// Centralized configuration for WatchHub Mega Menu System

export const MEGA_MENU_CONFIG = {
  brands: {
    id: 'brands',
    label: 'Brands',
    featured: {
      title: 'Global Watch',
      highlight: 'Brands (60+)',
      subtitle: 'From Swiss Haute Horlogerie to Next-Gen Wearables',
      image: '/images/products/featured_rolex_submariner.jpg',
      ctaText: 'Explore Directory',
      link: '/brands',
    },
    columns: [
      {
        title: 'Swiss Luxury',
        icon: '🇨🇭',
        items: [
          { label: 'Rolex', link: '/products?brand=rolex', badge: '👑' },
          { label: 'Omega', link: '/products?brand=omega', badge: 'Ω' },
          { label: 'Patek Philippe', link: '/products?brand=patek+philippe', badge: '❖' },
          { label: 'Audemars Piguet', link: '/products?brand=audemars+piguet', badge: 'AP' },
          { label: 'Cartier', link: '/products?brand=cartier' },
          { label: 'Tissot', link: '/products?brand=tissot' },
          { label: 'Breitling', link: '/products?brand=breitling' },
          { label: 'TAG Heuer', link: '/products?brand=tag+heuer' },
        ],
      },
      {
        title: 'Japanese Icons',
        icon: '🇯🇵',
        items: [
          { label: 'Seiko', link: '/products?brand=seiko', badge: 'Hot' },
          { label: 'Grand Seiko', link: '/products?brand=grand+seiko' },
          { label: 'Citizen', link: '/products?brand=citizen' },
          { label: 'Casio', link: '/products?brand=casio' },
          { label: 'Orient', link: '/products?brand=orient' },
        ],
      },
      {
        title: 'American & Fashion',
        icon: '🇺🇸',
        items: [
          { label: 'Fossil', link: '/products?brand=fossil' },
          { label: 'Timex', link: '/products?brand=timex' },
          { label: 'Tommy Hilfiger', link: '/products?brand=tommy+hilfiger' },
          { label: 'Michael Kors', link: '/products?brand=michael+kors' },
          { label: 'Guess', link: '/products?brand=guess' },
          { label: 'Kenneth Cole', link: '/products?brand=kenneth+cole' },
        ],
      },
      {
        title: 'Smartwatch Giants',
        icon: '📱',
        items: [
          { label: 'Apple Watch', link: '/products?brand=apple', badge: '' },
          { label: 'Samsung Galaxy', link: '/products?brand=samsung' },
          { label: 'Garmin', link: '/products?brand=garmin' },
          { label: 'Noise', link: '/products?brand=noise' },
          { label: 'boAt', link: '/products?brand=boat' },
          { label: 'Amazfit', link: '/products?brand=amazfit' },
          { label: 'Huawei', link: '/products?brand=huawei' },
        ],
      },
      {
        title: 'Indian Heritage',
        icon: '🇮🇳',
        items: [
          { label: 'Titan', link: '/products?brand=titan', badge: '🏆' },
          { label: 'Fastrack', link: '/products?brand=fastrack' },
          { label: 'Sonata', link: '/products?brand=sonata' },
          { label: 'Noise', link: '/products?brand=noise' },
          { label: 'boAt', link: '/products?brand=boat' },
        ],
      },
    ],
    bottomBadges: [
      { label: '👑 60+ International Houses', link: '/brands' },
      { label: '🇨🇭 100% Swiss Certified', link: '/products?cat=luxury' },
      { label: '🇯🇵 Japanese Precision', link: '/products?q=japan' },
      { label: '🏅 Direct Brand Warranty', link: '/brands' },
    ],
    bottomCta: {
      text: 'View All 60+ Brands Directory →',
      link: '/brands',
    },
  },

  men: {
    id: 'men',
    label: 'Men',
    featured: {
      title: "Men's",
      highlight: 'Watches',
      subtitle: 'Bold styles for every occasion',
      image: '/images/products/featured_rolex_daytona.jpg',
      ctaText: 'Explore Men',
      link: '/products?cat=men',
    },
    columns: [
      {
        title: 'By Watch Type',
        icon: '⌚',
        items: [
          { label: 'Analog Watches', link: '/products?cat=men&q=analog' },
          { label: 'Digital Watches', link: '/products?cat=men&q=digital' },
          { label: 'Chronograph Watches', link: '/products?cat=men&q=chronograph' },
          { label: 'Automatic Watches', link: '/products?cat=men&q=automatic' },
          { label: 'Mechanical Watches', link: '/products?cat=men&q=mechanical' },
          { label: 'Smartwatches', link: '/products?cat=smartwatches&gender=men' },
        ],
      },
      {
        title: 'By Style',
        icon: '❖',
        items: [
          { label: 'Formal Watches', link: '/products?cat=men&q=formal' },
          { label: 'Casual Watches', link: '/products?cat=men&q=casual' },
          { label: 'Sports Watches', link: '/products?cat=sports&gender=men' },
          { label: 'Luxury Watches', link: '/products?cat=luxury&gender=men' },
          { label: 'Minimalist Watches', link: '/products?cat=men&q=minimalist' },
          { label: 'Vintage Watches', link: '/products?cat=men&q=vintage' },
        ],
      },
      {
        title: 'By Strap Material',
        icon: '🏷️',
        items: [
          { label: 'Leather Strap', link: '/products?cat=men&q=leather' },
          { label: 'Stainless Steel', link: '/products?cat=men&q=steel' },
          { label: 'Silicone Strap', link: '/products?cat=men&q=silicone' },
          { label: 'Metal Bracelet', link: '/products?cat=men&q=metal' },
          { label: 'Nylon / Fabric Strap', link: '/products?cat=men&q=fabric' },
          { label: 'Mesh Strap', link: '/products?cat=men&q=mesh' },
        ],
      },
      {
        title: 'By Occasion',
        icon: '📅',
        items: [
          { label: 'Office Wear', link: '/products?cat=men&q=office' },
          { label: 'Party Wear', link: '/products?cat=men&q=party' },
          { label: 'Wedding Collection', link: '/products?cat=men&q=wedding' },
          { label: 'Everyday Wear', link: '/products?cat=men&q=everyday' },
          { label: 'Travel & Outdoor', link: '/products?cat=men&q=outdoor' },
          { label: 'Special Events', link: '/products?cat=men&q=special' },
        ],
      },
      {
        title: 'By Price',
        icon: '💰',
        items: [
          { label: 'Under ₹1,000', link: '/products?cat=men&maxPrice=1000' },
          { label: 'Under ₹5,000', link: '/products?cat=men&maxPrice=5000' },
          { label: 'Under ₹10,000', link: '/products?cat=men&maxPrice=10000' },
          { label: '₹10,000 – ₹25,000', link: '/products?cat=men&minPrice=10000&maxPrice=25000' },
          { label: 'Above ₹25,000', link: '/products?cat=men&minPrice=25000' },
        ],
      },
    ],
    bottomBadges: [
      { label: '⭐ Best Sellers', link: '/products?cat=men&tag=bestseller' },
      { label: '🆕 New Arrivals', link: '/products?cat=men&tag=new' },
      { label: '💎 Exclusive Collection', link: '/products?cat=men&q=exclusive' },
      { label: '🏷️ Offers & Discounts', link: '/products?cat=men&tag=deals' },
    ],
    bottomCta: {
      text: "Explore All Men's Watches →",
      link: '/products?cat=men',
    },
  },

  women: {
    id: 'women',
    label: 'Women',
    featured: {
      title: "Women's",
      highlight: 'Timepieces',
      subtitle: 'Graceful designs & timeless glam',
      image: '/images/products/featured_cartier_tank.jpg',
      ctaText: 'Explore Women',
      link: '/products?cat=women',
    },
    columns: [
      {
        title: 'By Watch Type',
        icon: '⌚',
        items: [
          { label: 'Analog Watches', link: '/products?cat=women&q=analog' },
          { label: 'Designer Watches', link: '/products?cat=women&q=designer' },
          { label: 'Luxury Watches', link: '/products?cat=luxury&gender=women' },
          { label: 'Rose Gold Watches', link: '/products?cat=women&q=rose+gold', badge: 'Hot' },
          { label: 'Bracelet Watches', link: '/products?cat=women&q=bracelet' },
          { label: 'Smartwatches', link: '/products?cat=smartwatches&gender=women' },
        ],
      },
      {
        title: 'By Style',
        icon: '❖',
        items: [
          { label: 'Fashion Watches', link: '/products?cat=women&q=fashion' },
          { label: 'Luxury Watches', link: '/products?cat=luxury&gender=women' },
          { label: 'Minimalist Watches', link: '/products?cat=women&q=minimalist' },
          { label: 'Casual Watches', link: '/products?cat=women&q=casual' },
          { label: 'Party Wear Watches', link: '/products?cat=women&q=party' },
          { label: 'Couple Watches', link: '/products?cat=couple' },
        ],
      },
      {
        title: 'By Strap Material',
        icon: '🏷️',
        items: [
          { label: 'Rose Gold Mesh', link: '/products?cat=women&q=rose+gold+mesh' },
          { label: 'Genuine Leather', link: '/products?cat=women&q=leather' },
          { label: 'Stainless Steel', link: '/products?cat=women&q=steel' },
          { label: 'Ceramic Bracelet', link: '/products?cat=women&q=ceramic' },
          { label: 'Metal Bangle', link: '/products?cat=women&q=bangle' },
          { label: 'Velvet / Satin', link: '/products?cat=women&q=velvet' },
        ],
      },
      {
        title: 'By Occasion',
        icon: '📅',
        items: [
          { label: 'Party & Evening', link: '/products?cat=women&q=party' },
          { label: 'Office & Formal', link: '/products?cat=women&q=office' },
          { label: 'Wedding & Bridal', link: '/products?cat=women&q=wedding' },
          { label: 'Casual Outing', link: '/products?cat=women&q=casual' },
          { label: 'Festive Wear', link: '/products?cat=women&q=festive' },
          { label: 'Daily Essentials', link: '/products?cat=women&q=daily' },
        ],
      },
      {
        title: 'By Price',
        icon: '💰',
        items: [
          { label: 'Under ₹1,000', link: '/products?cat=women&maxPrice=1000' },
          { label: 'Under ₹5,000', link: '/products?cat=women&maxPrice=5000' },
          { label: 'Under ₹10,000', link: '/products?cat=women&maxPrice=10000' },
          { label: '₹10,000 – ₹25,000', link: '/products?cat=women&minPrice=10000&maxPrice=25000' },
          { label: 'Above ₹25,000', link: '/products?cat=women&minPrice=25000' },
        ],
      },
    ],
    bottomBadges: [
      { label: '⭐ Best Sellers', link: '/products?cat=women&tag=bestseller' },
      { label: '🆕 New Arrivals', link: '/products?cat=women&tag=new' },
      { label: '💎 Diamond Accents', link: '/products?cat=women&q=diamond' },
      { label: '🎁 Gift Sets', link: '/products?cat=combo' },
    ],
    bottomCta: {
      text: "Explore All Women's Watches →",
      link: '/products?cat=women',
    },
  },

  kids: {
    id: 'kids',
    label: 'Kids',
    featured: {
      title: "Kids'",
      highlight: 'Collection',
      subtitle: 'Playful, durable & educational watches',
      image: '/images/hd_categories/cat_kids.jpg',
      ctaText: 'Explore Kids',
      link: '/products?cat=kids',
    },
    columns: [
      {
        title: 'By Category',
        icon: '👶',
        items: [
          { label: 'Boys Watches', link: '/products?cat=kids&q=boys' },
          { label: 'Girls Watches', link: '/products?cat=kids&q=girls' },
          { label: 'Cartoon Watches', link: '/products?cat=kids&q=cartoon', badge: 'Popular' },
          { label: 'Digital Watches', link: '/products?cat=kids&q=digital' },
          { label: 'Analog Watches', link: '/products?cat=kids&q=analog' },
        ],
      },
      {
        title: 'Special Features',
        icon: '⚡',
        items: [
          { label: 'Sports Watches', link: '/products?cat=kids&q=sports' },
          { label: 'Smartwatches', link: '/products?cat=kids&q=smartwatch' },
          { label: 'Educational Watches', link: '/products?cat=kids&q=educational' },
          { label: 'Waterproof Watches', link: '/products?cat=kids&q=waterproof' },
          { label: 'GPS Safety Watches', link: '/products?cat=kids&q=gps' },
        ],
      },
      {
        title: 'By Age Group',
        icon: '🎂',
        items: [
          { label: 'Ages 3–6 (Cartoon Fun)', link: '/products?cat=kids&q=toddler' },
          { label: 'Ages 7–12 (Digital Sports)', link: '/products?cat=kids&q=junior' },
          { label: 'Teens 13+ (Smartwear)', link: '/products?cat=kids&q=teen' },
        ],
      },
      {
        title: 'Themes & Characters',
        icon: '🎨',
        items: [
          { label: 'Superhero Edition', link: '/products?cat=kids&q=superhero' },
          { label: 'Space & Astronaut', link: '/products?cat=kids&q=space' },
          { label: 'Princess & Sparkle', link: '/products?cat=kids&q=princess' },
          { label: 'Luminous Glow In Dark', link: '/products?cat=kids&q=luminous' },
        ],
      },
      {
        title: 'By Price',
        icon: '💰',
        items: [
          { label: 'Under ₹500', link: '/products?cat=kids&maxPrice=500' },
          { label: 'Under ₹1,000', link: '/products?cat=kids&maxPrice=1000' },
          { label: 'Under ₹2,500', link: '/products?cat=kids&maxPrice=2500' },
          { label: 'Under ₹5,000', link: '/products?cat=kids&maxPrice=5000' },
        ],
      },
    ],
    bottomBadges: [
      { label: '🛡️ 100% Child-Safe Materials', link: '/products?cat=kids' },
      { label: '💧 50M Waterproof Tested', link: '/products?cat=kids&q=waterproof' },
      { label: '🔋 Long Battery Life', link: '/products?cat=kids' },
      { label: '🎁 Birthday Gift Ready', link: '/products?cat=kids' },
    ],
    bottomCta: {
      text: "Explore All Kids' Watches →",
      link: '/products?cat=kids',
    },
  },

  smartwatches: {
    id: 'smartwatches',
    label: 'Smartwatches',
    featured: {
      title: 'Smart',
      highlight: 'Wearables',
      subtitle: 'Next-gen intelligence on your wrist',
      image: '/images/products/featured_apple_watch.jpg',
      ctaText: 'Explore Smart',
      link: '/products?cat=smartwatches',
    },
    columns: [
      {
        title: 'Top Brands',
        icon: '👑',
        items: [
          { label: 'Apple Watch', link: '/products?brand=apple', badge: 'Series 10' },
          { label: 'Samsung Galaxy Watch', link: '/products?brand=samsung' },
          { label: 'Garmin GPS Sports', link: '/products?brand=garmin' },
          { label: 'Noise Smartwatches', link: '/products?brand=noise' },
          { label: 'boAt Wearables', link: '/products?brand=boat' },
          { label: 'Amazfit Bio-Trackers', link: '/products?brand=amazfit' },
          { label: 'Huawei Band & Watch', link: '/products?brand=huawei' },
        ],
      },
      {
        title: 'Smart Features',
        icon: '⚡',
        items: [
          { label: 'Bluetooth Calling', link: '/products?cat=smartwatches&q=calling' },
          { label: 'Fitness Trackers', link: '/products?cat=smartwatches&q=fitness' },
          { label: 'AMOLED Displays', link: '/products?cat=smartwatches&q=amoled', badge: 'Popular' },
          { label: 'GPS Navigation', link: '/products?cat=smartwatches&q=gps' },
          { label: 'Health Monitoring (SpO2 & HR)', link: '/products?cat=smartwatches&q=health' },
          { label: '120+ Sports Modes', link: '/products?cat=smartwatches&q=sports' },
        ],
      },
      {
        title: 'Display & Design',
        icon: '🖥️',
        items: [
          { label: 'Retina OLED Display', link: '/products?cat=smartwatches&q=retina' },
          { label: 'Round Classic Dials', link: '/products?cat=smartwatches&q=round' },
          { label: 'Square Sporty Dials', link: '/products?cat=smartwatches&q=square' },
          { label: 'Always-On Display (AOD)', link: '/products?cat=smartwatches&q=aod' },
          { label: 'Metallic & Leather Straps', link: '/products?cat=smartwatches&q=strap' },
        ],
      },
      {
        title: 'Toughness & Power',
        icon: '🔋',
        items: [
          { label: '7+ Days Normal Battery', link: '/products?cat=smartwatches&q=battery' },
          { label: '14+ Days Ultra Endurance', link: '/products?cat=smartwatches&q=ultra' },
          { label: 'IP68 Swimproof', link: '/products?cat=smartwatches&q=ip68' },
          { label: '5ATM Military Rugged', link: '/products?cat=smartwatches&q=military' },
        ],
      },
      {
        title: 'By Budget',
        icon: '💰',
        items: [
          { label: 'Under ₹2,000', link: '/products?cat=smartwatches&maxPrice=2000' },
          { label: 'Under ₹5,000', link: '/products?cat=smartwatches&maxPrice=5000' },
          { label: 'Under ₹15,000', link: '/products?cat=smartwatches&maxPrice=15000' },
          { label: 'Premium Flagships (₹15,000+)', link: '/products?cat=smartwatches&minPrice=15000' },
        ],
      },
    ],
    bottomBadges: [
      { label: '📞 Dual Mic Clear Calling', link: '/products?cat=smartwatches&q=calling' },
      { label: '❤️ 24/7 Vitals & Sleep Tracker', link: '/products?cat=smartwatches&q=health' },
      { label: '⚡ Fast Wireless Charging', link: '/products?cat=smartwatches' },
      { label: '🏃 Auto Workout Detection', link: '/products?cat=smartwatches&q=fitness' },
    ],
    bottomCta: {
      text: 'Explore All Smartwatches →',
      link: '/products?cat=smartwatches',
    },
  },

  luxury: {
    id: 'luxury',
    label: 'Luxury',
    featured: {
      title: 'Swiss Haute',
      highlight: 'Horlogerie',
      subtitle: 'Master craftsmanship & heirloom elegance',
      image: '/images/products/featured_patek_nautilus.jpg',
      ctaText: 'Explore Luxury',
      link: '/products?cat=luxury',
    },
    columns: [
      {
        title: 'Movements & Art',
        icon: '🇨🇭',
        items: [
          { label: 'Swiss Luxury Certified', link: '/products?cat=luxury&q=swiss', badge: 'COSC' },
          { label: 'Automatic Movements', link: '/products?cat=luxury&q=automatic' },
          { label: 'Mechanical Hand-Wound', link: '/products?cat=luxury&q=mechanical' },
          { label: 'Skeleton Dial Art', link: '/products?cat=luxury&q=skeleton' },
          { label: 'Tourbillon Masterpieces', link: '/products?cat=luxury&q=tourbillon' },
        ],
      },
      {
        title: 'Complications',
        icon: '⚙️',
        items: [
          { label: 'Chronograph Counters', link: '/products?cat=luxury&q=chronograph' },
          { label: 'Perpetual Calendar', link: '/products?cat=luxury&q=calendar' },
          { label: 'Moonphase Display', link: '/products?cat=luxury&q=moonphase' },
          { label: 'GMT Dual Timezone', link: '/products?cat=luxury&q=gmt' },
          { label: 'Deep Diver Submariner', link: '/products?cat=luxury&q=diver' },
        ],
      },
      {
        title: 'Noble Materials',
        icon: '💎',
        items: [
          { label: '18K Solid Gold', link: '/products?cat=luxury&q=gold', badge: 'Vault' },
          { label: 'Platinum Editions', link: '/products?cat=luxury&q=platinum' },
          { label: 'Hand-Set Diamonds', link: '/products?cat=luxury&q=diamond' },
          { label: 'Sapphire Crystal Glass', link: '/products?cat=luxury&q=sapphire' },
          { label: 'Grade 5 Titanium', link: '/products?cat=luxury&q=titanium' },
        ],
      },
      {
        title: 'Vault Collections',
        icon: '🏆',
        items: [
          { label: 'Limited Edition Vault', link: '/products?cat=luxury&tag=limited' },
          { label: 'Heritage Collection', link: '/products?cat=luxury&q=heritage' },
          { label: 'Vintage Horology', link: '/products?cat=luxury&q=vintage' },
          { label: 'Presidential Suites', link: '/products?cat=luxury&q=presidential' },
        ],
      },
      {
        title: 'Iconic Houses',
        icon: '👑',
        items: [
          { label: 'Rolex Crown Vault', link: '/products?brand=rolex' },
          { label: 'Omega Seamaster & Speedy', link: '/products?brand=omega' },
          { label: 'Patek Philippe Nautilus', link: '/products?brand=patek+philippe' },
          { label: 'Audemars Piguet Royal Oak', link: '/products?brand=audemars+piguet' },
          { label: 'Cartier Santos & Tank', link: '/products?brand=cartier' },
        ],
      },
    ],
    bottomBadges: [
      { label: '🇨🇭 100% Swiss Made Certified', link: '/products?cat=luxury' },
      { label: '🏅 Official COSC Chronometer', link: '/products?cat=luxury' },
      { label: '💎 Genuine Gem Certification', link: '/products?cat=luxury' },
      { label: '📜 Insured White-Glove Delivery', link: '/products?cat=luxury' },
    ],
    bottomCta: {
      text: 'Explore All Luxury Watches →',
      link: '/products?cat=luxury',
    },
  },

  sports: {
    id: 'sports',
    label: 'Sports',
    featured: {
      title: 'High-Performance',
      highlight: 'Sports Chronos',
      subtitle: 'Built for speed, diving & extreme terrain',
      image: '/images/products/featured_omega_seamaster.jpg',
      ctaText: 'Explore Sports',
      link: '/products?cat=sports',
    },
    columns: [
      {
        title: 'By Activity',
        icon: '🏃',
        items: [
          { label: 'Running & Marathon', link: '/products?cat=sports&q=running' },
          { label: 'Deep Sea Diving', link: '/products?cat=sports&q=diving', badge: '300M' },
          { label: 'Fitness & Crossfit', link: '/products?cat=sports&q=fitness' },
          { label: 'Adventure & Trekking', link: '/products?cat=sports&q=adventure' },
          { label: 'Military & Tactical', link: '/products?cat=sports&q=military' },
        ],
      },
      {
        title: 'By Technology',
        icon: '🌊',
        items: [
          { label: 'Waterproof 200M/300M', link: '/products?cat=waterproof' },
          { label: 'GPS Sports Tracking', link: '/products?cat=sports&q=gps' },
          { label: 'Digital Chronographs', link: '/products?cat=digital' },
          { label: 'Shock-Resistant G-Shock', link: '/products?brand=casio' },
          { label: 'Solar Powered Sports', link: '/products?cat=sports&q=solar' },
        ],
      },
      {
        title: 'Pro Features',
        icon: '⏱️',
        items: [
          { label: 'Tachymeter Bezels', link: '/products?cat=sports&q=tachymeter' },
          { label: 'Luminous Glow Hands', link: '/products?cat=sports&q=luminous' },
          { label: 'Lap Memory & Splits', link: '/products?cat=sports&q=lap' },
          { label: 'Altimeter & Barometer', link: '/products?cat=sports&q=altimeter' },
          { label: 'Compass Navigation', link: '/products?cat=sports&q=compass' },
        ],
      },
      {
        title: 'Sports Brands',
        icon: '🏅',
        items: [
          { label: 'Casio G-Shock', link: '/products?brand=casio' },
          { label: 'Garmin Forerunner & Fenix', link: '/products?brand=garmin' },
          { label: 'Seiko Prospex Diver', link: '/products?brand=seiko' },
          { label: 'Citizen Promaster', link: '/products?brand=citizen' },
          { label: 'Timex Ironman', link: '/products?brand=timex' },
        ],
      },
      {
        title: 'By Price',
        icon: '💰',
        items: [
          { label: 'Under ₹3,000', link: '/products?cat=sports&maxPrice=3000' },
          { label: 'Under ₹7,000', link: '/products?cat=sports&maxPrice=7000' },
          { label: 'Under ₹15,000', link: '/products?cat=sports&maxPrice=15000' },
          { label: 'Pro Diver Tier (₹15,000+)', link: '/products?cat=sports&minPrice=15000' },
        ],
      },
    ],
    bottomBadges: [
      { label: '🌊 300M Diver Certified', link: '/products?cat=waterproof' },
      { label: '🛡️ Heavy Impact Shockproof', link: '/products?brand=casio' },
      { label: '🧭 Built-In Compass Sensors', link: '/products?cat=sports&q=compass' },
      { label: '🔋 Tough Solar Powered', link: '/products?cat=sports&q=solar' },
    ],
    bottomCta: {
      text: 'Explore All Sports Watches →',
      link: '/products?cat=sports',
    },
  },

  collections: {
    id: 'collections',
    label: 'Collections',
    featured: {
      title: 'Signature',
      highlight: 'Vault Vault',
      subtitle: 'Exclusive curations & gift pairings',
      image: '/images/hd_categories/cat_combo.jpg',
      ctaText: 'Explore Vault',
      link: '/categories',
    },
    columns: [
      {
        title: 'Trending Curations',
        icon: '🔥',
        items: [
          { label: 'New Arrivals 2026', link: '/products?tag=new', badge: 'New' },
          { label: 'Best Sellers Vault', link: '/products?tag=bestseller', badge: 'Hot' },
          { label: 'Trending Right Now', link: '/products?q=trending' },
          { label: 'Limited Edition Series', link: '/products?tag=limited' },
          { label: 'Premium Gold Editions', link: '/products?q=gold' },
        ],
      },
      {
        title: 'Theme Collections',
        icon: '💑',
        items: [
          { label: 'Couple Watches (His & Hers)', link: '/products?cat=couple', badge: 'Popular' },
          { label: 'Minimalist Dials', link: '/products?q=minimalist' },
          { label: 'Vintage Horology', link: '/products?q=vintage' },
          { label: 'Festive & Celebration', link: '/products?q=festive' },
          { label: 'Skeleton Art', link: '/products?q=skeleton' },
        ],
      },
      {
        title: 'By Daily Lifestyle',
        icon: '👔',
        items: [
          { label: 'Office & Executive Wear', link: '/products?q=office' },
          { label: 'Party & Red Carpet', link: '/products?cat=partywear' },
          { label: 'Everyday Essentials', link: '/products?q=everyday' },
          { label: 'Weekend Casuals', link: '/products?q=casual' },
          { label: 'Collector Exclusive', link: '/products?q=exclusive' },
        ],
      },
      {
        title: 'Curated Hubs',
        icon: '🏭',
        items: [
          { label: '3D Manufacturing Hub', link: '/manufacturing-hub', badge: '3D' },
          { label: 'VIP Android Mobile App', link: '/mobile-app' },
          { label: '12 Curated Categories', link: '/categories' },
          { label: '60+ Brands Directory', link: '/brands' },
        ],
      },
      {
        title: 'Budget Boutiques',
        icon: '💰',
        items: [
          { label: 'Under ₹2,000 Store', link: '/products?maxPrice=2000' },
          { label: 'Under ₹5,000 Boutique', link: '/products?maxPrice=5000' },
          { label: 'Under ₹10,000 Curations', link: '/products?maxPrice=10000' },
          { label: '₹10,000 – ₹25,000 Luxury', link: '/products?minPrice=10000&maxPrice=25000' },
          { label: 'Ultra Luxury (₹25,000+)', link: '/products?minPrice=25000' },
        ],
      },
    ],
    bottomBadges: [
      { label: '🎁 Free Luxury Gift Packaging', link: '/categories' },
      { label: '⚡ Same-Day Metro Dispatch', link: '/cart' },
      { label: '🛡️ 2-Year International Warranty', link: '/categories' },
      { label: '✨ 100% Guaranteed Authenticity', link: '/categories' },
    ],
    bottomCta: {
      text: 'Explore All 12 Collections →',
      link: '/categories',
    },
  },
};
