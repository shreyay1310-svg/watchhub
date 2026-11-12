import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Globe,
  Building2,
  Factory,
  Layers,
  Search,
  ExternalLink,
  CheckCircle2,
  Plus,
  Minus,
  RotateCcw,
  MapPin,
  TrendingUp,
  ShoppingCart,
  Heart,
  Play,
  Pause,
  Compass,
  Sparkles,
  Award,
  ChevronRight,
  ShieldCheck,
  Check,
  Info
} from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { MOCK_PRODUCTS } from '../../../data/mockProducts';

// Geographic Coordinates (Lat / Lon) for 3D Rotating Spherical Globe
export const COUNTRIES_DATA = {
  Switzerland: {
    id: 'switzerland',
    name: 'Switzerland',
    flag: '🇨🇭',
    flagBg: 'bg-red-600',
    title: 'The Watch Capital of the World',
    color: '#ef4444',
    lat: 46.8,
    lon: 8.2,
    description: 'Home to world-renowned watchmakers known for unrivaled precision, Geneva seals, and Haute Horlogerie.',
    companiesCount: '45+',
    companiesNum: 45,
    brandsCount: '120+',
    keyHubs: 'La Chaux-de-Fonds, Biel/Bienne, Geneva, Le Locle',
    brandsSummary: '(Rolex, Omega, Patek Philippe)',
    tagline: 'Luxury & High-end',
    annualProduction: '20 Million Watches',
    exportValue: '$28.5 Billion',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
    cities: [
      { name: 'Geneva', brands: ['Rolex', 'Patek Philippe', 'Cartier'], count: 18, lat: 46.2, lon: 6.1 },
      { name: 'Biel/Bienne', brands: ['Omega', 'The Swatch Group AG'], count: 12, lat: 47.1, lon: 7.2 },
      { name: 'La Chaux-de-Fonds', brands: ['Rolex', 'TAG Heuer'], count: 8, lat: 47.1, lon: 6.8 },
      { name: 'Le Locle', brands: ['Tissot', 'Zenith'], count: 5, lat: 47.0, lon: 6.7 },
    ],
  },
  Germany: {
    id: 'germany',
    name: 'Germany',
    flag: '🇩🇪',
    flagBg: 'bg-amber-600',
    title: 'Saxony Glashütte Precision Engineering',
    color: '#f59e0b',
    lat: 51.1,
    lon: 10.4,
    description: 'Celebrated for three-quarter plates, Glashütte ribbing, hand-engraved balance cocks and Bauhaus tool watches.',
    companiesCount: '18+',
    companiesNum: 18,
    brandsCount: '35+',
    keyHubs: 'Glashütte, Pforzheim, Schramberg',
    brandsSummary: '(A. Lange, Nomos, Junghans)',
    tagline: 'Precision Engineering',
    annualProduction: '12 Million Watches',
    exportValue: '$2.1 Billion',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80',
    cities: [
      { name: 'Glashütte', brands: ['A. Lange & Söhne', 'Nomos'], count: 10, lat: 50.8, lon: 13.7 },
      { name: 'Schramberg', brands: ['Junghans'], count: 4, lat: 48.2, lon: 8.4 },
    ],
  },
  France: {
    id: 'france',
    name: 'France',
    flag: '🇫🇷',
    flagBg: 'bg-purple-600',
    title: 'Parisian Elegance & Haute Horlogerie',
    color: '#a855f7',
    lat: 46.6,
    lon: 2.2,
    description: 'Rich horological jewelry design blending timeless Parisian elegance with fine Swiss calibres.',
    companiesCount: '10+',
    companiesNum: 10,
    brandsCount: '25+',
    keyHubs: 'Paris, Besançon, Morteau',
    brandsSummary: '(Cartier, Hermès, Bell & Ross)',
    tagline: 'Fashion & Luxury',
    annualProduction: '8 Million Watches',
    exportValue: '$1.9 Billion',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    cities: [
      { name: 'Paris', brands: ['Cartier', 'Hermès', 'Bell & Ross'], count: 7, lat: 48.8, lon: 2.3 },
      { name: 'Besançon', brands: ['YEMA'], count: 3, lat: 47.2, lon: 6.0 },
    ],
  },
  Japan: {
    id: 'japan',
    name: 'Japan',
    flag: '🇯🇵',
    flagBg: 'bg-rose-600',
    title: 'Quartz & Tech Innovation Pioneer',
    color: '#f43f5e',
    lat: 36.2,
    lon: 138.2,
    description: 'Pioneered quartz timing, Solar Eco-Drive, Grand Seiko Spring Drive, and ultra-durable shock engineering.',
    companiesCount: '22+',
    companiesNum: 22,
    brandsCount: '45+',
    keyHubs: 'Tokyo, Yamagata, Shiojiri',
    brandsSummary: '(Seiko, Citizen, Casio)',
    tagline: 'Quartz & Tech',
    annualProduction: '65 Million Watches',
    exportValue: '$3.8 Billion',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    cities: [
      { name: 'Tokyo', brands: ['Seiko', 'Citizen', 'Casio'], count: 14, lat: 35.6, lon: 139.6 },
      { name: 'Yamagata', brands: ['Seiko Premium', 'Casio MR-G Line'], count: 5, lat: 38.2, lon: 140.3 },
      { name: 'Shiojiri', brands: ['Grand Seiko Spring Drive Studio'], count: 3, lat: 36.1, lon: 137.9 },
    ],
  },
  India: {
    id: 'india',
    name: 'India',
    flag: '🇮🇳',
    flagBg: 'bg-emerald-600',
    title: 'Slim Ceramic & Smartwatch Hub',
    color: '#10b981',
    lat: 20.5,
    lon: 78.9,
    description: 'Specialists in the world’s slimmest ceramic quartz movements (Titan Edge) and modern smart wearables.',
    companiesCount: '8+',
    companiesNum: 8,
    brandsCount: '20+',
    keyHubs: 'Hosur (Tamil Nadu), Bangalore, Roorkee',
    brandsSummary: '(Titan, Titan Edge, HMT)',
    tagline: 'Affordable & Smartwatches',
    annualProduction: '25 Million Watches',
    exportValue: '$850 Million',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80',
    cities: [
      { name: 'Hosur', brands: ['Titan', 'Titan Edge', 'Titan Raga', 'Fastrack'], count: 5, lat: 12.7, lon: 77.8 },
      { name: 'Bangalore', brands: ['Titan Smartwearables', 'HMT Heritage'], count: 3, lat: 12.9, lon: 77.5 },
    ],
  },
  China: {
    id: 'china',
    name: 'China',
    flag: '🇨🇳',
    flagBg: 'bg-orange-600',
    title: 'Global High-Volume Manufacturing Hub',
    color: '#ea580c',
    lat: 35.8,
    lon: 104.1,
    description: 'Mass mechanical movement manufacturing, multi-axis micro-machining, and advanced sapphire crystal production.',
    companiesCount: '28+',
    companiesNum: 28,
    brandsCount: '50+',
    keyHubs: 'Shenzhen, Tianjin, Guangzhou',
    brandsSummary: '(Sea-Gull, Beijing Watch)',
    tagline: 'Mass Manufacturing',
    annualProduction: '650 Million Watches & Movements',
    exportValue: '$5.6 Billion',
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80',
    cities: [
      { name: 'Shenzhen', brands: ['Casio Facility', 'Smartwatch Assembly'], count: 18, lat: 22.5, lon: 114.0 },
      { name: 'Tianjin', brands: ['Sea-Gull Chronograph movements'], count: 6, lat: 39.3, lon: 117.3 },
    ],
  },
  USA: {
    id: 'usa',
    name: 'USA',
    flag: '🇺🇸',
    flagBg: 'bg-sky-600',
    title: 'American Design & Smart Wearables',
    color: '#0284c7',
    lat: 37.0,
    lon: -95.7,
    description: 'Pioneers of connected smart wearables, American heritage military field watches and lifestyle fashion timepieces.',
    companiesCount: '12+',
    companiesNum: 12,
    brandsCount: '30+',
    keyHubs: 'Cupertino (CA), Dallas (TX), Middlebury (CT)',
    brandsSummary: '(Apple Watch, Timex, Fossil)',
    tagline: 'Design & Assembly',
    annualProduction: '45 Million Watches',
    exportValue: '$4.2 Billion',
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80',
    cities: [
      { name: 'Cupertino', brands: ['Apple Watch Ultra', 'Apple Watch Series'], count: 6, lat: 37.3, lon: -122.0 },
      { name: 'Dallas', brands: ['Fossil Group Inc.'], count: 4, lat: 32.9, lon: -96.7 },
    ],
  },
  Canada: {
    id: 'canada',
    name: 'Canada',
    flag: '🇨🇦',
    flagBg: 'bg-cyan-600',
    title: 'Arctic Tactical & Search-Rescue Timepieces',
    color: '#0891b2',
    lat: 56.1,
    lon: -106.3,
    description: 'Producers of military search-and-rescue divers watches featuring self-luminous tritium tubes.',
    companiesCount: '5+',
    companiesNum: 5,
    brandsCount: '10+',
    keyHubs: 'Toronto, Montreal, Vancouver',
    brandsSummary: '(Marathon Watch Co.)',
    tagline: 'Design & Assembly',
    annualProduction: '1.5 Million Watches',
    exportValue: '$320 Million',
    image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=800&q=80',
    cities: [
      { name: 'Toronto', brands: ['Marathon Watch Co.'], count: 3, lat: 43.6, lon: -79.3 },
    ],
  },
  'Hong Kong': {
    id: 'hong_kong',
    name: 'Hong Kong',
    flag: '🇭🇰',
    flagBg: 'bg-indigo-600',
    title: 'Horology Logistics & Movement Export Gateway',
    color: '#4f46e5',
    lat: 22.3,
    lon: 114.1,
    description: 'International horology logistics gateway, micro-tourbillon assembly and export hub.',
    companiesCount: '6+',
    companiesNum: 6,
    brandsCount: '15+',
    keyHubs: 'Kowloon, Kwun Tong',
    brandsSummary: '(Memorigin, Anicorn)',
    tagline: 'Assembly & Export',
    annualProduction: '80 Million Watches',
    exportValue: '$7.1 Billion',
    image: 'https://images.unsplash.com/photo-1506970845346-22b0153921b7?auto=format&fit=crop&w=800&q=80',
    cities: [
      { name: 'Kowloon', brands: ['Memorigin Tourbillon', 'Anicorn'], count: 6, lat: 22.3, lon: 114.1 },
    ],
  },
};

