import React, { useState } from 'react';
import CustomerNavbar from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import {
  ShieldCheck,
  CheckCircle2,
  Wrench,
  Search,
  Calendar,
  FileCheck,
  Award,
  Clock,
  MapPin,
  ChevronRight
} from 'lucide-react';

export const WarrantyServicePage = () => {
  const [activeTab, setActiveTab] = useState('register'); // 'register' | 'status' | 'request' | 'centers'
  const [serialQuery, setSerialQuery] = useState('CH-3123-89104');
  const [warrantyResult, setWarrantyResult] = useState(null);
  const [registrationSubmitted, setRegistrationSubmitted] = useState(false);

  const handleCheckWarranty = (e) => {
    e.preventDefault();
    if (serialQuery.trim()) {
      setWarrantyResult({
        model: 'Chronoswiss Open Gear Flying Tourbillon Paraiba',
        serial: serialQuery.trim(),
        calibre: 'Manufacture Calibre C.303',
        registeredDate: '15 October 2026',
        validUntil: '15 October 2031 (5-Year Official Atelier Guarantee)',
        status: 'ACTIVE & CERTIFIED',
        serviceEligible: 'Complimentary Ultrasonics & Timegrapher Calibration Available',
      });
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegistrationSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#020813] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#F4B942] selection:text-black">
      <CustomerNavbar />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-8 py-10 w-full flex-1">
        
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#F4B942] tracking-widest uppercase block">
            MANUFACTURE CARE & ASSURANCE
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-1">
            Warranty & Horological Service
          </h1>
          <p className="text-xs text-[#A6B1C8] mt-2">
            Every timepiece acquired from WatchHub carries an official 5-year manufacture international guarantee and lifetime provenance protection.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-center gap-2 max-w-2xl mx-auto mb-8 bg-[#040C1A] p-1.5 rounded-2xl border border-white/10 text-xs font-semibold">
          {[
            { id: 'register', label: 'Register Warranty' },
            { id: 'status', label: 'Check Status' },
            { id: 'request', label: 'Service Request' },
            { id: 'centers', label: 'Authorized Centers' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#00CFFF]/20 to-[#00A3FF]/20 text-[#00CFFF] border border-[#00CFFF]/40 shadow-xs'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════════════════════════════════
            TAB 1: REGISTER WARRANTY
            ════════════════════════════════════════════════════════════════ */}
        {activeTab === 'register' && (
          <div className="max-w-xl mx-auto bg-[#040C1A] border border-white/10 rounded-3xl p-6 sm:p-8 animate-fade-in text-xs">
            {registrationSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#39F5A5] mx-auto" />
                <h3 className="text-lg font-serif font-bold text-white">Warranty Certified Successfully</h3>
                <p className="text-[#A6B1C8]">
                  Your timepiece serial has been entered into the Swiss Atelier Blockchain Ledger. Your warranty certificate has been emailed.
                </p>
                <button
                  type="button"
                  onClick={() => setRegistrationSubmitted(false)}
                  className="py-2.5 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold"
                >
                  Register Another Timepiece
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <h3 className="text-base font-bold text-white border-b border-white/10 pb-3">
                  Register Timepiece Guarantee
                </h3>
                <div className="space-y-1">
                  <label className="text-gray-300">Watch Serial Number (Engraved on caseback)</label>
                  <input
                    type="text"
                    placeholder="e.g. CH-3123-89104"
                    className="w-full h-10 px-3.5 rounded-xl bg-[#020813] border border-white/10 text-white font-mono uppercase"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-300">Watch Brand & Model</label>
                  <input
                    type="text"
                    defaultValue="Chronoswiss Open Gear Flying Tourbillon"
                    className="w-full h-10 px-3.5 rounded-xl bg-[#020813] border border-white/10 text-white"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-gray-300">Date of Purchase</label>
                    <input
                      type="date"
                      defaultValue="2026-11-12"
                      className="w-full h-10 px-3.5 rounded-xl bg-[#020813] border border-white/10 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-gray-300">Order ID or Invoice No.</label>
                    <input
                      type="text"
                      defaultValue="WH125904"
                      className="w-full h-10 px-3.5 rounded-xl bg-[#020813] border border-white/10 text-white font-mono"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#F4B942] to-[#D4A84F] text-black font-extrabold rounded-xl shadow-md cursor-pointer mt-2"
                >
                  Confirm & Certify Warranty
                </button>
              </form>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            TAB 2: CHECK STATUS
            ════════════════════════════════════════════════════════════════ */}
        {activeTab === 'status' && (
          <div className="max-w-xl mx-auto space-y-6 animate-fade-in text-xs">
            <form onSubmit={handleCheckWarranty} className="bg-[#040C1A] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-base font-bold text-white border-b border-white/10 pb-3">
                Check Serial Warranty & Provenance
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={serialQuery}
                  onChange={(e) => setSerialQuery(e.target.value)}
                  placeholder="Enter Watch Serial Number"
                  className="flex-1 h-11 px-4 rounded-xl bg-[#020813] border border-white/10 text-white font-mono uppercase"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#00CFFF] to-[#00A3FF] text-[#020813] font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Search className="w-4 h-4" />
                  <span>Verify</span>
                </button>
              </div>
            </form>

            {warrantyResult && (
              <div className="bg-[#040C1A] border border-[#00CFFF]/40 rounded-3xl p-6 space-y-3 font-mono">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-white font-bold">{warrantyResult.model}</span>
                  <span className="text-[#39F5A5] text-[10px] font-bold bg-[#39F5A5]/10 border border-[#39F5A5]/30 px-2 py-0.5 rounded-full">
                    {warrantyResult.status}
                  </span>
                </div>
                <div className="flex justify-between py-1 text-gray-300">
                  <span className="text-gray-400">Serial Number</span>
                  <span className="text-[#00CFFF]">{warrantyResult.serial}</span>
                </div>
                <div className="flex justify-between py-1 text-gray-300">
                  <span className="text-gray-400">Calibre</span>
                  <span>{warrantyResult.calibre}</span>
                </div>
                <div className="flex justify-between py-1 text-gray-300">
                  <span className="text-gray-400">Guarantee Expiry</span>
                  <span className="text-[#F4B942]">{warrantyResult.validUntil}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            TAB 3: SERVICE REQUEST
            ════════════════════════════════════════════════════════════════ */}
        {activeTab === 'request' && (
          <div className="max-w-xl mx-auto bg-[#040C1A] border border-white/10 rounded-3xl p-6 sm:p-8 animate-fade-in text-xs space-y-4">
            <h3 className="text-base font-bold text-white border-b border-white/10 pb-3">
              Book Horological Maintenance
            </h3>
            <div className="space-y-1">
              <label className="text-gray-300">Service Required</label>
              <select className="w-full h-10 px-3 rounded-xl bg-[#020813] border border-white/10 text-white outline-none cursor-pointer">
                <option>Full Manufacture Movement Overhaul & Lubrication</option>
                <option>Water Resistance Testing & Gasket Replacement</option>
                <option>Laser Micro-Welding & Case Polish Refurbishment</option>
                <option>Strap Fitting & Sizing Adjustment</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-gray-300">Preferred Atelier Boutique</label>
              <select className="w-full h-10 px-3 rounded-xl bg-[#020813] border border-white/10 text-white outline-none cursor-pointer">
                <option>Lucerne Manufacture Atelier, Switzerland</option>
                <option>Geneva Flagship Salon, Switzerland</option>
                <option>New Bond Street Lounge, London</option>
                <option>Madison Avenue Boutique, New York</option>
                <option>Bandra Kurla Complex Salon, Mumbai</option>
              </select>
            </div>
            <button
              type="button"
              onClick={() => alert('Service appointment requested. Our atelier coordinator will contact you.')}
              className="w-full py-3 bg-gradient-to-r from-[#00CFFF] to-[#00A3FF] text-[#020813] font-bold rounded-xl mt-3 shadow-md"
            >
              Request Insured Valet Pickup
            </button>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            TAB 4: AUTHORIZED CENTERS
            ════════════════════════════════════════════════════════════════ */}
        {activeTab === 'centers' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fade-in text-xs">
            {[
              {
                city: 'Lucerne, Switzerland',
                name: 'Chronoswiss Manufacture Headquarters',
                address: 'Löwenstrasse 16b, 6004 Lucerne',
                phone: '+41 41 552 02 02',
              },
              {
                city: 'Geneva, Switzerland',
                name: 'WatchHub Haute Horlogerie Salon',
                address: 'Rue du Rhône 42, 1204 Geneva',
                phone: '+41 22 819 00 00',
              },
              {
                city: 'Mumbai, India',
                name: 'WatchHub Concierge Pavilion',
                address: 'Bandra Kurla Complex, G-Block, Mumbai 400051',
                phone: '+91 98765 43210',
              },
            ].map((c, i) => (
              <div key={i} className="p-5 rounded-2xl bg-[#040C1A] border border-white/10 space-y-2">
                <span className="text-[10px] font-bold text-[#F4B942] uppercase">{c.city}</span>
                <h4 className="text-sm font-bold text-white">{c.name}</h4>
                <p className="text-gray-400">{c.address}</p>
                <p className="text-[#00CFFF] font-mono">{c.phone}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default WarrantyServicePage;
