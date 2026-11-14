import express from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Mock Initial Inventory Database
let INVENTORY_DATABASE = [
  {
    id: 'inv_001',
    productName: 'Rolex Submariner Date 41mm',
    subSpecs: 'Black Dial • Stainless Steel',
    sku: 'WH-ROL-001',
    category: 'Luxury',
    brand: 'Rolex',
    warehouse: 'Main Warehouse',
    currentStock: 24,
    reservedStock: 3,
    availableStock: 21,
    minLevel: 5,
    unitCost: 12000,
    sellingPrice: 18999,
    status: 'In Stock',
    lastUpdated: '05 Nov 2026, 11:25 AM',
    image: '/images/products/featured_rolex_submariner.jpg',
  },
  {
    id: 'inv_002',
    productName: 'Rolex Cosmograph Daytona',
    subSpecs: 'Gold Dial • 40 mm',
    sku: 'WH-ROL-002',
    category: 'Luxury',
    brand: 'Rolex',
    warehouse: 'Main Warehouse',
    currentStock: 18,
    reservedStock: 2,
    availableStock: 16,
    minLevel: 5,
    unitCost: 14500,
    sellingPrice: 21999,
    status: 'In Stock',
    lastUpdated: '05 Nov 2026, 10:40 AM',
    image: '/images/products/featured_rolex_daytona.jpg',
  },
  {
    id: 'inv_003',
    productName: 'Omega Speedmaster Professional',
    subSpecs: 'Black Dial • 42 mm',
    sku: 'WH-OMG-001',
    category: 'Men\'s',
    brand: 'Omega',
    warehouse: 'Delhi Warehouse',
    currentStock: 8,
    reservedStock: 1,
    availableStock: 7,
    minLevel: 10,
    unitCost: 11000,
    sellingPrice: 16499,
    status: 'Low Stock',
    lastUpdated: '04 Nov 2026, 06:15 PM',
    image: '/images/products/featured_omega_speedmaster.jpg',
  },
  {
    id: 'inv_004',
    productName: 'Omega Seamaster Diver 300M',
    subSpecs: 'Blue Dial • 42 mm',
    sku: 'WH-OMG-002',
    category: 'Sports',
    brand: 'Omega',
    warehouse: 'Main Warehouse',
    currentStock: 0,
    reservedStock: 0,
    availableStock: 0,
    minLevel: 5,
    unitCost: 9800,
    sellingPrice: 14999,
    status: 'Out of Stock',
    lastUpdated: '04 Nov 2026, 02:10 PM',
    image: '/images/products/featured_omega_seamaster.jpg',
  },
  {
    id: 'inv_005',
    productName: 'Cartier Tank Must',
    subSpecs: 'White Dial • 33 mm',
    sku: 'WH-CAR-001',
    category: 'Women\'s',
    brand: 'Cartier',
    warehouse: 'Mumbai Warehouse',
    currentStock: 12,
    reservedStock: 2,
    availableStock: 10,
    minLevel: 5,
    unitCost: 240000,
    sellingPrice: 349000,
    status: 'In Stock',
    lastUpdated: '03 Nov 2026, 04:20 PM',
    image: '/images/products/featured_cartier_tank.jpg',
  },
  {
    id: 'inv_006',
    productName: 'Patek Philippe Nautilus 5711',
    subSpecs: 'Blue Dial • 40 mm',
    sku: 'WH-PP-001',
    category: 'Luxury',
    brand: 'Patek Philippe',
    warehouse: 'Main Warehouse',
    currentStock: 5,
    reservedStock: 1,
    availableStock: 4,
    minLevel: 5,
    unitCost: 4200000,
    sellingPrice: 5499000,
    status: 'Low Stock',
    lastUpdated: '03 Nov 2026, 01:15 PM',
    image: '/images/products/featured_patek_nautilus.jpg',
  },
  {
    id: 'inv_007',
    productName: 'Apple Watch Series 10',
    subSpecs: 'Midnight • 46 mm',
    sku: 'WH-APL-001',
    category: 'Smartwatches',
    brand: 'Apple',
    warehouse: 'Delhi Warehouse',
    currentStock: 28,
    reservedStock: 4,
    availableStock: 24,
    minLevel: 10,
    unitCost: 38000,
    sellingPrice: 46900,
    status: 'In Stock',
    lastUpdated: '02 Nov 2026, 05:45 PM',
    image: '/images/products/featured_apple_watch.jpg',
  },
  {
    id: 'inv_008',
    productName: 'Tag Heuer Carrera Chronograph',
    subSpecs: 'Silver Dial • 39 mm',
    sku: 'WH-TAG-001',
    category: 'Luxury',
    brand: 'Tag Heuer',
    warehouse: 'Mumbai Warehouse',
    currentStock: 6,
    reservedStock: 0,
    availableStock: 6,
    minLevel: 10,
    unitCost: 210000,
    sellingPrice: 285000,
    status: 'Low Stock',
    lastUpdated: '02 Nov 2026, 11:30 AM',
    image: '/images/products/featured_ap_royal_oak.jpg',
  },
];

