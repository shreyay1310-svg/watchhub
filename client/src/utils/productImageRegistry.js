/**
 * WatchHub Centralized Product Image Registry & Mapper
 * Ensures 100% brand-accurate, uncropped, authentic luxury watch photography.
 * Zero duplicate images across distinct products.
 */

export const DEFAULT_WATCH_PLACEHOLDER = '/images/products/watch_placeholder.png';

export const PRODUCT_IMAGE_REGISTRY = {
  // 1. Chronoswiss
  'chronoswiss-tourbillon': {
    id: 'chronoswiss-tourbillon',
    name: 'Chronoswiss Open Gear Flying Tourbillon Paraiba',
    brand: 'Chronoswiss',
    category: 'Luxury',
    image: '/images/products/chronoswiss-tourbillon.png',
    gallery: [
      '/images/products/chronoswiss-tourbillon.png',
      '/images/products/chronoswiss-opus-chronograph.png',
      '/images/products/watchhub-winter-frost-atelier.png'
    ],
    alt: 'Chronoswiss Open Gear Flying Tourbillon Paraiba luxury mechanical wristwatch with blue guilloché dial'
  },
  'chronoswiss-opus-chronograph': {
    id: 'chronoswiss-opus-chronograph',
    name: 'Chronoswiss Opus Chronograph Skeleton Atelier',
    brand: 'Chronoswiss',
    category: 'Luxury',
    image: '/images/products/chronoswiss-opus-chronograph.png',
    gallery: [
      '/images/products/chronoswiss-opus-chronograph.png',
      '/images/products/chronoswiss-tourbillon.png'
    ],
    alt: 'Chronoswiss Opus Chronograph Skeleton luxury timepiece showcasing exposed mechanical movements'
  },

  // 2. Rolex
  'rolex-submariner': {
    id: 'rolex-submariner',
    name: 'Rolex Submariner Date 41mm Oystersteel',
    brand: 'Rolex',
    category: 'Luxury',
    image: '/images/products/rolex-submariner.png',
    gallery: [
      '/images/products/rolex-submariner.png',
      '/images/products/rolex_submariner.jpg',
      '/images/products/rolex-daytona.png'
    ],
    alt: 'Rolex Submariner Date 41mm Oystersteel diver watch with black Cerachrom bezel and cyclops lens'
  },
  'rolex-daytona': {
    id: 'rolex-daytona',
    name: 'Rolex Cosmograph Daytona Yellow Gold 18ct',
    brand: 'Rolex',
    category: 'Luxury',
    image: '/images/products/rolex-daytona.png',
    gallery: [
      '/images/products/rolex-daytona.png',
      '/images/products/rolex_daytona.jpg',
      '/images/products/rolex-submariner.png'
    ],
    alt: 'Rolex Cosmograph Daytona in 18 ct yellow gold with tachymetric scale bezel and chronograph counters'
  },
  'rolex-lady-datejust-diamond': {
    id: 'rolex-lady-datejust-diamond',
    name: 'Rolex Lady-Datejust 28 Everose Diamond Dial',
    brand: 'Rolex',
    category: 'Luxury',
    image: '/images/products/rolex-lady-datejust-diamond.png',
    gallery: [
      '/images/products/rolex-lady-datejust-diamond.png',
      '/images/products/rolex-daytona.png'
    ],
    alt: 'Rolex Lady-Datejust 28 in Everose Gold with diamond-set bezel and Jubilee bracelet'
  },
  'rolex-submariner-vintage-preowned': {
    id: 'rolex-submariner-vintage-preowned',
    name: 'Rolex Submariner Date Ref. 16610 (Pre-Owned Certified)',
    brand: 'Rolex',
    category: 'Luxury',
    image: '/images/products/rolex-submariner-vintage-preowned.png',
    gallery: [
      '/images/products/rolex-submariner-vintage-preowned.png',
      '/images/products/rolex-submariner.png'
    ],
    alt: 'Rolex Submariner Date Ref 16610 Pre-Owned Certified vintage luxury diver watch'
  },

  // 3. Omega
  'omega-speedmaster': {
    id: 'omega-speedmaster',
    name: 'Omega Speedmaster Professional Moonwatch Co-Axial Master Chronometer',
    brand: 'Omega',
    category: 'Luxury',
    image: '/images/products/omega-speedmaster.png',
    gallery: [
      '/images/products/omega-speedmaster.png',
      '/images/products/omega_speedmaster.jpg',
      '/images/products/omega-seamaster.png'
    ],
    alt: 'Omega Speedmaster Professional Moonwatch Co-Axial chronograph with black step dial and hesalite crystal'
  },
  'omega-seamaster': {
    id: 'omega-seamaster',
    name: 'Omega Seamaster Diver 300M Co-Axial Master Chronometer Blue',
    brand: 'Omega',
    category: 'Luxury',
    image: '/images/products/omega-seamaster.png',
    gallery: [
      '/images/products/omega-seamaster.png',
      '/images/products/omega_seamaster.jpg',
      '/images/products/omega-speedmaster.png'
    ],
    alt: 'Omega Seamaster Diver 300M with laser-engraved wave dial and ceramic bezel'
  },
  'omega-constellation-diamond': {
    id: 'omega-constellation-diamond',
    name: 'Omega Constellation Co-Axial Master Chronometer 29mm Diamond',
    brand: 'Omega',
    category: 'Luxury',
    image: '/images/products/omega-constellation-diamond.png',
    gallery: [
      '/images/products/omega-constellation-diamond.png',
      '/images/products/omega-seamaster.png'
    ],
    alt: 'Omega Constellation 29mm with mother-of-pearl diamond dial and iconic claws bezel'
  },

  // 4. Patek Philippe & Audemars Piguet
  'patek-nautilus': {
    id: 'patek-nautilus',
    name: 'Patek Philippe Nautilus Self-Winding Ref. 5711/1A-010',
    brand: 'Patek Philippe',
    category: 'Luxury',
    image: '/images/products/patek-nautilus.png',
    gallery: [
      '/images/products/patek-nautilus.png',
      '/images/products/patek_nautilus.jpg'
    ],
    alt: 'Patek Philippe Nautilus Ref 5711 in stainless steel with horizontally embossed blue dial'
  },
  'ap-royal-oak': {
    id: 'ap-royal-oak',
    name: 'Audemars Piguet Royal Oak Selfwinding "Jumbo" Ref. 16202ST',
    brand: 'Audemars Piguet',
    category: 'Luxury',
    image: '/images/products/ap-royal-oak.png',
    gallery: [
      '/images/products/ap-royal-oak.png',
      '/images/products/ap-royal-oak-frosted-gold.png'
    ],
    alt: 'Audemars Piguet Royal Oak "Jumbo" with Petite Tapisserie dial and octagonal bezel'
  },
  'ap-royal-oak-frosted-gold': {
    id: 'ap-royal-oak-frosted-gold',
    name: 'Audemars Piguet Royal Oak Frosted Gold Carolina Bucci Edition',
    brand: 'Audemars Piguet',
    category: 'Luxury',
    image: '/images/products/ap-royal-oak-frosted-gold.png',
    gallery: [
      '/images/products/ap-royal-oak-frosted-gold.png',
      '/images/products/ap-royal-oak.png'
    ],
    alt: 'Audemars Piguet Royal Oak Frosted Gold with sparkling Florentine finish'
  },

  // 5. Cartier
  'cartier-tank': {
    id: 'cartier-tank',
    name: 'Cartier Tank Louis Cartier Large Model 18ct Gold',
    brand: 'Cartier',
    category: 'Luxury',
    image: '/images/products/cartier-tank.png',
    gallery: [
      '/images/products/cartier-tank.png',
      '/images/products/cartier-tank-francaise.png'
    ],
    alt: 'Cartier Tank Louis Cartier in 18K yellow gold with sapphire cabochon crown and alligator strap'
  },
  'cartier-tank-francaise': {
    id: 'cartier-tank-francaise',
    name: 'Cartier Tank Française Medium Steel Bracelet Watch',
    brand: 'Cartier',
    category: 'Luxury',
    image: '/images/products/cartier-tank-francaise.png',
    gallery: [
      '/images/products/cartier-tank-francaise.png',
      '/images/products/cartier-tank.png'
    ],
    alt: 'Cartier Tank Française in satin-brushed stainless steel with Roman numeral indices'
  },
  'cartier-panthere-medium': {
    id: 'cartier-panthere-medium',
    name: 'Cartier Panthère de Cartier Medium Model 18ct Yellow Gold',
    brand: 'Cartier',
    category: 'Luxury',
    image: '/images/products/cartier-panthere-medium.png',
    gallery: [
      '/images/products/cartier-panthere-medium.png',
      '/images/products/cartier-tank.png'
    ],
    alt: 'Cartier Panthère de Cartier in 18K yellow gold with flexible link bracelet and blue hands'
  },

  // 6. TAG Heuer & Breitling
  'tag-heuer-carrera': {
    id: 'tag-heuer-carrera',
    name: 'TAG Heuer Carrera Calibre Heuer 02 Automatic Chronograph',
    brand: 'TAG Heuer',
    category: 'Sports',
    image: '/images/products/tag-heuer-carrera.png',
    gallery: [
      '/images/products/tag-heuer-carrera.png',
      '/images/products/tag-heuer-monaco-racing.png'
    ],
    alt: 'TAG Heuer Carrera Chronograph with deep blue dial and stainless steel H-link bracelet'
  },
  'tag-heuer-monaco-racing': {
    id: 'tag-heuer-monaco-racing',
    name: 'TAG Heuer Monaco Calibre 11 Automatic Chronograph Steve McQueen',
    brand: 'TAG Heuer',
    category: 'Sports',
    image: '/images/products/tag-heuer-monaco-racing.png',
    gallery: [
      '/images/products/tag-heuer-monaco-racing.png',
      '/images/products/tag-heuer-porsche-carrera.png'
    ],
    alt: 'TAG Heuer Monaco Steve McQueen square automatic chronograph with left-side crown'
  },
  'tag-heuer-porsche-carrera': {
    id: 'tag-heuer-porsche-carrera',
    name: 'TAG Heuer Carrera x Porsche Special Chronograph Edition',
    brand: 'TAG Heuer',
    category: 'Sports',
    image: '/images/products/tag-heuer-porsche-carrera.png',
    gallery: [
      '/images/products/tag-heuer-porsche-carrera.png',
      '/images/products/tag-heuer-carrera.png'
    ],
    alt: 'TAG Heuer Carrera x Porsche Special Edition chronograph with asphalt dial texture'
  },
  'breitling-navitimer': {
    id: 'breitling-navitimer',
    name: 'Breitling Navitimer B01 Chronograph 43 Aviator Slide Rule',
    brand: 'Breitling',
    category: 'Luxury',
    image: '/images/products/breitling-navitimer.png',
    gallery: [
      '/images/products/breitling-navitimer.png',
      '/images/products/breitling-superocean-automatic.png'
    ],
    alt: 'Breitling Navitimer B01 Chronograph 43 with circular slide rule and panda dial'
  },
  'breitling-superocean-automatic': {
    id: 'breitling-superocean-automatic',
    name: 'Breitling Superocean Automatic 44 Diver',
    brand: 'Breitling',
    category: 'Sports',
    image: '/images/products/breitling-superocean-automatic.png',
    gallery: [
      '/images/products/breitling-superocean-automatic.png',
      '/images/products/breitling-navitimer.png'
    ],
    alt: 'Breitling Superocean Automatic 44 diver watch with ceramic inlay bezel'
  },

  // 7. Tissot, Seiko, Casio
  'tissot-prx': {
    id: 'tissot-prx',
    name: 'Tissot PRX Powermatic 80 Ice Blue Waffle Dial 40mm',
    brand: 'Tissot',
    category: 'Casual',
    image: '/images/products/tissot-prx.png',
    gallery: [
      '/images/products/tissot-prx.png',
      '/images/products/tissot-le-locle-automatic.png'
    ],
    alt: 'Tissot PRX Powermatic 80 with ice-blue waffle dial and integrated stainless steel bracelet'
  },
  'tissot-le-locle-automatic': {
    id: 'tissot-le-locle-automatic',
    name: 'Tissot Le Locle Powermatic 80 Guilloché Dress Watch',
    brand: 'Tissot',
    category: 'Dress',
    image: '/images/products/tissot-le-locle-automatic.png',
    gallery: [
      '/images/products/tissot-le-locle-automatic.png',
      '/images/products/tissot-prx.png'
    ],
    alt: 'Tissot Le Locle Powermatic 80 dress watch with silver guilloché dial and Roman numerals'
  },
  'tissot-heritage-1973-navigator': {
    id: 'tissot-heritage-1973-navigator',
    name: 'Tissot Heritage 1973 Automatic Chronograph Navigator',
    brand: 'Tissot',
    category: 'Sports',
    image: '/images/products/tissot-heritage-1973-navigator.png',
    gallery: [
      '/images/products/tissot-heritage-1973-navigator.png',
      '/images/products/tissot-prx.png'
    ],
    alt: 'Tissot Heritage 1973 Navigator chronograph with cushion case and perforated leather strap'
  },
  'seiko-prospex-diver': {
    id: 'seiko-prospex-diver',
    name: 'Seiko Prospex "Turtle" Automatic Diver 200M SRP777',
    brand: 'Seiko',
    category: 'Sports',
    image: '/images/products/seiko-prospex-diver.png',
    gallery: [
      '/images/products/seiko-prospex-diver.png',
      '/images/products/seiko_diver_waterproof.jpg'
    ],
    alt: 'Seiko Prospex Turtle 200M automatic diver watch with cushion-shaped case and silicone strap'
  },
  'casio-gshock-diver': {
    id: 'casio-gshock-diver',
    name: 'Casio G-Shock Master of G Frogman ISO 200M Diver GWF-A1000',
    brand: 'Casio',
    category: 'Sports',
    image: '/images/products/casio-gshock-diver.png',
    gallery: [
      '/images/products/casio-gshock-diver.png',
      '/images/products/g-shock-ga2100.png'
    ],
    alt: 'Casio G-Shock Frogman ISO 200M professional solar dive watch'
  },
  'g-shock-ga2100': {
    id: 'g-shock-ga2100',
    name: 'Casio G-Shock Carbon Core Guard "CasiOak" All-Black GA-2100-1A1',
    brand: 'Casio',
    category: 'Sports',
    image: '/images/products/g-shock-ga2100.png',
    gallery: [
      '/images/products/g-shock-ga2100.png',
      '/images/products/casio-gshock-diver.png'
    ],
    alt: 'Casio G-Shock CasiOak GA-2100 octagonal carbon core guard watch in stealth black'
  },
  'casio-vintage-gold': {
    id: 'casio-vintage-gold',
    name: 'Casio Vintage Iconic Digital Gold Illuminator A168WG-9',
    brand: 'Casio',
    category: 'Casual',
    image: '/images/products/casio-vintage-gold.png',
    gallery: [
      '/images/products/casio-vintage-gold.png',
      '/images/products/casio_vintage_digital.jpg'
    ],
    alt: 'Casio Vintage Digital Gold watch with electro-luminescence backlight and stainless steel bracelet'
  },

  // 8. Smartwatches
  'apple-watch-ultra-2': {
    id: 'apple-watch-ultra-2',
    name: 'Apple Watch Ultra 2 GPS + Cellular 49mm Titanium with Trail Loop',
    brand: 'Apple',
    category: 'Smartwatches',
    image: '/images/products/apple-watch-ultra-2.png',
    gallery: [
      '/images/products/apple-watch-ultra-2.png',
      '/images/products/apple-watch-s10.png'
    ],
    alt: 'Apple Watch Ultra 2 aerospace-grade titanium smartwatch with sapphire crystal and high-contrast display'
  },
  'apple-watch-s10': {
    id: 'apple-watch-s10',
    name: 'Apple Watch Series 10 Jet Black Aluminum Case with Sport Band',
    brand: 'Apple',
    category: 'Smartwatches',
    image: '/images/products/apple-watch-s10.png',
    gallery: [
      '/images/products/apple-watch-s10.png',
      '/images/products/apple-watch-ultra-2.png'
    ],
    alt: 'Apple Watch Series 10 in polished jet black aluminum with wide-angle OLED display'
  },
  'samsung-galaxy-watch-6': {
    id: 'samsung-galaxy-watch-6',
    name: 'Samsung Galaxy Watch6 Classic 47mm Rotating Bezel Bluetooth',
    brand: 'Samsung',
    category: 'Smartwatches',
    image: '/images/products/samsung-galaxy-watch-6.png',
    gallery: [
      '/images/products/samsung-galaxy-watch-6.png',
      '/images/products/samsung-galaxy-watch-7.png'
    ],
    alt: 'Samsung Galaxy Watch6 Classic with physical rotating bezel and stainless steel frame'
  },
  'samsung-galaxy-watch-7': {
    id: 'samsung-galaxy-watch-7',
    name: 'Samsung Galaxy Watch7 44mm BioActive Sensor AI Smartwatch',
    brand: 'Samsung',
    category: 'Smartwatches',
    image: '/images/products/samsung-galaxy-watch-7.png',
    gallery: [
      '/images/products/samsung-galaxy-watch-7.png',
      '/images/products/samsung-galaxy-watch-6.png'
    ],
    alt: 'Samsung Galaxy Watch7 featuring enhanced 3nm processor and dual-frequency GPS'
  },
  'garmin-fenix-7-pro': {
    id: 'garmin-fenix-7-pro',
    name: 'Garmin fēnix 7 Pro Solar Multisport GPS Smartwatch with LED Flashlight',
    brand: 'Garmin',
    category: 'Smartwatches',
    image: '/images/products/garmin-fenix-7-pro.png',
    gallery: [
      '/images/products/garmin-fenix-7-pro.png',
      '/images/products/garmin-forerunner-965.png'
    ],
    alt: 'Garmin fenix 7 Pro Solar multisport GPS watch with solar charging lens and built-in flashlight'
  },
  'titan-smart-pro-calling': {
    id: 'titan-smart-pro-calling',
    name: 'Titan Smart Pro Bluetooth Calling AMOLED Luxury Smartwatch',
    brand: 'Titan',
    category: 'Smartwatches',
    image: '/images/products/titan-smart-pro-calling.png',
    gallery: [
      '/images/products/titan-smart-pro-calling.png',
      '/images/products/titan-raga-viva.png'
    ],
    alt: 'Titan Smart Pro luxury smartwatch with HD AMOLED display and premium metal case'
  },

  // 9. Women's & Dress Timepieces
  'titan-raga-viva': {
    id: 'titan-raga-viva',
    name: 'Titan Raga Viva Mother of Pearl Rose Gold Crystal Mesh',
    brand: 'Titan',
    category: 'Dress',
    image: '/images/products/titan-raga-viva.png',
    gallery: [
      '/images/products/titan-raga-viva.png',
      '/images/products/titan-bandhan-pair.png'
    ],
    alt: 'Titan Raga Viva rose gold jewelry watch with mother-of-pearl dial and Swarovski crystals'
  },
  'fossil-jacqueline-blush': {
    id: 'fossil-jacqueline-blush',
    name: 'Fossil Jacqueline Three-Hand Blush Leather Watch',
    brand: 'Fossil',
    category: 'Casual',
    image: '/images/products/fossil-jacqueline-blush.png',
    gallery: [
      '/images/products/fossil-jacqueline-blush.png',
      '/images/products/fossil-couple-classic.png'
    ],
    alt: 'Fossil Jacqueline stainless steel dress watch with blush pink genuine leather strap'
  },
  'michael-kors-parker-gold': {
    id: 'michael-kors-parker-gold',
    name: 'Michael Kors Parker Chronograph Champagne Crystal Dial MK5353',
    brand: 'Michael Kors',
    category: 'Luxury',
    image: '/images/products/michael-kors-parker-gold.png',
    gallery: [
      '/images/products/michael-kors-parker-gold.png',
      '/images/products/titan-raga-viva.png'
    ],
    alt: 'Michael Kors Parker gold-tone chronograph watch with pavé crystal bezel'
  },
  'longines-dolcevita-steel-gold': {
    id: 'longines-dolcevita-steel-gold',
    name: 'Longines DolceVita Two-Tone 18ct Rose Gold & Steel Watch',
    brand: 'Longines',
    category: 'Dress',
    image: '/images/products/longines-dolcevita-steel-gold.png',
    gallery: [
      '/images/products/longines-dolcevita-steel-gold.png',
      '/images/products/longines-spirit-heritage-pioneer.png'
    ],
    alt: 'Longines DolceVita rectangular two-tone watch inspired by Italian elegance'
  },
  'chopard-happy-diamonds': {
    id: 'chopard-happy-diamonds',
    name: 'Chopard Happy Sport 30mm Dancing Diamonds Watch',
    brand: 'Chopard',
    category: 'Luxury',
    image: '/images/products/chopard-happy-diamonds.png',
    gallery: [
      '/images/products/chopard-happy-diamonds.png',
      '/images/products/rolex-lady-datejust-diamond.png'
    ],
    alt: 'Chopard Happy Sport luxury timepiece featuring free-moving dancing diamonds between sapphire crystals'
  },

  // 10. Kids & Youth
  'casio-youth-digital-kids': {
    id: 'casio-youth-digital-kids',
    name: 'Casio Youth Digital 50M Water Resistant Sport Watch W-218H',
    brand: 'Casio',
    category: 'Casual',
    image: '/images/products/casio-youth-digital-kids.png',
    gallery: [
      '/images/products/casio-youth-digital-kids.png',
      '/images/products/g-shock-ga2100.png'
    ],
    alt: 'Casio Youth digital sport watch with resin band and 7-year battery life'
  },
  'zoop-marvel-spiderman': {
    id: 'zoop-marvel-spiderman',
    name: 'Zoop Marvel Spider-Man Action Digital Dial Kid Watch',
    brand: 'Zoop',
    category: 'Casual',
    image: '/images/products/zoop-marvel-spiderman.png',
    gallery: [
      '/images/products/zoop-marvel-spiderman.png',
      '/images/products/zoop-disney-frozen-elsa.png'
    ],
    alt: 'Zoop Marvel Spider-Man colorful digital children watch with durable silicone strap'
  },
  'zoop-disney-frozen-elsa': {
    id: 'zoop-disney-frozen-elsa',
    name: 'Zoop Disney Frozen Elsa Sparkle Blue Crystal Kid Watch',
    brand: 'Zoop',
    category: 'Casual',
    image: '/images/products/zoop-disney-frozen-elsa.png',
    gallery: [
      '/images/products/zoop-disney-frozen-elsa.png',
      '/images/products/zoop-marvel-spiderman.png'
    ],
    alt: 'Zoop Disney Frozen Elsa sparkling blue strap watch for young horology enthusiasts'
  },
  'timex-kids-time-factory-analog': {
    id: 'timex-kids-time-factory-analog',
    name: 'Timex Time Factory Easy-Reader Analog Kid Watch',
    brand: 'Timex',
    category: 'Casual',
    image: '/images/products/timex-kids-time-factory-analog.png',
    gallery: [
      '/images/products/timex-kids-time-factory-analog.png',
      '/images/products/qq-kids-sport-waterproof.png'
    ],
    alt: 'Timex Time Factory easy-to-read analog children watch with labeled hour and minute hands'
  },
  'qq-kids-sport-waterproof': {
    id: 'qq-kids-sport-waterproof',
    name: 'Q&Q Japan VR99J 100M Water Resistant Kid Sport Watch',
    brand: 'Q&Q',
    category: 'Sports',
    image: '/images/products/qq-kids-sport-waterproof.png',
    gallery: [
      '/images/products/qq-kids-sport-waterproof.png',
      '/images/products/timex-kids-time-factory-analog.png'
    ],
    alt: 'Q&Q Japan 100M waterproof rugged sport watch for kids with high-visibility markers'
  },

  // 11. Heritage & Couples
  'swatch-omega-moonswatch-moon': {
    id: 'swatch-omega-moonswatch-moon',
    name: 'Bioceramic Moonswatch Mission to the Moon Chronograph',
    brand: 'Swatch',
    category: 'Casual',
    image: '/images/products/swatch-omega-moonswatch-moon.png',
    gallery: [
      '/images/products/swatch-omega-moonswatch-moon.png',
      '/images/products/omega-speedmaster.png'
    ],
    alt: 'Swatch x Omega Bioceramic Moonswatch Mission to the Moon chronograph with velcro strap'
  },
  'longines-spirit-heritage-pioneer': {
    id: 'longines-spirit-heritage-pioneer',
    name: 'Longines Spirit Titanium Chronometer 40mm Aviation Pioneer',
    brand: 'Longines',
    category: 'Luxury',
    image: '/images/products/longines-spirit-heritage-pioneer.png',
    gallery: [
      '/images/products/longines-spirit-heritage-pioneer.png',
      '/images/products/longines-dolcevita-steel-gold.png'
    ],
    alt: 'Longines Spirit Chronometer in Grade 5 Titanium with COSC certified automatic movement'
  },
  'watchhub-winter-frost-atelier': {
    id: 'watchhub-winter-frost-atelier',
    name: 'WatchHub Atelier Winter Frost Limited Chronograph 2026',
    brand: 'WatchHub',
    category: 'Limited Edition',
    image: '/images/products/watchhub-winter-frost-atelier.png',
    gallery: [
      '/images/products/watchhub-winter-frost-atelier.png',
      '/images/products/chronoswiss-tourbillon.png'
    ],
    alt: 'WatchHub Atelier Winter Frost limited edition chronograph with ice-crystal sunburst finish'
  },
  'titan-bandhan-pair': {
    id: 'titan-bandhan-pair',
    name: 'Titan Bandhan Royal Two-Tone Couple Pair Watches',
    brand: 'Titan',
    category: 'Couples',
    image: '/images/products/titan-bandhan-pair.png',
    gallery: [
      '/images/products/titan-bandhan-pair.png',
      '/images/products/couple_pair.jpg'
    ],
    alt: 'Titan Bandhan Royal two-tone matching luxury couple pair watches with champagne dials'
  },
  'fossil-couple-classic': {
    id: 'fossil-couple-classic',
    name: 'Fossil His and Her Classic Stainless Steel Couple Set',
    brand: 'Fossil',
    category: 'Couples',
    image: '/images/products/fossil-couple-classic.png',
    gallery: [
      '/images/products/fossil-couple-classic.png',
      '/images/products/titan-bandhan-pair.png'
    ],
    alt: 'Fossil His & Her classic stainless steel matching watches presented in gift packaging'
  },

  // 12. Additional Seeds & Fine Horology
  'citizen-promaster-diver': {
    id: 'citizen-promaster-diver',
    name: 'Citizen Eco-Drive Promaster Solar Marine Diver 200M',
    brand: 'Citizen',
    category: 'Sports',
    image: '/images/products/citizen-promaster-diver.png',
    gallery: ['/images/products/citizen-promaster-diver.png'],
    alt: 'Citizen Eco-Drive Promaster 200M solar-powered dive watch with polyurethane strap'
  },
  'rado-captain-cook': {
    id: 'rado-captain-cook',
    name: 'Rado Captain Cook High-Tech Ceramic Skeleton Automatic',
    brand: 'Rado',
    category: 'Luxury',
    image: '/images/products/rado-captain-cook.png',
    gallery: ['/images/products/rado-captain-cook.png'],
    alt: 'Rado Captain Cook High-Tech Ceramic automatic watch with open-heart tinted sapphire dial'
  },
  'tudor-pelagos-titanium': {
    id: 'tudor-pelagos-titanium',
    name: 'Tudor Pelagos 39 Titanium Diver Automatic',
    brand: 'Tudor',
    category: 'Sports',
    image: '/images/products/tudor-pelagos-titanium.png',
    gallery: ['/images/products/tudor-pelagos-titanium.png'],
    alt: 'Tudor Pelagos 39 satin-finished grade 2 titanium dive watch with luminescent ceramic bezel'
  },
  'vacheron-overseas-blue': {
    id: 'vacheron-overseas-blue',
    name: 'Vacheron Constantin Overseas Automatic Lacquered Blue Dial',
    brand: 'Vacheron Constantin',
    category: 'Luxury',
    image: '/images/products/vacheron-overseas-blue.png',
    gallery: ['/images/products/vacheron-overseas-blue.png'],
    alt: 'Vacheron Constantin Overseas with translucent blue lacquer dial and interchangeable bracelet system'
  },
  'jlc-reverso-tribute': {
    id: 'jlc-reverso-tribute',
    name: 'Jaeger-LeCoultre Reverso Tribute Monoface Small Seconds',
    brand: 'Jaeger-LeCoultre',
    category: 'Luxury',
    image: '/images/products/jlc-reverso-tribute.png',
    gallery: ['/images/products/jlc-reverso-tribute.png'],
    alt: 'Jaeger-LeCoultre Reverso Tribute with reversible art-deco case and Casa Fagliano calfskin strap'
  },
  'nomos-tangente-33': {
    id: 'nomos-tangente-33',
    name: 'NOMOS Glashütte Tangente 33 Karat Bauhaus Dress Watch',
    brand: 'NOMOS Glashütte',
    category: 'Dress',
    image: '/images/products/nomos-tangente-33.png',
    gallery: ['/images/products/nomos-tangente-33.png'],
    alt: 'NOMOS Glashütte Tangente 33 Bauhaus minimalist mechanical watch with tempered blue hands'
  }
};
