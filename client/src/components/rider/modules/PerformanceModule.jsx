import React from 'react';
import { TrendingUp, Star, Award, CheckCircle2, Clock, ShieldCheck, Zap } from 'lucide-react';

export const PerformanceModule = () => {
  return (
    <div className="space-y-6 select-none">
      <div className="pb-2 border-b border-white/10">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          <span>Rider Performance Analytics &amp; Rating Score</span>
        </h2>
        <p className="text-xs text-gray-400">
          Quality metrics, on-time punctuality, customer satisfaction, and transit velocity.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0B1022] border border-white/10 space-y-1">
          <span className="text-xs text-gray-400 font-medium">On-Time Rate</span>
          <div className="text-3xl font-black text-emerald-400 font-mono">100%</div>
          <span className="text-[10px] text-gray-400 font-bold block">Target: ≥ 95%</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B1022] border border-white/10 space-y-1">
          <span className="text-xs text-gray-400 font-medium">Avg Handover Time</span>
          <div className="text-3xl font-black text-cyan-400 font-mono">24m</div>
          <span className="text-[10px] text-emerald-400 font-bold block">6m faster than SLA</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B1022] border border-white/10 space-y-1">
          <span className="text-xs text-gray-400 font-medium">Customer Rating</span>
          <div className="text-3xl font-black text-amber-400 font-mono flex items-center gap-1">
            <Star className="w-6 h-6 fill-amber-400" />
            <span>4.8</span>
          </div>
          <span className="text-[10px] text-gray-400 font-bold block">Based on 184 reviews</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B1022] border border-white/10 space-y-1">
          <span className="text-xs text-gray-400 font-medium">Total Lifetime</span>
          <div className="text-3xl font-black text-purple-400 font-mono">312</div>
          <span className="text-[10px] text-gray-400 font-bold block">Zero Damaged Shipments</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quality Badges */}
        <div className="p-5 rounded-2xl bg-[#0B1022] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Earned Partner Badges</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
              <span className="text-xl">🛡️</span>
              <div>
                <p className="font-bold text-white">High-Value Horology Specialist</p>
                <p className="text-[11px] text-gray-400">Certified for armored transport of ₹5L+ watches.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
              <span className="text-xl">⚡</span>
              <div>
                <p className="font-bold text-white">Punctuality Champion</p>
                <p className="text-[11px] text-gray-400">Maintained 100% on-time record for 30 consecutive days.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
              <span className="text-xl">⭐</span>
              <div>
                <p className="font-bold text-white">Customer Favorite</p>
                <p className="text-[11px] text-gray-400">Top 5% customer satisfaction in Lucknow region.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Progress */}
        <div className="p-5 rounded-2xl bg-[#0B1022] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Monthly Incentive Goal</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-gray-300">350 Deliveries Milestone</span>
                <span className="text-cyan-400 font-mono">312 / 350 (89%)</span>
              </div>
              <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full w-[89%]" />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">38 more deliveries to unlock ₹5,000 monthly bonus.</p>
            </div>

            <div className="p-3 rounded-xl bg-[#050816] border border-white/10 text-xs space-y-1">
              <span className="text-gray-400 block font-medium">Current Incentive Tier:</span>
              <span className="text-amber-400 font-bold block text-sm">Tier 3 Platinum Courier</span>
              <p className="text-[11px] text-gray-500">Includes ₹50 extra bonus per express morning slot.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceModule;
