import React, { useState, useEffect, useRef } from 'react';
import {
  CreditCard,
  Search,
  Barcode,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Tag,
  Percent,
  User,
  UserPlus,
  DollarSign,
  QrCode,
  Smartphone,
  Printer,
  FileText,
  Download,
  Mail,
  Share2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  Lock,
  Unlock,
  RefreshCw,
  X,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Layers,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Award,
  Check,
  Building,
  Key,
} from 'lucide-react';
import { useCurrencyLanguage } from '../../../context/CurrencyLanguageContext';

import POSTerminalHeader from '../../pos/POSTerminalHeader';
import POSCartSidebar from '../../pos/POSCartSidebar';
import POSCheckoutModals from '../../pos/POSCheckoutModals';
import POSManagerModals from '../../pos/POSManagerModals';
// Comprehensive Luxury Watch Catalog for POS Terminal with Barcodes & SKUs
import { POS_PRODUCT_CATALOG, SEED_CUSTOMERS } from '../../../data/posCatalogData';
export const POSTerminalModule = ({ onOpenDrawer }) => {
  const { formatPrice } = useCurrencyLanguage();

  // Current Live Clock
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // POS State
  const [activeCatalogTab, setActiveCatalogTab] = useState('All');
  const [activeBrandFilter, setActiveBrandFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');

  // Cart / Current Sale Items
  const [currentSale, setCurrentSale] = useState([
    {
      ...POS_PRODUCT_CATALOG[0], // Rolex Submariner default
      qty: 1,
      itemDiscount: 0,
    },
    {
      ...POS_PRODUCT_CATALOG[2], // Omega Speedmaster default
      qty: 1,
      itemDiscount: 0,
    },
  ]);

  // Selected Customer
  const [customersList, setCustomersList] = useState(SEED_CUSTOMERS);
  const [selectedCustomer, setSelectedCustomer] = useState(SEED_CUSTOMERS[0]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({
    name: '',
    phone: '',
    email: '',
    tier: 'Gold Member',
  });

  // Discounts & Promo Codes
  const [discountType, setDiscountType] = useState('percentage'); // 'percentage' | 'fixed'
  const [discountValue, setDiscountValue] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [managerPinModalOpen, setManagerPinModalOpen] = useState(false);
  const [managerPinInput, setManagerPinInput] = useState('');
  const [managerPinError, setManagerPinError] = useState(null);
  const [pendingHighDiscount, setPendingHighDiscount] = useState(null);

  // Modals & Panels
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [heldSalesModalOpen, setHeldSalesModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [zReportModalOpen, setZReportModalOpen] = useState(false);
  const [scannerModalOpen, setScannerModalOpen] = useState(false);

  // Payment Execution State
  const [paymentMethod, setPaymentMethod] = useState('Card'); // 'Cash' | 'Card' | 'Debit' | 'UPI' | 'Split'
  const [cashTendered, setCashTendered] = useState('');
  const [splitCashAmount, setSplitCashAmount] = useState('');
  const [splitCardAmount, setSplitCardAmount] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Completed Transactions Store
  const [completedTransactions, setCompletedTransactions] = useState([
    {
      id: 'TXN-9012',
      invoiceNumber: 'INV-2026-WH9012',
      customer: 'Ananya Birla',
      customerPhone: '+91 98201 12345',
      itemsCount: 2,
      productsText: 'Rolex Submariner (1), Tissot PRX (1)',
      items: [POS_PRODUCT_CATALOG[0], POS_PRODUCT_CATALOG[7]],
      subtotal: 1026800,
      tax: 184824,
      total: 1211624,
      paymentMethod: 'Credit Card',
      authRef: 'AUTH-ICICI-88291',
      date: '17 Nov 2026, 11:15 AM',
      cashier: 'Vikramaditya Singhania',
      status: 'Completed',
    },
    {
      id: 'TXN-9011',
      invoiceNumber: 'INV-2026-WH9011',
      customer: 'Dr. Rajesh Mehta',
      customerPhone: '+91 99203 45678',
      itemsCount: 1,
      productsText: 'Chronoswiss Open Gear Flying Tourbillon (1)',
      items: [POS_PRODUCT_CATALOG[9]],
      subtotal: 2850000,
      tax: 513000,
      total: 3363000,
      paymentMethod: 'UPI / QR',
      authRef: 'UPI-REF-99214',
      date: '17 Nov 2026, 10:45 AM',
      cashier: 'Vikramaditya Singhania',
      status: 'Completed',
    },
  ]);

  // Held Sales Store
  const [heldSales, setHeldSales] = useState([
    {
      id: 'HELD-001',
      customer: 'Rohan Kapoor',
      items: [{ ...POS_PRODUCT_CATALOG[1], qty: 1 }],
      timestamp: '17 Nov 2026, 11:40 AM',
      total: 2595882,
    },
  ]);

  // Active Completed Invoice
  const [activeInvoice, setActiveInvoice] = useState(null);

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ════════════════════════════════════════════════════════════════
  // CALCULATIONS
  // ════════════════════════════════════════════════════════════════
  const grossSubtotal = currentSale.reduce((sum, it) => sum + it.price * it.qty, 0);

  // Customer VIP Discount
  const customerDiscountAmount =
    selectedCustomer && selectedCustomer.discountRate > 0
      ? Math.round(grossSubtotal * (selectedCustomer.discountRate / 100))
      : 0;

  // Manual General Discount
  let manualDiscountAmount = 0;
  if (discountType === 'percentage') {
    manualDiscountAmount = Math.round((grossSubtotal * (Number(discountValue) || 0)) / 100);
  } else {
    manualDiscountAmount = Number(discountValue) || 0;
  }

  // Coupon Discount
  const couponDiscountAmount = appliedCoupon
    ? Math.round((grossSubtotal * appliedCoupon.percent) / 100)
    : 0;

  const totalDiscount = Math.min(
    grossSubtotal,
    customerDiscountAmount + manualDiscountAmount + couponDiscountAmount
  );

  const netTaxableAmount = Math.max(0, grossSubtotal - totalDiscount);
  // GST 18% standard luxury rate (CGST 9% + SGST 9%)
  const cgstAmount = Math.round(netTaxableAmount * 0.09);
  const sgstAmount = Math.round(netTaxableAmount * 0.09);
  const totalGst = cgstAmount + sgstAmount;
  const grandTotal = netTaxableAmount + totalGst;

  // Change Calculation for Cash
  const cashGivenNum = Number(cashTendered) || 0;
  const cashChangeToReturn = Math.max(0, cashGivenNum - grandTotal);
  const cashRemainingBalance = Math.max(0, grandTotal - cashGivenNum);

  // ════════════════════════════════════════════════════════════════
  // BARCODE & USB SCANNER LISTENER
  // ════════════════════════════════════════════════════════════════
  const handleBarcodeSubmit = (codeToScan) => {
    const raw = (codeToScan || barcodeInput).trim();
    if (!raw) return;

    const matched = POS_PRODUCT_CATALOG.find(
      (p) =>
        p.barcode.toLowerCase() === raw.toLowerCase() ||
        p.sku.toLowerCase() === raw.toLowerCase()
    );

    if (matched) {
      handleAddToCart(matched);
      showToast(`⚡ Scanned & added: ${matched.name}`);
      setBarcodeInput('');
    } else {
      showToast(`❌ Product with SKU/Barcode "${raw}" not found in catalog.`);
    }
  };

  const handleKeyDownBarcode = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBarcodeSubmit();
    }
  };

  // ════════════════════════════════════════════════════════════════
  // CART ACTIONS
  // ════════════════════════════════════════════════════════════════
  const handleAddToCart = (product) => {
    setCurrentSale((prev) => {
      const exists = prev.find((it) => it.id === product.id);
      if (exists) {
        return prev.map((it) =>
          it.id === product.id ? { ...it, qty: it.qty + 1 } : it
        );
      }
      return [{ ...product, qty: 1, itemDiscount: 0 }, ...prev];
    });
    showToast(`✓ Added ${product.name} to sale`);
  };

  const handleUpdateQty = (id, delta) => {
    setCurrentSale((prev) =>
      prev
        .map((it) => {
          if (it.id === id) {
            const newQty = it.qty + delta;
            return newQty > 0 ? { ...it, qty: newQty } : null;
          }
          return it;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveFromSale = (id) => {
    setCurrentSale((prev) => prev.filter((it) => it.id !== id));
  };

  const handleNewSale = () => {
    if (currentSale.length > 0 && !window.confirm('Start a fresh sale? Current unsaved items will be discarded.')) {
      return;
    }
    setCurrentSale([]);
    setSelectedCustomer(SEED_CUSTOMERS[0]);
    setDiscountValue(0);
    setAppliedCoupon(null);
    setCouponCode('');
    showToast('✨ Clean POS sale ticket initialized');
  };

  const handleHoldSale = () => {
    if (currentSale.length === 0) {
      showToast('⚠️ No items in cart to hold.');
      return;
    }
    const newHeld = {
      id: `HELD-${Math.floor(100 + Math.random() * 900)}`,
      customer: selectedCustomer.name,
      items: [...currentSale],
      timestamp: currentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      total: grandTotal,
    };
    setHeldSales([newHeld, ...heldSales]);
    setCurrentSale([]);
    showToast(`⏸️ Sale held for ${selectedCustomer.name}`);
  };

  const handleResumeSale = (held) => {
    setCurrentSale(held.items);
    setHeldSales(heldSales.filter((h) => h.id !== held.id));
    setHeldSalesModalOpen(false);
    showToast(`▶️ Resumed held sale #${held.id}`);
  };

  // ════════════════════════════════════════════════════════════════
  // DISCOUNT & MANAGER PIN
  // ════════════════════════════════════════════════════════════════
  const handleApplyDiscountInput = (val, type) => {
    const num = Number(val) || 0;
    // If discount > 20%, require Manager Authorization PIN (7788)
    if (type === 'percentage' && num > 20) {
      setPendingHighDiscount({ value: num, type });
      setManagerPinModalOpen(true);
      return;
    }
    setDiscountValue(num);
    setDiscountType(type);
  };

  const handleAuthorizeManagerPin = () => {
    if (managerPinInput === '7788') {
      if (pendingHighDiscount) {
        setDiscountValue(pendingHighDiscount.value);
        setDiscountType(pendingHighDiscount.type);
      }
      setManagerPinModalOpen(false);
      setManagerPinInput('');
      setManagerPinError(null);
      showToast('🛡️ Manager authorized privileged discount!');
    } else {
      setManagerPinError('Invalid Manager Security PIN. Authorized PIN is 7788.');
    }
  };

  const handleApplyCoupon = (e) => {
    if (e) e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    const valid = {
      FESTIVAL40: { percent: 40, desc: 'Festival Luxury 40% Privilege' },
      WATCHHUB10: { percent: 10, desc: '10% Counter Privilege' },
      FIRSTBUY: { percent: 15, desc: '15% First-Time Client Discount' },
      VIPCLUB: { percent: 5, desc: '5% Swiss Club Exclusive' },
    };

    if (valid[clean]) {
      setAppliedCoupon({ code: clean, ...valid[clean] });
      showToast(`✓ Coupon ${clean} applied (${valid[clean].percent}% OFF)`);
      setCouponCode('');
    } else {
      showToast('❌ Invalid promo coupon code.');
    }
  };

  // ════════════════════════════════════════════════════════════════
  // PAYMENT COMPLETION & INVOICE GENERATION
  // ════════════════════════════════════════════════════════════════
  const handleProcessPayment = () => {
    if (currentSale.length === 0) {
      showToast('⚠️ Cannot checkout empty cart.');
      return;
    }

    if (paymentMethod === 'Cash' && cashGivenNum < grandTotal) {
      showToast('⚠️ Cash received is less than total payable amount.');
      return;
    }

    setPaymentProcessing(true);

    setTimeout(() => {
      const newInvoiceNumber = `INV-2026-WH${Math.floor(1000 + Math.random() * 9000)}`;
      const authReference =
        paymentMethod === 'Cash'
          ? 'CASH-DRAWER-REC'
          : paymentMethod === 'Card'
            ? `AUTH-ICICI-${Math.floor(10000 + Math.random() * 90000)}`
            : `UPI-${Math.floor(100000 + Math.random() * 900000)}`;

      const newTxn = {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        invoiceNumber: newInvoiceNumber,
        customer: selectedCustomer.name,
        customerPhone: selectedCustomer.phone,
        customerEmail: selectedCustomer.email,
        itemsCount: currentSale.reduce((s, it) => s + it.qty, 0),
        productsText: currentSale.map((it) => `${it.name} (${it.qty})`).join(', '),
        items: [...currentSale],
        grossSubtotal,
        totalDiscount,
        netTaxableAmount,
        cgstAmount,
        sgstAmount,
        tax: totalGst,
        total: grandTotal,
        paymentMethod,
        cashTendered: paymentMethod === 'Cash' ? cashGivenNum : null,
        changeReturned: paymentMethod === 'Cash' ? cashChangeToReturn : null,
        authRef: authReference,
        date: currentDateTime.toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        cashier: 'Vikramaditya Singhania',
        status: 'Completed',
      };

      setCompletedTransactions([newTxn, ...completedTransactions]);
      setActiveInvoice(newTxn);
      setPaymentProcessing(false);
      setPaymentModalOpen(false);
      setInvoiceModalOpen(true);
      setCurrentSale([]); // Reset bill
      showToast(`🎉 Payment of ${formatPrice(grandTotal)} Confirmed!`);
    }, 900);
  };

  // ════════════════════════════════════════════════════════════════
  // FILTERED CATALOG
  // ════════════════════════════════════════════════════════════════
  const filteredProducts = POS_PRODUCT_CATALOG.filter((p) => {
    const matchesCat =
      activeCatalogTab === 'All' ||
      p.category === activeCatalogTab ||
      p.watchType === activeCatalogTab;
    const matchesBrand =
      activeBrandFilter === 'All' || p.brand.toLowerCase() === activeBrandFilter.toLowerCase();
    const matchesStock =
      stockFilter === 'All'
        ? true
        : stockFilter === 'InStock'
          ? p.stock > 0
          : p.stock <= 5;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.barcode.includes(q);

    return matchesCat && matchesBrand && matchesStock && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#080923] text-white flex flex-col font-sans selection:bg-[#6500FF] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#11123D] border border-[#00D5FF] text-white px-5 py-3 rounded-2xl shadow-[0_10px_35px_rgba(0,213,255,0.35)] flex items-center gap-3 backdrop-blur-md animate-fade-in font-mono text-xs">
          <Sparkles className="w-4 h-4 text-[#00D5FF]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. POS TERMINAL TOP HEADER */}
      <POSTerminalHeader
        currentDateTime={currentDateTime}
        handleNewSale={handleNewSale}
        setHeldSalesModalOpen={setHeldSalesModalOpen}
        heldSales={heldSales}
        setHistoryModalOpen={setHistoryModalOpen}
        setZReportModalOpen={setZReportModalOpen}
      />

      {/* ════════════════════════════════════════════════════════════════
          2. MAIN POS WORKSPACE: LEFT (Catalog & Search) | RIGHT (Billing Cart)
          ════════════════════════════════════════════════════════════════ */}
      <main className="flex-1 p-3 sm:p-5 grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* ── LEFT SECTION: PRODUCT BROWSING & CATALOG (7 Cols on XL) ── */}
        <section className="xl:col-span-7 space-y-4">
          {/* Universal Search & Barcode Quick Input Bar */}
          <div className="bg-[#11123D] border border-[#23275E] rounded-2xl p-3.5 shadow-lg flex flex-col sm:flex-row gap-3 items-center">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search watch name, brand, SKU or barcode..."
                className="w-full h-10 pl-10 pr-4 bg-[#080923] border border-[#23275E] rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-[#6500FF] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Barcode Scanner Input */}
            <div className="relative w-full sm:w-64 flex items-center gap-1.5">
              <div className="relative flex-1">
                <Barcode className="w-4 h-4 text-[#00D5FF] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyDown={handleKeyDownBarcode}
                  placeholder="Scan Barcode / Enter SKU"
                  className="w-full h-10 pl-9 pr-3 bg-[#080923] border border-[#00D5FF]/40 rounded-xl text-xs text-white font-mono placeholder-slate-500 outline-none focus:border-[#00D5FF] transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={() => handleBarcodeSubmit()}
                className="h-10 px-3 bg-[#1265FF] hover:bg-[#00D5FF] hover:text-black text-white text-xs font-bold rounded-xl flex items-center justify-center transition-all cursor-pointer font-mono"
                title="Submit Barcode / SKU"
              >
                Scan
              </button>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs select-none">
            {[
              'All',
              "Men's Watches",
              "Women's Watches",
              'Smartwatches',
              'Luxury Watches',
              'Sports Watches',
              'Automatic Watches',
              'Digital Watches',
              'Limited Editions',
            ].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCatalogTab(cat)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-xs font-semibold transition-all cursor-pointer ${activeCatalogTab === cat
                  ? 'bg-gradient-to-r from-[#6500FF] to-[#8B00FF] text-white shadow-md'
                  : 'bg-[#11123D] border border-[#23275E] text-slate-300 hover:text-white hover:border-[#6500FF]/50'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Secondary Filter Row: Brands & Availability */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Brand Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full sm:max-w-xl scrollbar-none font-mono text-[11px]">
              <span className="text-slate-500 mr-1 text-[10px] uppercase">Brand:</span>
              {[
                'All',
                'Rolex',
                'Omega',
                'TAG Heuer',
                'Seiko',
                'Tissot',
                'Patek Philippe',
                'Chronoswiss',
                'Cartier',
                'Apple',
              ].map((brand) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() => setActiveBrandFilter(brand)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${activeBrandFilter === brand
                    ? 'bg-[#00D5FF] text-black font-bold'
                    : 'bg-[#11123D] text-slate-300 border border-[#23275E] hover:border-slate-400'
                    }`}
                >
                  {brand}
                </button>
              ))}
            </div>

            {/* Availability Filter */}
            <div className="flex items-center gap-2">
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="h-8 px-2.5 rounded-xl bg-[#11123D] border border-[#23275E] text-xs text-slate-300 outline-none focus:border-[#6500FF] cursor-pointer"
              >
                <option value="All">All Stock Levels</option>
                <option value="InStock">In Stock Only</option>
                <option value="LowStock">Low Stock (≤ 5)</option>
              </select>
            </div>
          </div>

          {/* Product Catalog Grid (Responsive Product Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
            {filteredProducts.map((p) => {
              const inSale = currentSale.find((it) => it.id === p.id);

              return (
                <div
                  key={p.id}
                  onClick={() => handleAddToCart(p)}
                  className="group bg-[#11123D] border border-[#23275E] hover:border-[#00D5FF] rounded-2xl p-3 flex flex-col justify-between transition-all duration-300 shadow-lg cursor-pointer transform hover:-translate-y-1 relative"
                >
                  {/* Stock Badge Top Right */}
                  <span
                    className={`absolute top-2 right-2 z-10 px-2 py-0.5 rounded-full text-[9.5px] font-bold font-mono ${p.stock <= 5
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                  >
                    {p.stock} left
                  </span>

                  {/* Quantity in bill indicator */}
                  {inSale && (
                    <span className="absolute top-2 left-2 z-10 w-5 h-5 rounded-full bg-[#6500FF] text-white text-[10px] font-bold font-mono flex items-center justify-center shadow-md">
                      {inSale.qty}
                    </span>
                  )}

                  <div>
                    {/* Watch Image Box with Dark Pedestal & Contain */}
                    <div className="relative w-full aspect-[4/3] rounded-xl bg-[#080923] border border-white/5 p-1.5 flex items-center justify-center mb-2 overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/products/watch_placeholder.png';
                        }}
                        className="w-full h-full object-contain object-center filter drop-shadow group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>

                    {/* Brand & SKU */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-0.5">
                      <span className="font-bold text-[#E9B94F] uppercase">{p.brand}</span>
                      <span className="text-[9px] truncate max-w-[80px]">{p.sku}</span>
                    </div>

                    {/* Product Title */}
                    <h4
                      className="text-xs font-bold text-white group-hover:text-[#00D5FF] transition-colors truncate leading-tight"
                      title={p.name}
                    >
                      {p.name}
                    </h4>

                    {/* Barcode number */}
                    <p className="text-[9.5px] text-slate-500 font-mono mt-0.5">
                      BAR: {p.barcode}
                    </p>
                  </div>

                  {/* Price & Add Action */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#23275E]/80">
                    <span className="font-mono font-bold text-xs sm:text-sm text-white">
                      {formatPrice(p.price)}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(p);
                      }}
                      className="w-7 h-7 rounded-lg bg-[#080923] group-hover:bg-[#6500FF] text-slate-300 group-hover:text-white flex items-center justify-center transition-all shadow-sm"
                      title="Add to current sale"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── RIGHT SECTION: DEDICATED LIVE BILLING CART ── */}
        <POSCartSidebar
          currentSale={currentSale}
          handleNewSale={handleNewSale}
          handleHoldSale={handleHoldSale}
          customersList={customersList}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
          setShowAddCustomerModal={setShowAddCustomerModal}
          handleUpdateQty={handleUpdateQty}
          handleRemoveFromSale={handleRemoveFromSale}
          formatPrice={formatPrice}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          handleApplyCoupon={handleApplyCoupon}
          appliedCoupon={appliedCoupon}
          setAppliedCoupon={setAppliedCoupon}
          discountType={discountType}
          setDiscountType={setDiscountType}
          discountValue={discountValue}
          handleApplyDiscountInput={handleApplyDiscountInput}
          managerAuthorized={managerAuthorized}
          setManagerPinModalOpen={setManagerPinModalOpen}
          grossSubtotal={grossSubtotal}
          customerDiscountAmount={customerDiscountAmount}
          couponDiscountAmount={couponDiscountAmount}
          totalDiscount={totalDiscount}
          netTaxableAmount={netTaxableAmount}
          cgstAmount={cgstAmount}
          sgstAmount={sgstAmount}
          grandTotal={grandTotal}
          setPaymentModalOpen={setPaymentModalOpen}
        />
      </main>

      {/* CHECKOUT MODALS (PAYMENT & INVOICE) */}
      <POSCheckoutModals
        paymentModalOpen={paymentModalOpen}
        setPaymentModalOpen={setPaymentModalOpen}
        selectedPaymentMethod={selectedPaymentMethod}
        setSelectedPaymentMethod={setSelectedPaymentMethod}
        grandTotal={grandTotal}
        formatPrice={formatPrice}
        cashTendered={cashTendered}
        setCashTendered={setCashTendered}
        cashChangeToReturn={cashChangeToReturn}
        cashRemainingBalance={cashRemainingBalance}
        splitDetails={splitDetails}
        setSplitDetails={setSplitDetails}
        isAuthorizingPayment={isAuthorizingPayment}
        handleProcessPayment={handleProcessPayment}
        invoiceModalOpen={invoiceModalOpen}
        setInvoiceModalOpen={setInvoiceModalOpen}
        activeInvoice={activeInvoice}
        showToast={showToast}
        handleNewSale={handleNewSale}
      />

      {/* MANAGER & UTILITY MODALS */}
      <POSManagerModals
        managerPinModalOpen={managerPinModalOpen}
        setManagerPinModalOpen={setManagerPinModalOpen}
        managerPin={managerPin}
        setManagerPin={setManagerPin}
        managerPinError={managerPinError}
        handleAuthorizeManagerPin={handleAuthorizeManagerPin}
        heldSalesModalOpen={heldSalesModalOpen}
        setHeldSalesModalOpen={setHeldSalesModalOpen}
        heldSalesList={heldSalesList}
        handleResumeSale={handleResumeSale}
        setHeldSalesList={setHeldSalesList}
        showToast={showToast}
        historyModalOpen={historyModalOpen}
        setHistoryModalOpen={setHistoryModalOpen}
        salesHistory={salesHistory}
        setActiveInvoice={setActiveInvoice}
        setInvoiceModalOpen={setInvoiceModalOpen}
        zReportModalOpen={zReportModalOpen}
        setZReportModalOpen={setZReportModalOpen}
        currentDateTime={currentDateTime}
        formatPrice={formatPrice}
        showAddCustomerModal={showAddCustomerModal}
        setShowAddCustomerModal={setShowAddCustomerModal}
        newCustomerForm={newCustomerForm}
        setNewCustomerForm={setNewCustomerForm}
        customersList={customersList}
        setCustomersList={setCustomersList}
        setSelectedCustomer={setSelectedCustomer}
      />
    </div>
  );
};

export default POSTerminalModule;
