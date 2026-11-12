import React, { useMemo } from 'react';

/**
 * GoldenStarsBackground
 * Premium Animated Golden Stars & Sparkling Stardust Background
 * Built specifically for WatchHub luxury watch portal login.
 * 100% optimized with pure CSS keyframes & hardware-accelerated transforms.
 * Fully responsive, accessible (prefers-reduced-motion), and non-blocking (pointer-events: none).
 */
export const GoldenStarsBackground = () => {
  // Deterministic star definitions to avoid re-render churn or hydration mismatches
  const microStars = useMemo(() => [
    { top: 5, left: 12, size: 1.5, color: '#F5D88A', duration: 3.2, delay: 0.2, anim: 'twinkleSlow', floatAnim: 'floatA' },
    { top: 8, left: 28, size: 1, color: '#C9A15B', duration: 4.1, delay: 1.1, anim: 'twinkleNormal', floatAnim: 'floatB' },
    { top: 12, left: 45, size: 2, color: '#D4AF37', duration: 3.8, delay: 2.3, anim: 'twinkleFast', floatAnim: 'floatC' },
    { top: 6, left: 68, size: 1.5, color: '#F5D88A', duration: 5.0, delay: 0.5, anim: 'twinkleSlow', floatAnim: 'floatD' },
    { top: 10, left: 88, size: 1, color: '#C9A15B', duration: 3.5, delay: 1.8, anim: 'twinkleNormal', floatAnim: 'floatA' },
    { top: 15, left: 95, size: 2, color: '#F5D88A', duration: 4.4, delay: 2.9, anim: 'twinkleFast', floatAnim: 'floatB' },
    
    { top: 22, left: 6, size: 1, color: '#D4AF37', duration: 4.8, delay: 0.7, anim: 'twinkleSlow', floatAnim: 'floatC' },
    { top: 26, left: 22, size: 1.5, color: '#F5D88A', duration: 3.3, delay: 1.5, anim: 'twinkleNormal', floatAnim: 'floatD' },
    { top: 32, left: 15, size: 2, color: '#C9A15B', duration: 5.2, delay: 2.1, anim: 'twinkleFast', floatAnim: 'floatA' },
    { top: 38, left: 8, size: 1, color: '#F5D88A', duration: 3.7, delay: 0.3, anim: 'twinkleSlow', floatAnim: 'floatB' },
    
    { top: 20, left: 82, size: 1.5, color: '#C9A15B', duration: 4.2, delay: 1.2, anim: 'twinkleFast', floatAnim: 'floatC' },
    { top: 28, left: 92, size: 2, color: '#F5D88A', duration: 3.6, delay: 2.7, anim: 'twinkleNormal', floatAnim: 'floatD' },
    { top: 35, left: 85, size: 1, color: '#D4AF37', duration: 5.1, delay: 0.9, anim: 'twinkleSlow', floatAnim: 'floatA' },
    
    { top: 48, left: 4, size: 2, color: '#F5D88A', duration: 3.9, delay: 1.6, anim: 'twinkleFast', floatAnim: 'floatB' },
    { top: 54, left: 18, size: 1, color: '#C9A15B', duration: 4.6, delay: 0.4, anim: 'twinkleSlow', floatAnim: 'floatC' },
    { top: 62, left: 9, size: 1.5, color: '#D4AF37', duration: 3.4, delay: 2.2, anim: 'twinkleNormal', floatAnim: 'floatD' },
    { top: 70, left: 14, size: 2, color: '#F5D88A', duration: 4.7, delay: 1.0, anim: 'twinkleFast', floatAnim: 'floatA' },
    
    { top: 46, left: 94, size: 1.5, color: '#F5D88A', duration: 4.0, delay: 2.4, anim: 'twinkleNormal', floatAnim: 'floatB' },
    { top: 56, left: 87, size: 1, color: '#D4AF37', duration: 3.7, delay: 0.8, anim: 'twinkleSlow', floatAnim: 'floatC' },
    { top: 65, left: 93, size: 2, color: '#C9A15B', duration: 5.3, delay: 1.7, anim: 'twinkleFast', floatAnim: 'floatD' },
    { top: 72, left: 84, size: 1.5, color: '#F5D88A', duration: 3.3, delay: 2.8, anim: 'twinkleSlow', floatAnim: 'floatA' },

    { top: 82, left: 7, size: 1.5, color: '#C9A15B', duration: 4.5, delay: 0.6, anim: 'twinkleNormal', floatAnim: 'floatB' },
    { top: 88, left: 19, size: 2, color: '#F5D88A', duration: 3.8, delay: 1.9, anim: 'twinkleFast', floatAnim: 'floatC' },
    { top: 94, left: 11, size: 1, color: '#D4AF37', duration: 5.0, delay: 2.5, anim: 'twinkleSlow', floatAnim: 'floatD' },
    
    { top: 80, left: 32, size: 1, color: '#F5D88A', duration: 3.6, delay: 1.3, anim: 'twinkleFast', floatAnim: 'floatA' },
    { top: 90, left: 42, size: 2, color: '#C9A15B', duration: 4.9, delay: 0.1, anim: 'twinkleSlow', floatAnim: 'floatB' },
    { top: 85, left: 58, size: 1.5, color: '#D4AF37', duration: 3.4, delay: 2.0, anim: 'twinkleNormal', floatAnim: 'floatC' },
    { top: 92, left: 70, size: 1, color: '#F5D88A', duration: 4.3, delay: 1.4, anim: 'twinkleFast', floatAnim: 'floatD' },
    
    { top: 81, left: 91, size: 2, color: '#D4AF37', duration: 3.9, delay: 0.5, anim: 'twinkleSlow', floatAnim: 'floatA' },
    { top: 89, left: 81, size: 1.5, color: '#C9A15B', duration: 4.7, delay: 2.6, anim: 'twinkleNormal', floatAnim: 'floatB' },
    { top: 95, left: 96, size: 1, color: '#F5D88A', duration: 3.2, delay: 1.8, anim: 'twinkleFast', floatAnim: 'floatC' },

    // Central background dispersion (visible in gaps, padding & margins)
    { top: 3, left: 50, size: 1.5, color: '#F5D88A', duration: 4.2, delay: 0.9, anim: 'twinkleSlow', floatAnim: 'floatD' },
    { top: 7, left: 38, size: 1, color: '#C9A15B', duration: 3.5, delay: 2.2, anim: 'twinkleNormal', floatAnim: 'floatA' },
    { top: 97, left: 50, size: 1.5, color: '#D4AF37', duration: 4.8, delay: 1.1, anim: 'twinkleFast', floatAnim: 'floatB' },
  ], []);

  // Medium glowing stars with radial champagne gold aura
  const mediumGlowingStars = useMemo(() => [
    { top: 9, left: 20, size: 3, color: '#F5D88A', glowColor: 'rgba(245, 216, 138, 0.85)', duration: 4.5, delay: 0.4, floatAnim: 'floatA' },
    { top: 14, left: 74, size: 3.5, color: '#D4AF37', glowColor: 'rgba(212, 175, 55, 0.9)', duration: 5.2, delay: 1.8, floatAnim: 'floatB' },
    { top: 24, left: 88, size: 2.5, color: '#F5D88A', glowColor: 'rgba(245, 216, 138, 0.75)', duration: 3.8, delay: 2.5, floatAnim: 'floatC' },
    { top: 18, left: 11, size: 3, color: '#C9A15B', glowColor: 'rgba(201, 161, 91, 0.8)', duration: 4.9, delay: 0.9, floatAnim: 'floatD' },
    { top: 42, left: 5, size: 3.5, color: '#F5D88A', glowColor: 'rgba(245, 216, 138, 0.9)', duration: 4.1, delay: 1.4, floatAnim: 'floatA' },
    { top: 58, left: 91, size: 3, color: '#D4AF37', glowColor: 'rgba(212, 175, 55, 0.85)', duration: 5.5, delay: 2.9, floatAnim: 'floatB' },
    { top: 75, left: 12, size: 2.5, color: '#F5D88A', glowColor: 'rgba(245, 216, 138, 0.8)', duration: 3.6, delay: 0.3, floatAnim: 'floatC' },
    { top: 78, left: 86, size: 3.5, color: '#C9A15B', glowColor: 'rgba(201, 161, 91, 0.85)', duration: 4.7, delay: 2.0, floatAnim: 'floatD' },
    { top: 87, left: 26, size: 3, color: '#F5D88A', glowColor: 'rgba(245, 216, 138, 0.9)', duration: 4.3, delay: 1.2, floatAnim: 'floatA' },
    { top: 91, left: 64, size: 2.5, color: '#D4AF37', glowColor: 'rgba(212, 175, 55, 0.75)', duration: 5.0, delay: 0.7, floatAnim: 'floatB' },
    { top: 4, left: 84, size: 3, color: '#F5D88A', glowColor: 'rgba(245, 216, 138, 0.85)', duration: 3.9, delay: 2.3, floatAnim: 'floatC' },
  ], []);

  // 4-Point Luxury Diamond Sparkle Stars (Celestial Horology Accents)
  const luxurySparkles = useMemo(() => [
    { top: 11, left: 16, size: 16, color: '#F5D88A', duration: 4.8, delay: 0.6, rotate: 15 },
    { top: 8, left: 81, size: 20, color: '#F5D88A', duration: 5.6, delay: 2.2, rotate: -20 },
    { top: 29, left: 93, size: 15, color: '#D4AF37', duration: 4.2, delay: 3.5, rotate: 30 },
    { top: 44, left: 3, size: 18, color: '#F5D88A', duration: 5.0, delay: 1.5, rotate: -10 },
    { top: 67, left: 92, size: 17, color: '#D4AF37', duration: 4.6, delay: 2.8, rotate: 25 },
    { top: 79, left: 7, size: 19, color: '#F5D88A', duration: 5.4, delay: 0.2, rotate: -35 },
    { top: 86, left: 76, size: 16, color: '#C9A15B', duration: 4.4, delay: 4.1, rotate: 18 },
    { top: 93, left: 35, size: 15, color: '#F5D88A', duration: 5.1, delay: 1.9, rotate: -15 },
    { top: 5, left: 62, size: 14, color: '#D4AF37', duration: 4.7, delay: 3.1, rotate: 40 },
    { top: 95, left: 88, size: 18, color: '#F5D88A', duration: 5.8, delay: 0.8, rotate: -25 },
  ], []);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, #0A1322 0%, #060B14 55%, #04070D 100%)',
      }}
    >
      <style>{`
        /* ══════════════════════════════════════════════════════════════
           PREMIUM ANIMATED GOLDEN STARS & STARDUST KEYFRAMES
           Hardware-accelerated transforms & opacity only (60 FPS smooth)
           ══════════════════════════════════════════════════════════════ */

        /* Twinkle variations with smooth organic curves */
        @keyframes starTwinkleSlow {
          0%, 100% { opacity: 0.18; transform: scale(0.85); }
          50% { opacity: 0.95; transform: scale(1.15); }
        }

        @keyframes starTwinkleNormal {
          0%, 100% { opacity: 0.22; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.25); }
        }

        @keyframes starTwinkleFast {
          0%, 100% { opacity: 0.15; transform: scale(0.8); }
          50% { opacity: 0.88; transform: scale(1.1); }
        }

        /* Subtle multi-directional celestial drift */
        @keyframes floatDirectionA {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(8px, -14px, 0); }
        }

        @keyframes floatDirectionB {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(-10px, -10px, 0); }
        }

        @keyframes floatDirectionC {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(12px, 10px, 0); }
        }

        @keyframes floatDirectionD {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(-8px, 12px, 0); }
        }

        /* Occasional sparkling 4-point diamond starburst */
        @keyframes luxurySparkleBurst {
          0% {
            opacity: 0;
            transform: scale(0.15) rotate(0deg);
            filter: drop-shadow(0 0 2px rgba(245, 216, 138, 0.4));
          }
          25% {
            opacity: 0.98;
            transform: scale(1.18) rotate(35deg);
            filter: drop-shadow(0 0 10px rgba(245, 216, 138, 0.95)) drop-shadow(0 0 22px rgba(212, 175, 55, 0.65));
          }
          45% {
            opacity: 0.85;
            transform: scale(1.0) rotate(55deg);
            filter: drop-shadow(0 0 7px rgba(245, 216, 138, 0.8));
          }
          75% {
            opacity: 0.45;
            transform: scale(0.8) rotate(80deg);
          }
          100% {
            opacity: 0;
            transform: scale(0.15) rotate(110deg);
          }
        }

        /* Atmospheric golden stardust nebula glow pulsing */
        @keyframes nebulaPulse {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.06); }
        }

        /* Accessibility: respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .star-particle,
          .star-float-wrapper,
          .sparkle-burst,
          .nebula-glow {
            animation: none !important;
            transform: none !important;
            opacity: 0.65 !important;
          }
        }
      `}</style>

      {/* ── LAYER 1: Deep Atmospheric Golden Nebulae & Cosmic Silk Gradients ── */}
      <div
        className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full blur-[140px] nebula-glow"
        style={{
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, rgba(201, 161, 91, 0.05) 45%, transparent 70%)',
          animation: 'nebulaPulse 12s ease-in-out infinite',
        }}
      />
      <div
        className="absolute -bottom-36 -right-36 w-[700px] h-[700px] rounded-full blur-[160px] nebula-glow"
        style={{
          background: 'radial-gradient(circle, rgba(245, 216, 138, 0.10) 0%, rgba(185, 131, 50, 0.04) 50%, transparent 70%)',
          animation: 'nebulaPulse 15s ease-in-out infinite 3s',
        }}
      />
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[130px] opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(30, 58, 95, 0.25) 0%, transparent 65%)',
        }}
      />

      {/* ── LAYER 2: Micro Stardust & Twinkling Golden Dust ── */}
      {microStars.map((star, idx) => {
        let keyframeName = 'starTwinkleSlow';
        if (star.anim === 'twinkleNormal') keyframeName = 'starTwinkleNormal';
        if (star.anim === 'twinkleFast') keyframeName = 'starTwinkleFast';

        let floatKeyframe = 'floatDirectionA';
        if (star.floatAnim === 'floatB') floatKeyframe = 'floatDirectionB';
        if (star.floatAnim === 'floatC') floatKeyframe = 'floatDirectionC';
        if (star.floatAnim === 'floatD') floatKeyframe = 'floatDirectionD';

        return (
          <div
            key={`micro-${idx}`}
            className="absolute star-float-wrapper"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              animation: `${floatKeyframe} ${star.duration * 4}s ease-in-out infinite alternate ${star.delay}s`,
            }}
          >
            <span
              className="block rounded-full star-particle"
              style={{
                width: `${star.size}px`,
                height: `${star.size}px`,
                backgroundColor: star.color,
                boxShadow: `0 0 ${star.size * 2}px ${star.color}`,
                animation: `${keyframeName} ${star.duration}s ease-in-out infinite ${star.delay}s`,
              }}
            />
          </div>
        );
      })}

      {/* ── LAYER 3: Medium Glowing Golden Stars with Radiant Halos ── */}
      {mediumGlowingStars.map((star, idx) => {
        let floatKeyframe = 'floatDirectionA';
        if (star.floatAnim === 'floatB') floatKeyframe = 'floatDirectionB';
        if (star.floatAnim === 'floatC') floatKeyframe = 'floatDirectionC';
        if (star.floatAnim === 'floatD') floatKeyframe = 'floatDirectionD';

        return (
          <div
            key={`medium-${idx}`}
            className="absolute star-float-wrapper"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              animation: `${floatKeyframe} ${star.duration * 4.5}s ease-in-out infinite alternate ${star.delay}s`,
            }}
          >
            <span
              className="block rounded-full star-particle"
              style={{
                width: `${star.size}px`,
                height: `${star.size}px`,
                backgroundColor: star.color,
                boxShadow: `0 0 6px ${star.glowColor}, 0 0 14px rgba(212, 175, 55, 0.45)`,
                animation: `starTwinkleNormal ${star.duration}s ease-in-out infinite ${star.delay}s`,
              }}
            />
          </div>
        );
      })}

      {/* ── LAYER 4: 4-Point Luxury Diamond Sparkle Starbursts (Flares) ── */}
      {luxurySparkles.map((sparkle, idx) => (
        <div
          key={`sparkle-${idx}`}
          className="absolute sparkle-burst"
          style={{
            top: `${sparkle.top}%`,
            left: `${sparkle.left}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            animation: `luxurySparkleBurst ${sparkle.duration}s cubic-bezier(0.4, 0, 0.2, 1) infinite ${sparkle.delay}s`,
            transformOrigin: 'center center',
          }}
        >
          {/* Subtle Golden Glow Halo behind sparkle rays */}
          <div
            className="absolute inset-[-4px] rounded-full blur-[4px]"
            style={{
              background: `radial-gradient(circle, ${sparkle.color} 0%, rgba(212, 175, 55, 0.25) 50%, transparent 75%)`,
            }}
          />

          {/* 4-Point Diamond Horology Star SVG */}
          <svg
            viewBox="0 0 24 24"
            className="w-full h-full relative z-10"
            style={{ fill: sparkle.color }}
          >
            <path d="M12 0 C12 6.5 13.5 10.5 24 12 C13.5 13.5 12 17.5 12 24 C12 17.5 10.5 13.5 0 12 C10.5 10.5 12 6.5 12 0 Z" />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default GoldenStarsBackground;

