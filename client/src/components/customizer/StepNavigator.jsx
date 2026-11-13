import React from 'react';
import { Check } from 'lucide-react';

export const STEPS = [
  { id: 1, label: 'Watch Type', desc: 'Select Horological Architecture' },
  { id: 2, label: 'Dial', desc: 'Shape, Size, Color & Finish' },
  { id: 3, label: 'Case', desc: 'Material, Color & Shape' },
  { id: 4, label: 'Strap', desc: 'Material, Color, Width & Style' },
  { id: 5, label: 'Movement & Features', desc: 'Caliber, Water Res. & Sapphire' },
  { id: 6, label: 'Hands & Markers', desc: 'Needles & Hour Numerals' },
  { id: 7, label: 'Personalization', desc: 'Dial Name & Case Engraving' },
  { id: 8, label: 'Review & Order', desc: 'Complete 360° Specs & Checkout' },
];

export const StepNavigator = ({ currentStep, onSelectStep, completedSteps = [] }) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-4 sm:p-5 font-poppins">
      <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center justify-between">
        <span>Build Your Watch</span>
        <span className="text-xs text-watch-gold font-semibold">Step {currentStep} of 8</span>
      </h3>

      <div className="mt-3 space-y-1.5">
        {STEPS.map((step) => {
          const isActive = currentStep === step.id;
          const isDone = completedSteps.includes(step.id) || step.id < currentStep;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onSelectStep(step.id)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-50/90 text-amber-950 border border-watch-gold/40 shadow-xs font-bold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-watch-gold text-black shadow-xs'
                      : isDone
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {isDone && !isActive ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : step.id}
                </span>

                <span className="text-xs sm:text-[13px]">{step.label}</span>
              </div>

              {isDone && !isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StepNavigator;

