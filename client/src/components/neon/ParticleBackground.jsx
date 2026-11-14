import React, { useMemo } from 'react';

export default function ParticleBackground({ density = 35 }) {
  // Generate random particles once
  const particles = useMemo(() => {
    return Array.from({ length: density }, (_, i) => {
      const size = Math.random() * 3 + 1; // 1px to 4px
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const duration = Math.random() * 15 + 10; // 10s to 25s
      const delay = Math.random() * 5;
      const colors = ['#00F0FF', '#A855F7', '#F4B942', '#39F5A5', '#FF35C8'];
      const color = colors[i % colors.length];
      const opacity = Math.random() * 0.6 + 0.2;

      return {
        id: i,
        size,
        left: `${left}%`,
        top: `${top}%`,
        duration: `${duration}s`,
        delay: `${delay}s`,
        color,
        opacity,
      };
    });
  }, [density]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Ambient Moving Gradient Waves */}
      <div className="absolute -top-[30%] -left-[20%] w-[80vw] h-[80vw] rounded-full bg-purple-900/10 blur-[130px] animate-pulse-glow" />
      <div className="absolute -bottom-[30%] -right-[20%] w-[80vw] h-[80vw] rounded-full bg-cyan-900/10 blur-[140px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full bg-blue-900/10 blur-[150px] animate-pulse-glow" style={{ animationDelay: '4s' }} />

      {/* Floating Star & Light Particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full animate-float-slow"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: p.left,
            top: p.top,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            opacity: p.opacity,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
