import React, { useState } from 'react';
import CustomerNavbar from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import {
  MapPin,
  Search,
  Phone,
  Clock,
  ExternalLink,
  Navigation,
  Calendar,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const StoreLocatorPage = () => {
  const [searchCity, setSearchCity] = useState('');
  const [selectedBoutique, setSelectedBoutique] = useState(0);

  const boutiques = [
    {
      id: 1,
      city: 'Lucerne',
      country: 'Switzerland',
      name: 'Chronoswiss Manufacture & Flagship Atelier',
      address: 'Löwenstrasse 16b, 6004 Lucerne, Switzerland',
      phone: '+41 41 552 02 02',
      hours: 'Mon – Fri: 09:30 – 18:30 | Sat: 10:00 – 17:00',
      tag: 'Global Manufacture Atelier',
      mapCoords: '47.0502° N, 8.3093° E',
    },
    {
      id: 2,
      city: 'Geneva',
      country: 'Switzerland',
      name: 'WatchHub Haute Horlogerie Flagship Salon',
      address: 'Rue du Rhône 42, 1204 Geneva, Switzerland',
      phone: '+41 22 819 00 00',
      hours: 'Mon – Sat: 10:00 – 19:00',
      tag: 'Flagship Salon',
      mapCoords: '46.2044° N, 6.1432° E',
    },
    {
      id: 3,
      city: 'London',
      country: 'United Kingdom',
      name: 'WatchHub Mayfair Connoisseur Lounge',
      address: '144 New Bond Street, Mayfair, London W1S 2PF, UK',
      phone: '+44 20 7493 0000',
      hours: 'Mon – Sat: 10:00 – 18:30 | Sun: By Appointment',
      tag: 'Private VIP Lounge',
      mapCoords: '51.5117° N, 0.1444° W',
    },
    {
      id: 4,
      city: 'New York',
      country: 'United States',
      name: 'WatchHub Fifth Avenue Boutique',
      address: '693 Fifth Avenue, New York, NY 10022, USA',
      phone: '+1 212 555 0199',
      hours: 'Mon – Sat: 10:00 – 19:00 | Sun: 12:00 – 18:00',
      tag: 'North American Salon',
      mapCoords: '40.7614° N, 73.9744° W',
    },
    {
      id: 5,
      city: 'Mumbai',
      country: 'India',
      name: 'WatchHub Horology Pavilion & Concierge',
      address: 'Bandra Kurla Complex, G-Block, Mumbai 400051, India',
      phone: '+91 98765 43210',
      hours: 'Mon – Sun: 11:00 – 20:30',
      tag: 'South Asia Flagship',
      mapCoords: '19.0660° N, 72.8687° E',
    },
    {
      id: 6,
      city: 'Dubai',
      country: 'United Arab Emirates',
      name: 'WatchHub Dubai Mall Grand Atrium',
      address: 'Financial Center Rd, Downtown Dubai, UAE',
      phone: '+971 4 362 7500',
      hours: 'Mon – Sun: 10:00 – 23:00',
      tag: 'Middle East Flagship',
      mapCoords: '25.1972° N, 55.2744° E',
    },
  ];

  const filteredBoutiques = boutiques.filter((b) =>
    searchCity.trim() === ''
      ? true
      : b.city.toLowerCase().includes(searchCity.toLowerCase()) ||
        b.country.toLowerCase().includes(searchCity.toLowerCase()) ||
        b.name.toLowerCase().includes(searchCity.toLowerCase())
  );

  const active = filteredBoutiques[selectedBoutique] || filteredBoutiques[0] || boutiques[0];

  return (
    <div className="min-h-screen bg-[#020813] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#F4B942] selection:text-black">
      <CustomerNavbar />

      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 py-10 w-full flex-1">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#F4B942] tracking-widest uppercase block">
            WORLDWIDE PRESENCE
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-1">
            Authorized Salons & Ateliers
          </h1>
          <p className="text-xs text-[#A6B1C8] mt-2">
            Experience our timepieces in person, consult with master watchmakers, and book private viewing salons.
          </p>

          {/* Search by City */}
          <div className="mt-6 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchCity}
              onChange={(e) => {
                setSearchCity(e.target.value);
                setSelectedBoutique(0);
              }}
              placeholder="Search by city (e.g. Lucerne, Geneva, London, Mumbai)..."
              className="w-full h-11 pl-11 pr-4 text-xs rounded-full bg-[#040C1A] border border-white/10 text-white placeholder-gray-400 outline-none focus:border-[#00CFFF]"
            />
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            2-COLUMN INTERACTIVE MAP & SALON DIRECTORY
            ════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Boutique Cards List (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-3 max-h-[620px] overflow-y-auto scrollbar-thin pr-1">
            {filteredBoutiques.map((b, idx) => (
              <div
                key={b.id}
                onClick={() => setSelectedBoutique(idx)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  active.id === b.id
                    ? 'bg-[#061224] border-[#00CFFF] shadow-[0_0_25px_rgba(0,207,255,0.2)]'
                    : 'bg-[#040C1A] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-[#F4B942] uppercase tracking-wider">
                    {b.city}, {b.country}
                  </span>
                  <span className="text-[9px] font-bold text-[#00CFFF] bg-[#00CFFF]/10 border border-[#00CFFF]/30 px-2 py-0.5 rounded-full">
                    {b.tag}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white leading-tight">{b.name}</h4>
                <p className="text-xs text-gray-400 mt-1 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-500 flex-shrink-0 mt-0.5" />
                  <span>{b.address}</span>
                </p>
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5 text-[11px]">
                  <span className="text-gray-300 font-mono">{b.phone}</span>
                  <span className="text-[#00CFFF] font-semibold flex items-center gap-1">
                    <span>View Boutique</span>
                    <Navigation className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Selected Boutique Preview & Simulated Map (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-[#040C1A] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            
            {/* Interactive Cyber Map Simulation */}
            <div className="aspect-[16/9] w-full rounded-2xl bg-[#020813] border border-white/10 relative overflow-hidden flex flex-col justify-between p-6">
              {/* Map background grid and route lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#00cfff10_1px,transparent_1px),linear-gradient(to_bottom,#00cfff10_1px,transparent_1px)] bg-[size:28px_28px]" />
              <div className="absolute inset-0 bg-radial from-transparent via-[#020813]/60 to-[#020813] pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between text-xs">
                <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-gray-300 font-mono text-[10.5px]">
                  GPS: {active.mapCoords}
                </span>
                <span className="bg-[#39F5A5]/20 text-[#39F5A5] border border-[#39F5A5]/40 px-3 py-1 rounded-full text-[10px] font-bold">
                  ● OPEN NOW
                </span>
              </div>

              {/* Pin Centerpiece */}
              <div className="relative z-10 text-center my-auto">
                <div className="w-14 h-14 rounded-full bg-[#00CFFF]/20 border border-[#00CFFF] mx-auto flex items-center justify-center text-xl text-[#00CFFF] shadow-[0_0_30px_rgba(0,207,255,0.6)] animate-pulse">
                  📍
                </div>
                <h4 className="text-base font-bold text-white mt-2">{active.name}</h4>
                <p className="text-xs text-[#00CFFF] font-medium">{active.city}, {active.country}</p>
              </div>

              <div className="relative z-10 flex justify-end">
                <button
                  type="button"
                  onClick={() => alert(`Launching GPS navigation to ${active.name}...`)}
                  className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#00CFFF] to-[#00A3FF] text-[#020813] font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Driving Directions</span>
                </button>
              </div>
            </div>

            {/* Selected Boutique Details Dossier */}
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-lg font-serif font-bold text-white">{active.name}</h3>
                  <p className="text-gray-400">{active.address}</p>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Private appointment booked with master horologist at ${active.city} boutique.`)}
                  className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#F4B942] to-[#D4A84F] text-black font-extrabold text-xs shadow-sm hover:brightness-110"
                >
                  Book Private VIP Salon
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#F4B942] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Opening Hours</strong>
                    <span>{active.hours}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-[#00CFFF] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Direct Atelier Line</strong>
                    <span className="font-mono">{active.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StoreLocatorPage;
