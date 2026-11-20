import { LUXURY_WATCHES } from './products/luxuryWatches.js';
import { CHRONOGRAPH_WATCHES } from './products/chronographWatches.js';
import { SMART_WATCHES } from './products/smartWatches.js';

export const MOCK_PRODUCTS = [
  ...LUXURY_WATCHES,
  ...CHRONOGRAPH_WATCHES,
  ...SMART_WATCHES,
];

export const GLOBAL_WATCH_BRANDS = [
  { name: 'Rolex', country: 'Switzerland' },
  { name: 'Omega', country: 'Switzerland' },
  { name: 'Patek Philippe', country: 'Switzerland' },
  { name: 'Audemars Piguet', country: 'Switzerland' },
  { name: 'Cartier', country: 'France' },
  { name: 'Chronoswiss', country: 'Switzerland' },
  { name: 'TAG Heuer', country: 'Switzerland' },
  { name: 'Breitling', country: 'Switzerland' },
  { name: 'Tissot', country: 'Switzerland' },
  { name: 'Longines', country: 'Switzerland' },
  { name: 'Rado', country: 'Switzerland' },
  { name: 'Hublot', country: 'Switzerland' },
  { name: 'Casio', country: 'Japan' },
  { name: 'Seiko', country: 'Japan' },
  { name: 'Citizen', country: 'Japan' },
  { name: 'Titan', country: 'India' },
  { name: 'Fossil', country: 'USA' },
  { name: 'Timex', country: 'USA' },
  { name: 'Tommy Hilfiger', country: 'USA' },
  { name: 'Armani Exchange', country: 'Italy' },
  { name: 'Michael Kors', country: 'USA' },
  { name: 'Apple', country: 'USA' },
  { name: 'Samsung', country: 'South Korea' },
  { name: 'Garmin', country: 'USA' },
  { name: 'Chopard', country: 'Switzerland' },
  { name: 'Swatch', country: 'Switzerland' }
];

export const BRAND_LINKS = {
  Rolex: 'https://www.rolex.com/',
  Omega: 'https://www.omegawatches.com/',
  Chronoswiss: 'https://chronoswiss.com/',
  Tissot: 'https://www.tissotwatches.com/',
  Fossil: 'https://www.fossil.com/',
  Seiko: 'https://www.seikowatches.com/',
  Casio: 'https://www.casio.com/',
  Citizen: 'https://www.citizenwatch.com/',
  Titan: 'https://www.titan.co.in/',
  Timex: 'https://www.timex.com/',
  'TAG Heuer': 'https://www.tagheuer.com/',
  Hublot: 'https://www.hublot.com/',
  'Patek Philippe': 'https://www.patek.com/',
  'Audemars Piguet': 'https://www.audemarspiguet.com/',
  Cartier: 'https://www.cartier.com/',
  Breitling: 'https://www.breitling.com/',
  Rado: 'https://www.rado.com/',
  Longines: 'https://www.longines.com/',
  Chopard: 'https://www.chopard.com/',
  Garmin: 'https://www.garmin.com/',
  Apple: 'https://www.apple.com/watch/',
  Samsung: 'https://www.samsung.com/galaxy-watch/',
  Swatch: 'https://www.swatch.com/'
};

export const brandLinks = BRAND_LINKS;
export default MOCK_PRODUCTS;
