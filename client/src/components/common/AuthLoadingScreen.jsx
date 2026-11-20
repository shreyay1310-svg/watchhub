import React from 'react';

export const AuthLoadingScreen = ({ message = 'Authenticating horological credentials...' }) => {
  return (
    <div
      data-testid="auth-loading-screen"
      className="min-h-screen w-full bg-[#0d0d0d] text-[#FAF8F3] flex flex-col items-center justify-center relative overflow-hidden select-none"
    >
      {/* Background Subtle Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(185,154,91,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* Luxury Horology Brand Mark */}
      <div className="flex flex-col items-center mb-8 z-10">
        <span className="font-serif tracking-[0.35em] text-sm uppercase text-[#B99A5B] font-medium">
          WATCHHUB
        </span>
        <span className="text-[10px] tracking-[0.45em] uppercase text-[#77736B] mt-1 font-sans">
          ATELIER
        </span>
        <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#B99A5B] to-transparent mt-3" />
      </div>

      {/* Animated Chronometer Dial Spinner */}
      <div className="relative w-20 h-20 flex items-center justify-center mb-6 z-10">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border border-[#B99A5B]/20 border-t-[#B99A5B] animate-spin" style={{ animationDuration: '2s' }} />

        {/* Middle Dial Markers */}
        <div className="absolute inset-2 rounded-full border border-[#DED8CC]/10 border-b-[#B99A5B]/60 animate-spin" style={{ animationDuration: '3.5s', animationDirection: 'reverse' }} />

        {/* Inner Jewel / Pivot */}
        <div className="w-2.5 h-2.5 rounded-full bg-[#B99A5B] shadow-[0_0_12px_rgba(185,154,91,0.8)]" />
      </div>

      {/* Loading Status Text */}
      <div className="flex flex-col items-center text-center z-10 px-4">
        <p className="text-xs uppercase tracking-[0.2em] text-[#DED8CC] font-medium">
          {message}
        </p>
        <p className="text-[10px] tracking-[0.25em] text-[#77736B] mt-2 font-light">
          TIMELESS ELEGANCE • TRUSTED CRAFTSMANSHIP
        </p>
      </div>
    </div>
  );
};

export default AuthLoadingScreen;
