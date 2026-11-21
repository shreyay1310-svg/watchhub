import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const NetworkStatusContext = createContext();

export const NETWORK_STATES = {
  ONLINE: 'ONLINE',
  BACKEND_UNAVAILABLE: 'BACKEND_UNAVAILABLE',
  REQUEST_TIMEOUT: 'REQUEST_TIMEOUT',
  INTERNET_OFFLINE: 'INTERNET_OFFLINE',
  AUTHENTICATION_EXPIRED: 'AUTHENTICATION_EXPIRED',
};

export const NetworkStatusProvider = ({ children }) => {
  const [networkStatus, setNetworkStatus] = useState(() => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return NETWORK_STATES.INTERNET_OFFLINE;
    }
    return NETWORK_STATES.ONLINE;
  });

  const [isRetrying, setIsRetrying] = useState(false);
  const [lastCheckedAt, setLastCheckedAt] = useState(Date.now());
  const failureCountRef = useRef(0);

  // Health check against real backend REST API endpoint /api/health
  const checkConnectivity = useCallback(async () => {
    // 1. Physical browser internet check
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setNetworkStatus(NETWORK_STATES.INTERNET_OFFLINE);
      return NETWORK_STATES.INTERNET_OFFLINE;
    }

    setIsRetrying(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
      const res = await fetch('/api/health', {
        method: 'GET',
        signal: controller.signal,
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        failureCountRef.current = 0;
        setNetworkStatus(NETWORK_STATES.ONLINE);
        setLastCheckedAt(Date.now());
        return NETWORK_STATES.ONLINE;
      } else {
        failureCountRef.current += 1;
        setNetworkStatus(NETWORK_STATES.BACKEND_UNAVAILABLE);
        return NETWORK_STATES.BACKEND_UNAVAILABLE;
      }
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        setNetworkStatus(NETWORK_STATES.REQUEST_TIMEOUT);
        return NETWORK_STATES.REQUEST_TIMEOUT;
      }
      failureCountRef.current += 1;
      setNetworkStatus(NETWORK_STATES.BACKEND_UNAVAILABLE);
      return NETWORK_STATES.BACKEND_UNAVAILABLE;
    } finally {
      setIsRetrying(false);
    }
  }, []);

  // Listen to browser native online/offline hardware events
  useEffect(() => {
    const handleOnline = () => {
      console.log('[Network] Browser reported online. Pinging backend...');
      checkConnectivity();
    };

    const handleOffline = () => {
      console.warn('[Network] Browser reported offline.');
      setNetworkStatus(NETWORK_STATES.INTERNET_OFFLINE);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleNetworkIssue = (e) => {
      const type = e.detail?.type;
      if (type === NETWORK_STATES.REQUEST_TIMEOUT) {
        setNetworkStatus(NETWORK_STATES.REQUEST_TIMEOUT);
      } else if (type === NETWORK_STATES.BACKEND_UNAVAILABLE) {
        checkConnectivity();
      }
    };
    window.addEventListener('watchhub-network-issue', handleNetworkIssue);

    // Initial silent connectivity check
    checkConnectivity();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('watchhub-network-issue', handleNetworkIssue);
    };
  }, [checkConnectivity]);

  // Public report function for Axios interceptors
  const reportNetworkIssue = useCallback((errorType) => {
    if (errorType === NETWORK_STATES.AUTHENTICATION_EXPIRED) {
      setNetworkStatus(NETWORK_STATES.AUTHENTICATION_EXPIRED);
    } else if (errorType === NETWORK_STATES.REQUEST_TIMEOUT) {
      setNetworkStatus(NETWORK_STATES.REQUEST_TIMEOUT);
    } else {
      checkConnectivity();
    }
  }, [checkConnectivity]);

  const resetNetworkState = useCallback(() => {
    setNetworkStatus(NETWORK_STATES.ONLINE);
    failureCountRef.current = 0;
  }, []);

  return (
    <NetworkStatusContext.Provider
      value={{
        networkStatus,
        isOnline: networkStatus === NETWORK_STATES.ONLINE,
        isRetrying,
        lastCheckedAt,
        checkConnectivity,
        reportNetworkIssue,
        resetNetworkState,
      }}
    >
      {children}
    </NetworkStatusContext.Provider>
  );
};

export const useNetworkStatus = () => useContext(NetworkStatusContext);
export default NetworkStatusContext;
