import React from 'react';

/**
 * High-definition vector SVG Brand Logo component
 * Renders authentic brand marks and emblems with official brand colors and typography.
 */
export const BrandLogo = ({ logoType, brandName, className = 'h-7 w-auto' }) => {
  switch (logoType) {
    case 'rolex':
      return (
        <div className="flex flex-col items-center justify-center">
          {/* Rolex Golden Crown */}
          <svg className="h-5 w-7 text-[#006039]" viewBox="0 0 100 65" fill="#C9A15B">
            <path d="M 50 15 L 60 38 L 82 22 L 72 52 L 28 52 L 18 22 L 40 38 Z" />
            <circle cx="50" cy="8" r="5" />
            <circle cx="85" cy="17" r="4.5" />
            <circle cx="15" cy="17" r="4.5" />
            <circle cx="70" cy="3" r="4" />
            <circle cx="30" cy="3" r="4" />
            <rect x="25" y="55" width="50" height="5" rx="2" />
          </svg>
          <span className="text-[13px] font-black tracking-[0.25em] text-[#006039] font-serif leading-none mt-0.5">
            ROLEX
          </span>
        </div>
      );

    case 'omega':
      return (
        <div className="flex flex-col items-center justify-center">
          <span className="text-xl font-serif text-[#C41230] leading-none font-bold">Ω</span>
          <span className="text-[12px] font-black tracking-[0.22em] text-[#C41230] font-sans leading-none mt-0.5">
            OMEGA
          </span>
        </div>
      );

    case 'patek':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          {/* Calatrava Cross */}
          <svg className="h-5 w-5 text-gray-800 mb-0.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a1 1 0 0 0-1 1v4.07a5 5 0 0 0-4.07-4.07 1 1 0 0 0-1 1 1 1 0 0 0 1 1 3 3 0 0 1 3 3v2.07a5 5 0 0 0-4.07-4.07 1 1 0 0 0-1 1 1 1 0 0 0 1 1 3 3 0 0 1 3 3H7a1 1 0 0 0-1 1 1 1 0 0 0 1 1h2.93a3 3 0 0 1-3 3 1 1 0 0 0-1 1 1 1 0 0 0 1 1 5 5 0 0 0 4.07-4.07V15a3 3 0 0 1-3-3 1 1 0 0 0-1-1 1 1 0 0 0 1-1h2.07A5 5 0 0 0 11 5.93V3a1 1 0 0 0-1-1zm1 1v4.07a5 5 0 0 0 4.07-4.07 1 1 0 0 1 1-1 1 1 0 0 1 1 1 3 3 0 0 1-3 3v2.07a5 5 0 0 0 4.07-4.07 1 1 0 0 1 1-1 1 1 0 0 1 1 1 3 3 0 0 1-3 3H17a1 1 0 0 1 1 1 1 1 0 0 1-1 1h-2.93a3 3 0 0 1 3 3 1 1 0 0 1 1 1 1 1 0 0 1-1 1 5 5 0 0 0-4.07-4.07V15a3 3 0 0 1 3-3 1 1 0 0 1 1-1 1 1 0 0 1-1-1h-2.07A5 5 0 0 0 13 5.93V3a1 1 0 0 0-1-1z"/>
          </svg>
          <span className="text-[11px] font-black tracking-[0.14em] text-gray-900 font-serif leading-none">
            PATEK PHILIPPE
          </span>
          <span className="text-[7.5px] tracking-[0.2em] text-gray-500 font-sans mt-0.5">GENEVE</span>
        </div>
      );

    case 'ap':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-[11.5px] font-serif font-black tracking-[0.16em] text-gray-900 leading-tight">
            AUDEMARS PIGUET
          </span>
          <span className="text-[7px] tracking-[0.25em] text-gray-500 font-sans mt-0.5">Le Brassus</span>
        </div>
      );

    case 'vacheron':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          {/* Maltese Cross */}
          <span className="text-sm text-[#8B6B2B] leading-none mb-0.5">✠</span>
          <span className="text-[9.5px] font-serif font-black tracking-[0.18em] text-gray-900 leading-none">
            VACHERON CONSTANTIN
          </span>
          <span className="text-[6.5px] tracking-[0.25em] text-gray-400 font-sans mt-0.5">GENÈVE</span>
        </div>
      );

    case 'jlc':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-[11px] font-serif font-extrabold tracking-[0.12em] text-gray-900 leading-tight">
            JAEGER-LECOULTRE
          </span>
          <span className="text-[6.5px] tracking-[0.2em] text-gray-500 mt-0.5">MANUFACTURE DE HAUTE HORLOGERIE</span>
        </div>
      );

    case 'iwc':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-base font-serif font-black tracking-[0.28em] text-gray-900 leading-none">
            IWC
          </span>
          <span className="text-[8px] font-sans tracking-[0.16em] text-gray-600 mt-0.5">
            SCHAFFHAUSEN
          </span>
        </div>
      );

    case 'breitling':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1">
            <span className="text-xs text-[#E6A100]">🪽</span>
            <span className="text-xs font-serif font-bold text-[#E6A100]">B</span>
            <span className="text-xs text-[#E6A100]">🪽</span>
          </div>
          <span className="text-[11.5px] font-black tracking-[0.18em] text-gray-900 font-sans leading-none mt-0.5">
            BREITLING
          </span>
          <span className="text-[7px] text-gray-500 tracking-[0.15em]">1884</span>
        </div>
      );

    case 'tagheuer':
      return (
        <div className="flex items-center justify-center">
          <div className="border border-red-600 bg-black text-white px-1.5 py-0.5 rounded-sm flex items-center gap-1 shadow-xs">
            <div className="bg-[#00875A] text-white text-[8px] font-black px-1 rounded-xs">TAG</div>
            <div className="text-[8px] font-black text-red-500 tracking-wider">HEUER</div>
          </div>
        </div>
      );

    case 'hublot':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center font-black text-xs leading-none mb-0.5">
            H
          </div>
          <span className="text-[12px] font-black tracking-[0.25em] text-gray-900 leading-none">
            HUBLOT
          </span>
        </div>
      );

    case 'longines':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          {/* Winged Hourglass */}
          <div className="text-[11px] text-[#00205B] leading-none mb-0.5">⏳</div>
          <span className="text-[11px] font-serif font-black tracking-[0.24em] text-[#00205B] leading-none">
            LONGINES
          </span>
        </div>
      );

    case 'tissot':
      return (
        <div className="flex items-center justify-center gap-1.5">
          <div className="bg-[#C41230] text-white w-4 h-4 rounded-xs flex items-center justify-center text-[10px] font-bold shadow-xs">
            +
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[12px] font-black tracking-[0.2em] text-gray-900 leading-none">
              TISSOT
            </span>
            <span className="text-[6.5px] text-gray-500 font-sans">SWISS WATCHES SINCE 1853</span>
          </div>
        </div>
      );

    case 'rado':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-[13px] font-black tracking-[0.3em] text-gray-900 leading-none">
            RADO
          </span>
          <span className="text-[7.5px] tracking-[0.16em] text-gray-500 mt-0.5">SWITZERLAND</span>
        </div>
      );

    case 'zenith':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-xs text-gray-900 leading-none mb-0.5">★</span>
          <span className="text-[12px] font-black tracking-[0.26em] text-gray-900 leading-none">
            ZENITH
          </span>
        </div>
      );

    case 'blancpain':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-[11.5px] font-serif font-black tracking-[0.18em] text-gray-900 leading-none">
            BLANCPAIN
          </span>
          <span className="text-[6.5px] tracking-[0.18em] text-gray-500 mt-0.5">MANUFACTURE DE HAUTE HORLOGERIE</span>
        </div>
      );

    case 'breguet':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-[14px] font-serif italic font-bold tracking-[0.08em] text-gray-900 leading-none">
            Breguet
          </span>
          <span className="text-[6.5px] tracking-[0.2em] text-gray-500 mt-0.5">DEPUIS 1775</span>
        </div>
      );

    case 'panerai':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-[12px] font-sans font-black tracking-[0.26em] text-gray-900 leading-none">
            PANERAI
          </span>
        </div>
      );

    case 'tudor':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="text-xs text-[#C41230] leading-none mb-0.5">🛡️</div>
          <span className="text-[12px] font-black tracking-[0.25em] text-gray-900 leading-none">
            TUDOR
          </span>
        </div>
      );

    case 'oris':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-[13px] font-black tracking-[0.3em] text-[#B01B1B] leading-none">
            ORIS
          </span>
          <span className="text-[7px] tracking-[0.15em] text-gray-500 mt-0.5">HOLSTEIN 1904</span>
        </div>
      );

    case 'swatch':
      return (
        <div className="flex items-center justify-center gap-1">
          <span className="text-[13px] font-sans font-bold tracking-tight text-gray-900">
            swatch
          </span>
          <span className="text-xs font-black text-[#ED1C24] leading-none">+</span>
        </div>
      );

    case 'frederique':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-[9.5px] font-serif font-black tracking-[0.12em] text-gray-900 leading-tight">
            FREDERIQUE CONSTANT
          </span>
          <span className="text-[6.5px] tracking-[0.2em] text-gray-400">GENEVE</span>
        </div>
      );

    case 'raymondweil':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-black tracking-[0.18em] text-gray-900 leading-tight">
            RAYMOND WEIL
          </span>
          <span className="text-[6.5px] tracking-[0.2em] text-gray-400">GENEVE</span>
        </div>
      );

    case 'mauricelacroix':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-xs text-gray-800 leading-none mb-0.5">⋈</span>
          <span className="text-[9.5px] font-black tracking-[0.16em] text-gray-900 leading-tight">
            MAURICE LACROIX
          </span>
        </div>
      );

    case 'chopard':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-[14px] font-serif italic font-bold tracking-[0.1em] text-gray-900 leading-none">
            Chopard
          </span>
        </div>
      );

    case 'cartier':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-[14px] font-serif italic font-extrabold tracking-[0.12em] text-[#C41230] leading-none">
            Cartier
          </span>
        </div>
      );

    // ─────────────────────────────────────────────────────────────
    // JAPANESE BRANDS
    // ─────────────────────────────────────────────────────────────
    case 'seiko':
      return (
        <div className="flex items-center justify-center">
          <span className="text-[14px] font-serif font-black tracking-[0.2em] text-gray-900">
            SEIKO
          </span>
        </div>
      );

    case 'grandseiko':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-xs font-serif font-bold text-gray-900 leading-none mb-0.5">GS</span>
          <span className="text-[10.5px] font-serif font-black tracking-[0.16em] text-gray-900 leading-none">
            Grand Seiko
          </span>
        </div>
      );

    case 'citizen':
      return (
        <div className="flex items-center justify-center">
          <span className="text-[13px] font-sans font-black tracking-[0.28em] text-gray-900">
            CITIZEN
          </span>
        </div>
      );

    case 'casio':
      return (
        <div className="flex items-center justify-center">
          <span className="text-[14px] font-sans font-black tracking-[0.22em] text-[#003882]">
            CASIO
          </span>
        </div>
      );

    case 'orient':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-xs text-[#C41230] leading-none mb-0.5">🦁 👑 🦁</span>
          <span className="text-[11.5px] font-serif font-black tracking-[0.2em] text-gray-900 leading-none">
            ORIENT
          </span>
        </div>
      );

    // ─────────────────────────────────────────────────────────────
    // AMERICAN & FASHION BRANDS
    // ─────────────────────────────────────────────────────────────
    case 'timex':
      return (
        <div className="flex items-center justify-center">
          <span className="text-[14px] font-sans font-black tracking-[0.25em] text-[#E4002B]">
            TIMEX
          </span>
        </div>
      );

    case 'fossil':
      return (
        <div className="flex items-center justify-center">
          <span className="text-[13px] font-sans font-black tracking-[0.28em] text-gray-900">
            FOSSIL
          </span>
        </div>
      );

    case 'bulova':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-xs text-gray-700 leading-none mb-0.5">⚙️</span>
          <span className="text-[12px] font-serif font-black tracking-[0.22em] text-gray-900 leading-none">
            BULOVA
          </span>
        </div>
      );

    case 'hamilton':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-xs text-[#E4002B] leading-none mb-0.5">⚓</span>
          <span className="text-[12px] font-serif font-black tracking-[0.22em] text-gray-900 leading-none">
            HAMILTON
          </span>
        </div>
      );

    case 'shinola':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-[12px] font-sans font-black tracking-[0.24em] text-gray-900 leading-none">
            SHINOLA
          </span>
          <span className="text-[7px] tracking-[0.2em] text-gray-500 mt-0.5">DETROIT</span>
        </div>
      );

    case 'movado':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-2.5 h-2.5 rounded-full bg-[#E5B04E] mb-1 shadow-xs"></div>
          <span className="text-[12px] font-sans font-black tracking-[0.26em] text-gray-900 leading-none">
            MOVADO
          </span>
        </div>
      );

    case 'kennethcole':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-[11px] font-serif font-bold tracking-[0.14em] text-gray-900 leading-tight">
            Kenneth Cole
          </span>
          <span className="text-[7px] tracking-[0.2em] text-gray-500">NEW YORK</span>
        </div>
      );

    case 'guess':
      return (
        <div className="flex items-center justify-center gap-1">
          <span className="text-[13px] font-sans font-black tracking-[0.22em] text-gray-900">
            GUESS
          </span>
          <span className="text-xs font-bold text-red-600">?</span>
        </div>
      );

    case 'tommy':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center border border-gray-300 w-6 h-3.5 mb-1 overflow-hidden shadow-xs">
            <div className="bg-[#00174F] w-1/4 h-full"></div>
            <div className="bg-white w-1/4 h-full"></div>
            <div className="bg-[#CC0000] w-1/4 h-full"></div>
            <div className="bg-[#00174F] w-1/4 h-full"></div>
          </div>
          <span className="text-[10px] font-black tracking-[0.16em] text-[#00174F] leading-none">
            TOMMY HILFIGER
          </span>
        </div>
      );

    case 'michaelkors':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-[11px] font-sans font-black tracking-[0.18em] text-gray-900 leading-tight">
            MICHAEL KORS
          </span>
        </div>
      );

    // ─────────────────────────────────────────────────────────────
    // SMARTWATCH & SPORTS BRANDS
    // ─────────────────────────────────────────────────────────────
    case 'apple':
      return (
        <div className="flex items-center justify-center">
          <svg className="w-5 h-5 text-gray-900" viewBox="0 0 170 170" fill="currentColor">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.77-11.66-14.19-6.3-9.9-11.05-21.43-14.25-34.6-3.2-13.16-4.8-24.97-4.8-35.43 0-16.74 4.54-30.43 13.62-41.07 9.08-10.63 20.35-16.14 33.8-16.53 4.8 0 10.45 1.34 16.96 4.02 6.5 2.68 10.63 4.13 12.39 4.35 1.45-.22 5.86-1.74 13.23-4.56 7.37-2.82 13.43-3.95 18.17-3.39 13.39 1.48 24.16 6.94 32.32 16.38-11.65 7.07-17.36 16.89-17.14 29.46.22 10.43 4.17 19.11 11.85 26.04 7.68 6.93 16.89 10.87 27.63 11.82-2.13 6.53-4.63 13.04-7.51 19.53zM119.22 33.39c-.06-8.25 2.87-15.82 8.79-22.7 5.92-6.88 13.12-10.69 21.6-11.43.12 1.07.18 2 .18 2.78 0 7.97-3.11 15.65-9.33 23.04-6.22 7.39-13.29 11.49-21.24 12.31-.06-1.34-.06-2.67-.06-4z"/>
          </svg>
        </div>
      );

    case 'samsung':
      return (
        <div className="flex items-center justify-center">
          <span className="text-[14px] font-sans font-black tracking-[0.2em] text-[#1428A0]">
            SAMSUNG
          </span>
        </div>
      );

    case 'garmin':
      return (
        <div className="flex items-center justify-center gap-1">
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-[#007CC3]"></div>
          <span className="text-[13px] font-sans font-black tracking-[0.24em] text-gray-900">
            GARMIN
          </span>
        </div>
      );

    case 'huawei':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-sm text-[#CF0A2C] leading-none mb-0.5">🌸</span>
          <span className="text-[11px] font-sans font-black tracking-[0.22em] text-[#CF0A2C] leading-none">
            HUAWEI
          </span>
        </div>
      );

    case 'xiaomi':
      return (
        <div className="flex items-center justify-center gap-1.5">
          <div className="bg-[#FF6900] text-white font-black text-[9px] px-1.5 py-0.5 rounded-sm">
            mi
          </div>
          <span className="text-[12px] font-sans font-bold tracking-wider text-gray-900">
            Xiaomi
          </span>
        </div>
      );

    case 'amazfit':
      return (
        <div className="flex items-center justify-center">
          <span className="text-[13px] font-sans font-black tracking-[0.2em] text-gray-900">
            amazfit
          </span>
        </div>
      );

    case 'suunto':
      return (
        <div className="flex items-center justify-center">
          <span className="text-[13px] font-sans font-black tracking-[0.24em] text-gray-900">
            SUUNTO
          </span>
        </div>
      );

    case 'polar':
      return (
        <div className="flex items-center justify-center">
          <span className="text-[13px] font-sans font-black tracking-[0.24em] text-gray-900">
            POLAR
          </span>
        </div>
      );

    // ─────────────────────────────────────────────────────────────
    // EUROPEAN BRANDS
    // ─────────────────────────────────────────────────────────────
    case 'mondaine':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-[11px] font-sans font-black tracking-[0.24em] text-gray-900 leading-none">
            MONDAINE
          </span>
          <span className="text-[6.5px] tracking-[0.18em] text-gray-400 mt-0.5">Swiss Watch</span>
        </div>
      );

    case 'victorinox':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-4 h-4 bg-[#D32F2F] text-white rounded-sm flex items-center justify-center text-[10px] font-bold mb-0.5 shadow-xs">
            +
          </div>
          <span className="text-[10.5px] font-sans font-black tracking-[0.16em] text-gray-900 leading-none">
            VICTORINOX
          </span>
        </div>
      );

    case 'alpina':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-xs text-[#E31B23] leading-none mb-0.5">▲</span>
          <span className="text-[12px] font-serif font-black tracking-[0.2em] text-gray-900 leading-none">
            Alpina
          </span>
        </div>
      );

    case 'certina':
      return (
        <div className="flex items-center justify-center gap-1">
          <div className="bg-[#008559] text-white text-[8px] font-bold px-1 rounded-xs">DS</div>
          <span className="text-[12px] font-sans font-black tracking-[0.2em] text-gray-900">
            CERTINA
          </span>
        </div>
      );

    case 'mido':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-[13px] font-sans font-black tracking-[0.26em] text-[#E66212] leading-none">
            MIDO
          </span>
          <span className="text-[6.5px] tracking-[0.2em] text-gray-500 mt-0.5">SWISS WATCHES SINCE 1918</span>
        </div>
      );

    case 'edox':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-xs text-gray-900 leading-none mb-0.5">⌛</span>
          <span className="text-[12px] font-sans font-black tracking-[0.28em] text-gray-900 leading-none">
            EDOX
          </span>
        </div>
      );

    case 'doxa':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-[13px] font-serif font-black tracking-[0.25em] text-[#FF5A00] leading-none">
            DOXA
          </span>
          <span className="text-[7px] tracking-[0.18em] text-gray-500 mt-0.5">1889</span>
        </div>
      );

    // ─────────────────────────────────────────────────────────────
    // INDIAN BRANDS
    // ─────────────────────────────────────────────────────────────
    case 'titan':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-xs text-[#1F2937] leading-none mb-0.5">👑</span>
          <span className="text-[13px] font-serif font-black tracking-[0.28em] text-gray-900 leading-none">
            TITAN
          </span>
        </div>
      );

    case 'fastrack':
      return (
        <div className="flex items-center justify-center gap-1">
          <span className="text-sm text-[#FF4800] leading-none">⚡</span>
          <span className="text-[13px] font-sans italic font-black tracking-wider text-gray-900">
            fastrack
          </span>
        </div>
      );

    case 'hmt':
      return (
        <div className="flex items-center justify-center">
          <span className="text-[16px] font-serif font-black tracking-[0.24em] text-[#002D62]">
            hmt
          </span>
        </div>
      );

    case 'jaipur':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-serif font-black tracking-[0.18em] text-[#936A34] leading-tight">
            JAIPUR
          </span>
          <span className="text-[7px] font-serif tracking-[0.2em] text-gray-700">WATCH COMPANY</span>
        </div>
      );

    case 'bangalore':
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-[9.5px] font-serif font-black tracking-[0.18em] text-gray-900 leading-tight">
            BANGALORE
          </span>
          <span className="text-[6.5px] tracking-[0.2em] text-gray-600">WATCH COMPANY™</span>
        </div>
      );

    default:
      return (
        <span className="text-sm font-bold tracking-wider text-gray-800">
          {brandName}
        </span>
      );
  }
};

export default BrandLogo;
