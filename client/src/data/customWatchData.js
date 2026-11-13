// WatchHub Watch Customization Studio - Master Configuration & Pricing Matrix

export const WATCH_TYPES = [
  {
    id: 'analog',
    name: 'Analog Watch',
    subtitle: 'Classic three-hand horology',
    basePrice: 9999,
    image: '/images/products/featured_rolex_submariner.jpg',
    icon: '⌚',
    compatibleMovements: ['quartz', 'automatic', 'mechanical'],
  },
  {
    id: 'automatic',
    name: 'Automatic Watch',
    subtitle: 'Self-winding mechanical caliber',
    basePrice: 18499,
    image: '/images/products/featured_rolex_daytona.jpg',
    icon: '⚙️',
    compatibleMovements: ['automatic'],
  },
  {
    id: 'chronograph',
    name: 'Chronograph Watch',
    subtitle: 'Dual sub-dial precision stopwatch',
    basePrice: 14999,
    image: '/images/products/featured_omega_speedmaster.jpg',
    icon: '⏱️',
    compatibleMovements: ['quartz', 'automatic'],
  },
  {
    id: 'skeleton',
    name: 'Skeleton Watch',
    subtitle: 'Open-worked transparent dial mechanics',
    basePrice: 24999,
    image: '/images/products/featured_patek_nautilus.jpg',
    icon: '💎',
    compatibleMovements: ['automatic', 'mechanical'],
  },
  {
    id: 'mechanical',
    name: 'Mechanical Watch',
    subtitle: 'Hand-wound Haute Horlogerie',
    basePrice: 21999,
    image: '/images/products/featured_ap_royal_oak.jpg',
    icon: '👑',
    compatibleMovements: ['mechanical'],
  },
  {
    id: 'minimalist',
    name: 'Minimalist Watch',
    subtitle: 'Ultra-thin Scandinavian pure aesthetic',
    basePrice: 7999,
    image: '/images/products/featured_cartier_tank.jpg',
    icon: '✨',
    compatibleMovements: ['quartz', 'automatic'],
  },
  {
    id: 'smartwatch',
    name: 'Smartwatch',
    subtitle: 'AMOLED display with smart sensors',
    basePrice: 12999,
    image: '/images/products/featured_apple_watch.jpg',
    icon: '📱',
    compatibleMovements: ['digital'],
  },
  {
    id: 'digital',
    name: 'Digital Watch',
    subtitle: 'Retro LED shock-resistant digital',
    basePrice: 6499,
    image: '/images/products/gshock_digital.jpg',
    icon: '⚡',
    compatibleMovements: ['digital'],
  },
];

export const DIAL_CONFIG = {
  shapes: [
    { id: 'round', name: 'Round', icon: '⭕', price: 0 },
    { id: 'square', name: 'Square', icon: '⏹️', price: 600 },
    { id: 'rectangle', name: 'Rectangle', icon: '▯', price: 800 },
    { id: 'oval', name: 'Oval', icon: '⬭', price: 700 },
    { id: 'tonneau', name: 'Tonneau', icon: '🛡️', price: 1200 },
  ],
  sizes: [
    { size: 28, label: '28 mm', desc: 'Chic Petite' },
    { size: 30, label: '30 mm', desc: 'Elegant Slim' },
    { size: 32, label: '32 mm', desc: 'Classic Women' },
    { size: 34, label: '34 mm', desc: 'Modern Mid' },
    { size: 36, label: '36 mm', desc: 'Unisex Classic' },
    { size: 38, label: '38 mm', desc: 'Vintage Standard' },
    { size: 40, label: '40 mm', desc: 'Contemporary' },
    { size: 42, label: '42 mm', desc: 'Modern Sport' },
    { size: 44, label: '44 mm', desc: 'Bold Presence' },
    { size: 46, label: '46 mm', desc: 'Statement Oversized' },
  ],
  colors: [
    { id: 'black', name: 'Black', hex: '#121212', price: 0 },
    { id: 'blue', name: 'Blue', hex: '#1B3B6F', price: 400 },
    { id: 'white', name: 'White', hex: '#F8F9FA', price: 0 },
    { id: 'silver', name: 'Silver', hex: '#C0C0C0', price: 300 },
    { id: 'gold', name: 'Gold', hex: '#D4AF37', price: 800 },
    { id: 'rosegold', name: 'Rose Gold', hex: '#B76E79', price: 800 },
    { id: 'green', name: 'Green', hex: '#1E4D2B', price: 500 },
    { id: 'brown', name: 'Brown', hex: '#4A2E18', price: 300 },
    { id: 'champagne', name: 'Champagne', hex: '#F7E7CE', price: 600 },
  ],
  finishes: [
    { id: 'sunburst', name: 'Sunburst', desc: 'Radiant metallic sheen', price: 600 },
    { id: 'matte', name: 'Matte', desc: 'Anti-reflective velvety texture', price: 0 },
    { id: 'glossy', name: 'Glossy', desc: 'High-shine lacquered depth', price: 400 },
    { id: 'textured', name: 'Textured', desc: 'Guilloché / Waffle pattern', price: 1000 },
    { id: 'skeleton', name: 'Skeleton', desc: 'Exposed mechanical gears', price: 2500 },
  ],
};

