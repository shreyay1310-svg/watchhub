import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  ChevronLeft,
  RotateCw,
  Sparkles,
  ArrowRight,
  Play,
  X,
  ShieldCheck,
  Check,
  Eye,
  Sliders,
  Box,
} from 'lucide-react';

const CUSTOMIZATION_STEPS = [
  {
    id: 'dial',
    title: 'Dial',
    image: '/images/hero/step_dial.png',
    options: ['Sunburst Blue', 'Obsidian Black', 'Opaline White', 'Emerald Green', 'Openwork Skeleton', 'Tri-Compax Chronograph'],
  },
  {
    id: 'case',
    title: 'Case',
    image: '/images/hero/step_case.png',
    options: ['316L Stainless Steel', '18K Yellow Gold', 'Rose Gold', 'Grade 5 Titanium', 'Black DLC / PVD'],
  },
  {
    id: 'strap',
    title: 'Strap',
    image: '/images/hero/step_strap.png',
    options: ['Italian Alligator Leather', 'Stainless Steel Bracelet', 'FKM Rubber Strap', 'Silicone Sports Band', 'Woven Fabric NATO'],
  },
  {
    id: 'engraving',
    title: 'Engraving',
    image: '/images/hero/step_engraving.png',
    options: ['Personalized Name / Date', 'Monogram Initials (e.g. SY)', 'Custom Message', 'Live 3D Preview Engraving'],
  },
];

const NEW_ARRIVALS_WATCHES = [
  {
    id: 'tag-carrera',
    name: 'Black Chronograph Watch',
    brand: 'TAG Heuer Carrera',
    badge: 'NEW NOVELTY',
    price: 490000,
    caseSize: '42mm • Automatic',
    image: '/images/hero/new_arrival_chrono.png',
    accentColor: '#00D5FF',
    releaseYear: '2026 Manufacture',
  },
  {
    id: 'rolex-daytona',
    name: 'Gold Automatic Watch',
    brand: 'Rolex Cosmograph Gold',
    badge: '18K YELLOW GOLD',
    price: 3250000,
    caseSize: '40mm • Chronometer',
    image: '/images/hero/new_arrival_gold.png',
    accentColor: '#E6B84F',
    releaseYear: '2026 Novelty',
  },
  {
    id: 'chronoswiss-tourbillon',
    name: 'Luxury Skeleton Watch',
    brand: 'Chronoswiss Open Gear',
    badge: 'FLYING TOURBILLON',
    price: 7800000,
    caseSize: '41mm • Skeleton',
    image: '/images/hero/new_arrival_skeleton.png',
    accentColor: '#00D5FF',
    releaseYear: 'Numbered Limited 15 Pcs',
  },
];

