import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CustomerNavbar from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import {
  BookOpen,
  Sparkles,
  Award,
  Clock,
  Compass,
  ChevronRight,
  ShieldCheck,
  Feather
} from 'lucide-react';

export const EditorialStoriesPage = () => {
  const [selectedArticle, setSelectedArticle] = useState(0);

  const stories = [
    {
      id: 1,
      tag: 'SWISS CRAFTSMANSHIP',
      title: 'The Art of the Flying Tourbillon: Defying Gravity in Modern Horology',
      subtitle: 'How Chronoswiss inverted the manufacture movement to showcase three-dimensional mechanics.',
      author: 'Jean-Luc Mercier • Master Horologist',
      date: '14 November 2026',
      readTime: '6 min read',
      image: '/images/hero/chronoswiss_tourbillon.jpg',
      content: [
        'In the tranquil canton of Lucerne, where watchmaking traditions date back centuries, Chronoswiss engineers achieved what many believed impossible: an inverted regulator movement where the balance spring and flying tourbillon cage hover suspended above the dial.',
        'Unlike traditional tourbillons nestled within the movement bridges, the flying tourbillon lacks an upper supporting bridge. It relies entirely on a micro-engineered ball-bearing mechanism calibrated to within 0.001 millimeters, granting unobstructed views of the balance oscillation.',
        'When illuminated by our electric blue CVD dial finishing, the tourbillon transforms from a mere mechanical escapement into kinetic sculpture on the wrist.'
      ]
    },
    {
      id: 2,
      tag: 'HISTORIC HERITAGE',
      title: 'The Regulator Dial Revolution: Gerd-R. Lang’s Enduring Vision',
      subtitle: 'From historic astronomical observatories to contemporary collector icons.',
      author: 'Dr. Elisabeth Vance • Horological Historian',
      date: '02 November 2026',
      readTime: '5 min read',
      image: '/images/hero/chronoswiss_website_ref.jpg',
      content: [
        'Before wristwatches were invented, astronomers and master clockmakers relied on wall-mounted regulator clocks. The minute hand took center stage across the full dial, while hours and seconds were relegated to non-overlapping subdials.',
        'In 1988, Chronoswiss made horological history by unveiling the world’s first serial wristwatch with a regulator dial: the Régulateur. It redefined time-telling clarity and proved that mechanical integrity could triumph over the quartz revolution.'
      ]
    },
    {
      id: 3,
      tag: 'WATCH CARE GUIDE',
      title: 'Preserving Mechanical Masterpieces: The Collector’s Maintenance Protocol',
      subtitle: 'Guidelines for winding, ultrasonic cleansing, and magnetic field protection.',
      author: 'Atelier Lucerne Service Directorate',
      date: '20 October 2026',
      readTime: '4 min read',
      image: '/images/hero/chronograph_black.jpg',
      content: [
        'A high-complication mechanical watch is an intricate micro-mechanical engine comprising over 280 precision components. To guarantee chronometric accuracy over generations:',
        '1. Winding Cadence: For manual-wound flying tourbillons, wind gently between 8:00 AM and 10:00 AM until subtle resistance is felt.',
        '2. Magnetic Shields: Modern devices emit powerful magnetic fields that can magnetize delicate Nivarox balance springs. Store your watch at least 15 cm away from wireless induction chargers.',
        '3. Water Integrity: Have seals and gaskets hydrostatically inspected every 24 months at an authorized WatchHub salon.'
      ]
    }
  ];

  const current = stories[selectedArticle] || stories[0];

  return (
    <div className="min-h-screen bg-[#020813] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#F4B942] selection:text-black">
      <CustomerNavbar />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-8 py-10 w-full flex-1">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#F4B942] tracking-widest uppercase block">
            WATCHHUB HOROLOGY JOURNAL
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-1">
            Watchmaking Stories & Atelier Heritage
          </h1>
          <p className="text-xs text-[#A6B1C8] mt-2">
            Chronicles of Swiss manufacture, astronomical regulators, and hand-guilloché mastery.
          </p>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            FEATURED EDITORIAL SHOWCASE
            ════════════════════════════════════════════════════════════════ */}
        <div className="bg-[#040C1A] border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] grid grid-cols-1 lg:grid-cols-12 mb-12">
          <div className="lg:col-span-7 relative min-h-[360px] sm:min-h-[460px] bg-[#020813] flex items-center justify-center p-8">
            <div className="absolute inset-0 bg-radial from-[#00CFFF]/20 via-transparent to-transparent pointer-events-none" />
            <img
              src={current.image}
              alt={current.title}
              className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)]"
            />
          </div>

          <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10">
            <div className="space-y-4">
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#00CFFF] bg-[#00CFFF]/10 border border-[#00CFFF]/30 px-3 py-1 rounded-full inline-block">
                {current.tag}
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white leading-snug">
                {current.title}
              </h2>
              <p className="text-xs text-gray-300 leading-relaxed">
                {current.subtitle}
              </p>
              <div className="text-[11px] text-gray-400 space-y-1">
                <p className="font-semibold text-white">{current.author}</p>
                <p>{current.date} • {current.readTime}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <Link
                to="/products?brand=Chronoswiss"
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#F4B942] to-[#D4A84F] text-black font-extrabold text-xs inline-flex items-center gap-2 shadow-sm hover:brightness-110"
              >
                <span>Explore Chronoswiss Ateliers</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            ARTICLE BODY & CHAPTER SELECTOR
            ════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Article Content (lg:col-span-8) */}
          <article className="lg:col-span-8 bg-[#040C1A] border border-white/10 rounded-3xl p-8 space-y-5 text-sm text-gray-300 leading-relaxed font-serif">
            <h3 className="text-xl font-sans font-bold text-white mb-2">{current.title}</h3>
            {current.content.map((p, i) => (
              <p key={i} className="text-gray-200">
                {p}
              </p>
            ))}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs font-sans text-gray-400">
              <span>Published by WatchHub Editorial Board</span>
              <span className="text-[#00CFFF]">Lucerne • Geneva • Mumbai</span>
            </div>
          </article>

          {/* Other Journal Chapters (lg:col-span-4) */}
          <aside className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-[#F4B942] uppercase tracking-wider mb-2">
              Horological Chapters
            </h4>
            {stories.map((s, idx) => (
              <div
                key={s.id}
                onClick={() => setSelectedArticle(idx)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedArticle === idx
                    ? 'bg-[#061224] border-[#00CFFF] shadow-[0_0_20px_rgba(0,207,255,0.2)]'
                    : 'bg-[#040C1A] border-white/10 hover:border-white/20'
                }`}
              >
                <span className="text-[9px] font-bold text-[#00CFFF] uppercase tracking-wider block mb-1">
                  {s.tag}
                </span>
                <h5 className="text-xs font-bold text-white leading-tight">{s.title}</h5>
                <p className="text-[10px] text-gray-400 mt-1">{s.readTime}</p>
              </div>
            ))}
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EditorialStoriesPage;