// Simplified Geographic Continent Polygons for 3D Globe Projection
const CONTINENT_POLYGONS = [
  // Europe
  [
    { lat: 36, lon: -9 }, { lat: 43, lon: -9 }, { lat: 48, lon: -4 }, { lat: 55, lon: 8 },
    { lat: 58, lon: 15 }, { lat: 68, lon: 25 }, { lat: 60, lon: 32 }, { lat: 45, lon: 30 },
    { lat: 40, lon: 26 }, { lat: 36, lon: 22 }, { lat: 38, lon: 15 }, { lat: 43, lon: 5 },
    { lat: 36, lon: -5 },
  ],
  // Asia
  [
    { lat: 45, lon: 30 }, { lat: 60, lon: 32 }, { lat: 70, lon: 70 }, { lat: 72, lon: 130 },
    { lat: 60, lon: 160 }, { lat: 40, lon: 140 }, { lat: 30, lon: 122 }, { lat: 20, lon: 108 },
    { lat: 10, lon: 102 }, { lat: 8, lon: 77 }, { lat: 22, lon: 68 }, { lat: 28, lon: 50 },
    { lat: 38, lon: 45 },
  ],
  // Africa
  [
    { lat: 36, lon: -5 }, { lat: 32, lon: 32 }, { lat: 12, lon: 51 }, { lat: -5, lon: 40 },
    { lat: -25, lon: 33 }, { lat: -34, lon: 20 }, { lat: -15, lon: 12 }, { lat: 5, lon: 8 },
    { lat: 15, lon: -17 }, { lat: 28, lon: -12 },
  ],
  // North America
  [
    { lat: 15, lon: -92 }, { lat: 25, lon: -80 }, { lat: 35, lon: -75 }, { lat: 45, lon: -65 },
    { lat: 55, lon: -58 }, { lat: 70, lon: -70 }, { lat: 72, lon: -125 }, { lat: 60, lon: -140 },
    { lat: 50, lon: -125 }, { lat: 32, lon: -117 }, { lat: 20, lon: -105 },
  ],
  // South America
  [
    { lat: 12, lon: -72 }, { lat: -5, lon: -35 }, { lat: -23, lon: -43 }, { lat: -38, lon: -57 },
    { lat: -54, lon: -68 }, { lat: -40, lon: -73 }, { lat: -18, lon: -70 }, { lat: 0, lon: -80 },
  ],
  // Australia
  [
    { lat: -12, lon: 130 }, { lat: -15, lon: 145 }, { lat: -28, lon: 153 }, { lat: -38, lon: 145 },
    { lat: -35, lon: 118 }, { lat: -22, lon: 114 },
  ],
];

