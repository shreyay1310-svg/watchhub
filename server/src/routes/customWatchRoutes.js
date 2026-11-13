import express from 'express';

const router = express.Router();

// In-memory persistent storage for custom watch designs and orders
let savedDesignsStore = [];
let customOrdersStore = [
  {
    id: 'BESPOKE-9401',
    customer: 'Dr. Vikram Malhotra',
    email: 'vikram.m@gmail.com',
    date: '13 Nov 2026, 02:40 PM',
    watchType: 'Automatic Watch (42mm)',
    specs: 'Sunburst Navy Blue Dial • Grade 5 Titanium Case • Italian Brown Leather (22mm) • Sapphire Crystal',
    engraving: '"V.M. • 2026 • Per Aspera Ad Astra"',
    status: 'Pending Review',
    calculatedPrice: 24799,
    approvedQuote: 24799,
    deliveryTarget: '21 Nov 2026',
  },
  {
    id: 'BESPOKE-9402',
    customer: 'Ananya Deshmukh',
    email: 'ananya.d@outlook.com',
    date: '13 Nov 2026, 11:15 AM',
    watchType: 'Skeleton Watch (38mm)',
    specs: 'Skeleton Dial • 18K Rose Gold-Plated Case • Milanese Mesh (18mm) • Exhibition Back Case',
    engraving: '"A.D. • Forever Yours"',
    status: 'Component Milling',
    calculatedPrice: 31299,
    approvedQuote: 31299,
    deliveryTarget: '24 Nov 2026',
  },
];

// 1. Get Master Configuration & Component Pricing
router.get('/config', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      basePrices: {
        analog: 9999,
        automatic: 18499,
        chronograph: 14999,
        skeleton: 24999,
        mechanical: 21999,
        minimalist: 7999,
        smartwatch: 12999,
        digital: 6499,
      },
      upgrades: {
        dialShapes: { round: 0, square: 600, rectangle: 800, oval: 700, tonneau: 1200 },
        dialFinishes: { sunburst: 600, matte: 0, glossy: 400, textured: 1000, skeleton: 2500 },
        caseMaterials: { steel: 0, titanium: 3500, ceramic: 4200, brass: 1200, gold_plated: 2800, rosegold_plated: 2800 },
        movements: { automatic: 3500, mechanical: 5000, quartz: 0, digital: 1500 },
        laserEngraving: 300,
      },
      currency: 'INR',
    },
  });
});

// 2. Validate Price & Component Compatibility
router.post('/validate-price', (req, res) => {
  const { watchType, dial, case: watchCase, strap, movement, features, personalization } = req.body;

  const basePrices = {
    analog: 9999,
    automatic: 18499,
    chronograph: 14999,
    skeleton: 24999,
    mechanical: 21999,
    minimalist: 7999,
    smartwatch: 12999,
    digital: 6499,
  };

  const basePrice = basePrices[watchType] || 9999;
  let upgrades = 0;

  // Material upgrades
  if (watchCase?.material === 'titanium') upgrades += 3500;
  if (watchCase?.material === 'ceramic') upgrades += 4200;
  if (watchCase?.material === 'gold_plated' || watchCase?.material === 'rosegold_plated') upgrades += 2800;

  // Movement upgrade
  if (movement === 'automatic') upgrades += 3500;
  if (movement === 'mechanical') upgrades += 5000;

  // Finish upgrade
  if (dial?.finish === 'skeleton') upgrades += 2500;
  if (dial?.finish === 'textured') upgrades += 1000;
  if (dial?.finish === 'sunburst') upgrades += 600;

  // Engraving fee
  const engravingFee = personalization?.backEngraving || personalization?.dialText ? 300 : 0;
  const totalPrice = basePrice + upgrades + engravingFee;

  res.status(200).json({
    status: 'success',
    data: {
      isValid: true,
      basePrice,
      upgrades,
      engravingFee,
      totalPrice,
      currency: 'INR',
    },
  });
});

// 3. Save Custom Watch Design
router.post('/save', (req, res) => {
  const design = {
    ...req.body,
    id: req.body.id || `design-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  savedDesignsStore.unshift(design);
  res.status(201).json({
    status: 'success',
    message: 'Custom watch design successfully saved.',
    data: design,
  });
});

// 4. Get Customer Saved Designs
router.get('/designs', (req, res) => {
  res.status(200).json({
    status: 'success',
    count: savedDesignsStore.length,
    data: savedDesignsStore,
  });
});

// 5. Submit Custom Watch Order
router.post('/order', (req, res) => {
  const { customer, email, customConfig, calculatedPrice } = req.body;

  const newOrder = {
    id: `BESPOKE-${Math.floor(1000 + Math.random() * 9000)}`,
    customer: customer || 'WatchHub Customer',
    email: email || 'customer@watchhub.com',
    date: new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    watchType: `${customConfig?.watchType || 'Custom'} Watch (${customConfig?.dial?.size || 42}mm)`,
    specs: `${customConfig?.dial?.shape} ${customConfig?.dial?.color} Dial • ${customConfig?.case?.material} Case • ${customConfig?.strap?.material} Strap`,
    engraving: customConfig?.personalization?.backEngraving
      ? `"${customConfig.personalization.backEngraving}"`
      : 'None',
    status: 'Pending Review',
    calculatedPrice: calculatedPrice || 14999,
    approvedQuote: calculatedPrice || 14999,
    deliveryTarget: '7-10 Business Days',
  };

  customOrdersStore.unshift(newOrder);

  res.status(201).json({
    status: 'success',
    message: 'Custom watch order created and sent to Horology Lab.',
    data: newOrder,
  });
});

// 6. Get All Custom Orders (Admin)
router.get('/orders', (req, res) => {
  res.status(200).json({
    status: 'success',
    count: customOrdersStore.length,
    data: customOrdersStore,
  });
});

// 7. Update Custom Order Status (Admin)
router.patch('/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, approvedQuote } = req.body;

  const order = customOrdersStore.find((o) => o.id === id);
  if (!order) {
    return res.status(404).json({
      status: 'fail',
      message: `Custom order ${id} not found.`,
    });
  }

  if (status) order.status = status;
  if (approvedQuote) order.approvedQuote = approvedQuote;

  res.status(200).json({
    status: 'success',
    message: `Order ${id} status updated to: ${order.status}`,
    data: order,
  });
});

export default router;

