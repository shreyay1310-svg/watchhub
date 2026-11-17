import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import {
  Truck,
  MapPin,
  Shield,
  Navigation,
  Compass,
  Clock,
  Radio,
  Sparkles,
  Maximize2,
  RefreshCw,
  PhoneCall,
  Lock,
} from 'lucide-react';

// Luxury Obsidian & Platinum Map Style for Google Maps
const LUXURY_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#0b1120' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0b1120' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f1f5f9' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#cbd5e1' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#131e33' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#1e293b' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#334155' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#6366f1' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#1e293b' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#020617' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#64748b' }],
  },
];

export default function GoogleMapLiveTracking({
  orderId = 'WH20261125',
  customerAddress = 'Penthouse 14B, The Oberoi Sky Heights, Gurugram',
  customerCoords = { lat: 28.4595, lng: 77.0850 },
  vaultCoords = { lat: 28.5020, lng: 77.0878 },
  riderName = 'Vikram Singh (Armoured Escort)',
  riderPhone = '+91 98765 00921',
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const riderMarkerRef = useRef(null);
  const routePolylineRef = useRef(null);
  const socketRef = useRef(null);

  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  // Live GPS telemetry state
  const [riderLocation, setRiderLocation] = useState({
    lat: 28.4815,
    lng: 77.0862,
    speed: 38.5,
    heading: 180,
    timestamp: new Date().toISOString(),
  });

  const [telemetry, setTelemetry] = useState({
    distanceKm: 2.4,
    etaMinutes: 8,
    status: 'Out for Armoured Delivery',
    battery: '94%',
    securityCode: 'SEC-8924',
  });

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // 1. Load Google Maps JS SDK
  useEffect(() => {
    if (window.google && window.google.maps) {
      setGoogleMapsLoaded(true);
      return;
    }

    if (!apiKey) {
      setGoogleMapsLoaded(false);
      return;
    }

    const scriptId = 'google-maps-script';
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
      script.async = true;
      script.defer = true;
      script.onload = () => setGoogleMapsLoaded(true);
      document.head.appendChild(script);
    } else {
      script.addEventListener('load', () => setGoogleMapsLoaded(true));
    }
  }, [apiKey]);

  // 2. Fetch initial GPS state from backend REST endpoint
  useEffect(() => {
    const fetchLiveGps = async () => {
      try {
        const res = await fetch(`/api/tracking/${orderId}/live-gps`);
        if (res.ok) {
          const json = await res.json();
          if (json?.data?.rider) {
            setRiderLocation({
              lat: json.data.rider.lat,
              lng: json.data.rider.lng,
              speed: json.data.rider.speed,
              heading: json.data.rider.heading,
              timestamp: json.data.rider.lastUpdated,
            });
          }
          if (json?.data?.metrics) {
            setTelemetry((prev) => ({
              ...prev,
              distanceKm: json.data.metrics.distanceKm,
              etaMinutes: json.data.metrics.etaMinutes,
              status: json.data.metrics.status,
            }));
          }
        }
      } catch (e) {
        // Fallback to local default coordinates
      }
    };

    fetchLiveGps();
  }, [orderId]);

  // 3. Connect to Socket.IO for real-time rider GPS streaming
  useEffect(() => {
    const serverUrl = window.location.origin.includes('localhost')
      ? 'http://localhost:5000'
      : window.location.origin;

    const socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsSocketConnected(true);
      socket.emit('join_tracking', orderId);
    });

    socket.on('rider_location_update', (data) => {
      if (data && data.lat && data.lng) {
        setRiderLocation({
          lat: Number(data.lat),
          lng: Number(data.lng),
          speed: data.speed || 35,
          heading: data.heading || 0,
          timestamp: data.serverTimestamp || new Date().toISOString(),
        });

        // Recalculate ETA approx
        const dLat = (customerCoords.lat - data.lat) * 111;
        const dLng = (customerCoords.lng - data.lng) * 85;
        const dist = Math.max(Math.sqrt(dLat * dLat + dLng * dLng), 0.3);
        const mins = Math.max(Math.round((dist / 30) * 60), 3);

        setTelemetry((prev) => ({
          ...prev,
          distanceKm: Number(dist.toFixed(1)),
          etaMinutes: mins,
        }));
      }
    });

    socket.on('disconnect', () => {
      setIsSocketConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [orderId, customerCoords]);

  // 4. Initialize Google Map with Markers and Route Polyline
  useEffect(() => {
    if (!googleMapsLoaded || !mapContainerRef.current || !window.google) return;

    try {
      const bounds = new window.google.maps.LatLngBounds();
      const vaultPos = new window.google.maps.LatLng(vaultCoords.lat, vaultCoords.lng);
      const riderPos = new window.google.maps.LatLng(riderLocation.lat, riderLocation.lng);
      const destPos = new window.google.maps.LatLng(customerCoords.lat, customerCoords.lng);

      bounds.extend(vaultPos);
      bounds.extend(riderPos);
      bounds.extend(destPos);

      const map = new window.google.maps.Map(mapContainerRef.current, {
        center: riderPos,
        zoom: 14,
        styles: LUXURY_MAP_STYLE,
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      });

      map.fitBounds(bounds, 50);

      // Marker 1: WatchHub Vault Origin
      new window.google.maps.Marker({
        position: vaultPos,
        map: map,
        title: 'WatchHub Armoured Vault (Origin)',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#8B00FF',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        },
      });

      // Marker 2: Customer Delivery Doorstep
      new window.google.maps.Marker({
        position: destPos,
        map: map,
        title: `Customer Delivery Destination: ${customerAddress}`,
        icon: {
          path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 6,
          fillColor: '#F4B942',
          fillOpacity: 1,
          strokeColor: '#000000',
          strokeWeight: 2,
        },
      });

      // Marker 3: Live Rider Marker
      const riderMarker = new window.google.maps.Marker({
        position: riderPos,
        map: map,
        title: `Rider: ${riderName}`,
        icon: {
          path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 7,
          fillColor: '#00D5FF',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
          rotation: riderLocation.heading || 0,
        },
      });

      // Polyline connecting points
      const routePolyline = new window.google.maps.Polyline({
        path: [vaultPos, riderPos, destPos],
        geodesic: true,
        strokeColor: '#00D5FF',
        strokeOpacity: 0.8,
        strokeWeight: 4,
      });
      routePolyline.setMap(map);

      mapRef.current = map;
      riderMarkerRef.current = riderMarker;
      routePolylineRef.current = routePolyline;
    } catch (err) {
      console.error('[Google Map Live Tracking Init Error]', err);
    }
  }, [googleMapsLoaded]);

  // 5. Update rider marker smoothly when riderLocation state changes
  useEffect(() => {
    if (riderMarkerRef.current && window.google) {
      const newPos = new window.google.maps.LatLng(riderLocation.lat, riderLocation.lng);
      riderMarkerRef.current.setPosition(newPos);

      // Update polyline route
      if (routePolylineRef.current) {
        const vaultPos = new window.google.maps.LatLng(vaultCoords.lat, vaultCoords.lng);
        const destPos = new window.google.maps.LatLng(customerCoords.lat, customerCoords.lng);
        routePolylineRef.current.setPath([vaultPos, newPos, destPos]);
      }
    }
  }, [riderLocation, customerCoords, vaultCoords]);

  // 6. Interactive Simulator: Emits realistic GPS coordinates step by step for live testing!
  const [isSimulating, setIsSimulating] = useState(false);
  const handleToggleSimulation = () => {
    if (isSimulating) {
      setIsSimulating(false);
      return;
    }

    setIsSimulating(true);
    let step = 0;
    const steps = 15;
    const latDelta = (customerCoords.lat - riderLocation.lat) / steps;
    const lngDelta = (customerCoords.lng - riderLocation.lng) / steps;

    const interval = setInterval(() => {
      step += 1;
      const nextLat = Number((riderLocation.lat + latDelta * step).toFixed(5));
      const nextLng = Number((riderLocation.lng + lngDelta * step).toFixed(5));

      // Post to real backend endpoint
      fetch('/api/tracking/rider-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          lat: nextLat,
          lng: nextLng,
          speed: Math.round(30 + Math.random() * 15),
          heading: 175,
          accuracy: 3,
        }),
      }).catch(() => {});

      if (step >= steps) {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 2500);
  };

  return (
    <div className="bg-[#11172C] border border-[#28334B] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
      {/* Top Telemetry Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#28334B]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#00D5FF]/10 text-[#00D5FF] border border-[#00D5FF]/30 flex items-center justify-center shadow-lg shadow-[#00D5FF]/20">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-black text-lg text-white">
                Live Armoured Escort GPS Telemetry
              </h3>
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {isSocketConnected ? 'Socket.IO Online' : 'Active Telemetry'}
              </span>
            </div>
            <p className="text-xs text-[#A7B1C2] mt-0.5">
              Encrypted satellite link streaming live coordinates every 2.5 seconds.
            </p>
          </div>
        </div>

        {/* Quick Action Simulator Button for user & QA evaluation */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleSimulation}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              isSimulating
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                : 'bg-[#1E293B] hover:bg-[#28334B] text-gray-300 hover:text-white border-[#334155]'
            }`}
          >
            <Compass className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Streaming GPS...' : 'Simulate Live GPS Stream'}</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-[#081529] hover:bg-[#6500FF]/30 text-[#A7B1C2] hover:text-white border border-[#28334B] transition-colors cursor-pointer"
            title="Toggle Map Size"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Real Map Canvas */}
      <div
        className={`w-full rounded-2xl bg-[#081529] border border-[#28334B] overflow-hidden relative transition-all duration-300 ${
          isFullscreen ? 'h-[520px]' : 'h-80 sm:h-96'
        }`}
      >
        {googleMapsLoaded ? (
          <div ref={mapContainerRef} className="w-full h-full" />
        ) : (
          // Vector Satellite Fallback UI
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-4 bg-gradient-to-b from-[#0b1120] to-[#030712] relative overflow-hidden">
            <svg className="w-full h-full absolute inset-0 opacity-40" viewBox="0 0 800 400" preserveAspectRatio="none">
              <defs>
                <pattern id="gridTrack" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(40, 51, 75, 0.4)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#gridTrack)" />
              <path
                d="M 120 280 C 240 180, 360 320, 500 210 S 680 140, 720 120"
                fill="none"
                stroke="#6500FF"
                strokeWidth="4"
                strokeDasharray="8 6"
                className="animate-pulse"
              />
            </svg>

            {/* Rider Pin */}
            <div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#6500FF] to-[#00D5FF] text-white flex items-center justify-center shadow-xl shadow-[#00D5FF]/40 border-2 border-white">
              <Truck className="w-6 h-6 animate-pulse" />
            </div>

            <div className="relative z-10 space-y-1">
              <h4 className="text-white font-serif font-bold text-base">
                Rider En Route • {riderName}
              </h4>
              <p className="text-xs text-[#00D5FF] font-mono">
                Current Coordinates: {riderLocation.lat.toFixed(5)}, {riderLocation.lng.toFixed(5)}
              </p>
            </div>
          </div>
        )}

        {/* Live Status HUD Badge */}
        <div className="absolute top-4 left-4 z-10 bg-[#0b1120]/90 backdrop-blur-md border border-[#28334B] rounded-xl px-3 py-2 text-xs text-white shadow-xl flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-emerald-300">Live Courier Speed:</span>
            <span className="font-mono text-white">{riderLocation.speed} km/h</span>
          </div>
          <span className="text-gray-500">|</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#F4B942]" />
            <span className="text-[#F4B942] font-bold">ETA: ~{telemetry.etaMinutes} mins</span>
          </div>
        </div>

        {/* Security Badge Overlay */}
        <div className="absolute bottom-4 left-4 z-10 bg-[#0b1120]/90 backdrop-blur-md border border-[#28334B] rounded-xl px-3 py-2 text-xs text-white shadow-xl flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-[#00D5FF]" />
          <span className="text-[11px] text-gray-300">
            Armed Escort Verification Code: <strong className="text-white font-mono">{telemetry.securityCode}</strong>
          </span>
        </div>
      </div>

      {/* Bottom Courier Details Card */}
      <div className="p-4 bg-[#081529] rounded-2xl border border-[#28334B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6500FF] to-[#8B00FF] text-white flex items-center justify-center font-bold text-sm border border-purple-300/40 shadow-md">
            VS
          </div>
          <div>
            <h5 className="font-serif font-bold text-sm text-white">{riderName}</h5>
            <p className="text-[11px] text-[#A7B1C2] flex items-center gap-2 mt-0.5">
              <span>WatchHub Secure Logistics Specialist</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">Verified ID #892</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a
            href={`tel:${riderPhone}`}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call Escort Rider</span>
          </a>
        </div>
      </div>
    </div>
  );
}