export const CASE_CONFIG = {
  materials: [
    { id: 'steel', name: 'Stainless Steel', grade: '316L Surgical Grade', price: 0 },
    { id: 'titanium', name: 'Titanium', grade: 'Grade 5 Aerospace Ultralight', price: 3500 },
    { id: 'ceramic', name: 'Ceramic', grade: 'Scratch-Proof High-Tech', price: 4200 },
    { id: 'brass', name: 'Brass', grade: 'Vintage Nautical Patina', price: 1200 },
    { id: 'gold_plated', name: 'Gold-Plated Steel', grade: '18K PVD 10-Micron Coat', price: 2800 },
    { id: 'rosegold_plated', name: 'Rose Gold-Plated', grade: '18K Rose PVD Coating', price: 2800 },
  ],
  colors: [
    { id: 'silver', name: 'Silver', hex: '#D8D8D8', price: 0 },
    { id: 'gold', name: 'Gold', hex: '#E6B800', price: 700 },
    { id: 'rosegold', name: 'Rose Gold', hex: '#E8927C', price: 700 },
    { id: 'black', name: 'Black', hex: '#222222', price: 500 },
    { id: 'gunmetal', name: 'Gunmetal', hex: '#53565A', price: 600 },
    { id: 'twotone', name: 'Two-Tone', hex: 'linear-gradient(45deg, #D8D8D8 50%, #E6B800 50%)', price: 1200 },
  ],
  shapes: [
    { id: 'round', name: 'Round', desc: 'Timeless circular bezel' },
    { id: 'square', name: 'Square', desc: 'Architectural sharp edges' },
    { id: 'rectangle', name: 'Rectangle', desc: 'Art-Deco elongated silhouette' },
    { id: 'tonneau', name: 'Tonneau', desc: 'Barrel-curved luxury profile' },
  ],
};

export const STRAP_CONFIG = {
  materials: [
    { id: 'leather', name: 'Genuine Leather', desc: 'Supple Italian handcrafted leather', price: 0 },
    { id: 'steel', name: 'Stainless Steel', desc: 'Solid oyster 3-link bracelet', price: 1500 },
    { id: 'mesh', name: 'Milanese Mesh', desc: 'Finely woven magnetic mesh', price: 1200 },
    { id: 'silicone', name: 'Silicone', desc: 'Ultra-flexible waterproof sport band', price: 600 },
    { id: 'rubber', name: 'FKM Rubber', desc: 'High-durability diver grade', price: 800 },
    { id: 'nylon', name: 'Nylon / NATO', desc: 'Military rugged breathable weave', price: 500 },
    { id: 'ceramic', name: 'Ceramic Links', desc: 'Mirror-polished hypoallergenic luxury', price: 3000 },
  ],
  colors: [
    { id: 'brown', name: 'Brown', hex: '#5C3A21' },
    { id: 'black', name: 'Black', hex: '#1A1A1A' },
    { id: 'tan', name: 'Tan', hex: '#A77848' },
    { id: 'blue', name: 'Navy Blue', hex: '#1B365D' },
    { id: 'white', name: 'White', hex: '#F5F5F5' },
    { id: 'red', name: 'Crimson Red', hex: '#9B111E' },
    { id: 'green', name: 'Olive Green', hex: '#204028' },
    { id: 'gold', name: 'Gold', hex: '#D4AF37' },
    { id: 'silver', name: 'Silver', hex: '#C0C0C0' },
  ],
  widths: [14, 16, 18, 20, 22, 24],
  styles: [
    { id: 'classic', name: 'Classic Smooth', desc: 'Traditional clean stitched finish' },
    { id: 'milanese', name: 'Milanese Weave', desc: 'Continuous adjustable woven mesh' },
    { id: 'link', name: 'Link Bracelet', desc: 'Segmented solid metal deployment clasp' },
    { id: 'sport', name: 'Sport Perforated', desc: 'Breathable dual-vented active band' },
    { id: 'croco', name: 'Embossed Crocodile', desc: 'Exotic luxury grain texture' },
  ],
};

