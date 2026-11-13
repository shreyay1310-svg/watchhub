import { Product } from '../models/Product.js';

// Pre-seeded rich catalog matching the Store Admin reference UI
export const INITIAL_PRODUCTS = [
  {
    id: 'p_rol_001',
    name: 'Rolex Submariner Date 41mm',
    sku: 'WH-ROL-001',
    category: 'Luxury Watches',
    brand: 'Rolex',
    price: 18999,
    originalPrice: 24999,
    costPrice: 12000,
    discount: 24,
    stock: 24,
    status: 'Active',
    rating: 4.9,
    reviewsCount: 3840,
    isFeatured: true,
    image: '/images/products/featured_rolex_submariner.jpg',
    images: [
      '/images/products/featured_rolex_submariner.jpg',
      '/images/products/featured_rolex_daytona.jpg',
    ],
    specifications: {
      dialSize: '41 mm',
      dialShape: 'Round',
      dialColor: 'Black',
      caseMaterial: 'Oystersteel',
      caseColor: 'Silver',
      strapMaterial: 'Stainless Steel',
      strapColor: 'Silver',
      movementType: 'Automatic Self-Winding',
      displayType: 'Analog',
      waterResistance: '300M Diver',
      watchWeight: '155g',
      warranty: '5 Years Official International Warranty',
      countryOfOrigin: 'Switzerland',
    },
    warehouseLocation: 'Zone A - Luxury Vault (L-12)',
    barcode: '8901234567890',
    description: 'The benchmark among divers watches. Features Oystersteel case with Cerachrom unidirectional rotating ceramic bezel and Chromalight luminescent dial.',
  },
  {
    id: 'p_rol_002',
    name: 'Rolex Cosmograph Daytona Gold',
    sku: 'WH-ROL-002',
    category: 'Luxury Watches',
    brand: 'Rolex',
    price: 21999,
    originalPrice: 29999,
    costPrice: 14500,
    discount: 27,
    stock: 18,
    status: 'Active',
    rating: 4.9,
    reviewsCount: 4120,
    isFeatured: true,
    image: '/images/products/featured_rolex_daytona.jpg',
    images: ['/images/products/featured_rolex_daytona.jpg'],
    specifications: {
      dialSize: '40 mm',
      dialShape: 'Round',
      dialColor: 'Champagne Gold',
      caseMaterial: '18 ct Yellow Gold',
      caseColor: 'Gold',
      strapMaterial: '18 ct Yellow Gold',
      strapColor: 'Gold',
      movementType: 'Calibre 4130 Chronograph',
      displayType: 'Chronograph',
      waterResistance: '100M Water Resistant',
      watchWeight: '190g',
      warranty: '5 Years Official International Warranty',
      countryOfOrigin: 'Switzerland',
    },
    warehouseLocation: 'Zone A - Luxury Vault (L-15)',
    barcode: '8901234567891',
    description: 'Iconic motor racing chronograph designed for endurance racing drivers. 18 ct yellow gold with champagne sunburst dial and engraved tachymetric bezel.',
  },
  {
    id: 'p_omg_001',
    name: 'Omega Speedmaster Professional',
    sku: 'WH-OMG-001',
    category: 'Men\'s Watches',
    brand: 'Omega',
    price: 16499,
    originalPrice: 22000,
    costPrice: 11000,
    discount: 25,
    stock: 32,
    status: 'Active',
    rating: 4.8,
    reviewsCount: 2950,
    isFeatured: true,
    image: '/images/products/featured_omega_speedmaster.jpg',
    images: ['/images/products/featured_omega_speedmaster.jpg'],
    specifications: {
      dialSize: '42 mm',
      dialShape: 'Round',
      dialColor: 'Matte Black',
      caseMaterial: 'Stainless Steel',
      caseColor: 'Silver',
      strapMaterial: 'Stainless Steel Bracelet',
      strapColor: 'Silver',
      movementType: 'Manual-Winding Co-Axial Master Chronometer 3861',
      displayType: 'Chronograph',
      waterResistance: '50M Water Resistant',
      watchWeight: '138g',
      warranty: '5 Years International Warranty',
      countryOfOrigin: 'Switzerland',
    },
    warehouseLocation: 'Zone A - Luxury Vault (M-04)',
    barcode: '8901234567892',
    description: 'The legendary Moonwatch. Tested on all six lunar missions. Hesalite crystal and Seahorse medallion caseback.',
  },
  {
    id: 'p_omg_002',
    name: 'Omega Seamaster Diver 300M',
    sku: 'WH-OMG-002',
    category: 'Sports Watches',
    brand: 'Omega',
    price: 14999,
    originalPrice: 19999,
    costPrice: 9800,
    discount: 25,
    stock: 15,
    status: 'Active',
    rating: 4.8,
    reviewsCount: 2100,
    isFeatured: true,
    image: '/images/products/featured_omega_seamaster.jpg',
    images: ['/images/products/featured_omega_seamaster.jpg'],
    specifications: {
      dialSize: '42 mm',
      dialShape: 'Round',
      dialColor: 'Wave-Engraved Blue Ceramic',
      caseMaterial: 'Stainless Steel',
      caseColor: 'Silver',
      strapMaterial: 'Steel Bracelet',
      strapColor: 'Silver',
      movementType: 'Automatic Co-Axial Master Chronometer 8800',
      displayType: 'Analog',
      waterResistance: '300M Professional Diver',
      watchWeight: '162g',
      warranty: '5 Years Official International Warranty',
      countryOfOrigin: 'Switzerland',
    },
    warehouseLocation: 'Zone B - Sports Vault (S-08)',
    barcode: '8901234567893',
    description: 'Since 1993, the Seamaster Diver 300M has enjoyed a legendary following. Laser-engraved wave dial with helium escape valve.',
  },
  {
    id: 'p_pp_001',
    name: 'Patek Philippe Nautilus 5711',
    sku: 'WH-PP-001',
    category: 'Luxury Watches',
    brand: 'Patek Philippe',
    price: 5499000,
    originalPrice: 5999000,
    costPrice: 4200000,
    discount: 8,
    stock: 5,
    status: 'Active',
    rating: 4.9,
    reviewsCount: 540,
    isFeatured: true,
    image: '/images/products/featured_patek_nautilus.jpg',
    images: ['/images/products/featured_patek_nautilus.jpg'],
    specifications: {
      dialSize: '40 mm',
      dialShape: 'Porothole Octagonal',
      dialColor: 'Gradated Blue Sunburst',
      caseMaterial: 'Stainless Steel',
      caseColor: 'Silver',
      strapMaterial: 'Steel Bracelet',
      strapColor: 'Silver',
      movementType: 'Mechanical Self-Winding Caliber 26-330 S C',
      displayType: 'Analog',
      waterResistance: '120M Water Resistant',
      watchWeight: '115g',
      warranty: 'Geneva Seal Lifetime Certified Warranty',
      countryOfOrigin: 'Switzerland',
    },
    warehouseLocation: 'Zone A - Ultra High Vault (U-01)',
    barcode: '8901234567894',
    description: 'With the rounded octagonal shape of its bezel, ingenious porthole construction and horizontally embossed dial, the Nautilus has epitomized the elegant sports watch since 1976.',
  },
  {
    id: 'p_ap_001',
    name: 'Audemars Piguet Royal Oak',
    sku: 'WH-AP-001',
    category: 'Luxury Watches',
    brand: 'Audemars Piguet',
    price: 4299000,
    originalPrice: 4899000,
    costPrice: 3300000,
    discount: 12,
    stock: 6,
    status: 'Active',
    rating: 4.8,
    reviewsCount: 420,
    isFeatured: true,
    image: '/images/products/featured_ap_royal_oak.jpg',
    images: ['/images/products/featured_ap_royal_oak.jpg'],
    specifications: {
      dialSize: '41 mm',
      dialShape: 'Octagonal with 8 Screws',
      dialColor: 'Grande Tapisserie Grey',
      caseMaterial: 'Stainless Steel',
      caseColor: 'Silver',
      strapMaterial: 'Steel Integrated Bracelet',
      strapColor: 'Silver',
      movementType: 'Calibre 4302 Selfwinding',
      displayType: 'Analog',
      waterResistance: '50M Water Resistant',
      watchWeight: '148g',
      warranty: '5 Years Official Manufacture Warranty',
      countryOfOrigin: 'Switzerland',
    },
    warehouseLocation: 'Zone A - Ultra High Vault (U-03)',
    barcode: '8901234567895',
    description: 'The iconic octagonal steel watch created by Gerald Genta. Hand-finished satin brushing, white gold hexagonal screws and Grande Tapisserie dial.',
  },
  {
    id: 'p_car_001',
    name: 'Cartier Tank Must',
    sku: 'WH-CAR-001',
    category: 'Women\'s Watches',
    brand: 'Cartier',
    price: 349000,
    originalPrice: 389000,
    costPrice: 240000,
    discount: 10,
    stock: 12,
    status: 'Active',
    rating: 4.7,
    reviewsCount: 980,
    isFeatured: true,
    image: '/images/products/featured_cartier_tank.jpg',
    images: ['/images/products/featured_cartier_tank.jpg'],
    specifications: {
      dialSize: '33 mm',
      dialShape: 'Rectangular',
      dialColor: 'Silvered Opaline Dial',
      caseMaterial: 'Rose Gold & Steel',
      caseColor: 'Rose Gold',
      strapMaterial: 'Alligator Leather',
      strapColor: 'Burgundy / Brown',
      movementType: 'High Autonomy Quartz Movement',
      displayType: 'Analog Roman Numerals',
      waterResistance: '30M Water Resistant',
      watchWeight: '62g',
      warranty: '8 Years Cartier Care Warranty',
      countryOfOrigin: 'Switzerland',
    },
    warehouseLocation: 'Zone B - Women\'s Vault (W-02)',
    barcode: '8901234567896',
    description: 'Created by Louis Cartier in 1917, the legendary Tank watch is a timeless icon of Parisian luxury with blue cabochon spinel crown and blued-steel sword hands.',
  },
  {
    id: 'p_apl_001',
    name: 'Apple Watch Series 10',
    sku: 'WH-APL-001',
    category: 'Smartwatches',
    brand: 'Apple',
    price: 46900,
    originalPrice: 54900,
    costPrice: 38000,
    discount: 15,
    stock: 28,
    status: 'Active',
    rating: 4.6,
    reviewsCount: 6200,
    isFeatured: true,
    image: '/images/products/featured_apple_watch.jpg',
    images: ['/images/products/featured_apple_watch.jpg'],
    specifications: {
      dialSize: '46 mm',
      dialShape: 'Curved Rectangle',
      dialColor: 'Always-On Retina OLED',
      caseMaterial: 'Jet Black Aluminium',
      caseColor: 'Midnight Black',
      strapMaterial: 'Fluoroelastomer Sport Band',
      strapColor: 'Midnight',
      movementType: 'S10 SiP with 64-bit Dual-Core',
      displayType: 'OLED Touchscreen 2000 nits',
      waterResistance: '50M Swimproof',
      watchWeight: '36.4g',
      warranty: '1 Year Apple Official Warranty + AppleCare+',
      countryOfOrigin: 'USA',
    },
    warehouseLocation: 'Zone C - Electronics Vault (E-10)',
    barcode: '8901234567897',
    description: 'Thinnest Apple Watch ever with our biggest display. Advanced ECG, sleep apnea detection, blood oxygen monitor and fastest charging ever.',
  },
];

// In-memory products state for live operations
let productsCache = [...INITIAL_PRODUCTS];

// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const { status, category, brand, search, featured } = req.query;
    let list = [...productsCache];

    if (status && status !== 'All') {
      list = list.filter((p) => p.status.toLowerCase() === status.toLowerCase());
    }
    if (category && category !== 'All') {
      list = list.filter((p) => p.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (brand && brand !== 'All') {
      list = list.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
    }
    if (featured === 'true') {
      list = list.filter((p) => p.isFeatured);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }

    res.status(200).json({
      status: 'success',
      count: list.length,
      data: list,
      stats: {
        total: productsCache.length,
        active: productsCache.filter((p) => p.status === 'Active').length,
        draft: productsCache.filter((p) => p.status === 'Draft').length,
        outOfStock: productsCache.filter((p) => p.stock === 0 || p.status === 'Out of Stock').length,
        averageRating: 4.6,
      },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
  const { id } = req.params;
  const product = productsCache.find((p) => p.id === id || p.sku.toUpperCase() === id.toUpperCase());
  if (!product) {
    return res.status(404).json({ status: 'fail', message: 'Product not found.' });
  }
  res.status(200).json({ status: 'success', data: product });
};

// POST /api/products
export const createProduct = async (req, res) => {
  try {
    const { name, sku, price, brand, category } = req.body;
    if (!name || !sku || !price || !brand || !category) {
      return res.status(400).json({
        status: 'fail',
        message: 'Name, SKU, Brand, Category and Selling Price are required.',
      });
    }

    // Check SKU duplicate
    const existing = productsCache.find((p) => p.sku.toUpperCase() === sku.toUpperCase());
    if (existing) {
      return res.status(400).json({
        status: 'fail',
        message: `SKU "${sku}" already exists! Please use a unique SKU.`,
      });
    }

    const original = Number(req.body.originalPrice) || Number(price);
    const cost = Number(req.body.costPrice) || Math.round(Number(price) * 0.65);
    const discount = original > Number(price) ? Math.round(((original - Number(price)) / original) * 100) : 0;

    const newProd = {
      id: `p_${Date.now()}`,
      name,
      sku: sku.toUpperCase(),
      brand,
      category,
      price: Number(price),
      originalPrice: original,
      costPrice: cost,
      discount,
      profitMargin: Number(price) - cost,
      stock: Number(req.body.stock) || 10,
      status: req.body.status || 'Active',
      rating: 4.5,
      reviewsCount: 0,
      isFeatured: req.body.isFeatured || false,
      image: req.body.image || '/images/products/featured_rolex_submariner.jpg',
      images: req.body.images || [req.body.image || '/images/products/featured_rolex_submariner.jpg'],
      specifications: req.body.specifications || {},
      variants: req.body.variants || [],
      warehouseLocation: req.body.warehouseLocation || 'Zone A - Luxury Vault',
      barcode: req.body.barcode || `890${Date.now().toString().slice(-10)}`,
      description: req.body.description || 'WatchHub Luxury Certified Timepiece.',
      createdAt: new Date().toISOString(),
    };

    productsCache.unshift(newProd);

    res.status(201).json({
      status: 'success',
      message: 'Product created successfully.',
      data: newProd,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const index = productsCache.findIndex((p) => p.id === id || p.sku === id);
    if (index === -1) {
      return res.status(404).json({ status: 'fail', message: 'Product not found.' });
    }

    const updated = {
      ...productsCache[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    productsCache[index] = updated;

    res.status(200).json({
      status: 'success',
      message: 'Product updated successfully.',
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const beforeCount = productsCache.length;
    productsCache = productsCache.filter((p) => p.id !== id && p.sku !== id);

    if (productsCache.length === beforeCount) {
      return res.status(404).json({ status: 'fail', message: 'Product not found.' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully.',
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// POST /api/products/bulk
export const bulkProductsAction = async (req, res) => {
  try {
    const { action, ids, products } = req.body;

    if (action === 'import' && Array.isArray(products)) {
      let imported = 0;
      let skipped = 0;
      const errors = [];

      products.forEach((prod) => {
        if (!prod.name || !prod.sku) {
          errors.push(`Row missing name or SKU: ${JSON.stringify(prod)}`);
          skipped++;
          return;
        }
        if (productsCache.some((p) => p.sku.toUpperCase() === prod.sku.toUpperCase())) {
          errors.push(`SKU ${prod.sku} already exists.`);
          skipped++;
          return;
        }

        productsCache.unshift({
          id: `p_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          name: prod.name,
          sku: prod.sku.toUpperCase(),
          brand: prod.brand || 'WatchHub Heritage',
          category: prod.category || 'Luxury Watches',
          price: Number(prod.price) || 9999,
          originalPrice: Number(prod.originalPrice) || Number(prod.price || 9999) * 1.25,
          stock: Number(prod.stock) || 10,
          status: prod.status || 'Active',
          rating: 4.5,
          reviewsCount: 1,
          image: prod.image || '/images/products/featured_rolex_submariner.jpg',
        });
        imported++;
      });

      return res.status(200).json({
        status: 'success',
        message: `Import complete: ${imported} imported, ${skipped} skipped.`,
        imported,
        skipped,
        errors,
      });
    }

    if (action === 'delete' && Array.isArray(ids)) {
      productsCache = productsCache.filter((p) => !ids.includes(p.id) && !ids.includes(p.sku));
      return res.status(200).json({ status: 'success', message: `${ids.length} products deleted.` });
    }

    if (action === 'activate' && Array.isArray(ids)) {
      productsCache = productsCache.map((p) => (ids.includes(p.id) || ids.includes(p.sku) ? { ...p, status: 'Active' } : p));
      return res.status(200).json({ status: 'success', message: `${ids.length} products activated.` });
    }

    if (action === 'deactivate' && Array.isArray(ids)) {
      productsCache = productsCache.map((p) => (ids.includes(p.id) || ids.includes(p.sku) ? { ...p, status: 'Draft' } : p));
      return res.status(200).json({ status: 'success', message: `${ids.length} products moved to draft.` });
    }

    if (action === 'feature' && Array.isArray(ids)) {
      productsCache = productsCache.map((p) => (ids.includes(p.id) || ids.includes(p.sku) ? { ...p, isFeatured: true } : p));
      return res.status(200).json({ status: 'success', message: `${ids.length} products marked as featured.` });
    }

    res.status(400).json({ status: 'fail', message: 'Invalid bulk action.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