// Top Watch Companies Data
export const COMPANIES_DATA = [
  {
    id: 'rolex_sa',
    name: 'Rolex SA',
    country: 'Switzerland',
    city: 'Geneva',
    flag: '🇨🇭',
    brandCount: 1,
    brands: ['Rolex'],
    founded: '1905',
    headquarters: 'Geneva, Switzerland',
    type: 'Full In-House Manufacture (Movements, Cases, Testing)',
    facilities: 'Geneva (Acacias, Chêne-Bourg, Plan-les-Ouates) & Biel/Bienne (Movements)',
    website: 'https://www.rolex.com',
    heroWatch: {
      name: 'Rolex Submariner Date 41mm',
      image: 'https://images.unsplash.com/photo-1526045431048-f857369baa09?auto=format&fit=crop&w=600&q=80',
    },
    workforce: '14,000+ Employees',
    annualCapacity: '1.2 Million Watches/Year',
    verified: true,
  },
  {
    id: 'swatch_group',
    name: 'The Swatch Group AG',
    country: 'Switzerland',
    city: 'Biel/Bienne',
    flag: '🇨🇭',
    brandCount: 17,
    brands: ['Omega', 'Longines', 'Tissot', 'Breguet', 'Blancpain', 'Rado', 'Hamilton', 'Swatch'],
    founded: '1983',
    headquarters: 'Biel/Bienne, Switzerland',
    type: 'Horological Conglomerate & ETA Calibre Manufacturer',
    facilities: 'Biel/Bienne, Le Locle, Saint-Imier, Grenchen',
    website: 'https://www.swatchgroup.com',
    heroWatch: {
      name: 'Omega Speedmaster Moonwatch',
      image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80',
    },
    workforce: '31,000+ Employees',
    annualCapacity: '15 Million Movements/Year',
    verified: true,
  },
  {
    id: 'omega_sa',
    name: 'Omega SA',
    country: 'Switzerland',
    city: 'Biel/Bienne',
    flag: '🇨🇭',
    brandCount: 1,
    brands: ['Omega'],
    founded: '1848',
    headquarters: 'Biel/Bienne, Switzerland',
    type: 'Master Chronometer & Co-Axial Escapement Facility',
    facilities: 'Biel Eco-Building (Designed by Shigeru Ban)',
    website: 'https://www.omegawatches.com',
    heroWatch: {
      name: 'Omega Seamaster Diver 300M Co-Axial',
      image: '/images/products/omega_speedmaster.jpg',
    },
    workforce: '2,500+ Specialists',
    annualCapacity: '500,000 Luxury Watches/Year',
    verified: true,
  },
  {
    id: 'seiko_group',
    name: 'Seiko Group Corp.',
    country: 'Japan',
    city: 'Tokyo',
    flag: '🇯🇵',
    brandCount: 4,
    brands: ['Seiko', 'Grand Seiko', 'Credor', 'Alba'],
    founded: '1881',
    headquarters: 'Tokyo, Japan',
    type: 'Integrated Manufacture (Mechanical, Quartz, Spring Drive)',
    facilities: 'Morioka (Mechanical), Shiojiri (Spring Drive), Yamagata (Precision)',
    website: 'https://www.seikowatches.com',
    heroWatch: {
      name: 'Grand Seiko Snowflake Spring Drive',
      image: '/images/products/rolex_daytona.jpg',
    },
    workforce: '12,000+ Employees',
    annualCapacity: '10 Million Watches/Year',
    verified: true,
  },
  {
    id: 'titan_company',
    name: 'Titan Company Ltd.',
    country: 'India',
    city: 'Hosur',
    flag: '🇮🇳',
    brandCount: 4,
    brands: ['Titan', 'Titan Edge', 'Fastrack', 'Nebula Gold'],
    founded: '1984',
    headquarters: 'Hosur, Tamil Nadu / Bangalore, India',
    type: 'Full Watch Case, Movement & Filigree Assembly Plant',
    facilities: 'Hosur Integrated Plant (45 Acres), Roorkee, Pantnagar',
    website: 'https://www.titan.co.in',
    heroWatch: {
      name: 'Titan Edge Ceramic Slimmest Quartz',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    },
    workforce: '8,200+ Employees',
    annualCapacity: '16 Million Watches/Year',
    verified: true,
  },
];

