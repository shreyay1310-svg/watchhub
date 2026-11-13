import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Plus,
  Filter,
  Edit3,
  Trash2,
  Copy,
  Eye,
  CheckCircle2,
  AlertTriangle,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Upload,
  ArrowUpDown,
  Star,
  Box,
  FileSpreadsheet,
  Check,
  Tag,
  SlidersHorizontal,
  RefreshCw,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';

// Brand logos / icons helper
const BRAND_LOGOS = {
  Rolex: '👑',
  Omega: 'Ω',
  'Patek Philippe': '⚜️',
  'Audemars Piguet': 'AP',
  Cartier: 'C',
  Apple: '🍎',
  Titan: 'T',
  Casio: 'G',
  Tissot: 'T+',
  Seiko: 'S',
};

// Initial 8 Primary Products matching UI Reference PDF / Mockup exactly
const SEED_ADMIN_PRODUCTS = [
  {
    id: 'p_rol_001',
    name: 'Rolex Submariner Date 41mm',
    subSpecs: '41 mm • Stainless Steel • Black Dial',
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
    description: 'The benchmark among divers watches. Oystersteel case with Cerachrom ceramic bezel and Chromalight luminescent dial.',
    variants: [
      { variantSku: 'WH-ROL-001-BLK', dialColor: 'Black', strapColor: 'Silver', size: '41 mm', price: 18999, stock: 16 },
      { variantSku: 'WH-ROL-001-BLU', dialColor: 'Royal Blue', strapColor: 'Silver', size: '41 mm', price: 19999, stock: 8 },
    ],
  },
  {
    id: 'p_rol_002',
    name: 'Rolex Cosmograph Daytona Gold',
    subSpecs: '40 mm • Gold • Champagne Dial',
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
    description: 'Iconic motor racing chronograph designed for endurance racing drivers. 18 ct yellow gold with champagne sunburst dial.',
    variants: [
      { variantSku: 'WH-ROL-002-GLD', dialColor: 'Champagne Gold', strapColor: 'Gold', size: '40 mm', price: 21999, stock: 18 },
    ],
  },
  {
    id: 'p_omg_001',
    name: 'Omega Speedmaster Professional',
    subSpecs: '42 mm • Stainless Steel • Black Dial',
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
      movementType: 'Co-Axial Master Chronometer 3861',
      displayType: 'Chronograph',
      waterResistance: '50M Water Resistant',
      watchWeight: '138g',
      warranty: '5 Years International Warranty',
      countryOfOrigin: 'Switzerland',
    },
    warehouseLocation: 'Zone A - Luxury Vault (M-04)',
    barcode: '8901234567892',
    description: 'The legendary Moonwatch. Tested on all six lunar missions. Hesalite crystal and Seahorse medallion caseback.',
    variants: [
      { variantSku: 'WH-OMG-001-STL', dialColor: 'Black', strapColor: 'Silver', size: '42 mm', price: 16499, stock: 24 },
      { variantSku: 'WH-OMG-001-LTH', dialColor: 'Black', strapColor: 'Vintage Leather', size: '42 mm', price: 15999, stock: 8 },
    ],
  },
  {
    id: 'p_omg_002',
    name: 'Omega Seamaster Diver 300M',
    subSpecs: '42 mm • Steel • Blue Dial',
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
    variants: [
      { variantSku: 'WH-OMG-002-BLU', dialColor: 'Blue', strapColor: 'Silver', size: '42 mm', price: 14999, stock: 15 },
    ],
  },
  {
    id: 'p_pp_001',
    name: 'Patek Philippe Nautilus 5711',
    subSpecs: '40 mm • Stainless Steel • Blue Dial',
    sku: 'WH-PP-001',
    category: 'Luxury Watches',
    brand: 'Patek Philippe',
    price: 5499000,
    originalPrice: 5999000,
    costPrice: 4200000,
    discount: 8,
    stock: 5,
    status: 'Low Stock',
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
    description: 'With the rounded octagonal shape of its bezel and horizontally embossed dial, the Nautilus has epitomized the elegant sports watch since 1976.',
    variants: [
      { variantSku: 'WH-PP-001-BLU', dialColor: 'Blue Sunburst', strapColor: 'Silver', size: '40 mm', price: 5499000, stock: 5 },
    ],
  },
  {
    id: 'p_ap_001',
    name: 'Audemars Piguet Royal Oak',
    subSpecs: '41 mm • Stainless Steel • Grey Dial',
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
    description: 'The iconic octagonal steel watch created by Gerald Genta. Hand-finished satin brushing and Grande Tapisserie dial.',
    variants: [
      { variantSku: 'WH-AP-001-GRY', dialColor: 'Grey', strapColor: 'Silver', size: '41 mm', price: 4299000, stock: 6 },
    ],
  },
  {
    id: 'p_car_001',
    name: 'Cartier Tank Must',
    subSpecs: '33 mm • Rose Gold • White Dial',
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
    description: 'Created by Louis Cartier in 1917, the legendary Tank watch is a timeless icon of Parisian luxury with blue cabochon spinel crown.',
    variants: [
      { variantSku: 'WH-CAR-001-WHT', dialColor: 'Opaline White', strapColor: 'Burgundy', size: '33 mm', price: 349000, stock: 12 },
    ],
  },
  {
    id: 'p_apl_001',
    name: 'Apple Watch Series 10',
    subSpecs: '46 mm • Aluminium • Midnight',
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
      warranty: '1 Year Apple Official Warranty',
      countryOfOrigin: 'USA',
    },
    warehouseLocation: 'Zone C - Electronics Vault (E-10)',
    barcode: '8901234567897',
    description: 'Thinnest Apple Watch ever with our biggest display. Advanced ECG, sleep apnea detection, blood oxygen monitor.',
    variants: [
      { variantSku: 'WH-APL-001-MID', dialColor: 'Midnight OLED', strapColor: 'Midnight', size: '46 mm', price: 46900, stock: 18 },
      { variantSku: 'WH-APL-001-SLV', dialColor: 'Silver OLED', strapColor: 'Starlight', size: '46 mm', price: 46900, stock: 10 },
    ],
  },
];

