import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Boxes,
  Crown,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Play,
} from 'lucide-react';
import { EDITORIAL_STORIES } from '../../data/editorialStoriesData';

export const CraftsmanshipStoriesSection = () => {
  const navigate = useNavigate();
  // Card 1 starts highlighted with glowing cyan border matching the reference screenshot
  const [activeCardId, setActiveCardId] = useState('craftsmanship');

  // Exact YouTube Shorts video configuration
  const YOUTUBE_SHORTS_ID = 'yzfdv0Tfkz0';
  const YOUTUBE_SHORTS_URL = 'https://youtube.com/shorts/yzfdv0Tfkz0?si=7D9eQ5hAnliytgMW';
  const EMBED_URL = `https://www.youtube-nocookie.com/embed/${YOUTUBE_SHORTS_ID}?rel=0&modestbranding=1&playsinline=1`;

  return (
    <section className="space-y-12 select-none py-8" id="watchmaking-craftsmanship">
      {/* ── 1. SECTION HEADER ── */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        {/* Top Gold Flourish Eyebrow */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 sm:w-16 h-[1px] bg-gradient-to-r from-transparent via-[#E9B94F]/60 to-[#E9B94F]" />
          <span className="text-[#E9B94F] text-xs font-serif">✦</span>
          <span className="text-[10px] sm:text-[11px] font-bold text-[#E9B94F] tracking-[0.3em] uppercase font-serif">
            BEHIND THE CRAFTSMANSHIP
          </span>
          <span className="text-[#E9B94F] text-xs font-serif">✦</span>
          <div className="w-10 sm:w-16 h-[1px] bg-gradient-to-l from-transparent via-[#E9B94F]/60 to-[#E9B94F]" />
        </div>

        {/* Section Heading */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight leading-snug">
          THE ART OF <span className="text-[#E9B94F]">WATCHMAKING</span>
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-[#94A3B8] max-w-xl mx-auto font-light leading-relaxed">
          Precision, patience and timeless craftsmanship.
        </p>
      </div>

      {/* ── 2. FEATURED 9:16 YOUTUBE SHORTS VIDEO SHOWCASE ── */}
      <div className="max-w-4xl mx-auto px-2 sm:px-4">
        <div className="relative rounded-3xl bg-gradient-to-b from-[#0B1528] via-[#060D1A] to-[#030712] border border-[#E9B94F]/25 hover:border-[#E9B94F]/45 p-6 sm:p-8 lg:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(233,185,79,0.08)] transition-all duration-300">
          {/* Subtle Ambient Background Pedestal Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-[#E9B94F]/5 blur-3xl rounded-full pointer-events-none" />

          {/* Video Metadata Header */}
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 space-y-2.5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-[#E9B94F]/10 text-[#E9B94F] border border-[#E9B94F]/30 shadow-sm">
              <Sparkles className="w-3 h-3 text-[#E9B94F]" />
              <span>ATELIER CINEMATIC REEL • YOUTUBE SHORTS</span>
            </div>

            <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-white tracking-tight">
              Inside the Art of Watchmaking
            </h3>

            <p className="text-xs sm:text-sm text-[#94A3B8] font-light leading-relaxed max-w-lg mx-auto">
              Discover the intricate craftsmanship, precision engineering and attention to detail behind the creation of fine timepieces.
            </p>
          </div>

          {/* Centered Responsive 9:16 Video Player Container */}
          <div className="flex flex-col items-center justify-center relative z-10">
            <div className="w-full max-w-[290px] sm:max-w-[340px] md:max-w-[360px] aspect-[9/16] rounded-2xl sm:rounded-3xl overflow-hidden bg-black border-2 border-[#E9B94F]/35 shadow-[0_15px_45px_rgba(0,0,0,0.9),0_0_30px_rgba(233,185,79,0.18)] relative group">
              {/* YouTube Embed iframe */}
              <iframe
                src={EMBED_URL}
                title="Inside the Art of Watchmaking"
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full object-cover"
              />
            </div>

            {/* Fallback & External Link Bar */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
              <a
                href={YOUTUBE_SHORTS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-[#E9B94F] bg-[#E9B94F]/10 hover:bg-[#E9B94F]/20 border border-[#E9B94F]/40 transition-all duration-300 shadow-[0_0_15px_rgba(233,185,79,0.12)] hover:shadow-[0_0_25px_rgba(233,185,79,0.25)] group/yt cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-[#E9B94F] text-[#E9B94F]" />
                <span>Open Original on YouTube Shorts</span>
                <ExternalLink className="w-3.5 h-3.5 transition-transform duration-300 group-hover/yt:translate-x-0.5 group-hover/yt:-translate-y-0.5" />
              </a>

              <span className="text-[11px] text-[#64748B] font-light">
                User-controlled playback &bull; 9:16 HD Vertical Format
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. ATELIER COMPANION STORIES DIVIDER ── */}
      <div className="pt-4 text-center max-w-xl mx-auto space-y-2">
        <div className="flex items-center justify-center gap-3">
          <div className="w-8 h-[1px] bg-white/10" />
          <span className="text-[10px] font-bold text-[#94A3B8] tracking-[0.25em] uppercase font-serif">
            EXPLORE ATELIER HERITAGE &amp; STORIES
          </span>
          <div className="w-8 h-[1px] bg-white/10" />
        </div>
      </div>

      {/* ── 4. THREE PREMIUM STORY CARDS (Preserved Exact Functionality) ── */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7"
        onMouseLeave={() => setActiveCardId('craftsmanship')}
      >
        {EDITORIAL_STORIES.map((story) => {
          const isCraftsmanship = story.id === 'craftsmanship';
          const isHeritage = story.id === 'heritage';
          const isJourneys = story.id === 'collectors-journal';
          const isActive = activeCardId === story.id;

          return (
            <div
              key={story.id}
              onClick={() => navigate(story.route)}
              onMouseEnter={() => setActiveCardId(story.id)}
              className={`group relative rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer bg-[#080E1C] overflow-hidden ${
                isActive
                  ? isHeritage
                    ? 'border-2 border-[#E9B94F] shadow-[0_0_35px_rgba(233,185,79,0.28)]'
                    : 'border-2 border-[#00D5FF] shadow-[0_0_35px_rgba(0,213,255,0.28)]'
                  : 'border border-[#1E293B] hover:border-slate-500/50'
              }`}
            >
              {/* Top Image Container */}
              <div>
                <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-[#040812] mb-5 border border-white/5">
                  {/* Category Badge Top-Left inside Image */}
                  <div
                    className={`absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase backdrop-blur-md shadow-md ${
                      isHeritage
                        ? 'border border-[#E9B94F] text-[#E9B94F] bg-[#070E1A]/85'
                        : 'border border-[#00D5FF] text-[#00D5FF] bg-[#070E1A]/85'
                    }`}
                  >
                    {isCraftsmanship && <Boxes className="w-3.5 h-3.5 text-[#00D5FF]" />}
                    {isHeritage && <Crown className="w-3.5 h-3.5 text-[#E9B94F]" />}
                    {isJourneys && <BookOpen className="w-3.5 h-3.5 text-[#00D5FF]" />}
                    <span>{story.badge}</span>
                  </div>

                  {/* High-Resolution Editorial Image */}
                  <img
                    src={story.heroImage}
                    alt={story.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter drop-shadow-md"
                    loading="lazy"
                  />
                  {/* Subtle vignette gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080E1C]/50 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Story Title */}
                <h3
                  className={`text-lg sm:text-xl font-serif font-bold tracking-tight leading-snug transition-colors ${
                    isCraftsmanship
                      ? 'text-white group-hover:text-[#00D5FF]'
                      : isHeritage
                      ? 'text-white group-hover:text-[#E9B94F]'
                      : 'text-white group-hover:text-[#00D5FF]'
                  }`}
                >
                  {story.title}
                </h3>

                {/* Short Descriptive Paragraph */}
                <p className="text-xs sm:text-[13px] text-[#94A3B8] font-light leading-relaxed mt-2.5 line-clamp-3">
                  {story.subtitle}
                </p>
              </div>

              {/* Bottom CTA Row & Decorative Corner Illustration */}
              <div className="relative pt-6 mt-3 flex items-center justify-between z-10">
                {/* CTA Outline Pill Button */}
                <Link
                  to={story.route}
                  onClick={(e) => e.stopPropagation()}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 group/btn shadow-sm ${
                    isHeritage
                      ? 'border border-[#E9B94F] text-[#E9B94F] hover:bg-[#E9B94F]/15 hover:border-[#E9B94F] shadow-[0_0_15px_rgba(233,185,79,0.12)]'
                      : 'border border-[#00D5FF] text-[#00D5FF] hover:bg-[#00D5FF]/15 hover:border-[#00D5FF] shadow-[0_0_15px_rgba(0,213,255,0.12)]'
                  }`}
                >
                  <span>{story.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </Link>

                {/* Subtle Decorative Background Line Art in bottom right matching reference image */}
                <div className="absolute bottom-0 right-0 pointer-events-none select-none">
                  {isCraftsmanship && (
                    <svg
                      width="80"
                      height="80"
                      viewBox="0 0 100 100"
                      fill="none"
                      stroke="#00D5FF"
                      strokeWidth="1.6"
                      className="opacity-35 group-hover:opacity-60 transition-opacity"
                    >
                      {/* Large Gear */}
                      <circle cx="65" cy="65" r="26" />
                      <circle cx="65" cy="65" r="16" />
                      <circle cx="65" cy="65" r="6" fill="#00D5FF" fillOpacity="0.4" />
                      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                        <line
                          key={deg}
                          x1="65"
                          y1="38"
                          x2="65"
                          y2="34"
                          transform={`rotate(${deg} 65 65)`}
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      ))}
                      {/* Small Interlocking Gear */}
                      <circle cx="32" cy="35" r="16" />
                      <circle cx="32" cy="35" r="9" />
                      <circle cx="32" cy="35" r="3.5" fill="#00D5FF" fillOpacity="0.4" />
                      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                        <line
                          key={deg}
                          x1="32"
                          y1="18"
                          x2="32"
                          y2="15"
                          transform={`rotate(${deg} 32 35)`}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      ))}
                    </svg>
                  )}
                  {isHeritage && (
                    <svg
                      width="80"
                      height="80"
                      viewBox="0 0 100 100"
                      fill="none"
                      stroke="#E9B94F"
                      strokeWidth="1.5"
                      className="opacity-35 group-hover:opacity-60 transition-opacity"
                    >
                      {/* European clock tower facade */}
                      <path d="M48 10 L52 10 L52 22 L62 36 L62 95 L38 95 L38 36 L48 22 Z" />
                      <path d="M50 4 L50 10" strokeWidth="2" />
                      <line x1="47" y1="7" x2="53" y2="7" strokeWidth="1.5" />
                      <circle cx="50" cy="46" r="8" />
                      <circle cx="50" cy="46" r="2" fill="#E9B94F" />
                      <line x1="50" y1="46" x2="50" y2="41" strokeWidth="1.5" />
                      <line x1="50" y1="46" x2="54" y2="46" strokeWidth="1.5" />
                      <rect x="42" y="60" width="6" height="10" rx="3" />
                      <rect x="52" y="60" width="6" height="10" rx="3" />
                      <rect x="42" y="76" width="6" height="12" rx="3" />
                      <rect x="52" y="76" width="6" height="12" rx="3" />
                      <path d="M38 65 L26 75 L26 95 L38 95" />
                      <path d="M62 65 L74 75 L74 95 L62 95" />
                      <line x1="20" y1="95" x2="80" y2="95" strokeWidth="2" />
                    </svg>
                  )}
                  {isJourneys && (
                    <svg
                      width="84"
                      height="84"
                      viewBox="0 0 100 100"
                      fill="none"
                      stroke="#00D5FF"
                      strokeWidth="1.5"
                      className="opacity-35 group-hover:opacity-60 transition-opacity"
                    >
                      {/* Layered mountain peaks */}
                      <path d="M5 92 L38 42 L55 68 L72 32 L95 92 Z" />
                      <path d="M38 42 L46 92" strokeWidth="1.2" strokeDasharray="3 2" />
                      <path d="M72 32 L78 92" strokeWidth="1.2" strokeDasharray="3 2" />
                      <path d="M22 92 L50 62 L68 92" />
                      <path d="M72 32 L68 45 L76 52" strokeWidth="1.2" />
                      <line x1="5" y1="92" x2="95" y2="92" strokeWidth="2" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CraftsmanshipStoriesSection;
