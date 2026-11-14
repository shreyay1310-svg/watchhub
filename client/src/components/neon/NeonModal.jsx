import React from 'react';
import { X } from 'lucide-react';

export default function NeonModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
  icon: Icon,
  iconColor = 'text-cyan-400',
  iconBg = 'bg-cyan-500/10 border-cyan-500/30',
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div
        className={`bg-[#0B1022] border border-white/15 rounded-3xl ${maxWidth} w-full p-6 shadow-2xl shadow-cyan-950/50 text-white relative animate-slide-in overflow-hidden`}
      >
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-400" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={`w-10 h-10 rounded-2xl ${iconBg} border flex items-center justify-center ${iconColor} shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div>
              <h3 className="text-base font-extrabold text-white leading-tight">{title}</h3>
              {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="pt-4">{children}</div>
      </div>
    </div>
  );
}