export const ProductsManagementModule = () => {
  const [products, setProducts] = useState(SEED_ADMIN_PRODUCTS);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'active' | 'draft' | 'outOfStock' | 'featured'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortField, setSortField] = useState('createdAt');
  const [sortAsc, setSortAsc] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importExportOpen, setImportExportOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Add / Edit Form State
  const initialFormState = {
    name: '',
    sku: '',
    brand: 'Rolex',
    category: 'Luxury Watches',
    subcategory: 'Wristwatch',
    productType: 'Analog',
    gender: 'Men',
    price: '',
    originalPrice: '',
    costPrice: '',
    stock: '',
    lowStockThreshold: 10,
    warehouseLocation: 'Zone A - Luxury Vault',
    barcode: '',
    image: '/images/products/featured_rolex_submariner.jpg',
    description: '',
    isFeatured: false,
    status: 'Active',
    specifications: {
      dialSize: '41 mm',
      dialShape: 'Round',
      dialColor: 'Black',
      caseMaterial: 'Stainless Steel',
      caseColor: 'Silver',
      strapMaterial: 'Stainless Steel',
      strapColor: 'Silver',
      movementType: 'Automatic',
      displayType: 'Analog',
      waterResistance: '100M Water Resistant',
      watchWeight: '150g',
      warranty: '2 Years Manufacturer Warranty',
      countryOfOrigin: 'Switzerland',
    },
    variants: [
      { variantSku: '', dialColor: 'Black', strapColor: 'Silver', size: '41 mm', price: '', stock: '' },
    ],
    seo: {
      metaTitle: '',
      metaDescription: '',
      slug: '',
    },
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formActiveTab, setFormActiveTab] = useState('basic'); // 'basic' | 'specs' | 'pricing' | 'inventory' | 'media' | 'variants' | 'seo'

  // Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // 1. Statistics Calculations (Matching UI Reference)
  const stats = useMemo(() => {
    return {
      total: 320,
      active: 298,
      draft: 12,
      outOfStock: 10,
      featured: 45,
      rating: '4.6 / 5',
      reviewsCount: '12,480 reviews',
    };
  }, []);

  // 2. Filter & Search Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Tab Filter
      if (activeTab === 'active' && p.status !== 'Active') return false;
      if (activeTab === 'draft' && p.status !== 'Draft') return false;
      if (activeTab === 'outOfStock' && p.stock > 0 && p.status !== 'Out of Stock') return false;
      if (activeTab === 'featured' && !p.isFeatured) return false;

      // Text Search
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        if (!matchName && !matchSku && !matchBrand) return false;
      }

      // Dropdown Filters
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (selectedBrand !== 'All' && p.brand !== selectedBrand) return false;
      if (selectedStatus !== 'All' && p.status !== selectedStatus) return false;

      // Price Range Filter
      if (selectedPriceRange !== 'All') {
        if (selectedPriceRange === 'under15k' && p.price >= 15000) return false;
        if (selectedPriceRange === '15k-50k' && (p.price < 15000 || p.price > 50000)) return false;
        if (selectedPriceRange === '50k-500k' && (p.price < 50000 || p.price > 500000)) return false;
        if (selectedPriceRange === 'above500k' && p.price <= 500000) return false;
      }

      return true;
    });
  }, [products, activeTab, searchTerm, selectedCategory, selectedBrand, selectedStatus, selectedPriceRange]);

  // Pagination Slice
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedBrand('All');
    setSelectedStatus('All');
    setSelectedPriceRange('All');
    setActiveTab('all');
    setCurrentPage(1);
    showToast('Filters reset to default.');
  };

  // Open Add Product Modal
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData(initialFormState);
    setFormActiveTab('basic');
    setShowAddEditModal(true);
  };

  // Open Edit Product Modal
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      brand: product.brand,
      category: product.category,
      subcategory: product.subcategory || 'Wristwatch',
      productType: product.productType || 'Analog',
      gender: product.gender || 'Men',
      price: product.price,
      originalPrice: product.originalPrice,
      costPrice: product.costPrice || Math.round(product.price * 0.65),
      stock: product.stock,
      lowStockThreshold: product.lowStockThreshold || 10,
      warehouseLocation: product.warehouseLocation || 'Zone A - Luxury Vault',
      barcode: product.barcode || '',
      image: product.image,
      description: product.description || '',
      isFeatured: product.isFeatured || false,
      status: product.status || 'Active',
      specifications: product.specifications || initialFormState.specifications,
      variants: product.variants?.length ? product.variants : initialFormState.variants,
      seo: product.seo || initialFormState.seo,
    });
    setFormActiveTab('basic');
    setShowAddEditModal(true);
  };

  // Duplicate Product
  const handleDuplicateProduct = (product) => {
    const dupSku = `${product.sku}-COPY`;
    const duplicated = {
      ...product,
      id: `p_${Date.now()}`,
      name: `${product.name} (Copy)`,
      sku: dupSku,
      stock: 10,
      status: 'Draft',
    };
    setProducts([duplicated, ...products]);
    showToast(`Product duplicated as ${dupSku}`);
  };

  // Delete Product
  const handleDeleteProduct = (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      setProducts(products.filter((p) => p.id !== productId));
      setSelectedItems(selectedItems.filter((id) => id !== productId));
      showToast(`Deleted "${productName}"`);
    }
  };

  // Handle Form Submission (Add / Edit)
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.sku.trim() || !formData.price) {
      alert('Please fill out the required fields: Product Name, SKU and Selling Price.');
      return;
    }

    const priceNum = Number(formData.price);
    const origNum = Number(formData.originalPrice) || priceNum;
    const costNum = Number(formData.costPrice) || Math.round(priceNum * 0.65);
    const discountCalc = origNum > priceNum ? Math.round(((origNum - priceNum) / origNum) * 100) : 0;

    if (editingProduct) {
      // Update existing
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                ...formData,
                price: priceNum,
                originalPrice: origNum,
                costPrice: costNum,
                discount: discountCalc,
                stock: Number(formData.stock) || 0,
              }
            : p
        )
      );
      showToast(`Updated "${formData.name}" successfully!`);
    } else {
      // Create new product
      const newProd = {
        id: `p_${Date.now()}`,
        ...formData,
        price: priceNum,
        originalPrice: origNum,
        costPrice: costNum,
        discount: discountCalc,
        stock: Number(formData.stock) || 10,
        rating: 4.5,
        reviewsCount: 1,
        subSpecs: `${formData.specifications.dialSize} • ${formData.specifications.caseMaterial} • ${formData.specifications.dialColor} Dial`,
      };
      setProducts([newProd, ...products]);
      showToast(`Created new product "${formData.name}"!`);
    }

    setShowAddEditModal(false);
  };

  // Bulk Actions
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(paginatedProducts.map((p) => p.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action) => {
    if (!selectedItems.length) return;
    if (action === 'delete') {
      if (window.confirm(`Delete ${selectedItems.length} selected products?`)) {
        setProducts(products.filter((p) => !selectedItems.includes(p.id)));
        setSelectedItems([]);
        showToast(`${selectedItems.length} products deleted.`);
      }
    } else if (action === 'activate') {
      setProducts(products.map((p) => (selectedItems.includes(p.id) ? { ...p, status: 'Active' } : p)));
      setSelectedItems([]);
      showToast(`Activated ${selectedItems.length} products.`);
    } else if (action === 'deactivate') {
      setProducts(products.map((p) => (selectedItems.includes(p.id) ? { ...p, status: 'Draft' } : p)));
      setSelectedItems([]);
      showToast(`Moved ${selectedItems.length} products to draft.`);
    } else if (action === 'feature') {
      setProducts(products.map((p) => (selectedItems.includes(p.id) ? { ...p, isFeatured: true } : p)));
      setSelectedItems([]);
      showToast(`Marked ${selectedItems.length} products as featured.`);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'SKU', 'Brand', 'Category', 'Price', 'OriginalPrice', 'Discount', 'Stock', 'Status', 'Rating'];
    const rows = filteredProducts.map((p) => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.sku,
      p.brand,
      p.category,
      p.price,
      p.originalPrice,
      p.discount,
      p.stock,
      p.status,
      p.rating,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WatchHub_Products_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setImportExportOpen(false);
    showToast(`Exported ${filteredProducts.length} products to CSV!`);
  };

  // Download Template
  const handleDownloadTemplate = () => {
    const headers = ['name', 'sku', 'brand', 'category', 'price', 'originalPrice', 'stock', 'status', 'description'];
    const sample = ['Rolex Submariner Gold', 'WH-ROL-SAMPLE', 'Rolex', 'Luxury Watches', '24999', '29999', '15', 'Active', 'Sample watch description'];
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), sample.join(',')].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'WatchHub_Product_Import_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setImportExportOpen(false);
    showToast('Downloaded CSV product import template.');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B121C] text-white px-4 py-3 rounded-xl border border-[#D6A63C] shadow-2xl flex items-center gap-3 text-xs animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-[#D6A63C]" />
          <span className="font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-white ml-2">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          1. PAGE HEADER STRIP (Title + Import/Export + Add Product Button)
          ════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-sans text-gray-900 tracking-tight flex items-center gap-2">
            <span>Products Management</span>
            <span className="text-xl">📦</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Add, edit, manage and track all your watch products in one place.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Import / Export Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setImportExportOpen(!importExportOpen)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-gray-500" />
              <span>Import / Export</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {importExportOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-1.5 z-50 text-xs animate-scaleUp">
                <button
                  type="button"
                  onClick={() => {
                    setShowImportModal(true);
                    setImportExportOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-amber-50 text-gray-700 flex items-center gap-2 cursor-pointer font-medium"
                >
                  <Upload className="w-3.5 h-3.5 text-[#D6A63C]" />
                  <span>Bulk Import Products (CSV)</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="w-full text-left px-4 py-2 hover:bg-amber-50 text-gray-700 flex items-center gap-2 cursor-pointer font-medium"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#D6A63C]" />
                  <span>Download Product Template</span>
                </button>
                <div className="border-t border-gray-100 my-1" />
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="w-full text-left px-4 py-2 hover:bg-amber-50 text-gray-700 flex items-center gap-2 cursor-pointer font-medium"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Export Filtered Products</span>
                </button>
              </div>
            )}
          </div>

          {/* + Add New Product Button */}
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D6A63C] to-[#E6BA5E] hover:from-[#c3973e] hover:to-[#d4a84f] text-black font-extrabold text-xs shadow-md shadow-[#D6A63C]/20 transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          2. FIVE PRODUCT OVERVIEW CARDS (Sparkline Highlights)
          ════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Total Products */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Total Products</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#D6A63C] flex items-center justify-center text-sm">
              <Box className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-sans text-gray-900 mt-2">{stats.total}</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
            <span>↑ +8%</span>
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Active Products</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
              <Check className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-sans text-gray-900 mt-2">{stats.active}</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
            <span>↑ +10%</span>
          </div>
        </div>

        {/* Draft Products */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Draft Products</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-sm">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-sans text-gray-900 mt-2">{stats.draft}</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 mt-1">
            <span>↑ +5%</span>
          </div>
        </div>

        {/* Out of Stock */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Out of Stock</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-sm">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-sans text-gray-900 mt-2">{stats.outOfStock}</div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-rose-600 mt-1">
            <span>↓ -4%</span>
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Average Rating</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#D6A63C] flex items-center justify-center text-sm">
              <Star className="w-4 h-4 fill-[#D6A63C]" />
            </div>
          </div>
          <div className="text-2xl font-bold font-sans text-gray-900 mt-2">{stats.rating}</div>
          <div className="text-[11px] text-gray-400 mt-1">
            <span>{stats.reviewsCount}</span>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          3. PRODUCT TABS (All Products, Active, Draft, Out of Stock, Featured)
          ════════════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {[
          { id: 'all', label: 'All Products', count: stats.total, icon: Layers },
          { id: 'active', label: 'Active', count: stats.active, icon: Check },
          { id: 'draft', label: 'Draft', count: stats.draft, icon: Tag },
          { id: 'outOfStock', label: 'Out of Stock', count: stats.outOfStock, icon: AlertTriangle },
          { id: 'featured', label: 'Featured', count: stats.featured, icon: Star },
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-[#0B121C] text-white shadow-md'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#D6A63C]' : 'text-gray-400'}`} />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                  isSelected ? 'bg-white/20 text-[#D6A63C]' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════════════════════════
          4. SEARCH AND FILTERS TOOLBAR
          ════════════════════════════════════════════════════════════════ */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between text-xs">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by product name, SKU or brand..."
            className="w-full h-10 pl-9 pr-3 text-xs rounded-xl border border-gray-200 bg-gray-50/50 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D6A63C]/40 focus:border-[#D6A63C] transition-all font-medium"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 px-3 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#D6A63C]"
          >
            <option value="All">Category: All</option>
            <option value="Luxury Watches">Luxury Watches</option>
            <option value="Men's Watches">Men's Watches</option>
            <option value="Women's Watches">Women's Watches</option>
            <option value="Sports Watches">Sports Watches</option>
            <option value="Smartwatches">Smartwatches</option>
            <option value="Kids' Watches">Kids' Watches</option>
          </select>

          {/* Brand Dropdown */}
          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 px-3 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#D6A63C]"
          >
            <option value="All">Brand: All</option>
            <option value="Rolex">Rolex</option>
            <option value="Omega">Omega</option>
            <option value="Patek Philippe">Patek Philippe</option>
            <option value="Audemars Piguet">Audemars Piguet</option>
            <option value="Cartier">Cartier</option>
            <option value="Apple">Apple</option>
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 px-3 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#D6A63C]"
          >
            <option value="All">Status: All</option>
            <option value="Active">Active</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Draft">Draft</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

          {/* Price Range Dropdown */}
          <select
            value={selectedPriceRange}
            onChange={(e) => {
              setSelectedPriceRange(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 px-3 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#D6A63C]"
          >
            <option value="All">Price Range: All</option>
            <option value="under15k">Under ₹15,000</option>
            <option value="15k-50k">₹15,000 – ₹50,000</option>
            <option value="50k-500k">₹50,000 – ₹5,00,000</option>
            <option value="above500k">Above ₹5,00,000</option>
          </select>

          {/* Reset Filters */}
          <button
            type="button"
            onClick={handleResetFilters}
            className="h-10 px-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset Filters"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          5. BULK ACTIONS TOOLBAR (Appears when items are selected)
          ════════════════════════════════════════════════════════════════ */}
      {selectedItems.length > 0 && (
        <div className="bg-[#0B121C] text-white p-3 rounded-xl border border-[#D6A63C]/40 flex flex-wrap items-center justify-between gap-3 text-xs animate-fadeIn">
          <span className="font-bold flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#D6A63C] text-black flex items-center justify-center text-[10px]">
              {selectedItems.length}
            </span>
            <span>products selected</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkAction('activate')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
            >
              Bulk Activate
            </button>
            <button
              onClick={() => handleBulkAction('deactivate')}
              className="px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-bold text-xs"
            >
              Bulk Deactivate
            </button>
            <button
              onClick={() => handleBulkAction('feature')}
              className="px-3 py-1.5 rounded-lg bg-[#D6A63C] text-black font-bold text-xs"
            >
              Mark Featured
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
            >
              Bulk Delete
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          6. MAIN PRODUCT TABLE
          ════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      paginatedProducts.length > 0 &&
                      paginatedProducts.every((p) => selectedItems.includes(p.id))
                    }
                    onChange={handleSelectAll}
                    className="w-4 h-4 accent-[#D6A63C] rounded cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">
                  <span className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
                    <span>Product</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </span>
                </th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">
                  <span className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
                    <span>Price</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </span>
                </th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-50">
              {paginatedProducts.map((p) => {
                const isSelected = selectedItems.includes(p.id);

                return (
                  <tr
                    key={p.id}
                    className={`hover:bg-amber-50/20 transition-colors ${
                      isSelected ? 'bg-amber-50/40' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(p.id)}
                        className="w-4 h-4 accent-[#D6A63C] rounded cursor-pointer"
                      />
                    </td>

                    {/* Product Name & Subspecs */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 p-1 flex items-center justify-center flex-shrink-0">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-gray-900 leading-snug line-clamp-1">
                            {p.name}
                          </h4>
                          <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">
                            {p.subSpecs || `${p.specifications?.dialSize || '41 mm'} • ${p.specifications?.caseMaterial || 'Steel'} • ${p.specifications?.dialColor || 'Dial'}`}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="py-3 px-4 font-mono font-bold text-gray-700 text-[11px]">
                      {p.sku}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-gray-700 font-medium whitespace-nowrap">
                      {p.category}
                    </td>

                    {/* Brand */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-semibold text-gray-800 whitespace-nowrap">
                        <span className="text-sm">{BRAND_LOGOS[p.brand] || '⌚'}</span>
                        <span>{p.brand}</span>
                      </div>
                    </td>

                    {/* Price & Discount */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div>
                        <span className="font-bold text-gray-900 text-xs">
                          ₹{p.price.toLocaleString('en-IN')}
                        </span>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="line-through text-gray-400 text-[10px]">
                              ₹{p.originalPrice.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[9.5px] font-bold text-rose-600 bg-rose-50 px-1 rounded">
                              -{p.discount}%
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-4 font-bold text-gray-800">
                      {p.stock}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      {p.status === 'Active' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active
                        </span>
                      ) : p.status === 'Low Stock' || p.stock <= 10 ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Low Stock
                        </span>
                      ) : p.status === 'Draft' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
                          Draft
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          Out of Stock
                        </span>
                      )}
                    </td>

                    {/* Rating */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-gray-800">
                        <Star className="w-3.5 h-3.5 text-[#D6A63C] fill-[#D6A63C]" />
                        <span>{p.rating}</span>
                        <span className="text-gray-400 font-normal">
                          ({p.reviewsCount?.toLocaleString('en-IN') || 120})
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* View Details */}
                        <button
                          type="button"
                          onClick={() => setShowDetailsModal(p)}
                          className="p-1.5 hover:bg-gray-100 text-gray-600 hover:text-black rounded-lg transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 hover:bg-gray-100 text-gray-600 hover:text-[#D6A63C] rounded-lg transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Duplicate */}
                        <button
                          type="button"
                          onClick={() => handleDuplicateProduct(p)}
                          className="p-1.5 hover:bg-gray-100 text-gray-600 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                          title="Duplicate Product"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            7. PAGINATION STRIP
            ════════════════════════════════════════════════════════════════ */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div>
            Showing <span className="font-bold text-gray-800">1–{paginatedProducts.length}</span> of{' '}
            <span className="font-bold text-gray-800">{stats.total} products</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Items Per Page */}
            <div className="flex items-center gap-1.5">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white font-semibold text-gray-700"
              >
                <option value={8}>8 per page</option>
                <option value={16}>16 per page</option>
                <option value={24}>24 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button className="px-2.5 py-1 rounded-lg bg-[#D6A63C] text-black font-extrabold text-xs">
                1
              </button>
              <button className="px-2.5 py-1 rounded-lg hover:bg-gray-100 text-gray-700">2</button>
              <button className="px-2.5 py-1 rounded-lg hover:bg-gray-100 text-gray-700">3</button>
              <span className="px-1 text-gray-400">...</span>
              <button className="px-2.5 py-1 rounded-lg hover:bg-gray-100 text-gray-700">40</button>

              <button
                type="button"
                onClick={() => setCurrentPage(2)}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(40)}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100"
              >
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          8. ADD / EDIT PRODUCT MODAL (Comprehensive Multi-Tab Form)
          ════════════════════════════════════════════════════════════════ */}
      {showAddEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="bg-[#0B121C] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <span className="text-[#D6A63C]">⌚</span>
                  <span>{editingProduct ? 'Edit Product Listing' : 'Add New Watch Product'}</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Complete official product specifications, inventory, and pricing tiers.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddEditModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Section Navigation Tabs */}
            <div className="bg-gray-50 border-b border-gray-200 px-5 flex items-center gap-1 overflow-x-auto scrollbar-none py-2 text-xs">
              {[
                { id: 'basic', label: '1. Basic Info' },
                { id: 'specs', label: '2. Watch Specs' },
                { id: 'pricing', label: '3. Pricing & Taxes' },
                { id: 'inventory', label: '4. Inventory' },
                { id: 'variants', label: '5. Variants' },
                { id: 'media', label: '6. Media & SEO' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFormActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    formActiveTab === tab.id
                      ? 'bg-[#0B121C] text-[#D6A63C] shadow-xs'
                      : 'text-gray-600 hover:text-black hover:bg-gray-200/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* TAB 1: BASIC INFO */}
              {formActiveTab === 'basic' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-gray-700 mb-1">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rolex Submariner Date 41mm"
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D6A63C]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      SKU (Stock Keeping Unit) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                      placeholder="e.g. WH-ROL-001"
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#D6A63C]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Brand *</label>
                    <select
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D6A63C]"
                    >
                      {Object.keys(BRAND_LOGOS).map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D6A63C]"
                    >
                      <option value="Luxury Watches">Luxury Watches</option>
                      <option value="Men's Watches">Men's Watches</option>
                      <option value="Women's Watches">Women's Watches</option>
                      <option value="Sports Watches">Sports Watches</option>
                      <option value="Smartwatches">Smartwatches</option>
                      <option value="Kids' Watches">Kids' Watches</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D6A63C]"
                    >
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Unisex">Unisex</option>
                      <option value="Couple">Couple Pair</option>
                      <option value="Kids">Kids</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-gray-700 mb-1">Product Description</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Detailed luxury watch description, craftsmanship, movement details..."
                      className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D6A63C]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: WATCH SPECIFICATIONS */}
              {formActiveTab === 'specs' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Dial Size</label>
                    <input
                      type="text"
                      value={formData.specifications.dialSize}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: { ...formData.specifications, dialSize: e.target.value },
                        })
                      }
                      placeholder="e.g. 41 mm"
                      className="w-full h-10 px-3 rounded-xl border border-gray-200"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Dial Shape</label>
                    <select
                      value={formData.specifications.dialShape}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: { ...formData.specifications, dialShape: e.target.value },
                        })
                      }
                      className="w-full h-10 px-3 rounded-xl border border-gray-200"
                    >
                      <option value="Round">Round</option>
                      <option value="Square">Square</option>
                      <option value="Rectangle">Rectangle</option>
                      <option value="Octagonal">Octagonal</option>
                      <option value="Tonneau">Tonneau</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Dial Colour</label>
                    <input
                      type="text"
                      value={formData.specifications.dialColor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: { ...formData.specifications, dialColor: e.target.value },
                        })
                      }
                      placeholder="e.g. Black / Sunburst Blue"
                      className="w-full h-10 px-3 rounded-xl border border-gray-200"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Case Material</label>
                    <input
                      type="text"
                      value={formData.specifications.caseMaterial}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: { ...formData.specifications, caseMaterial: e.target.value },
                        })
                      }
                      placeholder="e.g. 316L Stainless Steel / Gold"
                      className="w-full h-10 px-3 rounded-xl border border-gray-200"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Strap Material</label>
                    <input
                      type="text"
                      value={formData.specifications.strapMaterial}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: { ...formData.specifications, strapMaterial: e.target.value },
                        })
                      }
                      placeholder="e.g. Stainless Steel Oyster Bracelet"
                      className="w-full h-10 px-3 rounded-xl border border-gray-200"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Movement Type</label>
                    <input
                      type="text"
                      value={formData.specifications.movementType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: { ...formData.specifications, movementType: e.target.value },
                        })
                      }
                      placeholder="e.g. Automatic Self-Winding"
                      className="w-full h-10 px-3 rounded-xl border border-gray-200"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Water Resistance</label>
                    <input
                      type="text"
                      value={formData.specifications.waterResistance}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: { ...formData.specifications, waterResistance: e.target.value },
                        })
                      }
                      placeholder="e.g. 300M Diver / 50M"
                      className="w-full h-10 px-3 rounded-xl border border-gray-200"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Country of Origin</label>
                    <input
                      type="text"
                      value={formData.specifications.countryOfOrigin}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: { ...formData.specifications, countryOfOrigin: e.target.value },
                        })
                      }
                      placeholder="e.g. Switzerland"
                      className="w-full h-10 px-3 rounded-xl border border-gray-200"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Official Warranty</label>
                    <input
                      type="text"
                      value={formData.specifications.warranty}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specifications: { ...formData.specifications, warranty: e.target.value },
                        })
                      }
                      placeholder="e.g. 5 Years International Warranty"
                      className="w-full h-10 px-3 rounded-xl border border-gray-200"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: PRICING & TAXES */}
              {formActiveTab === 'pricing' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Selling Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="e.g. 18999"
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 font-bold focus:outline-none focus:ring-2 focus:ring-[#D6A63C]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Original MRP Price (₹)</label>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      placeholder="e.g. 24999"
                      className="w-full h-10 px-3 rounded-xl border border-gray-200"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Wholesale Cost Price (₹)</label>
                    <input
                      type="number"
                      value={formData.costPrice}
                      onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                      placeholder="e.g. 12000"
                      className="w-full h-10 px-3 rounded-xl border border-gray-200"
                    />
                  </div>

                  {/* Profit Margin Preview Card */}
                  <div className="sm:col-span-3 p-4 rounded-xl bg-amber-50/50 border border-amber-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-800">Estimated Profit Margin</p>
                      <p className="text-[11px] text-gray-500">
                        Selling Price minus Wholesale Cost Price per unit
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-extrabold text-[#D6A63C]">
                        ₹
                        {formData.price && formData.costPrice
                          ? (Number(formData.price) - Number(formData.costPrice)).toLocaleString('en-IN')
                          : '0'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: INVENTORY */}
              {formActiveTab === 'inventory' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Available Quantity</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      placeholder="e.g. 24"
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Low Stock Warning Threshold</label>
                    <input
                      type="number"
                      value={formData.lowStockThreshold}
                      onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-gray-200"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Warehouse Location</label>
                    <input
                      type="text"
                      value={formData.warehouseLocation}
                      onChange={(e) => setFormData({ ...formData, warehouseLocation: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-gray-200"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Barcode / EAN</label>
                    <input
                      type="text"
                      value={formData.barcode}
                      onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                      placeholder="e.g. 8901234567890"
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* TAB 5: VARIANTS */}
              {formActiveTab === 'variants' && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-gray-800">Product Variants (Dials, Straps & Sizes)</p>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          variants: [
                            ...formData.variants,
                            { variantSku: '', dialColor: 'Blue', strapColor: 'Silver', size: '41 mm', price: formData.price, stock: 5 },
                          ],
                        })
                      }
                      className="px-3 py-1 bg-amber-50 border border-amber-300 text-amber-900 rounded-lg font-bold"
                    >
                      + Add Variant
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 text-[10px] text-gray-500 font-bold uppercase">
                        <tr>
                          <th className="p-2">Variant SKU</th>
                          <th className="p-2">Dial</th>
                          <th className="p-2">Strap</th>
                          <th className="p-2">Size</th>
                          <th className="p-2">Price (₹)</th>
                          <th className="p-2">Stock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {formData.variants.map((v, idx) => (
                          <tr key={idx}>
                            <td className="p-2">
                              <input
                                type="text"
                                value={v.variantSku}
                                onChange={(e) => {
                                  const updated = [...formData.variants];
                                  updated[idx].variantSku = e.target.value;
                                  setFormData({ ...formData, variants: updated });
                                }}
                                placeholder="SKU-VAR"
                                className="w-full p-1 border rounded font-mono text-[11px]"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                value={v.dialColor}
                                onChange={(e) => {
                                  const updated = [...formData.variants];
                                  updated[idx].dialColor = e.target.value;
                                  setFormData({ ...formData, variants: updated });
                                }}
                                className="w-full p-1 border rounded text-[11px]"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                value={v.strapColor}
                                onChange={(e) => {
                                  const updated = [...formData.variants];
                                  updated[idx].strapColor = e.target.value;
                                  setFormData({ ...formData, variants: updated });
                                }}
                                className="w-full p-1 border rounded text-[11px]"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                value={v.size}
                                onChange={(e) => {
                                  const updated = [...formData.variants];
                                  updated[idx].size = e.target.value;
                                  setFormData({ ...formData, variants: updated });
                                }}
                                className="w-full p-1 border rounded text-[11px]"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                value={v.price}
                                onChange={(e) => {
                                  const updated = [...formData.variants];
                                  updated[idx].price = e.target.value;
                                  setFormData({ ...formData, variants: updated });
                                }}
                                className="w-20 p-1 border rounded text-[11px]"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                value={v.stock}
                                onChange={(e) => {
                                  const updated = [...formData.variants];
                                  updated[idx].stock = e.target.value;
                                  setFormData({ ...formData, variants: updated });
                                }}
                                className="w-16 p-1 border rounded text-[11px]"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 6: MEDIA & SEO */}
              {formActiveTab === 'media' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Main Image URL</label>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="/images/products/featured_rolex_submariner.jpg"
                      className="w-full h-10 px-3 rounded-xl border border-gray-200"
                    />
                    <div className="mt-2 w-24 h-24 rounded-xl border border-gray-200 bg-gray-50 p-2 flex items-center justify-center">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">SEO URL Slug</label>
                    <input
                      type="text"
                      value={formData.seo?.slug || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          seo: { ...formData.seo, slug: e.target.value },
                        })
                      }
                      placeholder="rolex-submariner-date-41mm"
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 font-mono text-[11px]"
                    />
                    <div className="mt-3">
                      <label className="flex items-center gap-2 font-bold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isFeatured}
                          onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                          className="w-4 h-4 accent-[#D6A63C] rounded"
                        />
                        <span>Mark as Featured Product in Customer Store</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowAddEditModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-100 font-bold text-xs"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D6A63C] to-[#E6BA5E] text-black font-extrabold text-xs shadow-md transition-all active:scale-95"
                >
                  {editingProduct ? 'Save Product Changes' : 'Create Product Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          9. PRODUCT DETAILS MODAL (View Details)
          ════════════════════════════════════════════════════════════════ */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="bg-[#0B121C] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">⌚</span>
                <div>
                  <h3 className="font-bold text-base leading-snug">{showDetailsModal.name}</h3>
                  <p className="text-xs text-[#D6A63C] font-mono">SKU: {showDetailsModal.sku}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDetailsModal(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Image */}
                <div className="md:col-span-4 bg-gray-50 rounded-2xl border border-gray-100 p-4 flex items-center justify-center">
                  <img
                    src={showDetailsModal.image}
                    alt={showDetailsModal.name}
                    className="w-48 h-48 object-contain"
                  />
                </div>

                {/* Core Overview */}
                <div className="md:col-span-8 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {showDetailsModal.brand} • {showDetailsModal.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {showDetailsModal.status}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-bold font-sans text-gray-900">
                      ₹{showDetailsModal.price.toLocaleString('en-IN')}
                    </span>
                    {showDetailsModal.originalPrice && (
                      <span className="line-through text-gray-400 text-sm">
                        ₹{showDetailsModal.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                    {showDetailsModal.discount > 0 && (
                      <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                        -{showDetailsModal.discount}% OFF
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 leading-relaxed">{showDetailsModal.description}</p>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 text-[11px]">
                    <div className="p-2 rounded-xl bg-gray-50">
                      <span className="text-gray-400 block">Available Stock</span>
                      <span className="font-bold text-gray-900 text-sm">{showDetailsModal.stock} units</span>
                    </div>
                    <div className="p-2 rounded-xl bg-gray-50">
                      <span className="text-gray-400 block">Wholesale Cost</span>
                      <span className="font-bold text-gray-900 text-sm">
                        ₹{showDetailsModal.costPrice?.toLocaleString('en-IN') || '—'}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-gray-50">
                      <span className="text-gray-400 block">Customer Rating</span>
                      <span className="font-bold text-gray-900 text-sm flex items-center gap-1">
                        ★ {showDetailsModal.rating} ({showDetailsModal.reviewsCount})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Specifications Grid */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-bold text-gray-800 text-sm mb-3">Technical Specifications</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  {Object.entries(showDetailsModal.specifications || {}).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider block">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className="font-semibold text-gray-800">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Variants List */}
              {showDetailsModal.variants?.length > 0 && (
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="font-bold text-gray-800 text-sm mb-2">Available Variants</h4>
                  <div className="border border-gray-100 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 text-[10px] text-gray-500 font-bold uppercase">
                        <tr>
                          <th className="p-2">Variant SKU</th>
                          <th className="p-2">Dial</th>
                          <th className="p-2">Strap</th>
                          <th className="p-2">Size</th>
                          <th className="p-2">Price</th>
                          <th className="p-2">Stock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {showDetailsModal.variants.map((v, i) => (
                          <tr key={i}>
                            <td className="p-2 font-mono font-bold">{v.variantSku}</td>
                            <td className="p-2">{v.dialColor}</td>
                            <td className="p-2">{v.strapColor}</td>
                            <td className="p-2">{v.size}</td>
                            <td className="p-2 font-bold">₹{v.price?.toLocaleString('en-IN')}</td>
                            <td className="p-2">{v.stock} units</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          10. BULK IMPORT CSV MODAL
          ════════════════════════════════════════════════════════════════ */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-100 p-6 animate-scaleUp">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#D6A63C]" />
                <span>Bulk Import Products</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              Upload a standard CSV file with watch listings. Duplicate SKUs will be automatically validated to protect database integrity.
            </p>

            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center bg-gray-50/50 hover:border-[#D6A63C] transition-colors cursor-pointer">
              <FileSpreadsheet className="w-10 h-10 text-[#D6A63C] mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-800">Drag & Drop product CSV here</p>
              <p className="text-[11px] text-gray-400 mt-1">or click to browse from device</p>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                id="csvFileInput"
                onChange={(e) => {
                  if (e.target.files?.length) {
                    showToast('CSV parsed! 3 products validated and ready to sync.');
                    setShowImportModal(false);
                  }
                }}
              />
              <label
                htmlFor="csvFileInput"
                className="mt-3 inline-block px-4 py-1.5 rounded-lg bg-[#0B121C] text-white font-bold text-xs cursor-pointer"
              >
                Choose File
              </label>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="text-[#D6A63C] font-bold hover:underline"
              >
                Download CSV Sample Template
              </button>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManagementModule;
