import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CustomerNavbar from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import ProductCard from '../../components/common/ProductCard';
import { useCart } from '../../context/CartContext';
import { useCurrencyLanguage } from '../../context/CurrencyLanguageContext';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import { getProductImage, getProductGallery, getProductAlt } from '../../utils/productImageMap';
import SEO from '../../components/common/SEO';
import {
  Heart,
  ShoppingCart,
  Zap,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Maximize2,
  Play,
  RotateCw,
  Share2,
  Award,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { formatPrice } = useCurrencyLanguage();

  // Find product by id, or fallback to Chronoswiss flagship
  const product =
    MOCK_PRODUCTS.find((p) => String(p.id).toLowerCase() === String(id).toLowerCase()) ||
    MOCK_PRODUCTS[0];

  const initialImage = getProductImage(product);
  const [selectedImage, setSelectedImage] = useState(initialImage);
  const [selectedDialColor, setSelectedDialColor] = useState('Paraiba Blue');
  const [selectedStrap, setSelectedStrap] = useState('Louisiana Alligator Leather');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [is360Active, setIs360Active] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedImage(getProductImage(product));
  }, [id, product]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const isFavorited = isInWishlist(product?.id);

  // Gallery items - product-specific images only
  const galleryImages = (
    product?.images && product.images.length > 0
      ? product.images
      : getProductGallery(product)
  ).filter(Boolean);

  const dialColors = [
    { name: 'Paraiba Blue', hex: '#00CFFF' },
    { name: 'Midnight Onyx', hex: '#111827' },
    { name: 'Champagne Gold', hex: '#F4B942' },
    { name: 'Emerald Guilloché', hex: '#059669' },
  ];

  const strapOptions = [
    { name: 'Louisiana Alligator Leather', label: 'Hand-sewn Alligator' },
    { name: 'Grade 5 Titanium Bracelet', label: 'Titanium Links' },
    { name: 'Vulcanized Rubber Strap', label: 'Sport Rubber' },
  ];

  // Related timepieces
  const relatedProducts = MOCK_PRODUCTS.filter(
    (p) => p.id !== product?.id && (p.brand === product?.brand || p.category === product?.category)
  ).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, { dialColor: selectedDialColor, strap: selectedStrap });
    showToast(`✨ ${product.name} added to your luxury shopping bag!`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, { dialColor: selectedDialColor, strap: selectedStrap });
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#020813] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#F4B942] selection:text-black">
      {product && (
        <SEO
          title={`${product.name} – ${product.brand} Luxury Timepiece | WatchHub`}
          description={product.description || `Buy certified authentic ${product.name} by ${product.brand}. Features premium automatic movement, sapphire crystal, and official warranty.`}
          canonical={`https://watchhub.in/product/${product.id}`}
          ogImage={getProductImage(product)}
          ogType="product"
          structuredData={{
            '@type': 'Product',
            name: product.name,
            image: getProductImage(product),
            description: product.description || `${product.brand} luxury timepiece`,
            brand: {
              '@type': 'Brand',
              name: product.brand,
            },
            sku: product.sku || product.id,
            offers: {
              '@type': 'Offer',
              url: `https://watchhub.in/product/${product.id}`,
              priceCurrency: 'INR',
              price: product.price,
              availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              itemCondition: 'https://schema.org/NewCondition',
            },
          }}
        />
      )}
      <CustomerNavbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#061426] border border-[#00CFFF]/50 text-white px-5 py-3.5 rounded-2xl shadow-[0_0_30px_rgba(0,207,255,0.3)] flex items-center gap-3 animate-fade-in text-xs font-semibold backdrop-blur-xl">
          <CheckCircle2 className="w-4 h-4 text-[#00CFFF] flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb Header */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-4 w-full text-xs text-[#A6B1C8] flex items-center gap-2">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3 opacity-50" />
        <Link to="/products" className="hover:text-white transition-colors">Timepieces</Link>
        <ChevronRight className="w-3 h-3 opacity-50" />
        <Link to={`/products?brand=${encodeURIComponent(product.brand)}`} className="hover:text-[#F4B942] transition-colors">
          {product.brand}
        </Link>
        <ChevronRight className="w-3 h-3 opacity-50" />
        <span className="text-white truncate max-w-xs">{product.name}</span>
      </div>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 py-6 w-full flex-1">
        {/* ════════════════════════════════════════════════════════════════
            MAIN 2-COLUMN SECTION: LEFT GALLERY + RIGHT PRODUCT SUMMARY
            ════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">

          {/* ── LEFT COLUMN: High-Res Watch Photography, Zoom & 360 ── */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-3xl bg-gradient-to-b from-[#061224] via-[#040C1A] to-[#020813] border border-white/10 p-6 sm:p-10 flex items-center justify-center min-h-[460px] sm:min-h-[560px] overflow-hidden group shadow-[0_20px_60px_rgba(0,0,0,0.8)]">

              {/* Electric blue subtle background glow */}
              <div className="absolute inset-0 bg-radial from-[#00CFFF]/15 via-transparent to-transparent pointer-events-none blur-3xl" />

              {/* Limited Edition badge */}
              <div className="absolute top-5 left-5 z-20 flex flex-col gap-1.5">
                {product.isLimitedEdition && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase bg-[#00CFFF]/15 text-[#00CFFF] border border-[#00CFFF]/30 shadow-[0_0_15px_rgba(0,207,255,0.25)]">
                    <Sparkles className="w-3 h-3" /> LIMITED TO {product.limitedCount || 15} PIECES
                  </span>
                )}
                <span className="text-[11px] font-mono text-[#A6B1C8] tracking-wider">
                  REF: {product.modelCode || 'CH-3123-PABL'}
                </span>
              </div>

              {/* Interactive Badges Top Right: 360 Toggle & Video Preview */}
              <div className="absolute top-5 right-5 z-20 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIs360Active(!is360Active)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${is360Active
                    ? 'bg-[#00CFFF] text-black shadow-[0_0_15px_rgba(0,207,255,0.4)]'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                    }`}
                  title="Interactive 360 Rotation"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${is360Active ? 'animate-spin' : ''}`} />
                  <span>360°</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(true)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#F4B942]/15 text-[#F4B942] border border-[#F4B942]/40 hover:bg-[#F4B942]/25 flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Watchmaker Atelier Video"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Video</span>
                </button>
              </div>

              {/* Main Watch Image (Guaranteed 100% Uncropped with object-fit: contain) */}
              <div
                className={`relative z-10 w-full h-[400px] sm:h-[480px] flex items-center justify-center transition-transform duration-300 ${isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
                  }`}
                style={{
                  transform: is360Active ? `rotate(${rotationAngle}deg)` : undefined,
                }}
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <img
                  src={selectedImage}
                  alt={product.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/products/watch_placeholder.png';
                  }}
                  className="max-h-full max-w-full object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)] select-none pointer-events-none transition-all duration-300"
                />
              </div>

              {/* 360 Rotation Slider when 360 is enabled */}
              {is360Active && (
                <div className="absolute bottom-5 inset-x-8 z-20 bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center gap-3">
                  <span className="text-[10px] font-bold text-[#00CFFF] uppercase tracking-wider whitespace-nowrap">
                    Rotate 360°
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={rotationAngle}
                    onChange={(e) => setRotationAngle(Number(e.target.value))}
                    className="w-full accent-[#00CFFF] cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-gray-300 w-8 text-right">
                    {rotationAngle}°
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery Row */}
            <div className="grid grid-cols-4 gap-3">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedImage(img);
                    setIs360Active(false);
                  }}
                  className={`h-24 sm:h-28 rounded-2xl bg-[#061224] border p-2 flex items-center justify-center transition-all cursor-pointer overflow-hidden ${selectedImage === img
                    ? 'border-[#00CFFF] shadow-[0_0_15px_rgba(0,207,255,0.3)]'
                    : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                    }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/products/watch_placeholder.png';
                    }}
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT COLUMN: Technical Details, Options & Purchasing ── */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              {/* Brand Header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#F4B942] tracking-widest uppercase block">
                  {product.brand} • SWISS MANUFACTURE
                </span>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  ● AVAILABLE
                </span>
              </div>

              {/* Timepiece Title */}
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mt-1 leading-snug">
                {product.name}
              </h1>

              {/* Ratings and Reviews */}
              <div className="flex items-center gap-2 mt-2.5 text-xs text-[#A6B1C8]">
                <div className="flex items-center text-[#F4B942]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-bold text-white">{product.rating || 4.9}</span>
                <span>•</span>
                <span>({(product.reviewsCount || 120).toLocaleString()} Verified Horology Reviews)</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through font-mono">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="bg-[#FF4567]/15 text-[#FF4567] border border-[#FF4567]/30 text-[10px] font-black px-2 py-0.5 rounded shadow-xs">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Inclusive of all Swiss customs duties, luxury packaging & fully insured global air transit.
              </p>
            </div>

            {/* Dial Colour Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Guilloché Dial Shade: <span className="text-[#00CFFF]">{selectedDialColor}</span>
              </label>
              <div className="flex items-center gap-3">
                {dialColors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedDialColor(color.name)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${selectedDialColor === color.name
                      ? 'ring-2 ring-[#00CFFF] ring-offset-2 ring-offset-[#020813] scale-110'
                      : 'opacity-70 hover:opacity-100 hover:scale-105'
                      }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedDialColor === color.name && (
                      <span className="text-white text-xs drop-shadow">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Strap Material Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Strap Variant: <span className="text-[#F4B942]">{selectedStrap}</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {strapOptions.map((st) => (
                  <button
                    key={st.name}
                    type="button"
                    onClick={() => setSelectedStrap(st.name)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${selectedStrap === st.name
                      ? 'bg-[#F4B942]/15 border-[#F4B942] text-[#F4B942] shadow-[0_0_12px_rgba(244,185,66,0.2)]'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                      }`}
                  >
                    <span className="block truncate">{st.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-white/10 bg-white/5 rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white flex items-center justify-center font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-white font-mono">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white flex items-center justify-center font-bold text-sm"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-[#00CFFF] to-[#00A3FF] text-[#020813] font-extrabold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,207,255,0.4)] hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${isFavorited
                    ? 'bg-[#FF35C8]/20 border-[#FF35C8] text-[#FF35C8]'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/30'
                    }`}
                  title="Save to Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Instant Buy Now Button */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#F4B942] to-[#D4A84F] text-[#020813] font-black text-xs flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(244,185,66,0.35)] hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer uppercase tracking-wider"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Instant Checkout • Buy Now</span>
              </button>

              {/* Customize this model link */}
              <Link
                to={`/customize-watch?base=${product.id}`}
                className="w-full py-2.5 px-4 rounded-xl border border-[#00CFFF]/30 bg-[#00CFFF]/10 hover:bg-[#00CFFF]/20 text-[#00CFFF] text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <span>✏️ Open in 3D Customization Studio</span>
              </Link>
            </div>

            {/* Swiss Luxury Trust Strip */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10 text-center">
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <ShieldCheck className="w-4 h-4 text-[#F4B942] mx-auto mb-1" />
                <p className="text-[10px] font-bold text-white">5-Year Warranty</p>
                <p className="text-[9px] text-gray-400">Manufacture Assured</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <Truck className="w-4 h-4 text-[#00CFFF] mx-auto mb-1" />
                <p className="text-[10px] font-bold text-white">Insured Freight</p>
                <p className="text-[9px] text-gray-400">Armoured Courier</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <RotateCcw className="w-4 h-4 text-[#39F5A5] mx-auto mb-1" />
                <p className="text-[10px] font-bold text-white">7-Day Inspection</p>
                <p className="text-[9px] text-gray-400">Complimentary Return</p>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            TECHNICAL SPECIFICATIONS, MOVEMENT & STORY TABS
            ════════════════════════════════════════════════════════════════ */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-none border-b border-white/10 pb-2 text-xs font-bold uppercase tracking-wider">
            {[
              { id: 'specs', label: 'Technical Specifications' },
              { id: 'movement', label: 'Manufacture Calibre' },
              { id: 'craftsmanship', label: 'Guilloché & Case' },
              { id: 'warranty', label: 'Warranty & Delivery' },
              { id: 'reviews', label: `Reviews (${product.reviewsCount || 120})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-4 rounded-xl transition-all whitespace-nowrap cursor-pointer ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#00CFFF]/20 to-[#00A3FF]/20 text-[#00CFFF] border border-[#00CFFF]/40 shadow-xs'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="p-6 rounded-2xl bg-[#040C1A] border border-white/10 space-y-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#F4B942]" /> Physical & Case Dimensions
                  </h4>
                  <div className="space-y-2 text-[#A6B1C8]">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span>Case Diameter</span>
                      <strong className="text-white">{product.dialSize || '44 mm'}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span>Case Height / Thickness</span>
                      <strong className="text-white">14.85 mm</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span>Case Material</span>
                      <strong className="text-white">{product.caseMaterial || 'Grade 5 Titanium & 316L Stainless Steel'}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span>Crystal Glass</span>
                      <strong className="text-white">Domed Anti-Reflective Sapphire Crystal (front & back)</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span>Water Resistance</span>
                      <strong className="text-white">{product.waterproof || product.waterResistance || '100M / 10 ATM'}</strong>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#040C1A] border border-white/10 space-y-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#00CFFF]" /> Dial Architecture & Strap
                  </h4>
                  <div className="space-y-2 text-[#A6B1C8]">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span>Dial Construction</span>
                      <strong className="text-white">{product.dialDetails || '3-D Regulator with Flying Tourbillon cage at 6H'}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span>Hour & Minute Indicators</span>
                      <strong className="text-white">Off-centre hour subdial at 12H, central minute hand</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span>Strap Material</span>
                      <strong className="text-white">{selectedStrap}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span>Clasp Mechanism</span>
                      <strong className="text-white">Folding Clasp with Double Safety Pushers</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'movement' && (
              <div className="p-6 sm:p-8 rounded-2xl bg-[#040C1A] border border-white/10 space-y-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00CFFF]/10 border border-[#00CFFF]/30 flex items-center justify-center text-[#00CFFF]">
                    ⚙️
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">
                      {product.movement || 'Manufacture Calibre C.303 Hand-Wound Flying Tourbillon'}
                    </h4>
                    <p className="text-[11px] text-[#A6B1C8]">Designed, machined and hand-assembled in Lucerne, Switzerland</p>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  The manufacture movement is engineered with an inverted gear train that exposes the balance spring, escapement wheel, and tourbillon cage directly onto the dial side. The flying tourbillon cage rotates 360 degrees once every 60 seconds, counteracting the effects of earth’s gravity on the hairspring.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                    <p className="text-gray-400 text-[10px]">Power Reserve</p>
                    <p className="text-sm font-bold text-white font-mono mt-0.5">60 Hours</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                    <p className="text-gray-400 text-[10px]">Frequency</p>
                    <p className="text-sm font-bold text-white font-mono mt-0.5">28,800 A/h (4 Hz)</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                    <p className="text-gray-400 text-[10px]">Jewels Count</p>
                    <p className="text-sm font-bold text-white font-mono mt-0.5">23 Rubies</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                    <p className="text-gray-400 text-[10px]">Finishing</p>
                    <p className="text-sm font-bold text-[#F4B942] font-mono mt-0.5">Côtes de Genève</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'craftsmanship' && (
              <div className="p-6 sm:p-8 rounded-2xl bg-[#040C1A] border border-white/10 space-y-4 text-xs text-gray-300 leading-relaxed">
                <h4 className="text-base font-bold text-white">The Art of Hand-Guilloché Finishing</h4>
                <p>
                  Each dial plate begins as a solid disc of German silver. Using historic 1920s rose engine lathes guided strictly by hand and optical magnification, the master guillocheur engraves thousands of microscopic, overlapping geometric lines that refract light with mesmerizing depth.
                </p>
                <p>
                  After engraving, the dial receives an ultra-thin chemical vapor deposition (CVD) coating, creating an iridescent turquoise-blue sheen inspired by the rare Paraiba tourmaline stone.
                </p>
              </div>
            )}

            {activeTab === 'warranty' && (
              <div className="p-6 sm:p-8 rounded-2xl bg-[#040C1A] border border-white/10 space-y-4 text-xs">
                <h4 className="text-base font-bold text-white">International Atelier Guarantee & White Glove Delivery</h4>
                <div className="space-y-2 text-[#A6B1C8]">
                  <p>• <strong>5-Year Warranty:</strong> Covers manufacturing defects, mechanical calibration, and movement servicing.</p>
                  <p>• <strong>Complimentary Maintenance:</strong> Includes free gasket replacement and ultrasonic water-resistance testing.</p>
                  <p>• <strong>Armoured Courier:</strong> Ships inside a temperature-controlled, tamper-evident security vault with satellite GPS tracking.</p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="p-6 sm:p-8 rounded-2xl bg-[#040C1A] border border-white/10 space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-white">Horology Connoisseur Reviews</h4>
                  <span className="text-xs text-[#F4B942] font-bold">5.0 ★ (100% Recommended)</span>
                </div>
                <div className="space-y-3 pt-2">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">Maximilian V. • Geneva, Switzerland</span>
                      <span className="text-[10px] text-gray-400">12 October 2026</span>
                    </div>
                    <div className="flex text-[#F4B942]">★★★★★</div>
                    <p className="text-gray-300">
                      "The three-dimensional architecture of the flying tourbillon is simply breathtaking in natural daylight. The Paraiba dial shifts colors between deep ocean navy and electric cyan."
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">Lord Edward H. • London, UK</span>
                      <span className="text-[10px] text-gray-400">28 September 2026</span>
                    </div>
                    <div className="flex text-[#F4B942]">★★★★★</div>
                    <p className="text-gray-300">
                      "Delivered within 48 hours to Mayfair in pristine condition with all certificate of origin stamps and serial registration."
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            RELATED TIMEPIECES SHOWCASE
            ════════════════════════════════════════════════════════════════ */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold text-[#F4B942] uppercase tracking-wider block">
                  CURATED SELECTION
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  Related Horological Masterpieces
                </h3>
              </div>
              <Link
                to="/products"
                className="text-xs font-bold text-[#00CFFF] hover:underline flex items-center gap-1"
              >
                <span>View Full Catalogue</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={() => {
                    addToCart(p, 1);
                    showToast(`✨ ${p.name} added to bag!`);
                  }}
                  onToggleWishlist={() => toggleWishlist(p)}
                  isInWishlist={isInWishlist(p.id)}
                  onNavigate={(item) => navigate(`/product/${item.id}`)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Video Modal Preview */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in font-sans">
          <div className="bg-[#050D1A] rounded-3xl max-w-2xl w-full p-6 border border-[#00CFFF]/40 shadow-[0_0_50px_rgba(0,207,255,0.3)] relative animate-scale-up text-white">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-lg font-serif font-bold mb-1">
              Atelier Lucerne: Handcrafting the Flying Tourbillon
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Watch master watchmakers calibrate hairsprings and engrave guilloché wave patterns.
            </p>
            <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center relative">
              <img
                src="/images/hero/chronoswiss_website_ref.jpg"
                alt="Watchmaker Atelier"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-full bg-[#00CFFF] text-black flex items-center justify-center text-xl shadow-[0_0_30px_rgba(0,207,255,0.6)] animate-pulse">
                  ▶
                </div>
                <span className="text-xs font-bold tracking-widest uppercase bg-black/70 px-3 py-1 rounded-full border border-white/20">
                  4K Horology Documentary • 03:45
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
