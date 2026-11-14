import React from 'react';

export default function NeonBadge({
  children,
  color = 'cyan', // 'cyan' | 'green' | 'amber' | 'purple' | 'red' | 'pink'
  className = '',
  icon: Icon,
}) {
  const colorStyles = {
    cyan: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 shadow-[0_0_10px_rgba(0,240,255,0.2)]',
    green: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 shadow-[0_0_10px_rgba(57,245,165,0.2)]',
    amber: 'bg-amber-500/10 text-amber-300 border-amber-500/30 shadow-[0_0_10px_rgba(244,185,66,0.2)]',
    purple: 'bg-purple-500/10 text-purple-300 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]',
    red: 'bg-red-500/10 text-red-300 border-red-500/30 shadow-[0_0_10px_rgba(255,69,103,0.2)]',
    pink: 'bg-pink-500/10 text-pink-300 border-pink-500/30 shadow-[0_0_10px_rgba(255,53,200,0.2)]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-bold tracking-wide transition-all ${
        colorStyles[color] || colorStyles.cyan
      } ${className}`}
    >
      {Icon && <Icon className="w-3 h-3" />}
      <span>{children}</span>
    </span>
  );
}