// Manufacturing Hubs Table
export const MANUFACTURING_HUBS_DATA = [
  { id: 1, hub: 'La Chaux-de-Fonds', company: 'Rolex SA', country: 'Switzerland', flag: '🇨🇭', type: 'Manufacturing' },
  { id: 2, hub: 'Biel/Bienne', company: 'Omega SA', country: 'Switzerland', flag: '🇨🇭', type: 'Manufacturing' },
  { id: 3, hub: 'Geneva', company: 'Patek Philippe', country: 'Switzerland', flag: '🇨🇭', type: 'Haute Horlogerie' },
  { id: 4, hub: 'Glashütte', company: 'A. Lange & Söhne', country: 'Germany', flag: '🇩🇪', type: 'Manufacturing' },
  { id: 5, hub: 'Yamagata', company: 'Seiko Corp.', country: 'Japan', flag: '🇯🇵', type: 'Manufacturing' },
  { id: 6, hub: 'Hosur', company: 'Titan Company Ltd.', country: 'India', flag: '🇮🇳', type: 'Manufacturing' },
];

export const ManufacturingHubModule = () => {
  const { addToCart } = useCart();
  const [selectedCountry, setSelectedCountry] = useState('Switzerland');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(COMPANIES_DATA[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [addedWatchId, setAddedWatchId] = useState(null);

  // 3D ROTATING GLOBE STATES
  const [globeRotation, setGlobeRotation] = useState(-10); // Current longitude offset in degrees
  const [isRotating, setIsRotating] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const startRotation = useRef(0);

  const countryPills = [
    'All Countries',
    'Switzerland',
    'Japan',
    'Germany',
    'France',
    'India',
    'USA',
    'China',
    'Hong Kong',
  ];

  // Auto-Rotation Animation Loop (60 FPS smooth spin)
  useEffect(() => {
    let animId;
    const rotateStep = () => {
      if (isRotating && !isDragging) {
        setGlobeRotation((prev) => (prev + 0.35) % 360);
      }
      animId = requestAnimationFrame(rotateStep);
    };
    animId = requestAnimationFrame(rotateStep);
    return () => cancelAnimationFrame(animId);
  }, [isRotating, isDragging]);

  // Handle Drag to Rotate Globe
  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    startRotation.current = globeRotation;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX.current;
    setGlobeRotation((startRotation.current + deltaX * 0.5) % 360);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Active Country Data
  const activeCountryData = COUNTRIES_DATA[selectedCountry] || COUNTRIES_DATA['Switzerland'];

  // Project Spherical Coordinates (Lat/Lon) to 2D Orthographic (x, y, z)
  const project3D = (lat, lon, cx = 350, cy = 200, R = 155) => {
    const phi = (lat * Math.PI) / 180;
    const lambda = ((lon + globeRotation) * Math.PI) / 180;

    const x = cx + R * Math.cos(phi) * Math.sin(lambda);
    const y = cy - R * Math.sin(phi);
    const z = R * Math.cos(phi) * Math.cos(lambda);

    return { x, y, z, visible: z > -15 };
  };

  // Center Globe on Clicked Country
  const centerOnCountry = (cName) => {
    const cData = COUNTRIES_DATA[cName];
    if (cData) {
      setGlobeRotation((-cData.lon + 360) % 360);
    }
  };

  // Filter watches dynamically based on Selected Country AND/OR Selected City
  const countryAndCityWatches = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => {
      const b = p.brand.toLowerCase();
      let originCountry = 'Switzerland';
      let originCity = 'Geneva';

      if (b.includes('rolex') || b.includes('patek') || b.includes('audemars')) {
        originCountry = 'Switzerland';
        originCity = 'Geneva';
      } else if (b.includes('omega')) {
        originCountry = 'Switzerland';
        originCity = 'Biel/Bienne';
      } else if (b.includes('cartier')) {
        originCountry = selectedCountry === 'France' ? 'France' : 'Switzerland';
        originCity = selectedCountry === 'France' ? 'Paris' : 'Geneva';
      } else if (b.includes('tag heuer') || b.includes('breitling')) {
        originCountry = 'Switzerland';
        originCity = 'La Chaux-de-Fonds';
      } else if (b.includes('tissot')) {
        originCountry = 'Switzerland';
        originCity = 'Le Locle';
      } else if (b.includes('lange') || b.includes('nomos') || b.includes('junghans')) {
        originCountry = 'Germany';
        originCity = 'Glashütte';
      } else if (b.includes('seiko') || b.includes('citizen')) {
        originCountry = 'Japan';
        originCity = 'Tokyo';
      } else if (b.includes('casio') || b.includes('g-shock')) {
        originCountry = selectedCountry === 'China' ? 'China' : 'Japan';
        originCity = selectedCountry === 'China' ? 'Shenzhen' : 'Yamagata';
      } else if (b.includes('titan') || b.includes('fastrack')) {
        originCountry = 'India';
        originCity = 'Hosur';
      } else if (b.includes('fossil') || b.includes('apple') || b.includes('garmin')) {
        originCountry = 'USA';
        originCity = 'Cupertino';
      }

      const matchCountry =
        selectedCountry === 'All Countries' ||
        originCountry.toLowerCase() === selectedCountry.toLowerCase();

      const matchCity =
        !selectedCity ||
        originCity.toLowerCase() === selectedCity.toLowerCase();

      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        originCountry.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCountry && matchCity && matchSearch;
    });
  }, [selectedCountry, selectedCity, searchQuery]);

  const handleCountrySelect = (cName) => {
    setSelectedCity('');
    if (cName === 'All Countries') {
      setSelectedCountry('All Countries');
      return;
    }
    setSelectedCountry(cName);
    centerOnCountry(cName);
    const comp = COMPANIES_DATA.find((c) => c.country.toLowerCase() === cName.toLowerCase());
    if (comp) setSelectedCompany(comp);
  };

  const handleCitySelect = (cityName, countryName) => {
    if (countryName && COUNTRIES_DATA[countryName]) {
      setSelectedCountry(countryName);
      centerOnCountry(countryName);
    }
    setSelectedCity(cityName);
  };

  const handleAddToCart = (watch) => {
    addToCart(watch);
    setAddedWatchId(watch.id);
    setTimeout(() => setAddedWatchId(null), 1800);
  };

  return (
    <div className="space-y-6 font-poppins text-gray-900 max-w-full">
      {/* 1. Clean White Header Bar */}
      <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Left Branding */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-watch-gold to-amber-500 text-watch-navy-dark flex items-center justify-center text-xl shadow-md font-bold">
            <Globe className="w-6 h-6 stroke-watch-navy-dark" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
              Global Watch Manufacturing & 3D Interactive Hub
            </h2>
            <p className="text-xs text-gray-500">
              Explore watch brands, manufacturing origins and company facilities across the world.
            </p>
          </div>
        </div>

        {/* Search & Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search brand, company, country..."
              className="w-full h-9 pl-9 pr-3 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 placeholder-gray-400 outline-none focus:border-watch-gold focus:bg-white transition-all font-medium"
            />
          </div>

          {/* 3D Spin / Pause Button */}
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 text-xs border transition-all ${
              isRotating
                ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-sm'
                : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
            }`}
          >
            {isRotating ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-600" />
                <span>Spinning (Pause)</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-600" />
                <span>Auto-Spin Globe</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Top Interactive Section: 5 Clean White KPIs (Left) + 3D Realistic Globe (Center) + Country Spotlight (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: 5 Clean White KPI Cards */}
        <div className="lg:col-span-2 flex flex-col justify-between gap-3">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-500 uppercase">Total Brands</span>
              <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs font-bold">
                ⌚
              </span>
            </div>
            <p className="text-xl font-black text-gray-900 mt-1">1,250+</p>
            <p className="text-[10.5px] text-emerald-600 font-bold mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active Global Brands
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-500 uppercase">Watch Companies</span>
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                🏢
              </span>
            </div>
            <p className="text-xl font-black text-gray-900 mt-1">540+</p>
            <p className="text-[10.5px] text-gray-500 font-medium mt-0.5">Independent & Groups</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-500 uppercase">Manufacturing Hubs</span>
              <span className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-xs font-bold">
                🏭
              </span>
            </div>
            <p className="text-xl font-black text-gray-900 mt-1">120+</p>
            <p className="text-[10.5px] text-gray-500 font-medium mt-0.5">Specialized Factories</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-500 uppercase">Countries</span>
              <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold">
                🌐
              </span>
            </div>
            <p className="text-xl font-black text-gray-900 mt-1">32</p>
            <p className="text-[10.5px] text-gray-500 font-medium mt-0.5">Horological Centers</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-500 uppercase">Annual Production</span>
              <span className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-bold">
                📦
              </span>
            </div>
            <p className="text-xl font-black text-gray-900 mt-1">~1.2 Billion</p>
            <p className="text-[10.5px] text-amber-700 font-bold mt-0.5">Watches & Calibres/Yr</p>
          </div>
        </div>

        {/* Center: 3D REALISTIC ROTATING SPHERICAL GLOBE CANVAS */}
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="lg:col-span-7 bg-white border border-gray-200 rounded-3xl relative overflow-hidden shadow-sm flex flex-col justify-between min-h-[440px] max-h-[480px] cursor-grab active:cursor-grabbing select-none"
        >
          {/* Top Status & Active Filter Pill */}
          <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-gray-200 text-xs shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-gray-500 font-medium">3D Interactive Globe:</span>
            <span className="font-extrabold text-gray-900">
              {activeCountryData.flag} {selectedCountry} {selectedCity ? `› ${selectedCity}` : ''}
            </span>
            <span className="text-[10px] text-gray-400 border-l border-gray-200 pl-2">
              (Drag to rotate)
            </span>
          </div>

          {/* Map Controls */}
          <div className="absolute top-3.5 right-3.5 z-20 flex flex-col gap-1.5">
            <button
              onClick={() => setIsRotating(!isRotating)}
              className="w-8 h-8 rounded-xl bg-white hover:bg-watch-gold hover:text-watch-navy-dark border border-gray-200 flex items-center justify-center text-xs font-bold transition-all shadow-sm"
              title="Toggle Auto Rotation"
            >
              {isRotating ? '⏸' : '▶'}
            </button>
            <button
              onClick={() => {
                setGlobeRotation(-10);
                setSelectedCity('');
              }}
              className="w-8 h-8 rounded-xl bg-white hover:bg-watch-gold hover:text-watch-navy-dark border border-gray-200 flex items-center justify-center text-xs font-bold transition-all shadow-sm"
              title="Reset Rotation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* SVG 3D SPHERE GLOBE CANVAS */}
          <div className="w-full flex-1 relative flex items-center justify-center p-2">
            <svg viewBox="0 0 700 400" className="w-full h-full max-h-[400px]">
              <defs>
                {/* 3D Oceanic Sphere Shading */}
                <radialGradient id="globeLightingClean" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#dbeafe" />
                  <stop offset="40%" stopColor="#bfdbfe" />
                  <stop offset="80%" stopColor="#93c5fd" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </radialGradient>

                {/* Soft Atmospheric Glow Rim */}
                <radialGradient id="atmosphereGlowClean" cx="50%" cy="50%" r="50%">
                  <stop offset="82%" stopColor="transparent" />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.45" />
                </radialGradient>

                {/* Drop shadow for pins */}
                <filter id="pinShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.25" />
                </filter>
              </defs>

              {/* Sphere Outer Shadow */}
              <circle cx="350" cy="200" r="158" fill="#e2e8f0" opacity="0.6" />

              {/* 3D SPHERE BASE (Crisp Azure Clean Oceans) */}
              <circle cx="350" cy="200" r="155" fill="url(#globeLightingClean)" stroke="#93c5fd" strokeWidth="1.5" />
              <circle cx="350" cy="200" r="155" fill="url(#atmosphereGlowClean)" />

              {/* ROTATING LATITUDE & LONGITUDE RINGS ON SPHERE */}
              <g stroke="#93c5fd" strokeWidth="0.8" fill="none" opacity="0.5">
                {/* Latitude Ellipses */}
                {[-60, -30, 0, 30, 60].map((lat) => {
                  const y = 200 - 155 * Math.sin((lat * Math.PI) / 180);
                  const rx = 155 * Math.cos((lat * Math.PI) / 180);
                  return <ellipse key={lat} cx="350" cy={y} rx={rx} ry={rx * 0.25} />;
                })}

                {/* Rotating Longitude Arcs */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((lon) => {
                  const rot = ((lon + globeRotation) * Math.PI) / 180;
                  const cosR = Math.cos(rot);
                  return (
                    <ellipse
                      key={lon}
                      cx="350"
                      cy="200"
                      rx={Math.abs(155 * cosR)}
                      ry="155"
                      opacity={cosR >= 0 ? '0.6' : '0.15'}
                    />
                  );
                })}
              </g>

              {/* ROTATING CONTINENTS ON SPHERE (Clean Emerald & Jade Landmasses) */}
              <g>
                {CONTINENT_POLYGONS.map((poly, idx) => {
                  const pts = poly.map((pt) => project3D(pt.lat, pt.lon, 350, 200, 155));
                  const visibleCount = pts.filter((p) => p.z > -10).length;
                  if (visibleCount < 3) return null;

                  const pathStr =
                    'M ' +
                    pts
                      .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
                      .join(' L ') +
                    ' Z';

                  return (
                    <path
                      key={idx}
                      d={pathStr}
                      fill="#86efac"
                      stroke="#22c55e"
                      strokeWidth="1.2"
                      opacity="0.9"
                    />
                  );
                })}
              </g>

              {/* ROTATING MANUFACTURING HUBS & COUNTRY MARKERS */}
              {Object.keys(COUNTRIES_DATA).map((cName) => {
                const cData = COUNTRIES_DATA[cName];
                const proj = project3D(cData.lat, cData.lon, 350, 200, 155);

                // Only render if marker is on the front facing side of globe
                if (!proj.visible || proj.z < 0) return null;

                const isSelected = selectedCountry.toLowerCase() === cData.name.toLowerCase();

                return (
                  <g
                    key={cData.id}
                    onClick={() => handleCountrySelect(cData.name)}
                    className="cursor-pointer transition-transform hover:scale-110"
                    filter="url(#pinShadow)"
                  >
                    {/* Pulsating ring on selected */}
                    {isSelected && (
                      <circle
                        cx={proj.x}
                        cy={proj.y}
                        r="14"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2"
                        className="animate-ping"
                        opacity="0.75"
                      />
                    )}

                    {/* Outer Pin Dot */}
                    <circle
                      cx={proj.x}
                      cy={proj.y}
                      r={isSelected ? '9' : '6.5'}
                      fill={isSelected ? '#101C2B' : cData.color}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />

                    {/* Flag Tooltip Box */}
                    <foreignObject
                      x={proj.x + 8}
                      y={proj.y - 18}
                      width="130"
                      height="38"
                      className="pointer-events-none"
                    >
                      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-md rounded-lg px-2 py-0.5 flex items-center gap-1.5 w-fit">
                        <span className="text-xs">{cData.flag}</span>
                        <div className="leading-tight">
                          <span className="text-[10px] font-black text-gray-900 block">{cData.name}</span>
                          <span className="text-[8.5px] font-extrabold text-amber-700 block">
                            {cData.companiesNum} Companies
                          </span>
                        </div>
                      </div>
                    </foreignObject>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom City Selector Pills for the Active Country */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-t border-gray-200 overflow-x-auto scrollbar-none z-10">
            <span className="text-[11px] font-bold text-gray-500 whitespace-nowrap flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-watch-gold" /> {activeCountryData.name} Cities:
            </span>
            <button
              onClick={() => setSelectedCity('')}
              className={`text-[10.5px] px-3 py-1 rounded-lg font-bold transition-all whitespace-nowrap ${
                !selectedCity ? 'bg-watch-navy-dark text-white shadow' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              All Cities
            </button>
            {activeCountryData.cities?.map((ct) => (
              <button
                key={ct.name}
                onClick={() => handleCitySelect(ct.name, activeCountryData.name)}
                className={`text-[10.5px] px-3 py-1 rounded-lg font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCity.toLowerCase() === ct.name.toLowerCase()
                    ? 'bg-watch-gold text-watch-navy-dark shadow font-black scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span>📍 {ct.name}</span>
                <span className="text-[9px] text-gray-500">({ct.brands.join(', ')})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Clean White Featured Country Spotlight Card */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between">
          <div className="relative h-44 overflow-hidden">
            <img
              src={activeCountryData.image}
              alt={activeCountryData.name}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute top-3 right-3 text-2xl drop-shadow w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center border border-gray-200">
              {activeCountryData.flag}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            <div className="absolute bottom-3 left-4 right-4">
              <h3 className="text-xl font-black text-white tracking-tight">
                {activeCountryData.name}
              </h3>
              <p className="text-xs font-bold text-watch-gold">
                — {activeCountryData.title}
              </p>
            </div>
          </div>

          <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
            <p className="text-xs text-gray-600 leading-relaxed">
              {activeCountryData.description}
            </p>

            <div className="space-y-2.5 text-xs bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 flex items-center gap-1.5 font-medium">
                  <Building2 className="w-4 h-4 text-watch-gold" /> Companies:
                </span>
                <span className="font-extrabold text-gray-900">{activeCountryData.companiesCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 flex items-center gap-1.5 font-medium">
                  <span>🏷️</span> Active Brands:
                </span>
                <span className="font-extrabold text-gray-900">{activeCountryData.brandsCount}</span>
              </div>
              <div className="flex items-start justify-between pt-1 border-t border-gray-200">
                <span className="text-gray-500 flex items-center gap-1.5 font-medium">
                  <MapPin className="w-4 h-4 text-watch-gold" /> Key Hubs:
                </span>
                <span className="font-bold text-gray-800 text-right text-[11px] max-w-[130px] truncate">
                  {activeCountryData.keyHubs}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                alert(`Showing ${countryAndCityWatches.length} authentic timepieces manufactured in ${activeCountryData.name}.`);
              }}
              className="w-full btn-gold py-2.5 px-4 rounded-xl font-extrabold text-xs shadow-sm flex items-center justify-center gap-1.5"
            >
              Explore {activeCountryData.name} ({countryAndCityWatches.length} Models) →
            </button>
          </div>
        </div>
      </div>

      {/* 3. Horizontal Country Pills Filter Bar (Clean White) */}
      <div className="bg-white border border-gray-200 p-2 rounded-2xl flex items-center gap-2 overflow-x-auto scrollbar-none shadow-sm">
        {countryPills.map((pill) => {
          const isActive = selectedCountry.toLowerCase() === pill.toLowerCase() || (pill === 'All Countries' && selectedCountry === 'All Countries');
          const cObj = COUNTRIES_DATA[pill];
          return (
            <button
              key={pill}
              onClick={() => handleCountrySelect(pill)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                isActive
                  ? 'bg-watch-navy-dark text-white shadow-sm'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cObj && <span>{cObj.flag}</span>}
              {pill === 'All Countries' && <Globe className="w-3.5 h-3.5" />}
              <span>{pill}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Bottom 3-Column Section (Companies, Hubs & Company Watch Spotlight) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Column 1: Top Watch Companies */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <h3 className="text-xs font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-watch-gold" /> Top Watch Companies (Global)
              </h3>
              <button
                onClick={() => setSelectedCountry('All Countries')}
                className="text-[11px] text-blue-600 font-semibold hover:underline"
              >
                View All →
              </button>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {COMPANIES_DATA.map((comp) => {
                const isSelected = selectedCompany.id === comp.id;
                return (
                  <div
                    key={comp.id}
                    onClick={() => {
                      setSelectedCompany(comp);
                      if (comp.country && COUNTRIES_DATA[comp.country]) {
                        setSelectedCountry(comp.country);
                        setSelectedCity(comp.city || '');
                        centerOnCountry(comp.country);
                      }
                    }}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-watch-gold bg-amber-50/50 shadow-sm'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{comp.flag}</span>
                        <div>
                          <h4 className="text-xs font-bold text-gray-900">{comp.name}</h4>
                          <span className="text-[10.5px] text-gray-500 font-medium">
                            {comp.headquarters}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                        {comp.brandCount} Brand{comp.brandCount > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Column 2: Manufacturing Facilities Table */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <h3 className="text-xs font-bold text-gray-900 flex items-center gap-2">
                <Factory className="w-4 h-4 text-watch-gold" /> Key Manufacturing Hubs (32)
              </h3>
              <span className="text-[10px] text-gray-400 font-medium">ISO 9001 Certified</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] text-gray-400 uppercase">
                    <th className="pb-2 font-bold">Hub / Facility</th>
                    <th className="pb-2 font-bold">Company</th>
                    <th className="pb-2 font-bold">Country</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MANUFACTURING_HUBS_DATA.map((hub) => (
                    <tr
                      key={hub.id}
                      onClick={() => {
                        handleCountrySelect(hub.country);
                        setSelectedCity(hub.hub);
                      }}
                      className="hover:bg-amber-50/50 cursor-pointer transition-colors"
                    >
                      <td className="py-2.5 font-bold text-gray-900 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {hub.hub}
                      </td>
                      <td className="py-2.5 text-gray-700 font-medium">{hub.company}</td>
                      <td className="py-2.5">
                        <span className="font-semibold text-gray-800 flex items-center gap-1">
                          <span>{hub.flag}</span>
                          <span>{hub.country}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Column 3: Featured Company Watch Card (Matching Reference UI Split Design) */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            {/* Split Top: Watch Picture Left + Company Info Right */}
            <div className="flex gap-4 items-start pb-3 border-b border-gray-100">
              {/* Left: Watch Photo */}
              <div className="w-24 h-28 bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden flex items-center justify-center p-1.5 flex-shrink-0 shadow-inner">
                <img
                  src={selectedCompany.heroWatch?.image || 'https://images.unsplash.com/photo-1526045431048-f857369baa09?auto=format&fit=crop&w=600&q=80'}
                  alt={selectedCompany.name}
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/ref_crops/hero-watch-center.jpg';
                  }}
                />
              </div>

              {/* Right: Company Header */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-lg bg-watch-navy-dark text-watch-gold flex items-center justify-center font-bold text-xs">
                    👑
                  </div>
                  <h4 className="text-sm font-black text-gray-900 truncate">{selectedCompany.name}</h4>
                  <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded font-bold">
                    ✔
                  </span>
                </div>
                <p className="text-[10.5px] text-gray-500 mt-0.5">Luxury Watch Manufacturer</p>
                <div className="mt-2 text-[10.5px] text-gray-600 space-y-0.5">
                  <p><span className="text-gray-400">HQ:</span> <strong className="text-gray-800">{selectedCompany.headquarters}</strong></p>
                  <p><span className="text-gray-400">Founded:</span> <strong className="text-gray-800">{selectedCompany.founded}</strong></p>
                  <p><span className="text-gray-400">Brand:</span> <strong className="text-watch-gold">{selectedCompany.brands[0]}</strong></p>
                </div>
              </div>
            </div>

            {/* Middle Specs */}
            <div className="py-2.5 text-[11px] text-gray-600 space-y-1">
              <p><span className="text-gray-400">Facilities:</span> {selectedCompany.facilities}</p>
              <p><span className="text-gray-400">Type:</span> {selectedCompany.type}</p>
              <p><span className="text-gray-400">Website:</span> <a href={selectedCompany.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{selectedCompany.website.replace('https://', '')}</a></p>
            </div>
          </div>

          {/* Bottom Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
            <a
              href={selectedCompany.website}
              target="_blank"
              rel="noreferrer"
              className="btn-gold py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1 shadow-sm text-center"
            >
              View Company →
            </a>
            <button
              onClick={() => handleCountrySelect(selectedCompany.country)}
              className="py-2 px-3 bg-watch-navy-dark hover:bg-black text-white rounded-xl font-bold text-xs flex items-center justify-center text-center transition-colors"
            >
              View All Brands ({selectedCompany.brandCount})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManufacturingHubModule;
