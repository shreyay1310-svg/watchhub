import { LUXURY_BRANDS } from './brands/luxuryBrands.js';
import { HERITAGE_BRANDS } from './brands/heritageBrands.js';

export const GLOBAL_BRANDS_60 = [...LUXURY_BRANDS, ...HERITAGE_BRANDS];

export const getBrandDescription = (brand) => {
  if (!brand) return '';
  if (brand.description) return brand.description;
  return `${brand.name} was established in ${brand.founded || 'Switzerland'} (${brand.country}). Celebrated worldwide as "${brand.tagline || 'Excellence in Horology'}", crafting world-class mechanical precision and iconic luxury timepieces.`;
};

export const REGIONAL_SECTIONS = [
  { id: 'swiss', title: 'Swiss Luxury Watches', flag: '🇨🇭', count: 26 },
  { id: 'japanese', title: 'Japanese Watch Collection', flag: '🇯🇵', count: 5 },
  { id: 'american', title: 'American & Fashion Watches', flag: '🇺🇸', count: 10 },
  { id: 'smartwatch', title: 'Smartwatch & Sports Brands', flag: '⌚', count: 8 },
  { id: 'european', title: 'European Watchmakers', flag: '🇪🇺', count: 13 },
  { id: 'indian', title: 'Indian Watch Brands', flag: '🇮🇳', count: 5 },
];

