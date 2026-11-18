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

// Comprehensive Luxury Watch Catalog for POS Terminal with Barcodes & SKUs
const POS_PRODUCT_CATALOG = [
  {
    id: 'pos_rol_001',
    name: 'Rolex Submariner Date 41mm',
    brand: 'Rolex',
    sku: 'WH-ROL-001',
    barcode: '8901234567890',
    category: "Men's Watches",
    watchType: 'Automatic Watches',
    price: 980000,
    originalPrice: 1078000,
    stock: 14,
    image: '/images/products/rolex-submariner.png',
    dialSize: '41mm',
    movement: 'Calibre 3235 Automatic',
    case: 'Oystersteel with Cerachrom',
    warranty: '5 Years Official International Warranty',
  },
  {
    id: 'pos_rol_002',
    name: 'Rolex Cosmograph Daytona Gold',
    brand: 'Rolex',
    sku: 'WH-ROL-002',
    barcode: '8901234567891',
    category: 'Luxury Watches',
    watchType: 'Automatic Watches',
    price: 2199900,
    originalPrice: 2450000,
    stock: 8,
    image: '/images/products/rolex-daytona.png',
    dialSize: '40mm',
    movement: 'Calibre 4130 Superlative Chronometer',
    case: '18K Yellow Gold',
    warranty: '5 Years Official International Warranty',
  },
  {
    id: 'pos_omg_001',
    name: 'Omega Speedmaster Professional Moonwatch',
    brand: 'Omega',
    sku: 'WH-OMG-001',
    barcode: '8901234567892',
    category: "Men's Watches",
    watchType: 'Luxury Watches',
    price: 797500,
    originalPrice: 890000,
    stock: 19,
    image: '/images/products/omega-speedmaster.png',
    dialSize: '42mm',
    movement: 'Calibre 3861 Manual Co-Axial',
    case: '316L Stainless Steel',
    warranty: '5 Years Official Omega Warranty',
  },
  {
    id: 'pos_omg_002',
    name: 'Omega Seamaster Diver 300M Co-Axial',
    brand: 'Omega',
    sku: 'WH-OMG-002',
    barcode: '8901234567893',
    category: 'Sports Watches',
    watchType: 'Automatic Watches',
    price: 585000,
    originalPrice: 650000,
    stock: 12,
    image: '/images/products/omega-seamaster.png',
    dialSize: '42mm',
    movement: 'Calibre 8800 Master Chronometer',
    case: 'Stainless Steel & Ceramic',
    warranty: '5 Years Official Omega Warranty',
  },
  {
    id: 'pos_tag_001',
    name: 'TAG Heuer Carrera Calibre 5',
    brand: 'TAG Heuer',
    sku: 'WH-TAG-001',
    barcode: '8901234567894',
    category: 'Sports Watches',
    watchType: 'Automatic Watches',
    price: 539000,
    originalPrice: 620000,
    stock: 15,
    image: '/images/products/tag-heuer-carrera.png',
    dialSize: '39mm',
    movement: 'Calibre 5 Automatic',
    case: 'Fine-Brushed Steel',
    warranty: '2 Years Manufacturer Warranty',
  },
  {
    id: 'pos_tag_002',
    name: 'TAG Heuer Monaco Calibre 11',
    brand: 'TAG Heuer',
    sku: 'WH-TAG-002',
    barcode: '8901234567895',
    category: 'Luxury Watches',
    watchType: 'Automatic Watches',
    price: 675000,
    originalPrice: 750000,
    stock: 6,
    image: '/images/products/tag-heuer-monaco-racing.png',
    dialSize: '39mm x 39mm',
    movement: 'Calibre 11 Automatic Chronograph',
    case: 'Square Stainless Steel',
    warranty: '2 Years Manufacturer Warranty',
  },
  {
    id: 'pos_sei_001',
    name: 'Seiko Prospex 200M Automatic Diver',
    brand: 'Seiko',
    sku: 'WH-SEI-001',
    barcode: '8901234567896',
    category: 'Sports Watches',
    watchType: 'Automatic Watches',
    price: 203500,
    originalPrice: 240000,
    stock: 24,
    image: '/images/products/seiko-prospex-diver.png',
    dialSize: '44mm',
    movement: '6R35 Automatic (70h Power Reserve)',
    case: 'Stainless Steel with Hard Coating',
    warranty: '3 Years International Warranty',
  },
  {
    id: 'pos_tis_001',
    name: 'Tissot PRX Powermatic 80 Blue',
    brand: 'Tissot',
    sku: 'WH-TIS-001',
    barcode: '8901234567897',
    category: "Men's Watches",
    watchType: 'Automatic Watches',
    price: 46800,
    originalPrice: 55000,
    stock: 35,
    image: '/images/products/tissot-prx.png',
    dialSize: '40mm',
    movement: 'Powermatic 80 with Nivachron Hairspring',
    case: '316L Stainless Steel',
    warranty: '2 Years Official Tissot Warranty',
  },
  {
    id: 'pos_pat_001',
    name: 'Patek Philippe Nautilus 5711/1A',
    brand: 'Patek Philippe',
    sku: 'WH-PAT-001',
    barcode: '8901234567898',
    category: 'Limited Editions',
    watchType: 'Luxury Watches',
    price: 3450000,
    originalPrice: 3800000,
    stock: 3,
    image: '/images/products/patek-nautilus.png',
    dialSize: '40mm',
    movement: 'Calibre 26-330 S C Automatic',
    case: 'Steel with Porous Bezel',
    warranty: 'Lifetime Patek Philippe Certificate',
  },
  {
    id: 'pos_chr_001',
    name: 'Chronoswiss Open Gear Flying Tourbillon',
    brand: 'Chronoswiss',
    sku: 'WH-CHR-001',
    barcode: '8901234567899',
    category: 'Limited Editions',
    watchType: 'Luxury Watches',
    price: 2850000,
    originalPrice: 3200000,
    stock: 4,
    image: '/images/products/chronoswiss-tourbillon.png',
    dialSize: '44mm',
    movement: 'Manufacture Calibre C.303 Flying Tourbillon',
    case: 'Stainless Steel with Electric Blue CVD',
    warranty: '5 Years Atelier Lucerne Guarantee',
  },
  {
    id: 'pos_car_001',
    name: 'Cartier Santos de Cartier Large',
    brand: 'Cartier',
    sku: 'WH-CAR-001',
    barcode: '8901234567900',
    category: "Women's Watches",
    watchType: 'Luxury Watches',
    price: 740000,
    originalPrice: 820000,
    stock: 9,
    image: '/images/products/cartier_santos.jpg',
    dialSize: '39.8mm',
    movement: 'Calibre 1847 MC Automatic',
    case: 'Stainless Steel with SmartLink System',
    warranty: '8 Years Cartier International Warranty',
  },
  {
    id: 'pos_apl_001',
    name: 'Apple Watch Ultra 2 Titanium 49mm',
    brand: 'Apple',
    sku: 'WH-APL-001',
    barcode: '8901234567901',
    category: 'Smartwatches',
    watchType: 'Digital Watches',
    price: 89900,
    originalPrice: 99900,
    stock: 28,
    image: '/images/products/apple-watch-ultra-2.png',
    dialSize: '49mm',
    movement: 'Apple S9 SiP 64-bit Dual-Core',
    case: 'Aerospace-Grade Titanium',
    warranty: '1 Year AppleCare Warranty Included',
  },
];

