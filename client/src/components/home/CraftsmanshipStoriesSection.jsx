import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Boxes,
  Crown,
  BookOpen,
  ArrowRight,
  Compass,
  Clock,
  Sparkles,
} from 'lucide-react';
import { EDITORIAL_STORIES } from '../../data/editorialStoriesData';

export const CraftsmanshipStoriesSection = () => {
  const navigate = useNavigate();

  return (
    <section className="space-y-8 select-none">
      {/* 1. CENTERED SECTION HEADER matching reference screenshot */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        {/* Top Label with Gold Ornamental Lines */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-[1px] bg-gradient-to-r from-transparent via-[#E9B94F]/60 to-[#E9B94F]" />
          <span className="text-[10.5px] sm:text-[11px] font-extrabold text-[#E9B94F] tracking-[0.25em] uppercase">
            SWISS HOROLOGY EXCELLENCE
          </span>
          <div className="w-10 h-[1px] bg-gradient-to-l from-transparent via-[#E9B94F]/60 to-[#E9B94F]" />
        </div>

        {/* Main Heading with Gold Highlights */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight leading-snug">
          Craftsmanship, <span className="text-[#E9B94F]">Heritage & Stories</span>
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-[#A7B1C2] max-w-xl mx-auto font-light leading-relaxed">
          Dive into the artistry, legacy and timeless stories behind the world's most iconic watches.
        </p>
      </div>

      {/* 2. THREE PREMIUM STORY CARDS (Single Row on Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EDITORIAL_STORIES.map((story) => {
          const isCraftsmanship = story.id === 'craftsmanship';
          const isHeritage = story.id === 'heritage';
          const isJourneys = story.id === 'collectors-journal';

          return (
            <div
              key={story.id}
              onClick={() => navigate(story.route)}
              className={`group relative rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer bg-[#07111F] overflow-hidden ${
                isCraftsmanship
                  ? 'border-2 border-[#00D5FF] shadow-[0_0_28px_rgba(0,213,255,0.25)]'
                  : isHeritage
                  ? 'border border-[#253247] hover:border-[#E9B94F]/80 hover:shadow-[0_10px_30px_rgba(233,185,79,0.18)]'
                  : 'border border-[#253247] hover:border-[#00D5FF]/80 hover:shadow-[0_10px_30px_rgba(0,213,255,0.18)]'
              }`}
            >
              {/* Top Image Container */}
              <div>
                <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-[#030914] mb-5 border border-white/5">
                  {/* Category Badge Top-Left */}
                  <div
                    className={`absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase backdrop-blur-md shadow-md ${
                      story.badgeType === 'gold'
                        ? 'border border-[#E9B94F]/60 text-[#E9B94F] bg-[#030914]/85'
                        : 'border border-[#00D5FF]/60 text-[#00D5FF] bg-[#030914]/85'
                    }`}
                  >
                    {isCraftsmanship && <Boxes className="w-3 h-3 text-[#00D5FF]" />}
                    {isHeritage && <Crown className="w-3 h-3 text-[#E9B94F]" />}
                    {isJourneys && <BookOpen className="w-3 h-3 text-[#00D5FF]" />}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07111F]/60 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Story Title */}
                <h3
                  className={`text-lg sm:text-xl font-serif font-bold tracking-tight leading-tight transition-colors ${
                    isCraftsmanship
                      ? 'text-white group-hover:text-[#00D5FF]'
                      : isHeritage
                      ? 'text-white group-hover:text-[#E9B94F]'
                      : 'text-white group-hover:text-[#00D5FF]'
                  }`}
                >
                  {story.title}
                </h3>

                {/* Elegant Gold Accent Line */}
                <div className="w-12 h-[2px] bg-gradient-to-r from-[#E9B94F] to-transparent my-2.5" />

                {/* Short Descriptive Paragraph */}
                <p className="text-xs sm:text-[13px] text-[#A7B1C2] font-light leading-relaxed line-clamp-3">
                  {story.subtitle}
                </p>
              </div>

              {/* Bottom CTA Row & Decorative Corner Illustration */}
              <div className="relative pt-6 mt-4 flex items-center justify-between z-10">
                {/* CTA Outline Pill Button */}
                <Link
                  to={story.route}
                  onClick={(e) => e.stopPropagation()}
                  className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all group/btn shadow-sm ${
                    isHeritage
                      ? 'border border-[#E9B94F]/60 text-[#E9B94F] hover:bg-[#E9B94F]/15 hover:border-[#E9B94F] shadow-[0_0_15px_rgba(233,185,79,0.12)]'
                      : 'border border-[#00D5FF]/60 text-[#00D5FF] hover:bg-[#00D5FF]/15 hover:border-[#00D5FF] shadow-[0_0_15px_rgba(0,213,255,0.12)]'
                  }`}
                >
                  <span>{story.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </Link>

                {/* Subtle Decorative Background Line Art in bottom right */}
                <div className="pointer-events-none select-none opacity-20 transition-opacity group-hover:opacity-40">
                  {isCraftsmanship && (
                    <svg
                      width="58"
                      height="58"
                      viewBox="0 0 100 100"
                      fill="none"
                      stroke="#00D5FF"
                      strokeWidth="2.5"
                      strokeDasharray="4 3"
                    >
                      <circle cx="50" cy="50" r="30" />
                      <circle cx="50" cy="50" r="10" />
                      <path d="M50 10 L50 20 M50 80 L50 90 M10 50 L20 50 M80 50 L90 50 M22 22 L29 29 M71 71 L78 78 M78 22 L71 29 M22 78 L29 71" />
                      <circle cx="80" cy="75" r="18" stroke="#00D5FF" strokeWidth="2" />
                      <circle cx="80" cy="75" r="5" fill="#00D5FF" />
                    </svg>
                  )}
                  {isHeritage && (
                    <svg
                      width="54"
                      height="54"
                      viewBox="0 0 100 100"
                      fill="none"
                      stroke="#E9B94F"
                      strokeWidth="2"
                    >
                      {/* Historic clock tower / atelier silhouette */}
                      <path d="M35 90 L35 45 L50 25 L65 45 L65 90 Z" />
                      <path d="M50 15 L50 25" strokeWidth="3" />
                      <circle cx="50" cy="48" r="8" />
                      <line x1="50" y1="48" x2="50" y2="44" />
                      <line x1="50" y1="48" x2="54" y2="48" />
                      <path d="M20 90 L80 90" strokeWidth="2.5" />
                    </svg>
                  )}
                  {isJourneys && (
                    <svg
                      width="58"
                      height="58"
                      viewBox="0 0 100 100"
                      fill="none"
                      stroke="#00D5FF"
                      strokeWidth="2"
                    >
                      {/* Mountain peaks and expedition compass lines */}
                      <path d="M10 85 L40 35 L60 65 L75 45 L95 85 Z" />
                      <circle cx="78" cy="28" r="12" strokeDasharray="3 3" />
                      <line x1="78" y1="12" x2="78" y2="44" strokeWidth="1.5" />
                      <line x1="62" y1="28" x2="94" y2="28" strokeWidth="1.5" />
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