export const MOVEMENT_CONFIG = [
  {
    id: 'automatic',
    name: 'Automatic Caliber',
    origin: 'Swiss-designed 28,800 vph',
    desc: 'Self-winding rotor powered by your natural wrist motion with 42hr power reserve.',
    price: 3500,
    icon: '⚙️',
  },
  {
    id: 'mechanical',
    name: 'Mechanical Hand-Wind',
    origin: 'Haute Horlogerie Exhibition Movement',
    desc: 'Pure horological purism with smooth hand winding and transparent exhibition back.',
    price: 5000,
    icon: '👑',
  },
  {
    id: 'quartz',
    name: 'High-Precision Quartz',
    origin: 'Japanese Ultra-Accurate Tuning Fork',
    desc: 'Accurate to within +/- 15 seconds per month with 3-year extended battery life.',
    price: 0,
    icon: '⚡',
  },
  {
    id: 'digital',
    name: 'Digital Smart Module',
    origin: 'Dual Bluetooth Smart Processor',
    desc: 'Microprocessor with sensor integration, battery management and instant synchronization.',
    price: 1500,
    icon: '📱',
  },
];

export const FEATURES_CONFIG = [
  { id: 'sapphire', name: 'Sapphire Crystal Glass', desc: 'Mohs 9 hardness scratch-proof crystal', price: 2200, icon: '💎' },
  { id: 'waterproof_100m', name: '100M Water Resistance', desc: 'Reinforced screw-down crown & gaskets', price: 800, icon: '💧' },
  { id: 'date_window', name: 'Date Display Window', desc: 'Framed date aperture at 3 o’clock', price: 600, icon: '📅' },
  { id: 'day_display', name: 'Day & Date Dual Complication', desc: 'Weekday and numerical date indicator', price: 800, icon: '🗓️' },
  { id: 'chronograph', name: 'Chronograph Sub-Dials', desc: 'Triple register stopwatch dials', price: 1800, icon: '⏱️' },
  { id: 'luminous', name: 'Super-LumiNova Hands', desc: 'Glowing green/blue photoluminescent markers', price: 500, icon: '✨' },
  { id: 'transparent_back', name: 'Transparent Exhibition Back', desc: 'Sapphire case-back showing movement', price: 1200, icon: '🔍' },
  { id: 'scratch_coating', name: 'Diamond-Like Carbon Coating', desc: 'Scratch-resistant molecular treatment', price: 900, icon: '🛡️' },
];

export const HANDS_MARKERS_CONFIG = {
  hands: [
    { id: 'silver', name: 'Silver Polished', hex: '#E0E0E0' },
    { id: 'gold', name: 'Yellow Gold', hex: '#D4AF37' },
    { id: 'rosegold', name: 'Rose Gold', hex: '#B76E79' },
    { id: 'black', name: 'Matte Black', hex: '#1C1C1C' },
    { id: 'luminous', name: 'Luminous Glow', hex: '#8AF5A1' },
  ],
  markers: [
    { id: 'index', name: 'Index Markers', desc: 'Faceted rectangular hour batons', price: 0 },
    { id: 'roman', name: 'Roman Numerals', desc: 'Classic XII, III, VI, IX styling', price: 400 },
    { id: 'arabic', name: 'Arabic Numbers', desc: 'Modern high-legibility numerals', price: 300 },
    { id: 'diamond', name: 'Diamond Gemstones', desc: 'Hand-set cubic zirconia hour points', price: 1200 },
    { id: 'minimal', name: 'Minimalist Dots', desc: 'Understated discreet micro-dots', price: 0 },
  ],
};

export const DEFAULT_CUSTOM_WATCH = {
  id: 'custom-' + Date.now(),
  name: 'WatchHub Bespoke Timepiece',
  watchType: 'analog',
  dial: {
    shape: 'round',
    size: 42,
    color: 'blue',
    customHex: '#1B3B6F',
    finish: 'sunburst',
  },
  case: {
    material: 'steel',
    color: 'silver',
    shape: 'round',
    size: 42,
  },
  strap: {
    material: 'leather',
    color: 'brown',
    width: 22,
    style: 'classic',
  },
  movement: 'automatic',
  features: ['waterproof_100m', 'date_window'],
  hands: 'gold',
  markers: 'index',
  personalization: {
    dialText: 'CUSTOM',
    backEngraving: 'S.Y.',
    font: 'serif',
    specialDate: '',
  },
};