// Warehouses Data
let WAREHOUSES = [
  {
    id: 'wh_main',
    name: 'Main Warehouse',
    city: 'Gurugram, Haryana',
    address: 'Plot 48, Central Logistics Hub, Sector 34, Gurugram',
    manager: 'Vikram Joshi (Senior Warehouse Lead)',
    managerContact: '+91 98112 34567',
    totalStockUnits: 8420,
    capacity: 10000,
    isPrimary: true,
    securityLevel: 'Vault Level 4 (Biometric + CCTV)',
    status: 'Operational',
  },
  {
    id: 'wh_delhi',
    name: 'Delhi Warehouse',
    city: 'Okhla, New Delhi',
    address: 'B-12, Industrial Area Phase III, New Delhi',
    manager: 'Ramesh Patel (North Hub Lead)',
    managerContact: '+91 98223 45678',
    totalStockUnits: 2640,
    capacity: 4000,
    isPrimary: false,
    securityLevel: 'Vault Level 3 (Smart Keycard)',
    status: 'Operational',
  },
  {
    id: 'wh_mumbai',
    name: 'Mumbai Warehouse',
    city: 'BKC, Mumbai',
    address: 'Godown 7, Bandra-Kurla Complex Logistics Park, Mumbai',
    manager: 'Rajesh Sharma (West Hub Lead)',
    managerContact: '+91 98334 56789',
    totalStockUnits: 1780,
    capacity: 3000,
    isPrimary: false,
    securityLevel: 'Vault Level 4 (High Security)',
    status: 'Operational',
  },
];

// Stock Movement History Ledger
let STOCK_MOVEMENTS = [
  {
    id: 'MOV-1049',
    timestamp: '14 Nov 2026, 10:45 AM',
    reference: 'PO-2026-9041',
    productName: 'Rolex Submariner Date 41mm',
    sku: 'WH-ROL-001',
    type: 'Stock In (+)',
    quantity: 10,
    warehouse: 'Main Warehouse',
    operator: 'Suresh Patel (Inventory Mgr)',
    reason: 'Direct Factory Inward from Rolex Geneva SA',
  },
  {
    id: 'MOV-1048',
    timestamp: '13 Nov 2026, 04:30 PM',
    reference: 'ORD-WH20261125',
    productName: 'Rolex Submariner Date 41mm',
    sku: 'WH-ROL-001',
    type: 'Stock Out (-)',
    quantity: 1,
    warehouse: 'Main Warehouse',
    operator: 'Automated Order Fulfillment',
    reason: 'Customer Dispatched (Delhivery DLV7894563210)',
  },
  {
    id: 'MOV-1047',
    timestamp: '13 Nov 2026, 01:15 PM',
    reference: 'TRF-2026-402',
    productName: 'Apple Watch Series 10',
    sku: 'WH-APL-001',
    type: 'Warehouse Transfer (⇄)',
    quantity: 5,
    warehouse: 'Delhi Warehouse',
    operator: 'Ramesh Patel',
    reason: 'Transferred from Main Warehouse to meet Delhi festive spike',
  },
  {
    id: 'MOV-1046',
    timestamp: '12 Nov 2026, 02:40 PM',
    reference: 'ADJ-2026-089',
    productName: 'Omega Speedmaster Professional',
    sku: 'WH-OMG-001',
    type: 'Manual Adjustment (-)',
    quantity: 1,
    warehouse: 'Delhi Warehouse',
    operator: 'Suresh Patel (Approved)',
    reason: 'Crystal scratch noticed during safety audit - Sent for servicing',
  },
  {
    id: 'MOV-1045',
    timestamp: '11 Nov 2026, 11:20 AM',
    reference: 'RET-WH12540',
    productName: 'Cartier Tank Must',
    sku: 'WH-CAR-001',
    type: 'Customer Return (+)',
    quantity: 1,
    warehouse: 'Mumbai Warehouse',
    operator: 'Rajesh Sharma',
    reason: 'Size exchange return - 100% Verified Authentic & Restocked',
  },
];

