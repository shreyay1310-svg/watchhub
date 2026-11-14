import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, Maximize2, Minimize2, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export const DiyBraceletCanvas = ({
  config,
  onOpenPreview,
  activeSlide = 1,
  onSlideChange,
}) => {
  const [rotationAngle, setRotationAngle] = useState(15);
  const [isRotating, setIsRotating] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef(null);

  // Auto rotation if enabled
  useEffect(() => {
    let animId;
    if (isRotating) {
      const step = () => {
        setRotationAngle((prev) => (prev + 0.4) % 360);
        animId = requestAnimationFrame(step);
      };
      animId = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animId);
  }, [isRotating]);

  // Handle zoom in/out
  const handleZoom = (delta) => {
    setZoomLevel((prev) => Math.min(1.4, Math.max(0.8, +(prev + delta).toFixed(1))));
  };

  // Primary bead styling
  const band1Bead = config.band1.primaryBead;
  const band2Bead = config.band2.primaryBead;
  const watchBase = config.watchBase;

  // Generate bead positions along an elliptical bracelet path around the watch
  // Strand 1 (Inner Loop)
  const strand1BeadsCount = config.band1.beadsCount || 16;
  const strand1RadiusX = 145;
  const strand1RadiusY = 125;
  const strand1Center = { x: 230, y: 220 };

  // Strand 2 (Outer Loop - when Double Band is active)
  const strand2BeadsCount = config.band2.beadsCount || 16;
  const strand2RadiusX = 175;
  const strand2RadiusY = 155;
  const strand2Center = { x: 230, y: 220 };

  // Map beads and accessories along Strand 1
  const renderStrand = (radiusX, radiusY, count, beadData, isOuter = false) => {
    const items = [];
    // We leave an opening on the left side where the watch case is attached
    // Angles in radians from -1.1 to 1.1 (covering top, right, bottom around the watch)
    const startAngle = -Math.PI * 0.72;
    const endAngle = Math.PI * 0.72;
    const angleStep = (endAngle - startAngle) / (count - 1);

    for (let i = 0; i < count; i++) {
      const angle = startAngle + i * angleStep;
      const x = strand1Center.x + radiusX * Math.cos(angle);
      const y = strand1Center.y + radiusY * Math.sin(angle);

      // Determine if this index is a spacer or charm
      let isSpacer = false;
      let isCharm = null;

      // In reference image: spacers are interspersed (indices 3, 7, 11, etc.)
      if (!isOuter) {
        if (i === 4 || i === 8 || i === 12) isSpacer = true;
        if (i === 6) isCharm = 'star';
        if (i === 10) isCharm = 'sun';
      } else {
        if (i === 3 || i === 7 || i === 11) isSpacer = true;
        if (i === 5) isCharm = 'heart';
      }

      items.push({
        id: `${isOuter ? 's2' : 's1'}-${i}`,
        x,
        y,
        angle: (angle * 180) / Math.PI,
        isSpacer,
        isCharm,
        bead: beadData,
      });
    }
    return items;
  };

  const strand1Items = renderStrand(strand1RadiusX, strand1RadiusY, strand1BeadsCount, band1Bead, false);
  const strand2Items = config.bandMode === 'double'
    ? renderStrand(strand2RadiusX, strand2RadiusY, strand2BeadsCount, band2Bead, true)
    : [];

  return (
    <div
      ref={canvasRef}
      className={`relative w-full rounded-2xl overflow-hidden border border-purple-500/20 bg-gradient-to-b from-[#090E24] via-[#050816] to-[#02050E] flex flex-col items-center justify-center select-none shadow-[0_20px_50px_rgba(0,0,0,0.6)] ${
        isFullscreen ? 'fixed inset-4 z-50 rounded-3xl' : 'min-h-[460px] md:min-h-[520px] lg:h-[540px]'
      }`}
    >
      {/* Background Studio Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft violet spotlight top left */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/15 rounded-full blur-[100px]" />
        {/* Soft electric blue light center */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[340px] bg-cyan-500/10 rounded-full blur-[90px]" />
        {/* Pedestal base glow */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[380px] h-[70px] bg-gradient-to-r from-purple-500/20 via-cyan-400/25 to-purple-500/20 rounded-[100%] blur-[25px]" />
      </div>

      {/* Top Floating Action Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {/* 360 Rotation toggle */}
        <button
          onClick={() => setIsRotating((prev) => !prev)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border transition-all duration-300 ${
            isRotating
              ? 'bg-purple-600/30 text-purple-200 border-purple-400/60 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
              : 'bg-black/40 text-slate-300 border-white/10 hover:border-purple-400/40 hover:text-white'
          }`}
          title="Toggle 360° Live Rotation"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
          <span>360°</span>
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={() => {
            if (onOpenPreview) {
              onOpenPreview();
            } else {
              setIsFullscreen((prev) => !prev);
            }
          }}
          className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white hover:border-purple-400/40 transition-colors"
          title="Fullscreen High-Resolution Preview"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Zoom In / Zoom Out */}
        <div className="flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-0.5">
          <button
            onClick={() => handleZoom(0.1)}
            disabled={zoomLevel >= 1.4}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] text-slate-400 px-1 font-mono">{Math.round(zoomLevel * 100)}%</span>
          <button
            onClick={() => handleZoom(-0.1)}
            disabled={zoomLevel <= 0.8}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Left / Right Carousel Navigation Arrows */}
      <button
        onClick={() => onSlideChange && onSlideChange(activeSlide === 1 ? 3 : activeSlide - 1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white hover:border-purple-400/50 hover:bg-purple-900/30 transition-all flex items-center justify-center shadow-lg"
        aria-label="Previous Perspective"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={() => onSlideChange && onSlideChange(activeSlide === 3 ? 1 : activeSlide + 1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white hover:border-purple-400/50 hover:bg-purple-900/30 transition-all flex items-center justify-center shadow-lg"
        aria-label="Next Perspective"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Main Interactive Studio Canvas */}
      <div
        className="relative w-[460px] h-[460px] flex items-center justify-center transition-transform duration-300"
        style={{
          transform: `scale(${zoomLevel}) rotate(${rotationAngle}deg)`,
          transformOrigin: 'center center',
        }}
      >
        {/* Studio Pedestal Base Plate (matching Gemloo dark podium in Image 2) */}
        <div
          className="absolute -bottom-10 w-[360px] h-[110px] rounded-[100%] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 30%, #17203E 0%, #0A0F22 65%, transparent 100%)',
            border: '1px solid rgba(168, 85, 247, 0.25)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.9), inset 0 2px 10px rgba(255,255,255,0.1)',
            transform: `rotate(${-rotationAngle}deg)`, // keep pedestal level
          }}
        />

        {/* SVG Drawing Layer for Connectors, Strings, Beads, Spacers & Charms */}
        <svg
          viewBox="0 0 460 460"
          className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
        >
          <defs>
            {/* Shading filters & Gradients */}
            <radialGradient id="goldSpacerGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFF176" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#78350F" />
            </radialGradient>
            <radialGradient id="silverSpacerGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#334155" />
            </radialGradient>
            <radialGradient id="pearlCharmGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </radialGradient>
            <filter id="beadGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.6" />
            </filter>
            <filter id="charmGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#F59E0B" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Elastic Strand Guideline (Inner Strand) */}
          <ellipse
            cx={strand1Center.x}
            cy={strand1Center.y}
            rx={strand1RadiusX}
            ry={strand1RadiusY}
            fill="none"
            stroke="rgba(244, 185, 66, 0.25)"
            strokeWidth="2.5"
            strokeDasharray="4 4"
          />

          {/* Elastic Strand Guideline (Outer Strand - if Double Band) */}
          {config.bandMode === 'double' && (
            <ellipse
              cx={strand2Center.x}
              cy={strand2Center.y}
              rx={strand2RadiusX}
              ry={strand2RadiusY}
              fill="none"
              stroke="rgba(168, 85, 247, 0.2)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          )}

          {/* Render Outer Strand (Strand 2) Beads if Double Band */}
          {strand2Items.map((item) => {
            const beadRadius = 14;
            return (
              <g key={item.id} transform={`translate(${item.x}, ${item.y})`}>
                {item.isSpacer ? (
                  // Gold/Silver Fluted Spacer
                  <g filter="url(#beadGlow)">
                    <circle r="9" fill="url(#goldSpacerGrad)" stroke="#FBBF24" strokeWidth="1" />
                    <line x1="-7" y1="0" x2="7" y2="0" stroke="#78350F" strokeWidth="1" />
                    <line x1="0" y1="-7" x2="0" y2="7" stroke="#78350F" strokeWidth="1" />
                  </g>
                ) : item.isCharm === 'heart' ? (
                  // Rose Gold Heart Charm
                  <g filter="url(#charmGlow)" transform="translate(0, 16) scale(0.9)">
                    <circle cx="0" cy="-14" r="3" fill="#E0A899" />
                    <path
                      d="M0 -6 C -6 -14 -16 -8 -16 2 C -16 12 0 20 0 24 C 0 20 16 12 16 2 C 16 -8 6 -14 0 -6 Z"
                      fill="#FB7185"
                      stroke="#E0A899"
                      strokeWidth="1.5"
                    />
                  </g>
                ) : (
                  // Gemstone / Pearl Bead with 3D sphere gradient
                  <g filter="url(#beadGlow)">
                    <circle
                      r={beadRadius}
                      fill={item.bead.imageColor || '#F8FAFC'}
                      stroke="rgba(255,255,255,0.4)"
                      strokeWidth="1"
                    />
                    {/* 3D highlight bubble */}
                    <circle cx="-4" cy="-4" r={beadRadius * 0.4} fill="rgba(255,255,255,0.6)" />
                    {/* Shadow crescent */}
                    <path
                      d={`M ${-beadRadius * 0.6} ${beadRadius * 0.4} A ${beadRadius} ${beadRadius} 0 0 0 ${beadRadius * 0.7} ${beadRadius * 0.5}`}
                      stroke="rgba(0,0,0,0.3)"
                      strokeWidth="2.5"
                      fill="none"
                    />
                  </g>
                )}
              </g>
            );
          })}

          {/* Render Inner Strand (Strand 1) Beads */}
          {strand1Items.map((item) => {
            const beadRadius = 15;
            return (
              <g key={item.id} transform={`translate(${item.x}, ${item.y})`}>
                {item.isSpacer ? (
                  // 18K Gold Fluted Spacer Ring
                  <g filter="url(#beadGlow)">
                    <circle r="10" fill="url(#goldSpacerGrad)" stroke="#FDE047" strokeWidth="1" />
                    <circle r="4" fill="#78350F" />
                  </g>
                ) : item.isCharm === 'star' ? (
                  // North Star Charm with crystal pavé
                  <g filter="url(#charmGlow)" transform="translate(0, 18) scale(1.1)">
                    {/* Connector jump ring */}
                    <circle cx="0" cy="-16" r="3.5" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
                    {/* 8-pointed star */}
                    <polygon
                      points="0,-14 3,-5 12,-3 5,3 8,12 0,7 -8,12 -5,3 -12,-3 -3,-5"
                      fill="url(#goldSpacerGrad)"
                      stroke="#FEF08A"
                      strokeWidth="1"
                    />
                    {/* Center Crystal */}
                    <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" stroke="#FEF08A" strokeWidth="0.8" />
                  </g>
                ) : item.isCharm === 'sun' ? (
                  // Sun Charm with Freshwater Pearl core
                  <g filter="url(#charmGlow)" transform="translate(0, 20) scale(1.15)">
                    {/* Jump ring */}
                    <circle cx="0" cy="-18" r="3.5" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
                    {/* Sunburst rays */}
                    <g stroke="#F59E0B" strokeWidth="2" strokeLinecap="round">
                      <line x1="0" y1="-12" x2="0" y2="-15" />
                      <line x1="9" y1="-9" x2="12" y2="-12" />
                      <line x1="12" y1="0" x2="15" y2="0" />
                      <line x1="9" y1="9" x2="12" y2="12" />
                      <line x1="0" y1="12" x2="0" y2="15" />
                      <line x1="-9" y1="9" x2="-12" y2="12" />
                      <line x1="-12" y1="0" x2="-15" y2="0" />
                      <line x1="-9" y1="-9" x2="-12" y2="-12" />
                    </g>
                    {/* Golden fluted ring */}
                    <circle cx="0" cy="0" r="8" fill="url(#goldSpacerGrad)" />
                    {/* Pearl core */}
                    <circle cx="0" cy="0" r="5" fill="url(#pearlCharmGrad)" stroke="rgba(255,255,255,0.8)" strokeWidth="0.8" />
                  </g>
                ) : (
                  // Gemstone Spherical Bead (e.g., Amazonite mint-turquoise)
                  <g filter="url(#beadGlow)">
                    <circle
                      r={beadRadius}
                      fill={item.bead.imageColor || '#4ECDC4'}
                      stroke="rgba(255,255,255,0.45)"
                      strokeWidth="1.2"
                    />
                    {/* Swirl vein effect for gemstone realism */}
                    <path
                      d={`M ${-beadRadius * 0.7} ${-beadRadius * 0.2} Q 0 ${beadRadius * 0.6} ${beadRadius * 0.7} ${-beadRadius * 0.3}`}
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="2"
                      fill="none"
                    />
                    {/* Top specular 3D highlight */}
                    <circle cx="-5" cy="-5" r={beadRadius * 0.38} fill="rgba(255,255,255,0.7)" />
                    {/* Depth shadow */}
                    <path
                      d={`M ${-beadRadius * 0.7} ${beadRadius * 0.5} A ${beadRadius} ${beadRadius} 0 0 0 ${beadRadius * 0.7} ${beadRadius * 0.5}`}
                      stroke="rgba(0,0,0,0.35)"
                      strokeWidth="3"
                      fill="none"
                    />
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Central Smartwatch Body & Curved OLED Display */}
        {/* Placed at (x: 175, y: 155) so the beads loop gracefully around the lugs */}
        <div
          className="relative z-10 w-[140px] h-[170px] rounded-[38px] p-2 flex flex-col items-center justify-between shadow-[0_20px_40px_rgba(0,0,0,0.8)] border transition-all duration-300"
          style={{
            transform: `rotate(${-rotationAngle * 0.25}deg)`, // slight reactive parallax
            background: `linear-gradient(145deg, ${watchBase.bezelColor} 0%, #2A1F1D 50%, ${watchBase.bezelColor} 100%)`,
            borderColor: `${watchBase.bezelColor}cc`,
            boxShadow: `0 20px 45px rgba(0,0,0,0.8), 0 0 25px ${watchBase.bezelColor}33, inset 0 2px 6px rgba(255,255,255,0.5)`,
          }}
        >
          {/* Top Lug Adapters (connects to bead strands) */}
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-4 rounded-t-lg border-t border-x shadow-md"
            style={{
              background: `linear-gradient(to bottom, ${watchBase.bezelColor}, #422)`,
              borderColor: watchBase.bezelColor,
            }}
          />

          {/* Bottom Lug Adapters */}
          <div
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-20 h-4 rounded-b-lg border-b border-x shadow-md"
            style={{
              background: `linear-gradient(to top, ${watchBase.bezelColor}, #422)`,
              borderColor: watchBase.bezelColor,
            }}
          />

          {/* Digital Crown & Side Button */}
          <div
            className="absolute -right-3 top-10 w-2.5 h-7 rounded-r-md border shadow-sm"
            style={{
              background: `linear-gradient(to bottom, #FFF, ${watchBase.bezelColor}, #222)`,
              borderColor: watchBase.bezelColor,
            }}
          />
          <div
            className="absolute -right-2 top-20 w-1.5 h-6 rounded-r-sm bg-slate-800 border"
            style={{ borderColor: watchBase.bezelColor }}
          />

          {/* Beveled Edge Screen Container */}
          <div className="relative w-full h-full rounded-[30px] overflow-hidden bg-black flex flex-col items-center justify-between p-3 border border-white/10 shadow-inner">
            {/* Screen Wallpaper: Realistic Pink Flower/Botanical Wallpaper matching Gemloo Image 2 */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#1E112A] via-[#10081C] to-black opacity-95" />
            
            {/* Glowing Lotus / Floral Illustration */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-24 opacity-85 pointer-events-none">
              <svg viewBox="0 0 100 80" className="w-full h-full">
                <defs>
                  <radialGradient id="lotusPetal" cx="50%" cy="80%" r="70%">
                    <stop offset="0%" stopColor="#FFAAA6" />
                    <stop offset="50%" stopColor="#FF7582" />
                    <stop offset="100%" stopColor="#8A1230" />
                  </radialGradient>
                </defs>
                {/* Layered lotus petals */}
                <path d="M50,75 C25,70 10,45 25,25 C40,40 50,60 50,75 Z" fill="url(#lotusPetal)" opacity="0.8" />
                <path d="M50,75 C75,70 90,45 75,25 C60,40 50,60 50,75 Z" fill="url(#lotusPetal)" opacity="0.8" />
                <path d="M50,75 C35,60 30,30 50,10 C70,30 65,60 50,75 Z" fill="url(#lotusPetal)" opacity="0.95" />
                <path d="M50,75 C42,65 38,40 50,22 C62,40 58,65 50,75 Z" fill="#FFC3A0" opacity="0.9" />
              </svg>
            </div>

            {/* Smartwatch UI: Time & Date Header matching "10:09 Tue, 14 Oct" */}
            <div className="relative z-10 w-full flex flex-col items-center pt-2">
              <span className="text-2xl font-light tracking-tight text-white font-sans drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                {watchBase.screenTime || '10:09'}
              </span>
              <span className="text-[10px] font-medium tracking-wide text-rose-200 uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                {watchBase.screenDate || 'Tue, 14 Oct'}
              </span>
            </div>

            {/* Smartwatch Status / Health bar at bottom */}
            <div className="relative z-10 w-full flex items-center justify-between px-2 text-[9px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                72 bpm
              </span>
              <span className="text-purple-300 font-mono">100%</span>
            </div>

            {/* Glass Curvature Glare */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none rounded-t-[30px]" />
          </div>
        </div>
      </div>

      {/* Bottom Center Carousel Dots (matching 3 dots in Gemloo Image 2) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {[1, 2, 3].map((dotIndex) => (
          <button
            key={dotIndex}
            onClick={() => onSlideChange && onSlideChange(dotIndex)}
            className={`transition-all duration-300 rounded-full ${
              activeSlide === dotIndex
                ? 'w-6 h-2 bg-gradient-to-r from-purple-400 to-cyan-400 shadow-[0_0_8px_rgba(168,85,247,0.7)]'
                : 'w-2 h-2 bg-white/30 hover:bg-white/60'
            }`}
            aria-label={`Slide ${dotIndex}`}
          />
        ))}
      </div>
    </div>
  );
};

export default DiyBraceletCanvas;
