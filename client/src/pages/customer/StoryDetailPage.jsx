import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CustomerNavbar from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import {
  EDITORIAL_STORIES,
  getStoryBySlug,
} from '../../data/editorialStoriesData';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar,
  User,
  Share2,
  Bookmark,
  Boxes,
  Crown,
  BookOpen,
  ArrowRight,
  Sparkles,
  Watch,
  Award,
  Compass,
} from 'lucide-react';

export const StoryDetailPage = ({ initialSlug }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const activeSlug = initialSlug || slug || 'craftsmanship';
  const story = getStoryBySlug(activeSlug);

  useEffect(() => {
    document.title = `${story.title} | WatchHub Horology Editorial`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeSlug, story.title]);

  const relatedStories = EDITORIAL_STORIES.filter((s) => s.id !== story.id);

  return (
    <div className="min-h-screen bg-[#030914] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#E9B94F] selection:text-black">
      <CustomerNavbar />

      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-12">
        {/* 1. BREADCRUMB & BACK BUTTON */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#253247]/60 pb-4">
          <nav className="flex items-center gap-2 text-xs text-[#A7B1C2] font-mono">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link to="/stories" className="hover:text-white transition-colors">
              Stories
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-[#E9B94F] font-semibold truncate max-w-[220px] sm:max-w-none">
              {story.title}
            </span>
          </nav>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00D5FF] hover:underline"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Stories</span>
          </button>
        </div>

        {/* 2. HERO ARTICLE HEADER */}
        <article className="space-y-6">
          <div className="space-y-4 max-w-4xl">
            {/* Category Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#E9B94F]/60 text-[#E9B94F] bg-[#E9B94F]/10 text-xs font-bold tracking-widest uppercase">
              {story.badgeType === 'gold' ? (
                <Crown className="w-3.5 h-3.5" />
              ) : (
                <Boxes className="w-3.5 h-3.5" />
              )}
              <span>{story.badge}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
              {story.title}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#A7B1C2] font-light leading-relaxed">
              {story.subtitle}
            </p>

            {/* Author, Date, Reading Time */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-400 font-mono border-t border-[#253247]/40">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-[#E9B94F]" />
                <span className="text-white font-medium">{story.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#00D5FF]" />
                <span>{story.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{story.readTime}</span>
              </div>
            </div>
          </div>

          {/* Large Hero Image */}
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden bg-[#07111F] border border-[#253247] shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <img
              src={story.heroImage}
              alt={story.title}
              className="w-full h-full object-cover object-center filter drop-shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030914] via-transparent to-transparent opacity-60 pointer-events-none" />
          </div>

          {/* 3. MAIN EDITORIAL CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-6">
            {/* Left 8 Columns: Article Body */}
            <div className="lg:col-span-8 space-y-10">
              {/* Editorial Blockquote */}
              {story.quote && (
                <div className="relative p-6 sm:p-8 rounded-2xl bg-[#07111F] border-l-4 border-[#E9B94F] shadow-lg">
                  <p className="font-serif italic text-base sm:text-lg text-slate-200 leading-relaxed">
                    "{story.quote}"
                  </p>
                  <span className="block mt-3 text-xs text-[#E9B94F] font-mono tracking-wider uppercase">
                    — From the Atelier Lucerne Horological Archive
                  </span>
                </div>
              )}

              {/* Story Sections */}
              {story.sections.map((sec, idx) => (
                <div key={idx} className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight flex items-center gap-2">
                    <span className="text-[#E9B94F] font-mono text-base">0{idx + 1}.</span>
                    <span>{sec.heading}</span>
                  </h2>
                  <div className="space-y-3.5 text-sm sm:text-base text-[#C2C9D6] font-normal leading-relaxed">
                    {sec.content.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}
                  </div>
                </div>
              ))}

              {/* Photo Gallery Grid */}
              <div className="space-y-4 pt-6 border-t border-[#253247]/60">
                <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#E9B94F]" />
                  <span>Atelier Visual Archive</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {story.galleryImages.map((g, gIdx) => (
                    <div
                      key={gIdx}
                      className="group rounded-2xl overflow-hidden bg-[#07111F] border border-[#253247] p-2 flex flex-col justify-between hover:border-[#00D5FF]/60 transition-all"
                    >
                      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#030914] mb-2 flex items-center justify-center">
                        <img
                          src={g.url}
                          alt={g.caption}
                          className="w-full h-full object-contain filter drop-shadow group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 font-light leading-snug px-1">
                        {g.caption}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 4 Columns: Horological Specifications & Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Technical Specifications Card */}
              <div className="rounded-2xl bg-[#07111F] border border-[#253247] p-6 space-y-4 shadow-xl">
                <div className="flex items-center gap-2 text-xs font-bold text-[#E9B94F] uppercase tracking-wider">
                  <Watch className="w-4 h-4" />
                  <span>Horological Specifications</span>
                </div>
                <div className="space-y-3 pt-2">
                  {story.specs.map((item, sIdx) => (
                    <div
                      key={sIdx}
                      className="border-b border-white/5 pb-2.5 last:border-0 last:pb-0"
                    >
                      <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-mono">
                        {item.label}
                      </span>
                      <span className="text-xs font-semibold text-white mt-0.5 block">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Explore Collection Banner */}
              <div className="rounded-2xl bg-gradient-to-br from-[#0B182E] to-[#040C1A] border border-[#00D5FF]/40 p-6 space-y-4 shadow-[0_0_25px_rgba(0,213,255,0.15)] text-center">
                <Award className="w-8 h-8 text-[#E9B94F] mx-auto" />
                <h4 className="font-serif text-lg font-bold text-white">
                  Experience Fine Swiss Horology
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  Explore certified authentic timepieces with global manufacturer warranties and white-glove delivery.
                </p>
                <Link
                  to="/watches"
                  className="inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-full bg-gradient-to-r from-[#E9B94F] to-[#D4A33B] text-black text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow-md"
                >
                  <span>Explore All Watches</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* 4. RELATED STORIES SECTION */}
        <section className="space-y-6 pt-10 border-t border-[#253247]/60">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#E9B94F] uppercase tracking-wider block">
                CONTINUE READING
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mt-0.5">
                Related Editorial Stories
              </h3>
            </div>
            <Link
              to="/stories"
              className="text-xs font-bold text-[#00D5FF] hover:underline flex items-center gap-1"
            >
              <span>View All Stories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedStories.map((rel) => (
              <div
                key={rel.id}
                onClick={() => navigate(rel.route)}
                className="group rounded-2xl bg-[#07111F] border border-[#253247] p-5 flex flex-col sm:flex-row gap-5 hover:border-[#00D5FF]/60 hover:shadow-[0_10px_25px_rgba(0,213,255,0.15)] transition-all cursor-pointer"
              >
                <div className="w-full sm:w-44 aspect-[4/3] rounded-xl overflow-hidden bg-[#030914] flex-shrink-0">
                  <img
                    src={rel.heroImage}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex flex-col justify-between space-y-2">
                  <div>
                    <span className="text-[10px] font-bold text-[#E9B94F] uppercase tracking-wider">
                      {rel.badge}
                    </span>
                    <h4 className="font-serif font-bold text-sm sm:text-base text-white group-hover:text-[#00D5FF] transition-colors mt-1">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-slate-400 font-light line-clamp-2 mt-1">
                      {rel.subtitle}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#00D5FF] inline-flex items-center gap-1">
                    <span>{rel.ctaText}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default StoryDetailPage;
