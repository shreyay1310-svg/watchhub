import React from 'react';

export default function NeonCard({
  children,
  className = '',
  glowColor = 'cyan', // 'cyan' | 'purple' | 'gold' | 'green' | 'pink' | 'none'
  hoverEffect = true,
  onClick,
  ...props
}) {
  const glowClasses = {
    cyan: 'hover:border-cyan-500/40 hover:shadow-neon-cyan',
    purple: 'hover:border-purple-500/40 hover:shadow-neon-purple',
    gold: 'hover:border-amber-400/40 hover:shadow-neon-gold',
    green: 'hover:border-emerald-400/40 hover:shadow-neon-green',
    pink: 'hover:border-pink-500/40 hover:shadow-neon-pink',
    none: '',
  };

  return (
    <div
      onClick={onClick}
      className={`relative rounded-3xl bg-[#10182D]/85 backdrop-blur-md border border-white/10 text-white shadow-xl transition-all duration-300 ${
        hoverEffect ? `hover:-translate-y-1 ${glowClasses[glowColor] || glowClasses.cyan}` : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
