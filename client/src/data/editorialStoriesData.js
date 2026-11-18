// WatchHub Editorial Horology Stories Data
// Real horological history, craftsmanship deep dives, and collector insights

export const EDITORIAL_STORIES = [
  {
    id: 'craftsmanship',
    slug: 'craftsmanship',
    route: '/stories/craftsmanship',
    badge: 'CRAFTSMANSHIP',
    badgeType: 'cyan',
    badgeIcon: 'Boxes',
    title: 'The Hand of the Master Watchmaker',
    subtitle:
      'Explore the precision, patience and human artistry behind every fine watch, where traditional techniques meet modern innovation.',
    author: 'Jean-Luc Mercier • Master Horologist & Finisher',
    date: '14 November 2026',
    readTime: '7 min read',
    heroImage: '/images/hero/story_craftsmanship.jpg',
    ctaText: 'Read the Full Story',
    quote:
      'In an age of automated ubiquity, the soul of haute horlogerie resides in the microscopically steady hand of the watchmaker at the wooden bench.',
    specs: [
      { label: 'Escapement', value: 'Free-Sprung Gyromax Balance with Breguet Overcoil' },
      { label: 'Tolerances', value: '±0.001 mm (1 Micron Micro-Tolerances)' },
      { label: 'Finishing Time', value: '45+ Hours of Hand-Chamfering per Movement' },
      { label: 'Oscillation Rate', value: '28,800 vph (4 Hz) with 72-Hour Reserve' },
      { label: 'Regulation', value: '6-Position Chronometric Testing over 21 Days' },
    ],
    sections: [
      {
        heading: 'The Sanctity of the Horological Atelier',
        content: [
          'Step across the threshold of a traditional Swiss watchmaking manufacture in the Jura valley or Lucerne, and the first sensation that greets you is absolute stillness. Filtered alpine light cascades across century-old solid beech benches, where master watchmakers work under stereoscopic optical magnification in laminar-flow, dust-free atmospheres.',
          'Every component—from the delicate teeth of a sub-millimeter pinion to the tempered hairspring thinner than a human hair—is handled exclusively with polished antimagnetic brass tweezers and elder pith wood. Here, patience is not a virtue; it is the fundamental medium through which mechanical time is sculpted.',
          'A single high-complication manufacture caliber comprises between 280 and 450 distinct parts. The master watchmaker must understand the thermodynamic behavior of every alloy, the surface tension of micro-synthetic oils, and the exact tactile resistance that signifies flawless gearing engagement.',
        ],
      },
      {
        heading: 'Hand-Finishing: Where Pure Mechanics Become Fine Art',
        content: [
          'While computer-controlled CNC lathes can mill steel and brass blanks to exacting tolerances, the transition from raw metal to haute horlogerie happens solely through hand-finishing (terminaison artisanale).',
          'Chief among these disciplines is anglage (hand-chamfering). Using progressively finer files, boxwood pegs coated with diamond paste, and gentian wood sourced from the Swiss Jura meadows, the artisan files away the sharp 90-degree edges of bridges to a uniform 45-degree mirror sheen. A rounded inward corner (angle entrant) cannot be cut by any automated machine; it requires hours of patient hand-scraping.',
          'Equally revered is poli noir (black polish or mirror polish). The steel component is rubbed with zinc plates and fine diamond dust in circular figures-of-eight until the surface becomes so optically flat that it reflects light only along one plane: turning pitch black from one viewing angle, and blazing like liquid mercury from another.',
        ],
      },
      {
        heading: 'The Human Element in Modern High-Tech Innovation',
        content: [
          'Modern horology has embraced revolutionary materials—from silicium escapements immune to magnetism to CVD galvanic coating baths that create iridescent Paraiba cyan hues across skeletonized bridges. Yet the paradox of luxury watchmaking is that high technology has elevated, rather than replaced, the artisan.',
          'When assembling an inverted flying tourbillon, the cage must be poised with micro-screws so that center-of-gravity deviations do not exceed 0.05 milligrams. No computer algorithm can replace the watchmaker’s tactile sense when tuning the poise of a balance wheel or adjusting the terminal curve of a Breguet hairspring.',
          'Each watch that leaves the atelier carries an invisible signature: the breath, heart rate, and decades of passed-down wisdom embedded in its mechanical pulse.',
        ],
      },
    ],
    galleryImages: [
      {
        url: '/images/hero/story_craftsmanship.jpg',
        caption: 'Master horologist hand-inserting a gold gear into an open-heart escapement with antimagnetic tweezers.',
      },
      {
        url: '/images/products/chronoswiss-tourbillon.png',
        caption: 'Inverted flying tourbillon movement with electric blue CVD dial finish and chamfered regulator bridges.',
      },
      {
        url: '/images/products/rolex-submariner.png',
        caption: 'Precision-calibrated automatic chronometer movement tested in six positions and extreme temperature variations.',
      },
    ],
  },
  {
    id: 'heritage',
    slug: 'heritage',
    route: '/stories/heritage',
    badge: 'HERITAGE',
    badgeType: 'gold',
    badgeIcon: 'Crown',
    title: 'The Historic Regulator Legacy',
    subtitle:
      'Trace the evolution of regulator watches, from their 18th-century origins to the modern icons that define horological excellence today.',
    author: 'Dr. Elisabeth Vance • Senior Horological Historian',
    date: '08 November 2026',
    readTime: '6 min read',
    heroImage: '/images/hero/story_heritage.jpg',
    ctaText: 'Explore Watch History',
    quote:
      'The regulator was born not as a luxury, but as the supreme scientific arbiter of truth—a decoupled clock against which all other timepieces were calibrated.',
    specs: [
      { label: 'Historical Origin', value: 'Mid-18th Century Astronomical Observatories' },
      { label: 'Dial Architecture', value: 'Decoupled Central Minute with Sub-Hours & Sub-Seconds' },
      { label: 'Modern Debut', value: '1988 (First Serial Wristwatch Regulator by Chronoswiss)' },
      { label: 'Signature Cues', value: 'Fluted Case Middle, Screwed Lugs, Onion Crown' },
      { label: 'Dial Guilloché', value: 'Hand-Turned on 1920s Antique Rose Engines' },
    ],
    sections: [
      {
        heading: 'Astronomical Observatories and the Search for Pure Truth',
        content: [
          'In the mid-18th century, before radio synchronized atomic clocks and global satellites, determining the exact time was an astronomical enterprise. Major observatories across Greenwich, Paris, and Neuchâtel monitored transit clocks aligned with stellar meridians.',
          'On traditional clocks with co-axial hour and minute hands, the overlapping hands obscured the dial for minutes at a time, risking crucial observational errors. To eliminate this parallax, clockmakers conceived the "regulator" dial: separating the displays so that the dominant minute hand reigned supreme across the full circumference, while hours and seconds occupied distinct, non-overlapping subdials.',
          'These towering pendulum clocks stood in the ateliers of master watchmakers, serving as the benchmark standard against which all newly finished marine chronometers and pocket watches were verified.',
        ],
      },
      {
        heading: 'The Audacious Wristwatch Revolution of 1988',
        content: [
          'By the late 1980s, the quartz crisis had decimated traditional Swiss watchmaking. Conventional wisdom insisted that mechanical watches were an obsolete curiosity. Yet visionary German-Swiss watchmaker Gerd-R. Lang recognized an unfulfilled yearning for pure, unadulterated horological heritage.',
          'In 1988, under the banner of Chronoswiss, Lang accomplished what no brand had ever attempted in serial production: he miniaturized the regulator dial from giant observatory wall clocks down to a 38mm stainless steel wristwatch.',
          'Featuring an unmistakable ribbed bezel, robust screwed strap bars, and an oversized onion crown designed for winding while wearing leather gloves, the Régulateur became an overnight triumph. It sparked an international renaissance of mechanical collector enthusiasm that continues to thrive today.',
        ],
      },
      {
        heading: 'The Modern Era: Flying Regulators and 3D Architecture',
        content: [
          'Today, the regulator has evolved from a historic tool into one of the most adventurous architectural canvases in luxury watchmaking.',
          'Modern flying regulators suspend the dial registers on bridges hovering millimeters above the mainplate. Intricate hand-guilloché guilloche patterns—carved line-by-line using hand-cranked rose engines dating back to 1924—catch the light in shimmering hypnotic waves.',
          'Combined with skeletonized gear trains, DLC coatings, and vivid galvanic coloring, the modern regulator bridges three centuries of uncompromising Swiss watchmaking.',
        ],
      },
    ],
    galleryImages: [
      {
        url: '/images/hero/story_heritage.jpg',
        caption: 'The contemporary Flying Regulator Tourbillon resting on a midnight slate pedestal.',
      },
      {
        url: '/images/hero/chronoswiss_website_ref.jpg',
        caption: 'Traditional hand-turned guilloché dial and decoupled hour/minute registers.',
      },
      {
        url: '/images/products/omega-speedmaster.png',
        caption: 'Historic chronograph heritage spanning observatory chronometry and space exploration.',
      },
    ],
  },
  {
    id: 'collectors-journal',
    slug: 'collectors-journal',
    route: '/stories/collectors-journal',
    badge: 'INSPIRING STORIES',
    badgeType: 'cyan',
    badgeIcon: 'BookOpen',
    title: 'Architectural Watches & Journeys',
    subtitle:
      'Discover how architecture, art and travel have inspired iconic watch designs, blending culture, design and the spirit of exploration.',
    author: 'Marcus Bennett • Curator, WatchHub Horology Archive',
    date: '02 November 2026',
    readTime: '8 min read',
    heroImage: '/images/hero/story_journeys.jpg',
    ctaText: "Read the Collector's Journal",
    quote:
      'A true mechanical watch is not merely an instrument that records the passage of hours; it is an enduring companion that carries the memory of landscapes, voyages, and human audacity.',
    specs: [
      { label: 'Inspiration', value: 'Brutalist Architecture, Nautical Cartography, High Alpinism' },
      { label: 'Complications', value: 'Bi-Directional 24-Hour GMT, Column-Wheel Flyback' },
      { label: 'Case Materials', value: 'Grade 5 Aerospace Titanium & Hand-Stitched Bridle Leather' },
      { label: 'Water Integrity', value: '300m / 30 ATM with Helium Escape Valve' },
      { label: 'Luminescence', value: 'Multi-Layer Super-LumiNova Grade X1 Blue/Green' },
    ],
    sections: [
      {
        heading: 'Horological Architecture: Structural Geometry on the Wrist',
        content: [
          'The intersection between grand architecture and haute horlogerie is profound. From the structural trusses of the Eiffel Tower to the cantilevered curves of Zaha Hadid and the stepped pediments of neoclassical facades, master watch designers borrow directly from the language of architects.',
          'Consider the multi-tier dial: where skeletonized bridges act as load-bearing arches, sapphire crystals provide transparent curtain walls, and guilloché dials reflect light like ribbed vaulting in a cathedral. The watch becomes a micro-cathedral designed to withstand 5,000 g of shock while maintaining chronometric precision.',
          'Case proportions—such as the golden ratio (1.618) governing the relationship between dial diameter, lug camber, and bezel thickness—ensure that the timepiece sits with natural ergonomic poise against the human wrist.',
        ],
      },
      {
        heading: 'Instruments of Exploration: From Ocean Depths to Alpine Summits',
        content: [
          'Throughout the twentieth century, every great leap of exploration had a mechanical timepiece clamped to a canvas sleeve. On transatlantic aviators’ wrists, rotating slide-rule bezels calculated fuel consumption against trade winds.',
          'In the subterranean depths of underwater exploration, diving watches with high-contrast dials and unidirectional ceramic bezels served as life-support equipment, calculating decompression stops with life-or-death accuracy.',
          'Even today, in an era of satellite navigation, explorer timepieces remain the ultimate analog fail-safe. Their movements are immune to software crashes, dead batteries, and electromagnetic disruption—beating steadfastly whether traversing Arctic tundra or crossing Saharan dunes.',
        ],
      },
      {
        heading: 'The Collector’s Philosophy: Curating Living History',
        content: [
          'Why do collectors treasure mechanical watches across lifetimes? Because unlike digital devices that become obsolete in months, a fine mechanical watch is immortal.',
          'The patina acquired by a leather strap, the faint sunburst oxidation on a champagne dial, and the mechanical whisper of the escapement tell a deeply intimate story of human journey. To own a fine watch is to be the temporary custodian of centuries of artisanal knowledge.',
          'When you hand down a mechanical timepiece to the next generation, you do not just pass along steel and sapphire; you pass along every journey, milestone, and triumph that watch bore witness to.',
        ],
      },
    ],
    galleryImages: [
      {
        url: '/images/hero/story_journeys.jpg',
        caption: 'Classic aviator chronograph resting alongside antique nautical maps and navigational brass compass.',
      },
      {
        url: '/images/products/tag-heuer-carrera.png',
        caption: 'High-speed motor racing chronograph inspired by the Carrera Panamericana endurance rally.',
      },
      {
        url: '/images/products/seiko-prospex-diver.png',
        caption: 'Professional diver timepiece built for deep oceanic exploration with luminescent markers.',
      },
    ],
  },
];

export const getStoryBySlug = (slug) => {
  if (!slug) return EDITORIAL_STORIES[0];
  const normalized = slug.toLowerCase().trim();
  return (
    EDITORIAL_STORIES.find(
      (s) => s.slug === normalized || s.id === normalized || s.route.endsWith(normalized)
    ) || EDITORIAL_STORIES[0]
  );
};