export const CustomizeAndNewArrivalsSection = () => {
  const navigate = useNavigate();

  // Left Card: 3D Demo modal state & active step selector
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [is3dModalOpen, setIs3dModalOpen] = useState(false);
  const [previewRotation, setPreviewRotation] = useState(0);

  // 3D Demo interactive settings
  const [demoDialColor, setDemoDialColor] = useState('blue');
  const [demoCaseMetal, setDemoCaseMetal] = useState('steel');
  const [demoAngle, setDemoAngle] = useState(15);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  // Right Card: 3 New Arrivals Carousel state
  const [activeArrivalIndex, setActiveArrivalIndex] = useState(0);

  // Auto-rotate 3D demo
  useEffect(() => {
    let animId;
    if (is3dModalOpen && isAutoRotating) {
      const step = () => {
        setDemoAngle((prev) => (prev + 0.5) % 360);
        animId = requestAnimationFrame(step);
      };
      animId = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animId);
  }, [is3dModalOpen, isAutoRotating]);

  const handlePrevArrival = () => {
    setActiveArrivalIndex((prev) => (prev - 1 + NEW_ARRIVALS_WATCHES.length) % NEW_ARRIVALS_WATCHES.length);
  };

  const handleNextArrival = () => {
    setActiveArrivalIndex((prev) => (prev + 1) % NEW_ARRIVALS_WATCHES.length);
  };

  const currentArrival = NEW_ARRIVALS_WATCHES[activeArrivalIndex];

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch select-none">
      {/* ══════════════════════════════════════════════════════════════════════
          PART 1 & PART 2: LEFT PANEL – 3D CONFIGURATOR STUDIO & LARGE PREVIEW
          (Exact Match to User Reference Screenshot)
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-[#0B1425] border border-[#00D5FF]/25 shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex flex-col justify-between relative overflow-hidden group">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-radial from-[#00D5FF]/10 via-transparent to-transparent pointer-events-none blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-radial from-[#E6B84F]/10 via-transparent to-transparent pointer-events-none blur-3xl" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10 flex-1">
          {/* Left Sub-Column: Text, 4 Steps, CTAs */}
          <div className="md:col-span-7 space-y-4">
            {/* 3D Configurator Studio Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-bold tracking-widest uppercase bg-[#00D5FF]/15 text-[#00D5FF] border border-[#00D5FF]/30 shadow-[0_0_15px_rgba(0,213,255,0.2)]">
              <Box className="w-3.5 h-3.5" />
              <span>3D CONFIGURATOR STUDIO</span>
            </div>

            {/* Main Heading matching "Customize Your Watch" with gold highlight */}
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-serif font-bold text-white tracking-tight leading-tight">
                Customize Your <span className="text-[#E6B84F]">Watch</span>
              </h2>
              <p className="text-xs sm:text-[13px] text-[#A6B1C8] mt-2 leading-relaxed font-light">
                Design your own unique timepiece with premium dial guilloché, case materials, hand-stitched straps, and personalized laser engravings.
              </p>
            </div>

            {/* 4 Customization Step Thumbnails matching reference */}
            <div className="pt-2">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {CUSTOMIZATION_STEPS.map((step, idx) => {
                  const isActive = activeStepIndex === idx;
                  return (
                    <React.Fragment key={step.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveStepIndex(idx);
                          navigate(`/customize-watch?step=${idx + 1}`);
                        }}
                        className={`group/step relative rounded-xl p-1.5 text-center flex flex-col items-center justify-between transition-all duration-300 w-16 sm:w-[72px] shrink-0 border cursor-pointer ${
                          isActive
                            ? 'bg-[#121F38] border-[#E6B84F] shadow-[0_0_15px_rgba(230,184,79,0.3)] scale-105'
                            : 'bg-[#060D1A]/90 border-white/10 hover:border-[#00D5FF]/50 hover:bg-[#0E1A2E]'
                        }`}
                        title={`Customize ${step.title}`}
                      >
                        {/* Thumbnail image */}
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/40 flex items-center justify-center p-0.5 mb-1 border border-white/5">
                          <img
                            src={step.image}
                            alt={step.title}
                            className="w-full h-full object-contain filter drop-shadow group-hover/step:scale-110 transition-transform"
                          />
                        </div>
                        <span
                          className={`text-[11px] font-bold tracking-wide transition-colors ${
                            isActive ? 'text-[#E6B84F]' : 'text-slate-300 group-hover/step:text-white'
                          }`}
                        >
                          {step.title}
                        </span>
                      </button>

                      {/* Small Separator Arrow */}
                      {idx < CUSTOMIZATION_STEPS.length - 1 && (
                        <span className="text-[#E6B84F]/70 text-xs font-bold select-none shrink-0">
                          ›
                        </span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Active step options hint */}
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E6B84F] animate-pulse" />
                <span className="text-slate-300 font-medium">
                  {CUSTOMIZATION_STEPS[activeStepIndex].title} Options:
                </span>
                <span className="truncate">
                  {CUSTOMIZATION_STEPS[activeStepIndex].options.slice(0, 3).join(', ')}...
                </span>
              </div>
            </div>

            {/* Two Action Buttons: Start Customizing & View 3D Demo */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              {/* Button 1: Start Customizing */}
              <Link
                to="/customize-watch"
                className="py-3 px-5 sm:px-6 rounded-xl bg-gradient-to-r from-[#E6B84F] to-[#D4A84F] hover:from-[#F4C55D] hover:to-[#E6B84F] text-[#050B18] font-black text-xs inline-flex items-center gap-2 shadow-[0_0_20px_rgba(230,184,79,0.35)] hover:shadow-[0_0_28px_rgba(230,184,79,0.55)] transition-all transform hover:-translate-y-0.5 active:scale-[0.99] tracking-wider uppercase"
              >
                <span>Start Customizing</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Button 2: View 3D Demo */}
              <button
                type="button"
                onClick={() => setIs3dModalOpen(true)}
                className="py-3 px-4 sm:px-5 rounded-xl border border-[#00D5FF]/50 bg-[#00D5FF]/10 hover:bg-[#00D5FF]/20 text-[#00D5FF] hover:text-white font-bold text-xs inline-flex items-center gap-2 shadow-[0_0_15px_rgba(0,213,255,0.2)] transition-all cursor-pointer"
              >
                <Box className="w-4 h-4 text-[#00D5FF]" />
                <span>View 3D Demo</span>
                <div className="w-4 h-4 rounded-full bg-[#00D5FF] text-black flex items-center justify-center ml-1">
                  <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                </div>
              </button>
            </div>
          </div>

          {/* Right Sub-Column: Large Watch Preview on Stone Pedestal with Cyan 360 Ring */}
          <div className="md:col-span-5 relative flex items-center justify-center min-h-[260px] sm:min-h-[300px]">
            {/* Floating 360 degree badge */}
            <div className="absolute top-2 right-2 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#00D5FF]/40 text-[10px] font-bold text-[#00D5FF]">
              <RotateCw className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} />
              <span>360°</span>
            </div>

            {/* Glowing cyan elliptical accent ring around the watch */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 sm:w-56 h-28 sm:h-32 rounded-[100%] border-2 border-[#00D5FF]/60 shadow-[0_0_25px_rgba(0,213,255,0.5),inset_0_0_20px_rgba(0,213,255,0.3)] transform -rotate-12 translate-y-16" />
            </div>

            {/* Watch on Pedestal Preview Image (100% Uncropped with object-fit: contain) */}
            <Link
              to="/customize-watch"
              className="relative z-10 w-full h-[250px] sm:h-[290px] flex items-center justify-center group/watch cursor-pointer"
              title="Click to launch 3D Watch Customizer"
            >
              <img
                src="/images/hero/custom_watch_3d_preview.png"
                alt="WatchHub Bespoke Blue Dial Watch"
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] group-hover/watch:scale-105 transition-transform duration-500 ease-out"
                onError={(e) => {
                  e.target.src = '/images/products/featured_rolex_submariner.jpg';
                }}
              />
            </Link>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          PART 3: RIGHT PANEL – LATEST RELEASES & 3-WATCH NEW ARRIVALS CAROUSEL
          (Exact Match to User Reference Screenshot)
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-[#0B1425] border border-[#1E2C44] shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex flex-col justify-between relative overflow-hidden group">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-radial from-[#E6B84F]/10 via-transparent to-transparent pointer-events-none blur-3xl" />

        <div className="space-y-4 relative z-10">
          {/* Latest Releases Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-bold tracking-widest uppercase bg-[#E6B84F]/15 text-[#E6B84F] border border-[#E6B84F]/30 shadow-[0_0_15px_rgba(230,184,79,0.2)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>LATEST RELEASES</span>
          </div>

          {/* Heading & Subtitle */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              New Arrivals
            </h2>
            <p className="text-xs sm:text-[13px] text-[#A6B1C8] mt-1 font-light">
              The latest timepieces from the world's top horological manufactures.
            </p>
          </div>

          {/* 3-Watch Showcase with Left & Right Arrows (Matching Reference Image) */}
          <div className="relative py-3 flex items-center justify-center min-h-[190px] sm:min-h-[220px]">
            {/* Left Carousel Navigation Arrow */}
            <button
              type="button"
              onClick={handlePrevArrival}
              className="absolute left-0 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#050B18]/85 hover:bg-[#00D5FF]/20 border border-[#00D5FF]/40 text-[#00D5FF] hover:text-white flex items-center justify-center shadow-lg transition-all cursor-pointer group/arrow"
              aria-label="Previous New Arrival"
            >
              <ChevronLeft className="w-5 h-5 group-arrow:scale-110" />
            </button>

            {/* Display the 3 Watches on Pedestals side by side (Matching Reference Screenshot) */}
            <div className="w-full flex items-center justify-center gap-2 sm:gap-4 px-8">
              {NEW_ARRIVALS_WATCHES.map((watch, idx) => {
                const isSelected = activeArrivalIndex === idx;
                return (
                  <Link
                    key={watch.id}
                    to={`/product/${watch.id}`}
                    onClick={() => setActiveArrivalIndex(idx)}
                    className={`relative flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'scale-110 z-10 opacity-100'
                        : 'scale-90 opacity-60 hover:opacity-90'
                    }`}
                    title={`View ${watch.brand} (${watch.name})`}
                  >
                    <div className="w-20 sm:w-24 h-32 sm:h-38 flex items-center justify-center">
                      <img
                        src={watch.image}
                        alt={watch.name}
                        className="max-h-full max-w-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Right Carousel Navigation Arrow */}
            <button
              type="button"
              onClick={handleNextArrival}
              className="absolute right-0 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#050B18]/85 hover:bg-[#00D5FF]/20 border border-[#00D5FF]/40 text-[#00D5FF] hover:text-white flex items-center justify-center shadow-lg transition-all cursor-pointer group/arrow"
              aria-label="Next New Arrival"
            >
              <ChevronRight className="w-5 h-5 group-arrow:scale-110" />
            </button>
          </div>

          {/* Active Watch Details Strip */}
          <div className="text-center pt-1 border-t border-white/5">
            <span className="text-[10px] font-mono text-[#00D5FF] font-semibold uppercase tracking-wider block">
              {currentArrival.brand} &bull; {currentArrival.caseSize}
            </span>
            <div className="flex items-center justify-center gap-2 mt-0.5">
              <span className="text-xs font-bold text-white">{currentArrival.name}</span>
              <span className="text-xs font-mono font-bold text-[#E6B84F]">
                ₹{currentArrival.price.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* 3 Slide Indicator Dots */}
          <div className="flex items-center justify-center gap-2 pt-1">
            {NEW_ARRIVALS_WATCHES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveArrivalIndex(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  activeArrivalIndex === idx
                    ? 'w-6 h-2 bg-[#E6B84F] shadow-[0_0_8px_rgba(230,184,79,0.7)]'
                    : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Explore Now Button matching reference styling */}
        <div className="pt-4 relative z-10">
          <Link
            to="/new-arrivals"
            className="py-3 px-6 rounded-xl border border-[#E6B84F]/50 bg-[#050B18]/80 hover:bg-[#E6B84F]/15 text-[#E6B84F] hover:text-white font-bold text-xs inline-flex items-center gap-2 shadow-[0_0_15px_rgba(230,184,79,0.2)] transition-all cursor-pointer"
          >
            <span>Explore Now</span>
            <ChevronRight className="w-4 h-4 text-[#E6B84F]" />
          </Link>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          INTERACTIVE 3D DEMO MODAL (Launched by "View 3D Demo ▶" Button)
          ══════════════════════════════════════════════════════════════════════ */}
      {is3dModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
          <div className="relative w-full max-w-3xl rounded-3xl bg-[#091120] border border-[#00D5FF]/40 p-6 md:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIs3dModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 pb-5 border-b border-white/10">
              <div className="p-2.5 rounded-xl bg-[#00D5FF]/15 text-[#00D5FF] border border-[#00D5FF]/30">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-wide">
                  Interactive 3D Horology Atelier Demo
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Live 360° perspective rendering with realistic dynamic lighting and materials.
                </p>
              </div>
            </div>

            {/* Interactive Stage */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6 items-center">
              {/* Left Canvas Preview */}
              <div className="md:col-span-7 flex flex-col items-center justify-center relative min-h-[300px] rounded-2xl bg-[#040C1A] border border-white/10 p-4 overflow-hidden">
                {/* 360 degree indicator */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 border border-[#00D5FF]/40 text-[11px] font-bold text-[#00D5FF]">
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>360° {Math.round(demoAngle)}°</span>
                </div>

                {/* Glowing cyan pedestal ring */}
                <div className="absolute bottom-6 w-56 h-28 rounded-[100%] border-2 border-[#00D5FF]/50 shadow-[0_0_30px_rgba(0,213,255,0.4)] pointer-events-none transform -rotate-12" />

                {/* Watch with dynamic rotation */}
                <div
                  className="relative z-10 w-52 h-64 flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform duration-75"
                  style={{
                    transform: `rotate(${Math.sin((demoAngle * Math.PI) / 180) * 8}deg) scale(${1 + Math.cos((demoAngle * Math.PI) / 180) * 0.05})`,
                  }}
                  onMouseDown={() => setIsAutoRotating(false)}
                >
                  <img
                    src="/images/hero/custom_watch_3d_preview.png"
                    alt="3D Demo Watch"
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_25px_40px_rgba(0,0,0,0.95)]"
                  />
                </div>

                {/* Drag Slider to manually rotate */}
                <div className="w-full flex items-center gap-3 mt-4 pt-3 border-t border-white/10 z-10">
                  <span className="text-[10px] text-slate-400 font-mono">0°</span>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={demoAngle}
                    onChange={(e) => {
                      setIsAutoRotating(false);
                      setDemoAngle(Number(e.target.value));
                    }}
                    className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#00D5FF]"
                  />
                  <span className="text-[10px] text-slate-400 font-mono">360°</span>
                </div>
              </div>

              {/* Right Control Customization Controls */}
              <div className="md:col-span-5 space-y-4">
                {/* Dial Color Swatches */}
                <div>
                  <label className="text-xs font-bold text-white block mb-2 uppercase tracking-wider">
                    Select Dial Color:
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'blue', name: 'Royal Blue', color: '#1E3A8A' },
                      { id: 'black', name: 'Jet Black', color: '#0F172A' },
                      { id: 'green', name: 'Emerald', color: '#047857' },
                      { id: 'skeleton', name: 'Openwork', color: '#E6B84F' },
                    ].map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setDemoDialColor(d.id)}
                        className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                          demoDialColor === d.id
                            ? 'bg-white/15 border-[#E6B84F] shadow-[0_0_12px_rgba(230,184,79,0.4)]'
                            : 'bg-white/5 border-white/10 hover:border-white/30'
                        }`}
                      >
                        <div
                          className="w-5 h-5 rounded-full border border-white/40 shadow-inner"
                          style={{ backgroundColor: d.color }}
                        />
                        <span className="text-[10px] text-slate-300 font-medium truncate w-full text-center">
                          {d.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Case Metal Finishes */}
                <div>
                  <label className="text-xs font-bold text-white block mb-2 uppercase tracking-wider">
                    Case Material:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'steel', name: 'Oystersteel', label: '316L Mirror' },
                      { id: 'gold', name: '18K Yellow', label: 'Warm Gold' },
                      { id: 'rose', name: 'Rose Gold', label: 'Blush Warm' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setDemoCaseMetal(m.id)}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          demoCaseMetal === m.id
                            ? 'bg-white/15 border-[#E6B84F] shadow-[0_0_12px_rgba(230,184,79,0.4)]'
                            : 'bg-white/5 border-white/10 hover:border-white/30'
                        }`}
                      >
                        <div className="text-[11px] font-bold text-white">{m.name}</div>
                        <div className="text-[9px] text-slate-400">{m.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Specification Callout */}
                <div className="p-3.5 rounded-xl bg-[#050B18] border border-white/10 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Base Movement:</span>
                    <span className="text-white font-medium">Calibre 3230 Automatic</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Power Reserve:</span>
                    <span className="text-emerald-400 font-medium">70 Hours</span>
                  </div>
                  <div className="flex justify-between text-slate-400 pt-1 border-t border-white/5">
                    <span>Estimated Price:</span>
                    <span className="text-[#E6B84F] font-mono font-bold text-sm">₹5,60,000</span>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIs3dModalOpen(false);
                      navigate('/customize-watch');
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E6B84F] to-[#D4A84F] text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(230,184,79,0.35)] hover:brightness-110 transition-all cursor-pointer tracking-wider uppercase"
                  >
                    <span>Open Full DIY Studio</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CustomizeAndNewArrivalsSection;
