import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Crosshair,
  Search,
  X,
  Check,
  AlertCircle,
  Navigation,
  Sparkles,
  Building,
  Compass,
} from 'lucide-react';

// Luxury Obsidian & Gold Map Style for Google Maps
const LUXURY_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#0b1120' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0b1120' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#e2e8f0' }],
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
    stylers: [{ color: '#4338ca' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1e1b4b' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#1e293b' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#030712' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#64748b' }],
  },
];

export default function GoogleMapAddressPicker({
  isOpen = false,
  onClose,
  onSelectAddress,
  initialCoords = { lat: 28.4595, lng: 77.0850 },
  initialAddress = '',
}) {
  const mapContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  const [mapInstance, setMapInstance] = useState(null);
  const [markerInstance, setMarkerInstance] = useState(null);
  const [coords, setCoords] = useState(initialCoords);
  const [selectedAddress, setSelectedAddress] = useState(initialAddress);
  const [addressDetails, setAddressDetails] = useState({
    street: '',
    apartment: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [mapsError, setMapsError] = useState(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Load Google Maps JavaScript API
  useEffect(() => {
    if (!isOpen) return;

    if (window.google && window.google.maps) {
      setGoogleMapsLoaded(true);
      return;
    }

    if (!apiKey) {
      // Graceful fallback: Google Maps key not configured yet
      setMapsError('Google Maps API Key not detected. Interactive luxury coordinate picker activated.');
      setGoogleMapsLoaded(false);
      return;
    }

    const scriptId = 'google-maps-script';
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      script.onload = () => setGoogleMapsLoaded(true);
      script.onerror = () => {
        setMapsError('Could not load Google Maps API. Fallback locator enabled.');
        setGoogleMapsLoaded(false);
      };
      document.head.appendChild(script);
    } else {
      script.addEventListener('load', () => setGoogleMapsLoaded(true));
    }
  }, [isOpen, apiKey]);

  // Initialize Map & Marker
  useEffect(() => {
    if (!isOpen || !googleMapsLoaded || !mapContainerRef.current || !window.google) return;

    try {
      const initialPos = {
        lat: Number(coords.lat || 28.4595),
        lng: Number(coords.lng || 77.0850),
      };

      const map = new window.google.maps.Map(mapContainerRef.current, {
        center: initialPos,
        zoom: 16,
        styles: LUXURY_MAP_STYLE,
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      });

      // Custom Luxury Marker Pin
      const marker = new window.google.maps.Marker({
        position: initialPos,
        map: map,
        draggable: true,
        animation: window.google.maps.Animation.DROP,
        title: 'Drag to adjust exact delivery doorstep',
        icon: {
          path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
          fillColor: '#F4B942',
          fillOpacity: 1,
          strokeColor: '#000000',
          strokeWeight: 2,
          scale: 1.8,
          anchor: new window.google.maps.Point(12, 22),
        },
      });

      // On Marker Drag End: Reverse Geocode
      marker.addListener('dragend', () => {
        const newPos = marker.getPosition();
        const newCoords = { lat: newPos.lat(), lng: newPos.lng() };
        setCoords(newCoords);
        reverseGeocode(newCoords);
      });

      // On Map Click: Reposition Marker
      map.addListener('click', (e) => {
        const clickedCoords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        marker.setPosition(clickedCoords);
        setCoords(clickedCoords);
        reverseGeocode(clickedCoords);
      });

      // Setup Places Autocomplete
      if (searchInputRef.current && window.google.maps.places) {
        const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
          componentRestrictions: { country: 'in' },
          fields: ['address_components', 'geometry', 'formatted_address', 'name'],
        });

        autocomplete.bindTo('bounds', map);

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (!place.geometry || !place.geometry.location) return;

          map.panTo(place.geometry.location);
          map.setZoom(17);
          marker.setPosition(place.geometry.location);

          const placeCoords = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          setCoords(placeCoords);
          parseGooglePlaceComponents(place);
        });
      }

      setMapInstance(map);
      setMarkerInstance(marker);

      // Initial reverse geocode if no address
      if (!selectedAddress) {
        reverseGeocode(initialPos);
      }
    } catch (err) {
      console.error('[Google Map Init Error]', err);
      setMapsError(err.message);
    }
  }, [isOpen, googleMapsLoaded]);

  // Reverse Geocoding with Google Geocoder or OpenStreetMap Nominatim Fallback
  const reverseGeocode = async ({ lat, lng }) => {
    setIsGeocoding(true);

    if (window.google && window.google.maps) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        setIsGeocoding(false);
        if (status === 'OK' && results && results[0]) {
          parseGooglePlaceComponents(results[0]);
        }
      });
      return;
    }

    // Free OpenStreetMap Reverse Geocoding Fallback
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};
        const formatted = data.display_name || 'Selected Location';
        setSelectedAddress(formatted);
        setAddressDetails({
          street: addr.road || addr.suburb || '',
          apartment: addr.building || addr.house_number || '',
          landmark: addr.neighbourhood || addr.suburb || '',
          city: addr.city || addr.town || addr.state_district || 'Gurugram',
          state: addr.state || 'Haryana',
          pincode: addr.postcode || '122002',
          country: addr.country || 'India',
        });
      }
    } catch (e) {
      console.warn('[Nominatim Geocode]', e);
    } finally {
      setIsGeocoding(false);
    }
  };

  const parseGooglePlaceComponents = (place) => {
    const formatted = place.formatted_address || place.name || '';
    setSelectedAddress(formatted);

    const components = place.address_components || [];
    let streetNumber = '';
    let route = '';
    let sublocality = '';
    let locality = '';
    let state = '';
    let postalCode = '';
    let country = 'India';

    components.forEach((c) => {
      const types = c.types;
      if (types.includes('street_number')) streetNumber = c.long_name;
      if (types.includes('route')) route = c.long_name;
      if (types.includes('sublocality') || types.includes('sublocality_level_1')) sublocality = c.long_name;
      if (types.includes('locality')) locality = c.long_name;
      if (types.includes('administrative_area_level_1')) state = c.long_name;
      if (types.includes('postal_code')) postalCode = c.long_name;
      if (types.includes('country')) country = c.long_name;
    });

    setAddressDetails({
      street: [streetNumber, route, sublocality].filter(Boolean).join(', ') || formatted,
      apartment: '',
      landmark: sublocality || '',
      city: locality || 'Gurugram',
      state: state || 'Haryana',
      pincode: postalCode || '122002',
      country: country || 'India',
    });
  };

  // Detect Current Location via Browser GPS
  const handleDetectCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const currentCoords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setCoords(currentCoords);

        if (mapInstance && markerInstance) {
          mapInstance.panTo(currentCoords);
          mapInstance.setZoom(17);
          markerInstance.setPosition(currentCoords);
        }
        reverseGeocode(currentCoords);
      },
      (err) => {
        setIsLocating(false);
        alert(`Could not retrieve location: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Confirm and return selected address payload
  const handleConfirmAddress = () => {
    if (onSelectAddress) {
      onSelectAddress({
        formattedAddress: selectedAddress,
        coordinates: coords,
        lat: coords.lat,
        lng: coords.lng,
        ...addressDetails,
      });
    }
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#0b1120] border border-[#28334B] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#28334B] bg-[#11172C]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6500FF] to-[#00D5FF] flex items-center justify-center text-white shadow-lg shadow-[#6500FF]/30">
              <Compass className="w-5 h-5 text-white animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-serif font-black text-white flex items-center gap-2">
                <span>Select Delivery Location on Google Maps</span>
                <span className="px-2 py-0.5 rounded-full bg-[#F4B942]/10 text-[#F4B942] text-[10px] font-bold border border-[#F4B942]/30">
                  Precision GPS
                </span>
              </h3>
              <p className="text-xs text-[#A7B1C2]">
                Pinpoint your residence for VIP armored courier dispatch.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-[#28334B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Location Detection Toolbar */}
        <div className="p-4 bg-[#0d1527] border-b border-[#28334B] flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#A7B1C2] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search apartment, society, street, or landmark..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#11172C] border border-[#28334B] rounded-xl text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-hidden focus:border-[#F4B942]"
            />
          </div>

          <button
            onClick={handleDetectCurrentLocation}
            disabled={isLocating}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] text-white text-xs font-bold shadow-lg shadow-[#6500FF]/30 hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
          >
            <Crosshair className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Detecting GPS...' : 'Use My Current Location'}</span>
          </button>
        </div>

        {/* Interactive Map Canvas */}
        <div className="relative flex-1 w-full min-h-[340px] sm:min-h-[400px] bg-[#070918]">
          {googleMapsLoaded ? (
            <div ref={mapContainerRef} className="w-full h-full min-h-[340px] sm:min-h-[400px]" />
          ) : (
            // Interactive Fallback Visual Map Picker
            <div className="w-full h-full min-h-[340px] sm:min-h-[400px] flex flex-col items-center justify-center p-6 text-center space-y-4 bg-gradient-to-b from-[#0b1120] to-[#030712] relative overflow-hidden">
              {/* Background grid */}
              <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

              <div className="relative z-10 w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#F4B942] to-[#FFE082] text-black flex items-center justify-center shadow-2xl shadow-[#F4B942]/30">
                <MapPin className="w-8 h-8 animate-bounce" />
              </div>

              <div className="relative z-10 max-w-md space-y-1.5">
                <h4 className="text-white font-serif font-bold text-base">
                  Luxury Map Precision Coordinate System
                </h4>
                <p className="text-xs text-gray-400">
                  {mapsError || 'Google Maps API integration active. Coordinates pinpointed.'}
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/60 border border-[#28334B] rounded-lg text-xs font-mono text-[#F4B942] mt-2">
                  <span>LAT: {Number(coords.lat).toFixed(6)}</span>
                  <span>•</span>
                  <span>LNG: {Number(coords.lng).toFixed(6)}</span>
                </div>
              </div>

              {/* Quick Preset Luxury Locations */}
              <div className="relative z-10 flex flex-wrap gap-2 justify-center pt-2">
                {[
                  { name: 'Golf Course Road, Gurugram', lat: 28.4595, lng: 77.0850 },
                  { name: 'South Extension, New Delhi', lat: 28.5700, lng: 77.2200 },
                  { name: 'Bandra West, Mumbai', lat: 19.0596, lng: 72.8295 },
                  { name: 'Indiranagar, Bengaluru', lat: 12.9784, lng: 77.6408 },
                ].map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setCoords({ lat: preset.lat, lng: preset.lng });
                      reverseGeocode({ lat: preset.lat, lng: preset.lng });
                    }}
                    className="px-3 py-1 rounded-lg bg-[#11172C] hover:bg-[#1E293B] border border-[#28334B] text-[11px] text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    📍 {preset.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Coordinates HUD overlay */}
          <div className="absolute top-4 left-4 z-10 bg-[#0b1120]/90 backdrop-blur-md border border-[#28334B] rounded-xl px-3 py-2 text-xs text-white shadow-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px]">
              GPS: {Number(coords.lat).toFixed(5)}, {Number(coords.lng).toFixed(5)}
            </span>
          </div>

          {/* Geocoding indicator */}
          {isGeocoding && (
            <div className="absolute top-4 right-4 z-10 bg-[#0b1120]/90 backdrop-blur-md border border-[#28334B] rounded-xl px-3 py-1.5 text-xs text-[#F4B942] shadow-xl flex items-center gap-2">
              <Crosshair className="w-3.5 h-3.5 animate-spin" />
              <span>Fetching street address...</span>
            </div>
          )}
        </div>

        {/* Selected Address Card & Confirmation Footer */}
        <div className="p-5 bg-[#0f172a] border-t border-[#28334B] space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F4B942]/10 text-[#F4B942] border border-[#F4B942]/30 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex-1 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                Selected Delivery Address
              </span>
              <p className="text-xs sm:text-sm text-white font-medium mt-0.5 leading-snug">
                {selectedAddress || 'Drop pin on map or select a preset location above.'}
              </p>
              <div className="flex flex-wrap gap-2 text-[11px] text-[#A7B1C2] mt-1 font-mono">
                {addressDetails.city && <span>City: {addressDetails.city}</span>}
                {addressDetails.state && <span>• State: {addressDetails.state}</span>}
                {addressDetails.pincode && <span>• PIN: {addressDetails.pincode}</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#1e293b] gap-3">
            <p className="text-[11px] text-gray-400 hidden sm:block">
              Coordinates will be securely attached to your order for delivery tracking.
            </p>
            <div className="flex items-center gap-2.5 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-[#28334B] text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAddress}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F4B942] via-[#E9B94F] to-[#D4A33B] text-black text-xs font-black shadow-lg shadow-[#F4B942]/20 hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Delivery Location</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
