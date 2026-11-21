import React, { useState } from 'react';
import { HelpCircle, Phone, MessageSquare, AlertTriangle, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

export const SupportModule = ({ onOpenIssueModal }) => {
  return (
    <div className="space-y-6 select-none max-w-4xl mx-auto">
      <div className="pb-2 border-b border-white/10">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          <span>Rider Concierge &amp; Dispatch Support</span>
        </h2>
        <p className="text-xs text-gray-400">
          24/7 dedicated assistance for delivery obstacles, customer unreachable scenarios, and transit security.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0B1022] border border-white/10 space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-sm">Emergency Hotline</h3>
          <p className="text-xs text-gray-400">Instant direct priority phone line to Central Vault Dispatch.</p>
          <a
            href="tel:+911800928244"
            className="inline-block px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs rounded-xl border border-emerald-500/30"
          >
            Call 1800-WATCHHUB
          </a>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B1022] border border-white/10 space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-sm">Report Delivery Issue</h3>
          <p className="text-xs text-gray-400">Log customer unavailable, damaged parcel, or wrong address.</p>
          <button
            type="button"
            onClick={onOpenIssueModal}
            className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs rounded-xl border border-amber-500/30 cursor-pointer"
          >
            Open Ticket
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B1022] border border-white/10 space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 mx-auto flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-sm">Live Dispatch Chat</h3>
          <p className="text-xs text-gray-400">Real-time messenger with Support Manager Pooja Sharma.</p>
          <button
            type="button"
            onClick={() => alert('Dispatch chat connected to Support Desk.')}
            className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-xs rounded-xl border border-purple-500/30 cursor-pointer"
          >
            Start Chat
          </button>
        </div>
      </div>

      {/* Delivery FAQ & Protocol Guide */}
      <div className="p-6 rounded-3xl bg-[#0B1022] border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>High-Value Horology Delivery Protocols</span>
        </h3>

        <div className="space-y-3 text-xs text-gray-300">
          <div className="p-3.5 rounded-xl bg-[#050816] border border-white/5 space-y-1">
            <h4 className="font-bold text-white">1. Customer Handover Verification OTP</h4>
            <p className="text-gray-400 leading-relaxed">
              Never hand over timepieces exceeding ₹50,000 without entering the 4-digit SMS OTP provided by the customer. Handover without OTP verification violates insurance transit coverage.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#050816] border border-white/5 space-y-1">
            <h4 className="font-bold text-white">2. Tamper-Evident Security Seal Inspection</h4>
            <p className="text-gray-400 leading-relaxed">
              Verify the gold hologram seal on the outer Pelican casing before opening or allowing customer unboxing. If the seal shows void patterns, contact dispatch immediately.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#050816] border border-white/5 space-y-1">
            <h4 className="font-bold text-white">3. Customer Unreachable Protocol</h4>
            <p className="text-gray-400 leading-relaxed">
              Attempt 3 phone calls with at least 5 minutes interval. If unreachable, trigger 'Report Delivery Issue' in this portal. Do not leave luxury packages with building security without explicit recorded authorization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportModule;
