import React from 'react';

export default function NeonButton({
  children,
  variant = 'gold', // 'gold' | 'cyan' | 'purple' | 'outline' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  type = 'button',
  onClick,
  ...props
}) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
    md: 'px-4 py-2 text-xs md:text-sm rounded-xl gap-2',
    lg: 'px-6 py-3 text-sm md:text-base rounded-2xl gap-2.5',
  };

  const variantClasses = {
    gold: 'bg-gradient-to-r from-[#F4B942] to-[#D97706] text-[#050816] font-extrabold shadow-neon-gold hover:shadow-[0_0_25px_rgba(244,185,66,0.6)]',
    cyan: 'bg-gradient-to-r from-[#00F0FF] to-[#0099FF] text-[#050816] font-extrabold shadow-neon-cyan hover:shadow-[0_0_25px_rgba(0,240,255,0.6)]',
    purple: 'bg-gradient-to-r from-[#A855F7] to-[#7E22CE] text-white font-extrabold shadow-neon-purple hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]',
    outline: 'bg-[#10182D]/80 border border-white/20 text-gray-200 font-bold hover:border-cyan-400 hover:text-cyan-300 hover:shadow-neon-cyan',
    danger: 'bg-gradient-to-r from-[#FF4567] to-[#DC2626] text-white font-extrabold shadow-[0_0_20px_rgba(255,69,103,0.4)] hover:shadow-[0_0_25px_rgba(255,69,103,0.6)]',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
        sizeClasses[size] || sizeClasses.md
      } ${variantClasses[variant] || variantClasses.gold} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        Icon && <Icon className="w-4 h-4" />
      )}
      <span>{children}</span>
    </button>
  );
}
