import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Bike, ShieldCheck, Star, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export const MyProfileModule = ({ isOnDuty }) => {
  const { user } = useAuth();
  const [phone, setPhone] = useState('+91 98765 11221');
  const [vehicle, setVehicle] = useState('Honda Activa 6G (UP 32 BK 4021)');
  const [zone, setZone] = useState('Lucknow Central Zone');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 98111 22334');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 select-none max-w-4xl mx-auto">
      <div className="pb-2 border-b border-white/10">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <User className="w-5 h-5 text-cyan-400" />
          <span>Rider Profile &amp; Vehicle Registration</span>
        </h2>
        <p className="text-xs text-gray-400">
          Personal identification, dispatch clearance, and emergency contacts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left ID Badge */}
        <div className="p-6 rounded-3xl bg-[#0B1022] border border-white/10 text-center space-y-3.5 shadow-xl">
          <div className="relative w-24 h-24 mx-auto">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              alt="Rohan Singh"
              className="w-full h-full rounded-2xl object-cover border-2 border-cyan-400/40 shadow-lg"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80';
              }}
            />
            <span
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#0B1022] ${
                isOnDuty ? 'bg-emerald-400' : 'bg-gray-500'
              }`}
            />
          </div>

          <div>
            <h3 className="text-base font-black text-white">{user?.name || 'Rohan Singh'}</h3>
            <p className="text-xs text-cyan-400 font-mono">EMP-RD-01 • Delivery Partner</p>
          </div>

          <div className="p-3 rounded-xl bg-[#050816] border border-white/5 space-y-1 text-xs text-left">
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className={`font-bold ${isOnDuty ? 'text-emerald-400' : 'text-gray-400'}`}>
                {isOnDuty ? 'Active / On Duty' : 'Off Duty'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Rating:</span>
              <span className="font-bold text-amber-400">★ 4.8 / 5.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Transit Clearance:</span>
              <span className="font-bold text-emerald-400">Armored Luxury</span>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-[#0B1022] border border-white/10 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white">Contact &amp; Vehicle Information</h3>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Profile details updated successfully.</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  value={user?.name || 'Rohan Singh'}
                  disabled
                  className="w-full p-2.5 bg-[#050816] border border-white/10 rounded-xl text-gray-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Official Email</label>
                <input
                  type="email"
                  value={user?.email || 'rider@watchhub.com'}
                  disabled
                  className="w-full p-2.5 bg-[#050816] border border-white/10 rounded-xl text-gray-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Mobile Contact Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-[#050816] border border-white/10 rounded-xl text-white focus:outline-hidden focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Emergency Contact</label>
                <input
                  type="tel"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full p-2.5 bg-[#050816] border border-white/10 rounded-xl text-white focus:outline-hidden focus:border-cyan-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-300 font-bold mb-1">Vehicle Specification &amp; Plate No.</label>
                <input
                  type="text"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  className="w-full p-2.5 bg-[#050816] border border-white/10 rounded-xl text-white focus:outline-hidden focus:border-cyan-400"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-300 font-bold mb-1">Designated Delivery Hub Zone</label>
                <input
                  type="text"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="w-full p-2.5 bg-[#050816] border border-white/10 rounded-xl text-white focus:outline-hidden focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:brightness-110 text-black font-black text-xs rounded-xl shadow-md cursor-pointer"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyProfileModule;
