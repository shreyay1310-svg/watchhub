import React, { useState, useRef } from 'react';
import { RotateCw, Eye, ZoomIn, Sparkles } from 'lucide-react';
import { DIAL_CONFIG, CASE_CONFIG, STRAP_CONFIG, HANDS_MARKERS_CONFIG } from '../../data/customWatchData';

export const LiveWatchPreview = ({ customWatch, onSelectAngle }) => {
  const [viewMode, setViewMode] = useState('front'); // '360', 'front', 'back', 'zoom'
  const [rotationAngle, setRotationAngle] = useState(0); // 0 to 360 deg
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const previewRef = useRef(null);

  // Extract selected configurations
  const dialColorObj = DIAL_CONFIG.colors.find((c) => c.id === customWatch.dial.color) || DIAL_CONFIG.colors[1];
  const dialColorHex = customWatch.dial.customHex || dialColorObj.hex;
  const caseColorObj = CASE_CONFIG.colors.find((c) => c.id === customWatch.case.color) || CASE_CONFIG.colors[0];
  const caseColorHex = caseColorObj.hex;
  const strapColorObj = STRAP_CONFIG.colors.find((c) => c.id === customWatch.strap.color) || STRAP_CONFIG.colors[0];
  const strapColorHex = strapColorObj.hex;
  const handObj = HANDS_MARKERS_CONFIG.hands.find((h) => h.id === customWatch.hands) || HANDS_MARKERS_CONFIG.hands[1];
  const handColor = handObj.hex;

  // Mouse & Touch Drag Handlers for 360 Rotation
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStartX(e.clientX || (e.touches && e.touches[0].clientX) || 0);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = clientX - dragStartX;
    setRotationAngle((prev) => (prev + deltaX * 0.8) % 360);
    setDragStartX(clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const isSquare = customWatch.dial.shape === 'square';
  const isRectangle = customWatch.dial.shape === 'rectangle';
  const isTonneau = customWatch.dial.shape === 'tonneau';
  const isOval = customWatch.dial.shape === 'oval';

  const isSkeleton = customWatch.dial.finish === 'skeleton';
  const isSunburst = customWatch.dial.finish === 'sunburst';
  const isTextured = customWatch.dial.finish === 'textured';
  const isGlossy = customWatch.dial.finish === 'glossy';

  const hasDate = customWatch.features.includes('date_window');
  const hasChrono = customWatch.watchType === 'chronograph' || customWatch.features.includes('chronograph');

  // Markers coordinate calculations for 12 hours
  const hourMarkers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const romanLabels = {
    12: 'XII', 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V',
    6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X', 11: 'XI',
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200/90 shadow-xl p-5 flex flex-col justify-between relative overflow-hidden font-poppins select-none">
      {/* Background radial atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F9FAFB] via-white to-[#F3F4F6] pointer-events-none" />

      {/* Top Controls: 360°, Front, Back, Zoom */}
      <div className="relative z-10 flex flex-col gap-2 mb-2">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-watch-gold/15 border border-watch-gold/30 text-[11px] font-bold text-amber-900">
            <Sparkles className="w-3.5 h-3.5 text-watch-gold" />
            <span>Interactive 3D Studio</span>
          </div>

          <div className="text-[11px] text-gray-500 font-medium">
            Dial: <span className="font-bold text-gray-800">{customWatch.dial.size} mm</span>
          </div>
        </div>

        {/* Floating View Switcher Pills */}
        <div className="flex items-center gap-1.5 self-start bg-gray-100/90 p-1 rounded-2xl border border-gray-200 shadow-xs">
          <button
            type="button"
            onClick={() => setViewMode('360')}
            className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              viewMode === '360'
                ? 'bg-watch-navy text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5 text-watch-gold" />
            <span>360°</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('front')}
            className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              viewMode === 'front'
                ? 'bg-watch-navy text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Front</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('back')}
            className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              viewMode === 'back'
                ? 'bg-watch-navy text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>Back Case</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'zoom' ? 'front' : 'zoom')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              viewMode === 'zoom'
                ? 'bg-watch-navy text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          LIVE REACTIVE SVG WATCH STAGE (FRONT / BACK / ROTATION)
          ════════════════════════════════════════════════════════════════ */}
      <div
        ref={previewRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        className={`relative z-10 w-full h-[380px] sm:h-[420px] flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform ${
          viewMode === 'zoom' ? 'scale-125' : 'scale-100'
        }`}
        style={{
          transform: viewMode === '360' ? `rotateY(${rotationAngle}deg)` : undefined,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Shadow Grounding Glow */}
        <div className="absolute bottom-6 w-52 h-7 bg-black/25 blur-xl rounded-full scale-95" />

        {viewMode === 'back' ? (
          /* ──────── BACK CASE VIEW WITH EXHIBITION GLASS & ENGRAVING ──────── */
          <svg
            viewBox="0 0 320 440"
            className="w-full h-full max-h-[410px] drop-shadow-2xl animate-fade-in"
          >
            <defs>
              <linearGradient id="backCaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="40%" stopColor={caseColorHex} />
                <stop offset="100%" stopColor="#2A2A2A" />
              </linearGradient>
              <linearGradient id="rotorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D4AF37" />
                <stop offset="50%" stopColor="#FFE082" />
                <stop offset="100%" stopColor="#A88214" />
              </linearGradient>
            </defs>

            {/* Upper Strap segment */}
            <rect x="110" y="20" width="100" height="90" rx="6" fill={strapColorHex} />
            {/* Lower Strap segment */}
            <rect x="110" y="330" width="100" height="90" rx="6" fill={strapColorHex} />

            {/* Case Back Bezel Outer */}
            <circle cx="160" cy="220" r="102" fill="url(#backCaseGrad)" stroke="#B0B0B0" strokeWidth="3" />
            <circle cx="160" cy="220" r="90" fill="#1C1F26" stroke="#4B5563" strokeWidth="2" />

            {/* Transparent Sapphire Crystal Exhibition Window */}
            <circle cx="160" cy="220" r="76" fill="#111827" />

            {/* Geneva Stripes Background Movement Plates */}
            <g opacity="0.6">
              {[...Array(9)].map((_, i) => (
                <line
                  key={i}
                  x1="90"
                  y1={160 + i * 15}
                  x2="230"
                  y2={160 + i * 15}
                  stroke="#475569"
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                />
              ))}
            </g>

            {/* Oscillating Golden Rotor (Weight) */}
            <path
              d="M 100 220 A 60 60 0 0 1 220 220 L 160 220 Z"
              fill="url(#rotorGrad)"
              stroke="#B38914"
              strokeWidth="1.5"
              opacity="0.92"
            />
            <circle cx="160" cy="220" r="12" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
            <circle cx="160" cy="220" r="4" fill="#991B1B" />

            {/* Perimeter Technical Specifications Text */}
            <path
              id="specCurve"
              d="M 85 220 A 75 75 0 1 1 235 220 A 75 75 0 1 1 85 220"
              fill="none"
            />
            <text fill="#D4AF37" fontSize="7.5" fontWeight="bold" letterSpacing="1.2">
              <textPath href="#specCurve" startOffset="6%">
                SWISS ASSEMBLED • 100M WATER RESISTANT • 316L STEEL • SAPPHIRE
              </textPath>
            </text>

            {/* Custom Engraving Banner */}
            <rect x="95" y="270" width="130" height="26" rx="6" fill="#0B121C" stroke="#D4AF37" strokeWidth="1" />
            <text
              x="160"
              y="287"
              textAnchor="middle"
              fill="#FDE68A"
              fontSize="10"
              fontWeight="bold"
              fontFamily={customWatch.personalization.font === 'serif' ? 'serif' : 'sans-serif'}
              letterSpacing="1"
            >
              {customWatch.personalization.backEngraving || 'WATCHHUB BESPOKE'}
            </text>
          </svg>
        ) : (
          /* ──────── FRONT LIVE WATCH FACE VIEW ──────── */
          <svg
            viewBox="0 0 320 440"
            className="w-full h-full max-h-[410px] drop-shadow-2xl animate-fade-in"
          >
            <defs>
              {/* Case Metallic Shading Gradient */}
              <linearGradient id="caseMetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="25%" stopColor={caseColorHex} />
                <stop offset="70%" stopColor={caseColorHex} />
                <stop offset="100%" stopColor="#1E1E1E" />
              </linearGradient>

              {/* Sunburst Dial Shading */}
              <radialGradient id="dialSunburstGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
                <stop offset="40%" stopColor={dialColorHex} />
                <stop offset="100%" stopColor="#05080E" />
              </radialGradient>

              {/* Crystal Glass Reflection Sheen */}
              <linearGradient id="glassGlossGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
                <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.08" />
                <stop offset="65%" stopColor="#FFFFFF" stopOpacity="0" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.15" />
              </linearGradient>
            </defs>

            {/* 1. STRAPS */}
            {/* Upper Strap */}
            <g>
              <rect
                x="114"
                y="15"
                width="92"
                height="95"
                rx={customWatch.strap.material === 'mesh' ? 0 : 5}
                fill={strapColorHex}
                stroke="#000000"
                strokeOpacity="0.15"
              />
              {/* Strap Texture / Stitching */}
              {customWatch.strap.material === 'leather' && (
                <g stroke="#E5E7EB" strokeWidth="1" strokeDasharray="3 3" opacity="0.65">
                  <line x1="120" y1="20" x2="120" y2="105" />
                  <line x1="200" y1="20" x2="200" y2="105" />
                </g>
              )}
              {customWatch.strap.material === 'steel' && (
                <g stroke="#1F2937" strokeWidth="1.5" opacity="0.35">
                  <line x1="114" y1="40" x2="206" y2="40" />
                  <line x1="114" y1="65" x2="206" y2="65" />
                  <line x1="114" y1="90" x2="206" y2="90" />
                  <line x1="145" y1="15" x2="145" y2="105" />
                  <line x1="175" y1="15" x2="175" y2="105" />
                </g>
              )}
            </g>

            {/* Lower Strap */}
            <g>
              <rect
                x="114"
                y="330"
                width="92"
                height="95"
                rx={customWatch.strap.material === 'mesh' ? 0 : 5}
                fill={strapColorHex}
                stroke="#000000"
                strokeOpacity="0.15"
              />
              {customWatch.strap.material === 'leather' && (
                <g stroke="#E5E7EB" strokeWidth="1" strokeDasharray="3 3" opacity="0.65">
                  <line x1="120" y1="335" x2="120" y2="420" />
                  <line x1="200" y1="335" x2="200" y2="420" />
                </g>
              )}
              {customWatch.strap.material === 'steel' && (
                <g stroke="#1F2937" strokeWidth="1.5" opacity="0.35">
                  <line x1="114" y1="355" x2="206" y2="355" />
                  <line x1="114" y1="380" x2="206" y2="380" />
                  <line x1="114" y1="405" x2="206" y2="405" />
                  <line x1="145" y1="330" x2="145" y2="425" />
                  <line x1="175" y1="330" x2="175" y2="425" />
                </g>
              )}
            </g>

            {/* 2. CASE & LUGS */}
            {/* Lugs */}
            <polygon points="106,120 114,80 136,80 126,130" fill="url(#caseMetalGrad)" stroke="#4A5568" strokeWidth="0.8" />
            <polygon points="214,120 206,80 184,80 194,130" fill="url(#caseMetalGrad)" stroke="#4A5568" strokeWidth="0.8" />
            <polygon points="106,320 114,360 136,360 126,310" fill="url(#caseMetalGrad)" stroke="#4A5568" strokeWidth="0.8" />
            <polygon points="214,320 206,360 184,360 194,310" fill="url(#caseMetalGrad)" stroke="#4A5568" strokeWidth="0.8" />

            {/* Crown at 3 o'clock */}
            <rect x="264" y="210" width="12" height="20" rx="3" fill="url(#caseMetalGrad)" stroke="#2D3748" strokeWidth="1" />
            <line x1="267" y1="213" x2="267" y2="227" stroke="#333" strokeWidth="1" />
            <line x1="270" y1="213" x2="270" y2="227" stroke="#333" strokeWidth="1" />
            <line x1="273" y1="213" x2="273" y2="227" stroke="#333" strokeWidth="1" />

            {/* Chronograph Pushers if Chrono Watch */}
            {hasChrono && (
              <>
                <rect x="256" y="175" width="8" height="14" rx="2" fill="url(#caseMetalGrad)" />
                <rect x="256" y="250" width="8" height="14" rx="2" fill="url(#caseMetalGrad)" />
              </>
            )}

            {/* Outer Bezel */}
            {isSquare ? (
              <rect x="60" y="120" width="200" height="200" rx="28" fill="url(#caseMetalGrad)" stroke="#718096" strokeWidth="2.5" />
            ) : isRectangle ? (
              <rect x="70" y="110" width="180" height="220" rx="20" fill="url(#caseMetalGrad)" stroke="#718096" strokeWidth="2.5" />
            ) : isTonneau ? (
              <path
                d="M 90 125 C 160 105 160 105 230 125 C 265 220 265 220 230 315 C 160 335 160 335 90 315 C 55 220 55 220 90 125 Z"
                fill="url(#caseMetalGrad)"
                stroke="#718096"
                strokeWidth="2.5"
              />
            ) : isOval ? (
              <ellipse cx="160" cy="220" rx="98" ry="110" fill="url(#caseMetalGrad)" stroke="#718096" strokeWidth="2.5" />
            ) : (
              <circle cx="160" cy="220" r="105" fill="url(#caseMetalGrad)" stroke="#718096" strokeWidth="2.5" />
            )}

            {/* 3. DIAL FACE */}
            {isSquare ? (
              <rect
                x="76"
                y="136"
                width="168"
                height="168"
                rx="18"
                fill={isSunburst ? 'url(#dialSunburstGrad)' : dialColorHex}
              />
            ) : isRectangle ? (
              <rect
                x="84"
                y="124"
                width="152"
                height="192"
                rx="14"
                fill={isSunburst ? 'url(#dialSunburstGrad)' : dialColorHex}
              />
            ) : isTonneau ? (
              <path
                d="M 102 138 C 160 120 160 120 218 138 C 248 220 248 220 218 302 C 160 320 160 320 102 302 C 72 220 72 220 102 138 Z"
                fill={isSunburst ? 'url(#dialSunburstGrad)' : dialColorHex}
              />
            ) : isOval ? (
              <ellipse
                cx="160"
                cy="220"
                rx="84"
                ry="96"
                fill={isSunburst ? 'url(#dialSunburstGrad)' : dialColorHex}
              />
            ) : (
              <circle
                cx="160"
                cy="220"
                r="90"
                fill={isSunburst ? 'url(#dialSunburstGrad)' : dialColorHex}
              />
            )}

            {/* Skeleton Gears Overlay (if Skeleton Finish) */}
            {isSkeleton && (
              <g opacity="0.85">
                <circle cx="140" cy="205" r="28" fill="none" stroke="#D4AF37" strokeWidth="5" strokeDasharray="6 3" />
                <circle cx="180" cy="235" r="22" fill="none" stroke="#E2E8F0" strokeWidth="4" strokeDasharray="5 2" />
                <circle cx="140" cy="205" r="8" fill="#B91C1C" />
                <circle cx="180" cy="235" r="6" fill="#D4AF37" />
              </g>
            )}

            {/* Textured Waffle Grid Overlay */}
            {isTextured && (
              <g opacity="0.18">
                {[...Array(14)].map((_, i) => (
                  <line key={`tx-${i}`} x1="75" y1={130 + i * 14} x2="245" y2={130 + i * 14} stroke="#FFF" strokeWidth="1" />
                ))}
                {[...Array(14)].map((_, i) => (
                  <line key={`ty-${i}`} x1={80 + i * 14} y1={125} x2={80 + i * 14} y2={315} stroke="#FFF" strokeWidth="1" />
                ))}
              </g>
            )}

            {/* 4. HOUR MARKERS */}
            <g>
              {hourMarkers.map((hour) => {
                const angle = (hour * 30 - 90) * (Math.PI / 180);
                const rRadius = 74;
                const x = 160 + rRadius * Math.cos(angle);
                const y = 220 + rRadius * Math.sin(angle);

                if (customWatch.markers === 'roman') {
                  return (
                    <text
                      key={hour}
                      x={x}
                      y={y + 3.5}
                      textAnchor="middle"
                      fill={handColor}
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="serif"
                    >
                      {romanLabels[hour]}
                    </text>
                  );
                }

                if (customWatch.markers === 'arabic') {
                  return (
                    <text
                      key={hour}
                      x={x}
                      y={y + 3.5}
                      textAnchor="middle"
                      fill={handColor}
                      fontSize="9.5"
                      fontWeight="bold"
                    >
                      {hour}
                    </text>
                  );
                }

                if (customWatch.markers === 'diamond') {
                  return (
                    <polygon
                      key={hour}
                      points={`${x},${y - 3.5} ${x + 3},${y} ${x},${y + 3.5} ${x - 3},${y}`}
                      fill="#FFFFFF"
                      stroke={handColor}
                      strokeWidth="0.8"
                    />
                  );
                }

                if (customWatch.markers === 'minimal') {
                  return (
                    <circle
                      key={hour}
                      cx={x}
                      cy={y}
                      r={hour % 3 === 0 ? 2.5 : 1.2}
                      fill={handColor}
                    />
                  );
                }

                // Default Index batons
                const rotDeg = hour * 30;
                return (
                  <rect
                    key={hour}
                    x={158.5}
                    y={136}
                    width={hour % 3 === 0 ? 3.5 : 2}
                    height={hour % 3 === 0 ? 10 : 7}
                    rx="1"
                    fill={handColor}
                    transform={`rotate(${rotDeg} 160 220)`}
                  />
                );
              })}
            </g>

            {/* 5. BRAND LOGO & CUSTOM DIAL TEXT */}
            <text
              x="160"
              y="180"
              textAnchor="middle"
              fill={dialColorObj.id === 'white' || dialColorObj.id === 'champagne' ? '#0F172A' : '#F8FAFC'}
              fontSize="9"
              fontWeight="900"
              fontFamily="serif"
              letterSpacing="0.8"
            >
              WatchHub
            </text>
            <text
              x="160"
              y="190"
              textAnchor="middle"
              fill="#D4AF37"
              fontSize="6"
              fontWeight="bold"
              letterSpacing="1.5"
            >
              {customWatch.personalization.dialText || 'CUSTOM'}
            </text>

            {/* Bottom Movement Text */}
            <text
              x="160"
              y="256"
              textAnchor="middle"
              fill={dialColorObj.id === 'white' || dialColorObj.id === 'champagne' ? '#475569' : '#CBD5E1'}
              fontSize="5.5"
              fontWeight="bold"
              letterSpacing="1.2"
            >
              {(customWatch.movement || 'AUTOMATIC').toUpperCase()}
            </text>
            <text
              x="160"
              y="264"
              textAnchor="middle"
              fill="#D4AF37"
              fontSize="4.8"
              fontWeight="semibold"
              letterSpacing="0.8"
            >
              WATER RESISTANT
            </text>

            {/* Date Display Aperture at 3 o'clock */}
            {hasDate && (
              <g>
                <rect x="206" y="213" width="18" height="14" rx="2" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />
                <text x="215" y="224" textAnchor="middle" fill="#000000" fontSize="8" fontWeight="bold">
                  28
                </text>
              </g>
            )}

            {/* Chronograph Sub-Dials */}
            {hasChrono && (
              <g opacity="0.9">
                {/* 9 o'clock Sub-dial */}
                <circle cx="125" cy="220" r="16" fill="none" stroke={handColor} strokeWidth="1" strokeDasharray="2 2" />
                <line x1="125" y1="220" x2="132" y2="215" stroke={handColor} strokeWidth="1.2" />
                {/* 6 o'clock Sub-dial */}
                <circle cx="160" cy="245" r="14" fill="none" stroke={handColor} strokeWidth="1" strokeDasharray="2 2" />
                <line x1="160" y1="245" x2="160" y2="236" stroke={handColor} strokeWidth="1.2" />
              </g>
            )}

            {/* 6. TIMEPIECE HANDS (Hour, Minute & Second needles) */}
            {/* Hour Hand (Points around 10:10) */}
            <line
              x1="160"
              y1="220"
              x2="124"
              y2="175"
              stroke={handColor}
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Minute Hand */}
            <line
              x1="160"
              y1="220"
              x2="198"
              y2="155"
              stroke={handColor}
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            {/* Center Pinion */}
            <circle cx="160" cy="220" r="5" fill={handColor} stroke="#0B121C" strokeWidth="1" />
            {/* Second Needle (Sporty Red or Gold needle) */}
            <line
              x1="160"
              y1="230"
              x2="160"
              y2="142"
              stroke="#EF4444"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <circle cx="160" cy="220" r="2.2" fill="#EF4444" />

            {/* 7. GLASS REFLECTION SHEEN (if Glossy) */}
            {isGlossy && (
              <path
                d="M 90 140 Q 160 160 210 200 L 230 180 Q 160 130 110 125 Z"
                fill="url(#glassGlossGrad)"
                opacity="0.8"
              />
            )}
          </svg>
        )}
      </div>

      {/* Bottom Hint */}
      <div className="relative z-10 text-center text-[11px] text-gray-400 mt-1 flex items-center justify-center gap-1.5">
        <RotateCw className="w-3 h-3 text-watch-gold animate-spin" style={{ animationDuration: '6s' }} />
        <span>Drag to rotate 360° • Click thumbnails for angle previews</span>
      </div>

      {/* 4 Angle Thumbnail Pickers (Matching Mockup exactly!) */}
      <div className="relative z-10 grid grid-cols-4 gap-2.5 mt-4 pt-3 border-t border-gray-100">
        {/* Thumb 1: Front */}
        <button
          type="button"
          onClick={() => { setViewMode('front'); onSelectAngle?.('front'); }}
          className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
            viewMode === 'front'
              ? 'border-watch-gold bg-amber-50/50 shadow-sm'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center" style={{ backgroundColor: dialColorHex }}>
            <span className="text-[10px]">⌚</span>
          </div>
          <span className="text-[9.5px] font-bold text-gray-700">Front</span>
        </button>

        {/* Thumb 2: Angled 360 */}
        <button
          type="button"
          onClick={() => { setViewMode('360'); setRotationAngle(35); onSelectAngle?.('angled'); }}
          className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
            viewMode === '360'
              ? 'border-watch-gold bg-amber-50/50 shadow-sm'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-gray-100">
            <span className="text-[10px]">🔄</span>
          </div>
          <span className="text-[9.5px] font-bold text-gray-700">360° Tilt</span>
        </button>

        {/* Thumb 3: Back Case */}
        <button
          type="button"
          onClick={() => { setViewMode('back'); onSelectAngle?.('back'); }}
          className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
            viewMode === 'back'
              ? 'border-watch-gold bg-amber-50/50 shadow-sm'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-slate-800 text-watch-gold">
            <span className="text-[10px]">🔍</span>
          </div>
          <span className="text-[9.5px] font-bold text-gray-700">Back Case</span>
        </button>

        {/* Thumb 4: Zoom */}
        <button
          type="button"
          onClick={() => { setViewMode('zoom'); onSelectAngle?.('zoom'); }}
          className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
            viewMode === 'zoom'
              ? 'border-watch-gold bg-amber-50/50 shadow-sm'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-amber-100">
            <ZoomIn className="w-4 h-4 text-amber-800" />
          </div>
          <span className="text-[9.5px] font-bold text-gray-700">Dial Zoom</span>
        </button>
      </div>
    </div>
  );
};

export default LiveWatchPreview;