// Pre-seeded VIP Customers
const SEED_CUSTOMERS = [
  {
    id: 'c_guest',
    name: 'Walk-in VIP Guest',
    phone: 'Counter Sale',
    email: 'counter@watchhub.in',
    tier: 'Guest',
    points: 0,
    totalSpent: 0,
    ordersCount: 0,
    discountRate: 0,
  },
  {
    id: 'c_001',
    name: 'Ananya Birla',
    phone: '+91 98201 12345',
    email: 'ananya.b@birla.com',
    tier: 'Diamond VIP',
    points: 3450,
    totalSpent: 4850000,
    ordersCount: 8,
    discountRate: 5,
  },
  {
    id: 'c_002',
    name: 'Rohan Kapoor',
    phone: '+91 98112 54321',
    email: 'rohan.kapoor@outlook.com',
    tier: 'Platinum VIP',
    points: 1820,
    totalSpent: 1980000,
    ordersCount: 4,
    discountRate: 3,
  },
  {
    id: 'c_003',
    name: 'Dr. Rajesh Mehta',
    phone: '+91 99203 45678',
    email: 'dr.mehta@bombayhospital.com',
    tier: 'Connoisseur VIP',
    points: 5100,
    totalSpent: 6200000,
    ordersCount: 12,
    discountRate: 7,
  },
  {
    id: 'c_004',
    name: 'Priya Sharma',
    phone: '+91 97690 98765',
    email: 'priya.sharma@gmail.com',
    tier: 'Gold Member',
    points: 950,
    totalSpent: 780000,
    ordersCount: 2,
    discountRate: 2,
  },
];

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

      {/* ════════════════════════════════════════════════════════════════
          1. POS TERMINAL TOP HEADER
          ════════════════════════════════════════════════════════════════ */}
      <header className="bg-[#11123D] border-b border-[#23275E] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4 shadow-xl select-none">
        {/* Left: Terminal Identity & Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6500FF] to-[#00D5FF] flex items-center justify-center text-white shadow-[0_0_20px_rgba(101,0,255,0.4)]">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-serif font-bold text-white tracking-tight">
                  WatchHub POS Terminal
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE • TERM #04
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                <Building className="w-3 h-3 text-[#E9B94F]" />
                <span>Flagship Boutique • Mumbai High Street</span>
              </p>
            </div>
          </div>
        </div>

        {/* Center: Live Clock & Shift */}
        <div className="hidden lg:flex items-center gap-6 px-4 py-1.5 rounded-xl bg-[#080923] border border-[#23275E] text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-[#00D5FF]" />
            <span>
              {currentDateTime.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </span>
          </div>
          <div className="h-4 w-[1px] bg-[#23275E]" />
          <div className="flex items-center gap-2 text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-[#E9B94F]" />
            <span>
              {currentDateTime.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="h-4 w-[1px] bg-[#23275E]" />
          <div className="flex items-center gap-1.5 text-slate-300">
            <User className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-white font-bold">Vikramaditya S.</span>
            <span className="text-[10px] text-slate-500">(Shift #01)</span>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={handleNewSale}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:brightness-110 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
            title="Clear and start new bill"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Sale</span>
          </button>

          <button
            type="button"
            onClick={() => setHeldSalesModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-[#080923] hover:bg-[#16184C] border border-[#23275E] text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all relative"
            title="View Parked / Held Sales"
          >
            <Pause className="w-3.5 h-3.5 text-[#E9B94F]" />
            <span className="hidden sm:inline">Held Sales</span>
            {heldSales.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#E9B94F] text-black text-[10px] font-bold font-mono">
                {heldSales.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setHistoryModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-[#080923] hover:bg-[#16184C] border border-[#23275E] text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
            title="Transaction History & Invoices"
          >
            <FileText className="w-3.5 h-3.5 text-[#00D5FF]" />
            <span className="hidden sm:inline">History</span>
          </button>

          <button
            type="button"
            onClick={() => setZReportModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-[#080923] hover:bg-[#16184C] border border-[#23275E] text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
            title="EOD Daily Summary Report"
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Z-Report</span>
          </button>
        </div>
      </header>

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
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-xs font-semibold transition-all cursor-pointer ${
                  activeCatalogTab === cat
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
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    activeBrandFilter === brand
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
                    className={`absolute top-2 right-2 z-10 px-2 py-0.5 rounded-full text-[9.5px] font-bold font-mono ${
                      p.stock <= 5
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

        {/* ── RIGHT SECTION: DEDICATED LIVE BILLING CART (5 Cols on XL) ── */}
        <section className="xl:col-span-5 bg-[#11123D] border border-[#23275E] rounded-3xl p-5 shadow-2xl space-y-4 sticky top-4">
          {/* Header of Current Sale */}
          <div className="flex items-center justify-between border-b border-[#23275E] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-serif font-bold text-white">Current Sale</h2>
                <span className="px-2 py-0.5 rounded-full bg-[#6500FF]/20 text-[#00D5FF] border border-[#6500FF]/40 text-xs font-mono font-bold">
                  {currentSale.reduce((sum, it) => sum + it.qty, 0)} Items
                </span>
              </div>
              <p className="text-[10.5px] text-slate-400 font-mono">
                Order Ticket #SALE-{Math.floor(1000 + currentSale.length * 24)}
              </p>
            </div>

            <button
              type="button"
              onClick={handleHoldSale}
              className="px-2.5 py-1 rounded-xl bg-[#080923] hover:bg-[#1E1256] text-[#E9B94F] text-[11px] font-bold border border-[#23275E] flex items-center gap-1 cursor-pointer transition-colors"
              title="Hold this sale temporarily"
            >
              <Pause className="w-3 h-3" />
              <span>Hold</span>
            </button>
          </div>

          {/* 5. CUSTOMER SELECTION BAR */}
          <div className="relative bg-[#080923] border border-[#23275E] rounded-2xl p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10.5px] font-bold text-slate-400 font-mono flex items-center gap-1 uppercase">
                <User className="w-3 h-3 text-[#E9B94F]" /> Client / Customer
              </span>
              <button
                type="button"
                onClick={() => setShowAddCustomerModal(true)}
                className="text-[10.5px] text-[#00D5FF] hover:underline flex items-center gap-0.5 font-bold"
              >
                <UserPlus className="w-3 h-3" />
                <span>+ New Client</span>
              </button>
            </div>

            {/* Selected Customer View & Dropdown Trigger */}
            <div
              onClick={() => setShowCustomerDropdown(!showCustomerDropdown)}
              className="flex items-center justify-between p-2 rounded-xl bg-[#11123D] border border-white/5 hover:border-[#6500FF] cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#6500FF] to-[#E9B94F] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{selectedCustomer.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {selectedCustomer.phone} •{' '}
                    <span className="text-[#E9B94F] font-bold">{selectedCustomer.tier}</span>
                  </p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>

            {/* Dropdown Menu */}
            {showCustomerDropdown && (
              <div className="absolute left-0 right-0 top-18 z-40 bg-[#080923] border border-[#23275E] rounded-2xl shadow-2xl p-2 space-y-1">
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="Search VIP clients by name/phone..."
                  className="w-full h-8 px-2.5 bg-[#11123D] border border-white/10 rounded-lg text-xs text-white outline-none mb-1 font-mono"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {customersList
                    .filter((c) =>
                      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
                      c.phone.includes(customerSearch)
                    )
                    .map((cust) => (
                      <div
                        key={cust.id}
                        onClick={() => {
                          setSelectedCustomer(cust);
                          setShowCustomerDropdown(false);
                          showToast(`Selected client: ${cust.name}`);
                        }}
                        className={`p-2 rounded-xl text-xs flex justify-between items-center cursor-pointer transition-colors ${
                          selectedCustomer.id === cust.id
                            ? 'bg-[#6500FF] text-white font-bold'
                            : 'hover:bg-[#11123D] text-slate-300'
                        }`}
                      >
                        <div>
                          <p className="font-semibold">{cust.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{cust.phone}</p>
                        </div>
                        <span className="text-[10px] text-[#E9B94F] font-mono">{cust.tier}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. CURRENT SALE ITEMS (Scrollable) */}
          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
            {currentSale.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs font-mono border border-dashed border-[#23275E] rounded-2xl">
                <span>🛒 Current bill is empty.</span>
                <span className="block text-[10px] text-slate-600 mt-1">
                  Select watches from catalog or scan barcode.
                </span>
              </div>
            ) : (
              currentSale.map((it) => (
                <div
                  key={it.id}
                  className="bg-[#080923] border border-[#23275E] rounded-xl p-2.5 flex items-center justify-between gap-3"
                >
                  {/* Thumbnail */}
                  <div className="w-12 h-12 rounded-lg bg-[#11123D] p-1 flex items-center justify-center flex-shrink-0 border border-white/5">
                    <img
                      src={it.image}
                      alt={it.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/products/watch_placeholder.png';
                      }}
                      className="w-full h-full object-contain filter drop-shadow"
                    />
                  </div>

                  {/* Title & Brand */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-mono text-[#E9B94F] uppercase">{it.brand}</p>
                    <h4 className="text-xs font-bold text-white truncate" title={it.name}>
                      {it.name}
                    </h4>
                    <p className="text-[11px] text-slate-300 font-mono font-semibold">
                      {formatPrice(it.price)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center bg-[#11123D] border border-[#23275E] rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(it.id, -1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:bg-[#6500FF] hover:text-white transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-mono font-bold text-white">
                      {it.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(it.id, 1)}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:bg-[#6500FF] hover:text-white transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Item Net Subtotal */}
                  <div className="text-right font-mono">
                    <p className="text-xs font-bold text-white">
                      {formatPrice(it.price * it.qty)}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleRemoveFromSale(it.id)}
                      className="text-slate-500 hover:text-rose-400 p-0.5 transition-colors"
                      title="Remove from bill"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 6. DISCOUNTS & COUPON SECTION */}
          <div className="bg-[#080923] border border-[#23275E] rounded-2xl p-3 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10.5px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                <Percent className="w-3 h-3 text-[#00D5FF]" /> Privilege Discount & Coupon
              </span>
              {appliedCoupon && (
                <span className="text-[9.5px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {appliedCoupon.code} (-{appliedCoupon.percent}%)
                </span>
              )}
            </div>

            {/* Quick Discount Buttons */}
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              {[0, 5, 10, 15, 25].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handleApplyDiscountInput(pct, 'percentage')}
                  className={`flex-1 py-1 rounded-lg border transition-all cursor-pointer ${
                    discountType === 'percentage' && discountValue === pct
                      ? 'bg-[#6500FF] text-white font-bold border-[#6500FF]'
                      : 'bg-[#11123D] border-[#23275E] text-slate-300 hover:border-slate-400'
                  }`}
                >
                  {pct === 0 ? 'None' : `${pct}%`}
                </button>
              ))}
            </div>

            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-1.5 pt-1">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="PROMO CODE (e.g. FESTIVAL40)"
                className="flex-1 h-8 px-2.5 bg-[#11123D] border border-[#23275E] rounded-lg text-xs text-white uppercase font-mono outline-none focus:border-[#00D5FF]"
              />
              <button
                type="submit"
                className="px-3 h-8 rounded-lg bg-[#00D5FF] hover:bg-[#6500FF] text-black hover:text-white font-bold text-xs font-mono transition-colors"
              >
                Apply
              </button>
              {appliedCoupon && (
                <button
                  type="button"
                  onClick={() => {
                    setAppliedCoupon(null);
                    showToast('Coupon removed');
                  }}
                  className="px-2 h-8 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 text-xs"
                  title="Remove coupon"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>
          </div>

          {/* FINANCIAL SUMMARY & GST BREAKDOWN */}
          <div className="bg-[#080923] border border-[#23275E] rounded-2xl p-3.5 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Gross Subtotal</span>
              <span className="text-white">{formatPrice(grossSubtotal)}</span>
            </div>

            {totalDiscount > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Total Privilege Discount</span>
                <span>-{formatPrice(totalDiscount)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Taxable Value</span>
              <span className="text-white">{formatPrice(netTaxableAmount)}</span>
            </div>

            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>CGST (9%) + SGST (9%)</span>
              <span className="text-white">{formatPrice(totalGst)}</span>
            </div>

            {/* Prominent Grand Total */}
            <div className="pt-2 border-t border-[#23275E] flex justify-between items-baseline">
              <div>
                <span className="text-xs font-bold text-white block">FINAL PAYABLE</span>
                <span className="text-[10px] text-slate-400">GST Inclusive</span>
              </div>
              <span className="text-2xl font-bold text-[#E9B94F] font-mono">
                {formatPrice(grandTotal)}
              </span>
            </div>
          </div>

          {/* 7. ACTION BUTTONS: PROCEED TO PAYMENT */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              disabled={currentSale.length === 0}
              onClick={() => setPaymentModalOpen(true)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#1265FF] via-[#6500FF] to-[#8B00FF] hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider shadow-[0_4px_25px_rgba(18,101,255,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
            >
              <CreditCard className="w-4 h-4" />
              <span>COLLECT PAYMENT ({formatPrice(grandTotal)})</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleHoldSale}
                className="flex-1 py-2 rounded-xl bg-[#080923] hover:bg-[#1E1256] text-slate-300 hover:text-white border border-[#23275E] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Pause className="w-3.5 h-3.5 text-[#E9B94F]" />
                <span>Hold Sale</span>
              </button>

              <button
                type="button"
                onClick={handleNewSale}
                className="flex-1 py-2 rounded-xl bg-[#080923] hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-[#23275E] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Cancel Sale</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ════════════════════════════════════════════════════════════════
          MODAL 1: PAYMENT CHECKOUT MODAL
          ════════════════════════════════════════════════════════════════ */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#11123D] border border-[#23275E] rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl animate-fade-in text-xs">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#23275E] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#1265FF]/20 text-[#00D5FF] flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-white">POS Payment Gateway</h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Terminal Auth: WH-POS-04 • Bill #{Math.floor(1000 + Math.random() * 9000)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPaymentModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Amount Payable Highlight */}
            <div className="p-4 rounded-2xl bg-[#080923] border border-[#23275E] text-center">
              <span className="text-[10.5px] text-slate-400 uppercase font-mono block">
                Total Amount Payable
              </span>
              <span className="text-3xl font-bold font-mono text-[#E9B94F]">
                {formatPrice(grandTotal)}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Client: {selectedCustomer.name} ({selectedCustomer.phone})
              </span>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-4 gap-2 font-mono text-xs">
              {[
                { id: 'Card', label: 'Credit Card', icon: CreditCard },
                { id: 'Cash', label: 'Cash', icon: DollarSign },
                { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                { id: 'Split', label: 'Split Pay', icon: Layers },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === m.id
                        ? 'bg-gradient-to-tr from-[#6500FF] to-[#1265FF] text-white border-transparent shadow-lg font-bold'
                        : 'bg-[#080923] border-[#23275E] text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10.5px]">{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mode-Specific Content */}
            {paymentMethod === 'Cash' && (
              <div className="space-y-3 bg-[#080923] p-3.5 rounded-2xl border border-[#23275E]">
                <label className="text-[11px] text-slate-400 font-mono block">
                  Cash Amount Tendered:
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={cashTendered}
                    onChange={(e) => setCashTendered(e.target.value)}
                    placeholder="Enter cash amount received..."
                    className="w-full h-10 pl-8 pr-3 bg-[#11123D] border border-white/10 rounded-xl text-white font-mono text-sm outline-none focus:border-[#E9B94F]"
                  />
                </div>

                {/* Quick denomination chips */}
                <div className="flex gap-2">
                  {[grandTotal, grandTotal + 500, grandTotal + 2000].map((amt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCashTendered(amt.toString())}
                      className="px-2 py-1 rounded-lg bg-[#11123D] border border-[#23275E] text-[10px] font-mono text-slate-300 hover:text-white"
                    >
                      ₹{amt.toLocaleString()}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between font-mono text-xs pt-1 border-t border-white/5">
                  <span className="text-slate-400">Change to Return:</span>
                  <span className="text-[#00C98B] font-bold text-sm">
                    {formatPrice(cashChangeToReturn)}
                  </span>
                </div>
              </div>
            )}

            {paymentMethod === 'Card' && (
              <div className="p-4 rounded-2xl bg-[#080923] border border-[#23275E] text-center space-y-2">
                <CreditCard className="w-8 h-8 text-[#00D5FF] mx-auto animate-pulse" />
                <p className="font-bold text-white text-xs">Waiting for Card Swipe / Insert</p>
                <p className="text-[10px] text-slate-400 font-mono">
                  ICICI EDC Terminal #8821 Connected • Dip Chip or Tap Contactless NFC
                </p>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono">
                  ✓ EMV Pin Pad Ready
                </span>
              </div>
            )}

            {paymentMethod === 'UPI' && (
              <div className="p-4 rounded-2xl bg-[#080923] border border-[#23275E] text-center space-y-2.5">
                <div className="w-32 h-32 rounded-xl bg-white p-2 mx-auto flex items-center justify-center shadow-lg">
                  <QrCode className="w-28 h-28 text-black" />
                </div>
                <p className="text-xs font-mono text-white font-bold">
                  VPA: watchhub.boutique04@icici
                </p>
                <p className="text-[10px] text-slate-400">
                  Scan via GPay, PhonePe, Paytm, BHIM or any Banking UPI App
                </p>
              </div>
            )}

            {paymentMethod === 'Split' && (
              <div className="space-y-2.5 bg-[#080923] p-3.5 rounded-2xl border border-[#23275E] font-mono">
                <div>
                  <label className="text-[10.5px] text-slate-400">Cash Portion:</label>
                  <input
                    type="number"
                    value={splitCashAmount}
                    onChange={(e) => setSplitCashAmount(e.target.value)}
                    placeholder="e.g. 500000"
                    className="w-full h-8 px-2.5 bg-[#11123D] border border-white/10 rounded-lg text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10.5px] text-slate-400">Card / UPI Portion:</label>
                  <input
                    type="number"
                    value={splitCardAmount}
                    onChange={(e) => setSplitCardAmount(e.target.value)}
                    placeholder="Remaining balance"
                    className="w-full h-8 px-2.5 bg-[#11123D] border border-white/10 rounded-lg text-white text-xs"
                  />
                </div>
              </div>
            )}

            {/* Complete Payment Button */}
            <button
              type="button"
              disabled={paymentProcessing}
              onClick={handleProcessPayment}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {paymentProcessing ? 'Authorizing Merchant Payment...' : 'AUTHORIZE & PRINT RECEIPT'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          MODAL 2: LUXURY TAX INVOICE & RECEIPT MODAL
          ════════════════════════════════════════════════════════════════ */}
      {invoiceModalOpen && activeInvoice && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#11123D] border border-[#E9B94F]/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl my-8 animate-fade-in text-xs text-white">
            {/* Invoice Top Header */}
            <div className="flex items-start justify-between border-b border-[#23275E] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">👑</span>
                  <h2 className="text-xl font-serif font-bold tracking-tight text-white">
                    WATCHHUB LUXURY HOROLOGY
                  </h2>
                </div>
                <p className="text-[10.5px] text-slate-400 font-mono mt-0.5">
                  Flagship Boutique • 14/B Heritage Chambers, Palladium Mall, Mumbai
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  GSTIN: 27AAACW8892K1Z5 • CIN: U33100MH2024PTC392811
                </p>
              </div>

              <div className="text-right font-mono">
                <span className="px-2.5 py-1 rounded bg-[#E9B94F]/20 text-[#E9B94F] font-bold text-[11px] border border-[#E9B94F]/40 block mb-1">
                  ORIGINAL TAX INVOICE
                </span>
                <p className="text-xs font-bold text-white">{activeInvoice.invoiceNumber}</p>
                <p className="text-[10px] text-slate-400">{activeInvoice.date}</p>
              </div>
            </div>

            {/* Client & Cashier Strip */}
            <div className="grid grid-cols-2 gap-4 bg-[#080923] p-3.5 rounded-2xl border border-[#23275E] font-mono text-[11px]">
              <div>
                <span className="text-slate-500 uppercase text-[9.5px] block">Billed To:</span>
                <span className="text-white font-bold block">{activeInvoice.customer}</span>
                <span className="text-slate-400 block">{activeInvoice.customerPhone}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 uppercase text-[9.5px] block">Cashier / POS:</span>
                <span className="text-white font-bold block">{activeInvoice.cashier}</span>
                <span className="text-slate-400 block">Terminal #04 (ICICI Merchant)</span>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-[#23275E] rounded-xl overflow-hidden font-mono">
              <table className="w-full text-left">
                <thead className="bg-[#080923] text-slate-400 text-[10px] uppercase border-b border-[#23275E]">
                  <tr>
                    <th className="py-2 px-3">Item / Timepiece</th>
                    <th className="py-2 px-2 text-center">SKU</th>
                    <th className="py-2 px-2 text-center">Qty</th>
                    <th className="py-2 px-3 text-right">Unit Price</th>
                    <th className="py-2 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#23275E]/60 text-xs">
                  {activeInvoice.items.map((it, idx) => (
                    <tr key={idx} className="hover:bg-white/5">
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-white block">{it.name}</span>
                        <span className="text-[10px] text-[#E9B94F]">{it.brand}</span>
                      </td>
                      <td className="py-2.5 px-2 text-center text-slate-400 text-[11px]">
                        {it.sku}
                      </td>
                      <td className="py-2.5 px-2 text-center text-white font-bold">{it.qty}</td>
                      <td className="py-2.5 px-3 text-right text-slate-300">
                        {formatPrice(it.price)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-white font-bold">
                        {formatPrice(it.price * it.qty)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Totals */}
            <div className="space-y-1.5 font-mono text-xs max-w-xs ml-auto">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span className="text-white">{formatPrice(activeInvoice.grossSubtotal)}</span>
              </div>
              {activeInvoice.totalDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Privilege Discount:</span>
                  <span>-{formatPrice(activeInvoice.totalDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>CGST (9%):</span>
                <span className="text-white">{formatPrice(activeInvoice.cgstAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>SGST (9%):</span>
                <span className="text-white">{formatPrice(activeInvoice.sgstAmount)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#E9B94F] pt-2 border-t border-[#23275E]">
                <span>Grand Total Paid:</span>
                <span>{formatPrice(activeInvoice.total)}</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                <span>Payment Mode:</span>
                <span className="text-slate-300 font-bold">{activeInvoice.paymentMethod}</span>
              </div>
            </div>

            {/* Guarantee & Return Policy Footnote */}
            <div className="bg-[#080923] p-3 rounded-xl border border-white/5 space-y-1 text-[10px] text-slate-400">
              <div className="flex items-center gap-1.5 text-[#E9B94F] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>WatchHub International Guarantee & Terms</span>
              </div>
              <p>
                • All watches include certified manufacturer warranties with complimentary 2-year
                in-house atelier service coverage.
              </p>
              <p>
                • 7-Day Unworn Exchange Policy applicable in original luxury box packaging with warranty
                cards intact.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2.5 pt-2 border-t border-[#23275E]">
              <button
                type="button"
                onClick={() => {
                  window.print();
                  showToast('🖨️ Printing thermal tax receipt slip...');
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#1265FF] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>

              <button
                type="button"
                onClick={() => showToast('📥 PDF Invoice downloaded to local storage.')}
                className="px-4 py-2.5 rounded-xl bg-[#080923] hover:bg-[#1A1E52] border border-[#23275E] text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#00D5FF]" />
                <span>Download PDF</span>
              </button>

              <button
                type="button"
                onClick={() => showToast(`✉️ Invoice emailed to ${activeInvoice.customerEmail || 'client'}`)}
                className="px-4 py-2.5 rounded-xl bg-[#080923] hover:bg-[#1A1E52] border border-[#23275E] text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-[#E9B94F]" />
                <span>Email</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setInvoiceModalOpen(false);
                  setActiveInvoice(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
              >
                Done / Next Sale
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          MODAL 3: MANAGER SECURITY PIN AUTHORIZATION
          ════════════════════════════════════════════════════════════════ */}
      {managerPinModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#11123D] border border-rose-500/50 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-xs text-white">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Key className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-white">Manager Approval Required</h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Discounts greater than 20% exceed cashier threshold. Please enter Manager PIN.
              </p>
              <p className="text-[10px] text-emerald-400 font-mono mt-1 font-bold">
                (Authorized PIN: 7788)
              </p>
            </div>

            <input
              type="password"
              maxLength={4}
              value={managerPinInput}
              onChange={(e) => setManagerPinInput(e.target.value)}
              placeholder="Enter 4-Digit PIN..."
              className="w-full h-11 text-center font-mono text-lg tracking-widest bg-[#080923] border border-white/20 rounded-xl outline-none focus:border-rose-400"
            />

            {managerPinError && (
              <p className="text-[10.5px] text-rose-400 text-center font-mono font-semibold">
                {managerPinError}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setManagerPinModalOpen(false);
                  setManagerPinInput('');
                  setManagerPinError(null);
                }}
                className="flex-1 py-2 rounded-xl bg-[#080923] text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAuthorizeManagerPin}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold"
              >
                Authorize
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          MODAL 4: HELD SALES MANAGEMENT
          ════════════════════════════════════════════════════════════════ */}
      {heldSalesModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#11123D] border border-[#23275E] rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl text-xs text-white">
            <div className="flex items-center justify-between border-b border-[#23275E] pb-3">
              <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                <Pause className="w-4 h-4 text-[#E9B94F]" />
                <span>Held / Parked Sales ({heldSales.length})</span>
              </h3>
              <button
                type="button"
                onClick={() => setHeldSalesModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {heldSales.length === 0 ? (
                <p className="py-6 text-center text-slate-500 font-mono">No currently held sales.</p>
              ) : (
                heldSales.map((h) => (
                  <div
                    key={h.id}
                    className="p-3 rounded-xl bg-[#080923] border border-[#23275E] flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="font-bold text-white block">{h.customer}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {h.id} • {h.timestamp} • {h.items.length} items
                      </span>
                      <span className="text-xs font-mono font-bold text-[#E9B94F] block mt-0.5">
                        {formatPrice(h.total)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleResumeSale(h)}
                        className="px-3 py-1.5 rounded-lg bg-[#6500FF] hover:bg-[#1265FF] text-white font-bold font-mono text-[11px]"
                      >
                        Resume
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setHeldSales(heldSales.filter((item) => item.id !== h.id));
                          showToast('Discarded held ticket');
                        }}
                        className="p-1.5 text-slate-500 hover:text-rose-400"
                        title="Discard"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          MODAL 5: TRANSACTION HISTORY & REPRINT
          ════════════════════════════════════════════════════════════════ */}
      {historyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#11123D] border border-[#23275E] rounded-3xl p-6 max-w-4xl w-full space-y-4 shadow-2xl text-xs text-white max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#23275E] pb-3">
              <div>
                <h3 className="text-base font-serif font-bold text-white">
                  POS Register Transaction History
                </h3>
                <p className="text-[10.5px] text-slate-400 font-mono">
                  All counter sales, payment settlements and invoices for Terminal #04
                </p>
              </div>
              <button
                type="button"
                onClick={() => setHistoryModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left font-mono text-[11px]">
                <thead className="bg-[#080923] text-slate-400 text-[10px] uppercase border-b border-[#23275E]">
                  <tr>
                    <th className="py-2.5 px-3">Invoice #</th>
                    <th className="py-2.5 px-3">Client</th>
                    <th className="py-2.5 px-3">Items Summary</th>
                    <th className="py-2.5 px-2 text-center">Payment</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#23275E]/60">
                  {completedTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-white/5">
                      <td className="py-3 px-3">
                        <span className="font-bold text-white block">{tx.invoiceNumber}</span>
                        <span className="text-[9.5px] text-slate-500">{tx.date}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-slate-200 block">{tx.customer}</span>
                        <span className="text-[9.5px] text-slate-500">{tx.customerPhone}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-400 max-w-[200px] truncate">
                        {tx.productsText}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className="px-2 py-0.5 rounded bg-[#6500FF]/20 text-[#00D5FF] text-[10px]">
                          {tx.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-white">
                        {formatPrice(tx.total)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveInvoice(tx);
                            setHistoryModalOpen(false);
                            setInvoiceModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded bg-[#1265FF] hover:bg-[#00D5FF] hover:text-black text-white text-[10px] font-bold"
                        >
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          MODAL 6: Z-REPORT / DAILY SALES SUMMARY
          ════════════════════════════════════════════════════════════════ */}
      {zReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#11123D] border border-emerald-500/40 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl text-xs text-white">
            <div className="flex items-center justify-between border-b border-[#23275E] pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-serif font-bold text-white">Daily Z-Report Summary</h3>
              </div>
              <button
                type="button"
                onClick={() => setZReportModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 bg-[#080923] p-4 rounded-2xl border border-[#23275E] font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Date:</span>
                <span className="text-white">
                  {currentDateTime.toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Register Sales:</span>
                <span className="text-emerald-400 font-bold">{formatPrice(2485075)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Completed Orders:</span>
                <span className="text-white">28 Transactions</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Average Order Value:</span>
                <span className="text-white">{formatPrice(88752)}</span>
              </div>
              <div className="border-t border-[#23275E] pt-2 flex justify-between text-slate-400">
                <span>Card Settlements:</span>
                <span className="text-white">{formatPrice(1250075)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>UPI Collections:</span>
                <span className="text-white">{formatPrice(820000)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Cash in Drawer:</span>
                <span className="text-white">{formatPrice(415000)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                window.print();
                showToast('🖨️ Printing Daily Z-Report Slip...');
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official EOD Z-Report</span>
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          MODAL 7: ADD NEW CUSTOMER MODAL
          ════════════════════════════════════════════════════════════════ */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#11123D] border border-[#23275E] rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-xs text-white">
            <div className="flex items-center justify-between border-b border-[#23275E] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#00D5FF]" />
                <span>Register New VIP Client</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddCustomerModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10.5px] text-slate-400 font-mono block">Full Name:</label>
                <input
                  type="text"
                  value={newCustomerForm.name}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
                  placeholder="e.g. Vikramaditya Birla"
                  className="w-full h-9 px-3 bg-[#080923] border border-white/10 rounded-xl text-white text-xs outline-none focus:border-[#6500FF]"
                />
              </div>

              <div>
                <label className="text-[10.5px] text-slate-400 font-mono block">
                  Mobile Number:
                </label>
                <input
                  type="text"
                  value={newCustomerForm.phone}
                  onChange={(e) =>
                    setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })
                  }
                  placeholder="+91 98200 00000"
                  className="w-full h-9 px-3 bg-[#080923] border border-white/10 rounded-xl text-white text-xs outline-none focus:border-[#6500FF]"
                />
              </div>

              <div>
                <label className="text-[10.5px] text-slate-400 font-mono block">
                  Email Address:
                </label>
                <input
                  type="email"
                  value={newCustomerForm.email}
                  onChange={(e) =>
                    setNewCustomerForm({ ...newCustomerForm, email: e.target.value })
                  }
                  placeholder="client@luxury.com"
                  className="w-full h-9 px-3 bg-[#080923] border border-white/10 rounded-xl text-white text-xs outline-none focus:border-[#6500FF]"
                />
              </div>

              <div>
                <label className="text-[10.5px] text-slate-400 font-mono block">
                  Membership Tier:
                </label>
                <select
                  value={newCustomerForm.tier}
                  onChange={(e) =>
                    setNewCustomerForm({ ...newCustomerForm, tier: e.target.value })
                  }
                  className="w-full h-9 px-2 bg-[#080923] border border-white/10 rounded-xl text-white text-xs outline-none"
                >
                  <option value="Gold Member">Gold Member (2% Privilege)</option>
                  <option value="Platinum VIP">Platinum VIP (3% Privilege)</option>
                  <option value="Diamond VIP">Diamond VIP (5% Privilege)</option>
                  <option value="Connoisseur VIP">Connoisseur VIP (7% Privilege)</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!newCustomerForm.name || !newCustomerForm.phone) {
                  showToast('⚠️ Please enter name and mobile number.');
                  return;
                }
                const created = {
                  id: `c_${Date.now()}`,
                  name: newCustomerForm.name,
                  phone: newCustomerForm.phone,
                  email: newCustomerForm.email || 'client@watchhub.in',
                  tier: newCustomerForm.tier,
                  points: 500, // Welcome points
                  totalSpent: 0,
                  ordersCount: 0,
                  discountRate:
                    newCustomerForm.tier === 'Diamond VIP'
                      ? 5
                      : newCustomerForm.tier === 'Connoisseur VIP'
                      ? 7
                      : 2,
                };
                setCustomersList([created, ...customersList]);
                setSelectedCustomer(created);
                setShowAddCustomerModal(false);
                setNewCustomerForm({ name: '', phone: '', email: '', tier: 'Gold Member' });
                showToast(`✨ Client ${created.name} registered and selected!`);
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#1265FF] text-white font-bold text-xs"
            >
              Save & Attach to Current Bill
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default POSTerminalModule;
