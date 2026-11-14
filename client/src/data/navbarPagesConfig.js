// WatchHub Navbar Pages Configuration & Subcategories Meta
// Powers dedicated pages for /watches, /men, /women, /kids, /smartwatches, /luxury, /sports, /collections

export const NAVBAR_PAGES_CONFIG = {
  watches: {
    key: 'watches',
    route: '/watches',
    title: 'All Luxury Timepieces & Horology Catalog',
    subtitle: 'Explore our complete treasury of Swiss Haute Horlogerie, German precision engineering, Japanese mastery, and connected luxury wearables.',
    badge: 'COMPLETE WATCH DIRECTORY',
    gradient: 'from-[#020813] via-[#0B1E38] to-[#040A17]',
    subcategories: [
      { id: 'all', label: 'All Watches', icon: '⌚' },
      { id: 'new', label: 'New Arrivals', icon: '✨' },
      { id: 'bestseller', label: 'Best Sellers', icon: '🔥' },
      { id: 'limited', label: 'Limited Edition', icon: '💎' },
      { id: 'preowned', label: 'Pre-Owned Certified', icon: '🛡️' },
      { id: 'customize', label: 'Customize Your Watch', icon: '🎨', link: '/customize-watch' },
    ],
    baseFilter: () => true,
    subFilter: (p, sub) => {
      if (!sub || sub === 'all') return true;
      if (sub === 'new') return p.isNew === true;
      if (sub === 'bestseller') return p.isTrending === true || p.rating >= 4.8;
      if (sub === 'limited') return p.isLimitedEdition === true;
      if (sub === 'preowned') return p.isPreOwned === true;
      return true;
    },
  },

  men: {
    key: 'men',
    route: '/men',
    title: "Men's Luxury Chronograph & Mechanical Watches",
    subtitle: 'Engineered with masculine silhouettes, architectural bezels, column-wheel chronographs, and certified deep-water resistance.',
    badge: "MEN'S ATELIER",
    gradient: 'from-[#020813] via-[#06152F] to-[#030914]',
    subcategories: [
      { id: 'all', label: 'All Men', icon: '👔' },
      { id: 'classic', label: 'Classic', icon: '🎩' },
      { id: 'chronograph', label: 'Chronograph', icon: '⏱️' },
      { id: 'diver', label: 'Diver', icon: '🌊' },
      { id: 'sports', label: 'Sports', icon: '⚡' },
      { id: 'analog', label: 'Analog', icon: '🕰️' },
      { id: 'digital', label: 'Digital', icon: '📟' },
    ],
    baseFilter: (p) => p.gender === 'Men' || p.gender === 'Unisex',
    subFilter: (p, sub) => {
      if (!sub || sub === 'all') return true;
      const s = sub.toLowerCase();
      if (s === 'classic') return p.style === 'Classic' || p.subCategory === 'Classic' || ['Tissot', 'Cartier', 'Jaeger-LeCoultre', 'Rolex', 'Longines'].includes(p.brand);
      if (s === 'chronograph') return p.style === 'Chronograph' || p.subCategory === 'Chronograph' || p.name.toLowerCase().includes('chronograph');
      if (s === 'diver') return p.style === 'Diver' || p.subCategory.includes('Diving') || (p.waterproof && p.waterproof.includes('Diver'));
      if (s === 'sports') return p.style === 'Sports' || p.category === 'Sports' || p.subCategory.includes('Outdoor');
      if (s === 'analog') return p.style === 'Analog' || (p.movement && (p.movement.includes('Automatic') || p.movement.includes('Calibre') || p.movement.includes('Quartz')));
      if (s === 'digital') return p.style === 'Digital' || p.subCategory === 'Digital' || p.category === 'Digital';
      return true;
    },
  },

  women: {
    key: 'women',
    route: '/women',
    title: "Women's High Jewellery & Elegant Timepieces",
    subtitle: 'Graceful mother-of-pearl dials, brilliant diamond-set bezels, warm rose gold finishing, and poetic mechanical movements.',
    badge: "WOMEN'S ATELIER",
    gradient: 'from-[#0A0514] via-[#1A0A26] to-[#040816]',
    subcategories: [
      { id: 'all', label: 'All Women', icon: '✨' },
      { id: 'elegant', label: 'Elegant', icon: '🌸' },
      { id: 'fashion', label: 'Fashion', icon: '💄' },
      { id: 'diamond', label: 'Diamond', icon: '💎' },
      { id: 'minimal', label: 'Minimal', icon: '🤍' },
      { id: 'luxury', label: 'Luxury', icon: '👑' },
      { id: 'smart', label: 'Smart', icon: '📱' },
    ],
    baseFilter: (p) => p.gender === 'Women' || p.gender === 'Unisex',
    subFilter: (p, sub) => {
      if (!sub || sub === 'all') return true;
      const s = sub.toLowerCase();
      if (s === 'elegant') return p.style === 'Elegant' || p.subCategory === 'Elegant' || (p.dialDetails && p.dialDetails.includes('mother-of-pearl'));
      if (s === 'fashion') return p.style === 'Fashion' || p.subCategory === 'Fashion' || ['Michael Kors', 'Fossil', 'Titan'].includes(p.brand);
      if (s === 'diamond') return p.style === 'Diamond' || p.subCategory === 'Diamond' || (p.description && p.description.toLowerCase().includes('diamond'));
      if (s === 'minimal') return p.style === 'Minimal' || p.subCategory === 'Minimal' || ['Nomos Glashütte', 'Fossil'].includes(p.brand);
      if (s === 'luxury') return p.style === 'Luxury' || p.category === 'Luxury' || ['Rolex', 'Cartier', 'Chopard', 'Audemars Piguet'].includes(p.brand);
      if (s === 'smart') return p.category === 'Smartwatches' || p.style.includes('Smart') || (p.subCategory && p.subCategory.includes('Smart'));
      return true;
    },
  },

  kids: {
    key: 'kids',
    route: '/kids',
    title: "Kids' Educational, Cartoon & Shockproof Watches",
    subtitle: 'Vibrant, durable, and shatterproof timepieces built with educational time-teaching dials and beloved superhero editions.',
    badge: 'YOUTH & JUNIOR HOROLOGY',
    gradient: 'from-[#03141F] via-[#052838] to-[#020A12]',
    subcategories: [
      { id: 'all', label: 'All Kids', icon: '🎈' },
      { id: 'digital', label: 'Digital', icon: '📟' },
      { id: 'analog', label: 'Analog', icon: '🕰️' },
      { id: 'cartoon', label: 'Cartoon', icon: '🦸' },
      { id: 'sports', label: 'Sports', icon: '⚽' },
      { id: 'age-5-9', label: 'Ages 5–9', icon: '🧸' },
      { id: 'age-10-15', label: 'Ages 10–15', icon: '🎯' },
    ],
    baseFilter: (p) => p.gender === 'Kids',
    subFilter: (p, sub) => {
      if (!sub || sub === 'all') return true;
      const s = sub.toLowerCase();
      if (s === 'digital') return p.style === 'Digital' || p.subCategory === 'Digital';
      if (s === 'analog') return p.style === 'Analog' || p.subCategory === 'Analog';
      if (s === 'cartoon') return p.style === 'Cartoon' || p.subCategory === 'Cartoon' || (p.description && p.description.toLowerCase().includes('marvel'));
      if (s === 'sports') return p.style === 'Sports' || p.subCategory === 'Sports' || (p.waterproof && p.waterproof.includes('100M'));
      if (s === 'age-5-9') return (p.description && p.description.includes('5-9')) || p.brand === 'Flik Flak' || p.brand === 'Timex';
      if (s === 'age-10-15') return (p.description && p.description.includes('10-15')) || p.brand === 'Q&Q' || p.brand === 'Casio' || p.brand === 'Zoop';
      return true;
    },
  },

  smartwatches: {
    key: 'smartwatches',
    route: '/smartwatches',
    title: 'Next-Gen AMOLED Smartwatches & Luxury Wearables',
    subtitle: 'Aerospace-grade titanium chassis, continuous ECG, cardiac health vitals, dual-frequency GPS, and seamless cellular connectivity.',
    badge: 'CONNECTED SMART HOROLOGY',
    gradient: 'from-[#060D2A] via-[#0B1545] to-[#030617]',
    subcategories: [
      { id: 'all', label: 'All Smartwatches', icon: '📱' },
      { id: 'apple', label: 'Apple Watch', icon: '' },
      { id: 'samsung', label: 'Samsung Galaxy Watch', icon: '⭐' },
      { id: 'garmin', label: 'Garmin', icon: '🧭' },
      { id: 'fitness', label: 'Fitness Trackers', icon: '🏃' },
      { id: 'calling', label: 'Bluetooth Calling', icon: '📞' },
      { id: 'health', label: 'Health Monitoring', icon: '❤️' },
    ],
    baseFilter: (p) => p.category === 'Smartwatches' || (p.style && p.style.includes('Smart')),
    subFilter: (p, sub) => {
      if (!sub || sub === 'all') return true;
      const s = sub.toLowerCase();
      if (s === 'apple') return p.brand === 'Apple';
      if (s === 'samsung') return p.brand === 'Samsung';
      if (s === 'garmin') return p.brand === 'Garmin';
      if (s === 'fitness') return p.style === 'Fitness Trackers' || p.name.includes('Fitness') || p.name.includes('Running');
      if (s === 'calling') return p.style === 'Bluetooth Calling' || (p.description && p.description.toLowerCase().includes('calling')) || (p.description && p.description.toLowerCase().includes('cellular'));
      if (s === 'health') return p.style === 'Health Monitoring' || (p.description && p.description.includes('ECG')) || (p.description && p.description.includes('BioActive')) || (p.description && p.description.includes('apnea'));
      return true;
    },
  },

  luxury: {
    key: 'luxury',
    route: '/luxury',
    title: 'Swiss Haute Horlogerie & Precious Metal Vault',
    subtitle: 'Hand-finished flying tourbillons, perpetual calendars, minute repeaters, and certified Swiss chronometers.',
    badge: 'HAUTE HORLOGERIE VAULT',
    gradient: 'from-[#0C0B05] via-[#211A07] to-[#050402]',
    subcategories: [
      { id: 'all', label: 'All Luxury', icon: '👑' },
      { id: 'swiss', label: 'Swiss Watches', icon: '🇨🇭' },
      { id: 'haute', label: 'Haute Horlogerie', icon: '⚜️' },
      { id: 'limited', label: 'Limited Editions', icon: '💎' },
      { id: 'mechanical', label: 'Premium Mechanical', icon: '⚙️' },
      { id: 'automatic', label: 'Automatic Watches', icon: '🔄' },
    ],
    baseFilter: (p) => p.category === 'Luxury' || p.price >= 150000,
    subFilter: (p, sub) => {
      if (!sub || sub === 'all') return true;
      const s = sub.toLowerCase();
      const swissBrands = ['rolex', 'omega', 'patek philippe', 'audemars piguet', 'chronoswiss', 'breitling', 'tissot', 'cartier', 'longines', 'chopard', 'jaeger-lecoultre', 'vacheron constantin', 'tudor'];
      if (s === 'swiss') return swissBrands.includes(p.brand.toLowerCase());
      if (s === 'haute') return p.style === 'Haute Horlogerie' || ['chronoswiss', 'patek philippe', 'audemars piguet', 'vacheron constantin'].includes(p.brand.toLowerCase());
      if (s === 'limited') return p.isLimitedEdition === true || p.collection === 'Limited Collection';
      if (s === 'mechanical') return (p.movement && (p.movement.includes('Calibre') || p.movement.includes('Tourbillon') || p.movement.includes('Hand-Wound')));
      if (s === 'automatic') return (p.movement && (p.movement.includes('Automatic') || p.movement.includes('Selfwinding') || p.movement.includes('Self-Winding')));
      return true;
    },
  },

  sports: {
    key: 'sports',
    route: '/sports',
    title: 'High-Performance Sports, Diver & Racing Watches',
    subtitle: 'From ISO 6425 300M+ deep ocean diving to trackside split-second tachymeters and shockproof carbon-core armor.',
    badge: 'EXPEDITION & MOTORSPORT SPEC',
    gradient: 'from-[#02131C] via-[#042436] to-[#01090F]',
    subcategories: [
      { id: 'all', label: 'All Sports', icon: '⚡' },
      { id: 'diving', label: 'Diving Watches', icon: '🤿' },
      { id: 'racing', label: 'Racing Watches', icon: '🏎️' },
      { id: 'outdoor', label: 'Outdoor Watches', icon: '🏔️' },
      { id: 'fitness', label: 'Fitness Watches', icon: '🏋️' },
      { id: 'waterproof', label: 'Waterproof Watches', icon: '💧' },
    ],
    baseFilter: (p) =>
      p.category === 'Sports' ||
      p.subCategory.includes('Diving') ||
      p.subCategory.includes('Racing') ||
      p.subCategory.includes('Outdoor') ||
      (p.style && p.style.includes('Fitness')) ||
      (p.waterproof && (p.waterproof.includes('200M') || p.waterproof.includes('300M') || p.waterproof.includes('500M'))),
    subFilter: (p, sub) => {
      if (!sub || sub === 'all') return true;
      const s = sub.toLowerCase();
      if (s === 'diving') return p.style === 'Diver' || p.subCategory.includes('Diving') || (p.description && p.description.toLowerCase().includes('diver'));
      if (s === 'racing') return p.style === 'Racing' || p.subCategory.includes('Racing') || p.name.includes('Daytona') || p.name.includes('Carrera') || p.name.includes('Monaco') || p.name.includes('Speedmaster');
      if (s === 'outdoor') return p.subCategory.includes('Outdoor') || p.brand === 'Casio' || p.brand === 'Garmin';
      if (s === 'fitness') return (p.style && p.style.includes('Fitness')) || p.category === 'Smartwatches' || p.brand === 'Garmin' || p.brand === 'Fitbit';
      if (s === 'waterproof') return (p.waterproof && (p.waterproof.includes('200M') || p.waterproof.includes('300M') || p.waterproof.includes('500M')));
      return true;
    },
  },

  collections: {
    key: 'collections',
    route: '/collections',
    title: 'WatchHub Signature Collections & Collaborations',
    subtitle: 'Limited seasonal drops, historic heritage tributes, iconic series, and bespoke collaborative masterpieces.',
    badge: 'CURATED COLLECTOR VAULT',
    gradient: 'from-[#070617] via-[#150F33] to-[#04030F]',
    subcategories: [
      { id: 'all', label: 'All Collections', icon: '🏛️' },
      { id: 'heritage', label: 'Heritage Collection', icon: '📜' },
      { id: 'iconic', label: 'Iconic Series', icon: '🏆' },
      { id: 'limited', label: 'Limited Collection', icon: '💎' },
      { id: 'collaboration', label: 'Collaboration', icon: '🤝' },
      { id: 'seasonal', label: 'Seasonal Collection', icon: '❄️' },
    ],
    baseFilter: (p) => Boolean(p.collection),
    subFilter: (p, sub) => {
      if (!sub || sub === 'all') return true;
      const s = sub.toLowerCase();
      if (s === 'heritage') return p.collection === 'Heritage Collection';
      if (s === 'iconic') return p.collection === 'Iconic Series';
      if (s === 'limited') return p.collection === 'Limited Collection' || p.isLimitedEdition === true;
      if (s === 'collaboration') return p.collection === 'Collaboration';
      if (s === 'seasonal') return p.collection === 'Seasonal Collection';
      return true;
    },
  },

  'limited-edition': {
    key: 'limited-edition',
    route: '/limited-edition',
    title: 'Limited Edition & Haute Horlogerie Masterpieces',
    subtitle: 'Exclusive skeleton dials, flying tourbillons, perpetual calendars, and strictly numbered rare artisan collector timepieces.',
    badge: 'HAUTE HORLOGERIE • NUMBERED EDITIONS',
    gradient: 'from-[#170B04] via-[#2D1607] to-[#0D0502]',
    subcategories: [
      { id: 'all', label: 'All Limited Editions', icon: '💎' },
      { id: 'tourbillon', label: 'Flying Tourbillon', icon: '⚙️' },
      { id: 'skeleton', label: 'Skeleton & Openwork', icon: '🪞' },
      { id: 'numbered', label: 'Numbered Pieces', icon: '🔢' },
      { id: 'meteorite', label: 'Meteorite & Rare Dials', icon: '☄️' },
      { id: 'haute', label: 'Grand Complications', icon: '👑' },
    ],
    baseFilter: (p) => Boolean(p.isLimitedEdition || p.category === 'Luxury' || p.price > 400000 || p.collection === 'Limited Collection'),
    subFilter: (p, sub) => {
      if (!sub || sub === 'all') return true;
      const s = sub.toLowerCase();
      if (s === 'tourbillon') return p.name?.toLowerCase().includes('tourbillon') || p.movement?.toLowerCase().includes('tourbillon');
      if (s === 'skeleton') return p.name?.toLowerCase().includes('skeleton') || p.description?.toLowerCase().includes('skeleton');
      if (s === 'numbered') return p.isLimitedEdition === true;
      if (s === 'meteorite') return p.name?.toLowerCase().includes('meteorite') || p.description?.toLowerCase().includes('meteorite');
      if (s === 'haute') return p.price > 500000;
      return true;
    },
  },

  'party-wear': {
    key: 'party-wear',
    route: '/categories/party-wear',
    title: 'Party Wear & Evening Statement Timepieces',
    subtitle: 'Diamond-studded bezels, rose-gold finishes, and iridescent dials designed to shine at every celebration.',
    badge: 'EVENING GLAMOUR & SOIREE',
    gradient: 'from-[#1A0A1C] via-[#2D1030] to-[#0A040D]',
    subcategories: [
      { id: 'all', label: 'All Party Watches', icon: '🍸' },
      { id: 'diamond', label: 'Diamond Encrusted', icon: '💎' },
      { id: 'rose-gold', label: 'Rose Gold Shimmer', icon: '✨' },
      { id: 'cocktail', label: 'Cocktail Dress', icon: '🥂' },
      { id: 'minimal', label: 'Minimal Luxury', icon: '🪞' },
    ],
    baseFilter: (p) => Boolean(p.category === "Women's" || p.category === 'Luxury' || p.gender === 'Women' || p.price > 50000),
    subFilter: (p, sub) => true,
  },

  waterproof: {
    key: 'waterproof',
    route: '/categories/waterproof',
    title: 'Professional Diver & Waterproof Watches (200M–300M)',
    subtitle: 'Engineered with helium escape valves, screw-down crowns, unidirectional ceramic bezels, and deep-sea luminescence.',
    badge: 'SUB-AQUATIC RESILIENCE',
    gradient: 'from-[#021A2A] via-[#052C42] to-[#010C14]',
    subcategories: [
      { id: 'all', label: 'All Waterproof', icon: '💧' },
      { id: 'diver-300m', label: '300M Diver', icon: '🤿' },
      { id: 'chrono-dive', label: 'Diving Chronograph', icon: '⏱️' },
      { id: 'ceramic', label: 'Cerachrom Bezel', icon: '🛡️' },
    ],
    baseFilter: (p) => Boolean(p.category === 'Sports' || p.name?.toLowerCase().includes('submariner') || p.name?.toLowerCase().includes('seamaster') || p.waterResistance),
    subFilter: (p, sub) => true,
  },

  couple: {
    key: 'couple',
    route: '/categories/couple',
    title: 'His & Hers Matching Luxury Couple Watches',
    subtitle: 'Coordinated twin luxury timepieces crafted for weddings, anniversaries, and shared lifelong milestones.',
    badge: 'TWIN TIMEPIECE SETS',
    gradient: 'from-[#1E0E18] via-[#35152A] to-[#0E050B]',
    subcategories: [
      { id: 'all', label: 'All Couple Sets', icon: '💖' },
      { id: 'two-tone', label: 'Two-Tone Gold & Steel', icon: '👑' },
      { id: 'classic-pairs', label: 'Classic Leather Pairs', icon: '💼' },
      { id: 'luxury-anniversary', label: 'Anniversary Special', icon: '🎁' },
    ],
    baseFilter: (p) => true,
    subFilter: (p, sub) => true,
  },

  digital: {
    key: 'digital',
    route: '/categories/digital',
    title: 'Precision Digital & Tactical Wristwatches',
    subtitle: 'Classic retro LCD digital wristwatches, military shock-proof chronographs, countdown alarms, and night-glow displays.',
    badge: 'DIGITAL CHRONOMETRY',
    gradient: 'from-[#051824] via-[#0B2536] to-[#020A0F]',
    subcategories: [
      { id: 'all', label: 'All Digital Watches', icon: '🔲' },
      { id: 'vintage', label: 'Vintage Retro LCD', icon: '📟' },
      { id: 'tactical', label: 'Military Shock Resistant', icon: '⚡' },
      { id: 'sports-digital', label: 'Split Lap Timers', icon: '⏱️' },
    ],
    baseFilter: (p) => Boolean(p.category === 'Digital' || p.movement?.toLowerCase().includes('digital') || p.movement?.toLowerCase().includes('quartz') || p.type === 'Digital'),
    subFilter: (p, sub) => true,
  },

  analog: {
    key: 'analog',
    route: '/categories/analog',
    title: 'Classic Three-Hand Analog Horology',
    subtitle: 'Timeless Roman and Baton hour markers, sunburst lacquered dials, flame-blued hands, and scratch-resistant sapphire crystals.',
    badge: 'HERITAGE ANALOG DIALS',
    gradient: 'from-[#041226] via-[#082042] to-[#020712]',
    subcategories: [
      { id: 'all', label: 'All Analog Watches', icon: '🕒' },
      { id: 'sunburst', label: 'Sunburst Blue Dials', icon: '🔵' },
      { id: 'minimalist', label: 'Ultra-Slim Minimalist', icon: '📏' },
      { id: 'leather', label: 'Italian Leather Bands', icon: '🏷️' },
    ],
    baseFilter: (p) => Boolean(p.category !== 'Smartwatches' && p.type !== 'Smartwatch'),
    subFilter: (p, sub) => true,
  },

  automatic: {
    key: 'automatic',
    route: '/categories/automatic',
    title: 'Self-Winding Automatic Mechanical Calibres',
    subtitle: 'No batteries required. Powered by the natural movement of your wrist with exhibition glass casebacks and decorated rotors.',
    badge: 'KINETIC MECHANICAL ENERGY',
    gradient: 'from-[#1C1205] via-[#33200A] to-[#0D0802]',
    subcategories: [
      { id: 'all', label: 'All Automatic Watches', icon: '⚙️' },
      { id: 'skeleton', label: 'Openwork Skeletons', icon: '🪞' },
      { id: 'swiss', label: 'COSC Certified Swiss', icon: '🇨🇭' },
      { id: 'power-reserve', label: '70H Power Reserve', icon: '🔋' },
    ],
    baseFilter: (p) => Boolean(p.movement?.toLowerCase().includes('automatic') || p.category === 'Luxury' || p.category === "Men's"),
    subFilter: (p, sub) => true,
  },

  'new-arrivals': {
    key: 'new-arrivals',
    route: '/new-arrivals',
    title: 'New Arrivals & Latest Haute Horlogerie Releases',
    subtitle: "The world's newest certified chronometers, perpetual calendars, and limited manufacture novelties.",
    badge: 'LATEST RELEASES • 2026 EDITIONS',
    gradient: 'from-[#071324] via-[#0E2038] to-[#040A14]',
    subcategories: [
      { id: 'all', label: 'All New Releases', icon: '✨' },
      { id: 'chronograph', label: 'Novelty Chronographs', icon: '⏱️' },
      { id: 'gold', label: 'Precious Metals', icon: '👑' },
      { id: 'skeleton', label: 'Openwork Skeletons', icon: '🪞' },
      { id: 'limited', label: 'Numbered Editions', icon: '💎' },
    ],
    baseFilter: (p) => Boolean(p.isNewArrival || p.isNew || p.id === 'omega-speedmaster' || p.id === 'rolex-submariner' || p.id === 'tissot-prx'),
    subFilter: (p, sub) => true,
  },
};

export default NAVBAR_PAGES_CONFIG;
