/**
 * Safe Authentication API Fetch Helper
 * Handles Content-Type verification, plain-text/HTML serverless crash responses,
 * HTTP status code mapping (400, 401, 429, 500), and network connectivity errors.
 */
export async function safeAuthFetch(endpoint, options = {}) {
  try {
    const res = await fetch(endpoint, options);
    const contentType = res.headers.get('content-type') || '';
    let data = null;

    if (contentType.includes('application/json')) {
      try {
        data = await res.json();
      } catch {
        data = null;
      }
    } else {
      try {
        const text = await res.text();
        if (text && (text.startsWith('{') || text.startsWith('['))) {
          data = JSON.parse(text);
        }
      } catch {
        data = null;
      }
    }

    if (!res.ok) {
      let errorMessage = data?.message;
      if (!errorMessage) {
        if (res.status === 429) {
          errorMessage = 'Rate limit reached. Please wait a moment before requesting another code.';
        } else if (res.status === 500) {
          errorMessage = 'Authentication server error (HTTP 500). Please try again later.';
        } else if (res.status === 502 || res.status === 503 || res.status === 504) {
          errorMessage = 'Authentication gateway temporarily unavailable (HTTP 502/503). Please try again later.';
        } else if (res.status === 400 || res.status === 401 || res.status === 403) {
          errorMessage = 'Request could not be processed. Please verify your details.';
        } else {
          errorMessage = `Server returned an error (HTTP ${res.status}). Please try again.`;
        }
      }
      return { ok: false, status: res.status, data, error: errorMessage };
    }

    if (data && (data.status === 'fail' || data.status === 'error')) {
      return {
        ok: false,
        status: res.status,
        data,
        error: data.message || 'Operation failed. Please try again.',
      };
    }

    return { ok: true, status: res.status, data };
  } catch (err) {
    const isNetworkError =
      (typeof navigator !== 'undefined' && !navigator.onLine) ||
      err.name === 'TypeError' ||
      err.message?.toLowerCase().includes('fetch') ||
      err.message?.toLowerCase().includes('network');

    return {
      ok: false,
      status: 0,
      data: null,
      error: isNetworkError
        ? 'Unable to reach the authentication server. Please check your internet connection.'
        : 'An unexpected communication error occurred. Please try again.',
    };
  }
}

export default safeAuthFetch;