// Purchase Requests Ledger
let PURCHASE_REQUESTS = [
  {
    id: 'PR-8901',
    date: '14 Nov 2026',
    productName: 'Omega Seamaster Diver 300M',
    sku: 'WH-OMG-002',
    suggestedQty: 25,
    supplier: 'Swatch Group India Pvt Ltd',
    currentStock: 0,
    minLevel: 5,
    status: 'Pending Super Admin Approval',
    urgency: 'Critical (Out of Stock)',
  },
  {
    id: 'PR-8902',
    date: '13 Nov 2026',
    productName: 'Omega Speedmaster Professional',
    sku: 'WH-OMG-001',
    suggestedQty: 20,
    supplier: 'Swatch Group India Pvt Ltd',
    currentStock: 8,
    minLevel: 10,
    status: 'Approved & PO Dispatched',
    urgency: 'High (Low Stock)',
  },
];

// GET /api/inventory
router.get('/', (req, res) => {
  const { warehouse, status, search } = req.query;
  let items = [...INVENTORY_DATABASE];

  if (warehouse && warehouse !== 'All' && warehouse !== 'All Warehouses') {
    items = items.filter((i) => i.warehouse.toLowerCase().includes(warehouse.toLowerCase()));
  }

  if (status && status !== 'All') {
    items = items.filter((i) => i.status.toLowerCase() === status.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    items = items.filter(
      (i) =>
        i.productName.toLowerCase().includes(q) ||
        i.sku.toLowerCase().includes(q) ||
        i.brand.toLowerCase().includes(q)
    );
  }

  const totalStockUnits = INVENTORY_DATABASE.reduce((sum, item) => sum + item.currentStock, 0) + 12840 - 91;
  const totalStockValue = 84290000;

  res.status(200).json({
    status: 'success',
    data: items,
    stats: {
      totalStockUnits: 12840,
      inStockProducts: 298,
      lowStockItems: 18,
      outOfStock: 10,
      totalStockValue: '₹8,42,90,000',
      totalProductsCount: 320,
    },
    warehouses: WAREHOUSES,
    lowStockAlerts: INVENTORY_DATABASE.filter((i) => i.status === 'Low Stock' || i.currentStock <= i.minLevel),
  });
});

// POST /api/inventory/add-stock
router.post('/add-stock', authenticate, authorizeRoles('Inventory Manager', 'Super Admin'), (req, res) => {
  const { sku, quantity, warehouse, supplier, purchaseRef, unitCost, remarks } = req.body;
  if (!sku || !quantity || Number(quantity) <= 0) {
    return res.status(400).json({ status: 'fail', message: 'Valid SKU and positive quantity required.' });
  }

  const qty = Number(quantity);
  const itemIndex = INVENTORY_DATABASE.findIndex((i) => i.sku.toUpperCase() === sku.toUpperCase());

  if (itemIndex === -1) {
    return res.status(404).json({ status: 'fail', message: `Product with SKU ${sku} not found in inventory.` });
  }

  // Update Stock
  INVENTORY_DATABASE[itemIndex].currentStock += qty;
  INVENTORY_DATABASE[itemIndex].availableStock =
    INVENTORY_DATABASE[itemIndex].currentStock - INVENTORY_DATABASE[itemIndex].reservedStock;
  INVENTORY_DATABASE[itemIndex].lastUpdated = 'Just now';

  if (INVENTORY_DATABASE[itemIndex].currentStock > INVENTORY_DATABASE[itemIndex].minLevel) {
    INVENTORY_DATABASE[itemIndex].status = 'In Stock';
  }

  // Log Movement
  const newMovement = {
    id: `MOV-${Date.now().toString().slice(-4)}`,
    timestamp: 'Just now',
    reference: purchaseRef || `PO-${Date.now().toString().slice(-4)}`,
    productName: INVENTORY_DATABASE[itemIndex].productName,
    sku: INVENTORY_DATABASE[itemIndex].sku,
    type: 'Stock In (+)',
    quantity: qty,
    warehouse: warehouse || INVENTORY_DATABASE[itemIndex].warehouse,
    operator: 'Suresh Patel (Inventory Mgr)',
    reason: remarks || `Supplier inward from ${supplier || 'Authorized Manufacturer'}`,
  };

  STOCK_MOVEMENTS.unshift(newMovement);

  res.status(200).json({
    status: 'success',
    message: `Successfully added ${qty} units to ${INVENTORY_DATABASE[itemIndex].productName}!`,
    updatedItem: INVENTORY_DATABASE[itemIndex],
    movement: newMovement,
  });
});

// POST /api/inventory/adjust-stock
router.post('/adjust-stock', authenticate, authorizeRoles('Inventory Manager', 'Super Admin'), (req, res) => {
  const { sku, adjustmentType, adjustmentQuantity, reason, remarks } = req.body;
  if (!sku || !adjustmentQuantity || Number(adjustmentQuantity) <= 0) {
    return res.status(400).json({ status: 'fail', message: 'Valid SKU and positive adjustment quantity required.' });
  }

  const qty = Number(adjustmentQuantity);
  const itemIndex = INVENTORY_DATABASE.findIndex((i) => i.sku.toUpperCase() === sku.toUpperCase());

  if (itemIndex === -1) {
    return res.status(404).json({ status: 'fail', message: `Product with SKU ${sku} not found.` });
  }

  const isIncrease = adjustmentType === 'increase';

  if (!isIncrease && INVENTORY_DATABASE[itemIndex].currentStock < qty) {
    return res.status(400).json({
      status: 'fail',
      message: `Cannot decrease ${qty} units. Current stock is only ${INVENTORY_DATABASE[itemIndex].currentStock} units.`,
    });
  }

  // Apply Adjustment
  if (isIncrease) {
    INVENTORY_DATABASE[itemIndex].currentStock += qty;
  } else {
    INVENTORY_DATABASE[itemIndex].currentStock -= qty;
  }

  INVENTORY_DATABASE[itemIndex].availableStock =
    INVENTORY_DATABASE[itemIndex].currentStock - INVENTORY_DATABASE[itemIndex].reservedStock;
  INVENTORY_DATABASE[itemIndex].lastUpdated = 'Just now';

  // Status check
  if (INVENTORY_DATABASE[itemIndex].currentStock === 0) {
    INVENTORY_DATABASE[itemIndex].status = 'Out of Stock';
  } else if (INVENTORY_DATABASE[itemIndex].currentStock <= INVENTORY_DATABASE[itemIndex].minLevel) {
    INVENTORY_DATABASE[itemIndex].status = 'Low Stock';
  } else {
    INVENTORY_DATABASE[itemIndex].status = 'In Stock';
  }

  // Log movement
  const movement = {
    id: `MOV-${Date.now().toString().slice(-4)}`,
    timestamp: 'Just now',
    reference: `ADJ-${Date.now().toString().slice(-4)}`,
    productName: INVENTORY_DATABASE[itemIndex].productName,
    sku: INVENTORY_DATABASE[itemIndex].sku,
    type: isIncrease ? 'Manual Adjustment (+)' : 'Manual Adjustment (-)',
    quantity: isIncrease ? qty : -qty,
    warehouse: INVENTORY_DATABASE[itemIndex].warehouse,
    operator: 'Suresh Patel (Inventory Mgr)',
    reason: `${reason || 'Stock audit reconciliation'}: ${remarks || 'Standard inventory audit adjustment'}`,
  };

  STOCK_MOVEMENTS.unshift(movement);

  res.status(200).json({
    status: 'success',
    message: `Stock successfully adjusted for ${INVENTORY_DATABASE[itemIndex].productName}!`,
    updatedItem: INVENTORY_DATABASE[itemIndex],
    movement,
  });
});

// POST /api/inventory/transfer
router.post('/transfer', authenticate, authorizeRoles('Inventory Manager', 'Super Admin'), (req, res) => {
  const { sku, fromWarehouse, toWarehouse, quantity, transferRef, reason } = req.body;
  if (!sku || !fromWarehouse || !toWarehouse || !quantity || Number(quantity) <= 0) {
    return res.status(400).json({ status: 'fail', message: 'All transfer fields and positive quantity required.' });
  }

  if (fromWarehouse === toWarehouse) {
    return res.status(400).json({ status: 'fail', message: 'Source and destination warehouses cannot be the same.' });
  }

  const qty = Number(quantity);
  const item = INVENTORY_DATABASE.find((i) => i.sku.toUpperCase() === sku.toUpperCase());

  if (!item) {
    return res.status(404).json({ status: 'fail', message: 'Product not found.' });
  }

  if (item.availableStock < qty) {
    return res.status(400).json({
      status: 'fail',
      message: `Insufficient available stock in ${fromWarehouse}. Available: ${item.availableStock}, requested: ${qty}.`,
    });
  }

  // Record transfer movement
  const movement = {
    id: `MOV-${Date.now().toString().slice(-4)}`,
    timestamp: 'Just now',
    reference: transferRef || `TRF-${Date.now().toString().slice(-4)}`,
    productName: item.productName,
    sku: item.sku,
    type: 'Warehouse Transfer (⇄)',
    quantity: qty,
    warehouse: `${fromWarehouse} → ${toWarehouse}`,
    operator: 'Suresh Patel (Inventory Mgr)',
    reason: reason || 'Regional inventory rebalancing',
  };

  STOCK_MOVEMENTS.unshift(movement);

  res.status(200).json({
    status: 'success',
    message: `Successfully transferred ${qty} units of ${item.productName} from ${fromWarehouse} to ${toWarehouse}!`,
    movement,
  });
});

// POST /api/inventory/reorder
router.post('/reorder', authenticate, authorizeRoles('Inventory Manager', 'Super Admin'), (req, res) => {
  const { sku, suggestedQty, supplier, notes } = req.body;
  const item = INVENTORY_DATABASE.find((i) => i.sku.toUpperCase() === (sku || '').toUpperCase());

  const newPr = {
    id: `PR-${Date.now().toString().slice(-4)}`,
    date: '14 Nov 2026',
    productName: item?.productName || 'Luxury Timepiece',
    sku: sku || 'WH-GEN-01',
    suggestedQty: Number(suggestedQty) || 20,
    supplier: supplier || 'Authorized Brand Distributor',
    currentStock: item?.currentStock || 0,
    minLevel: item?.minLevel || 5,
    status: 'Purchase Request Submitted',
    urgency: item?.currentStock === 0 ? 'Critical' : 'Standard Low Stock Reorder',
    notes,
  };

  PURCHASE_REQUESTS.unshift(newPr);

  res.status(200).json({
    status: 'success',
    message: `Purchase Request ${newPr.id} submitted for ${newPr.productName}!`,
    request: newPr,
  });
});

// GET /api/inventory/movements
router.get('/movements', (req, res) => {
  res.status(200).json({ status: 'success', data: STOCK_MOVEMENTS });
});

// GET /api/inventory/warehouses
router.get('/warehouses', (req, res) => {
  res.status(200).json({ status: 'success', data: WAREHOUSES });
});

export default router;
