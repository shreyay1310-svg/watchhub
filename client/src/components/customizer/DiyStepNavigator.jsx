import React from 'react';
import { Check, Sparkles, Gem, Layers, Palette, Eye, Watch } from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Select Watch', icon: Watch },
  { id: 2, title: 'Wrist Size & Bands', icon: Layers },
  { id: 3, title: 'Choose Beads', icon: Gem },
  { id: 4, title: 'Add Accessories', icon: Sparkles },
  { id: 5, title: 'Choose Colors', icon: Palette },
  { id: 6, title: 'Preview & Finish', icon: Eye },
];

export const DiyStepNavigator = ({
  currentStep = 3,
  onStepClick,
}) => {
  return (
    <div className="rounded-2xl p-4 md:p-5 bg-[#0B1026]/90 backdrop-blur-xl border border-purple-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
      <div className="space-y-2">
        {STEPS.map((step) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepClick(step.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 text-left ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-[1.02]'
                  : isCompleted
                  ? 'bg-[#050816]/70 text-slate-300 hover:text-white border border-white/5'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Step indicator circle */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                    isActive
                      ? 'bg-white text-purple-700 shadow-md'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-white/5 text-slate-400 border border-white/10'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.id}
                </div>

                <span>{step.title}</span>
              </div>

              {/* Status indicator */}
              {isCompleted && (
                <span className="text-emerald-400 text-xs">✓</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DiyStepNavigator;
