# WatchHub UI Architecture, Visual Showcase & Screen Registry

This document maps the user interface screens, layout structures, visual design aesthetics, and client assets across the **WatchHub Luxury Horology E-Commerce & Operations Platform**.

---

## 1. Visual Identity & Design System

WatchHub embodies the aesthetics of **Swiss Haute Horlogerie**:
- **Primary Color Palette**:
  - `Dark Navy Background`: `#070918`
  - `Card / Component Surface`: `#111729`
  - `Sidebar Deep Surface`: `#091426`
  - `Borders & Subtleties`: `#252D42`
  - `Primary Horology Gold Accent`: `#E7B43F` (Rolex Fluted Bezel Gold)
  - `High-Tech Precision Cyan Accent`: `#00D9E8` (Luminescence Glow)
- **Typography**: Precision tabular figures, geometric sans-serif headings, and elegant serif typography for luxury provenance narratives.

---

## 2. Customer Storefront & E-Commerce Screens

### 2.1 Luxury Homepage & Hero Chronograph Showcase
- **Route**: `/`
- **Component**: `client/src/pages/HomePage.jsx`
- **Visual Assets**:
  - Hero Showcase: [hero-chronograph-showcase.jpg](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/client/src/assets/images/hero-chronograph-showcase.jpg)
  - Horology Pedestal: [watches-pedestal.jpg](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/client/src/assets/images/watches-pedestal.jpg)
  - Master Assembly Film: [watchmaking_assembly.mp4](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/client/public/videos/watchmaking_assembly.mp4)
- **Key Modules**:
  1. **Hero Banner**: High-resolution floating timepiece carousel with 3D depth lighting and live price tickers.
  2. **Watchmaking Video Preview**: Interactive modal playing mechanical movement assembly film with escapement closeups.
  3. **Brand Pavilion**: Interactive filter tabs for Rolex, Omega, Patek Philippe, TAG Heuer, Breitling, Tissot, and Seiko.
  4. **Trending & Haute Horlogerie Curations**: Carousel of limited-edition pieces with real-time stock availability badges.

### 2.2 Brand & Category Discovery Portals
- **Routes**: `/watches`, `/categories`, `/brands/:brandSlug`
- **Components**: `client/src/pages/WatchesPage.jsx`, `client/src/pages/CategoriesPage.jsx`
- **Visual Assets**:
  - Rolex Submariner: [rolex-submariner.png](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/client/public/images/products/rolex-submariner.png)
  - Patek Philippe Nautilus: [patek-nautilus.png](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/client/public/images/products/patek-nautilus.png)
  - Omega Speedmaster: [omega-speedmaster.png](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/client/public/images/products/omega-speedmaster.png)
  - TAG Heuer Carrera: [tag-heuer-carrera.png](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/client/public/images/products/tag-heuer-carrera.png)
- **Key Modules**:
  1. **Faceted Filter Drawer**: Dynamic multi-criteria filter by price range, movement type (Automatic, Tourbillon, Quartz), case material (Oystersteel, Rose Gold, Titanium), and water resistance.
  2. **Product Grid**: Uncropped full-watch cards displaying bezel, dial, crown, and strap details with hover zoom micro-interactions.

### 2.3 DIY 3D Beaded Watch Customization Studio
- **Route**: `/customize`
- **Component**: `client/src/pages/CustomizeWatchPage.jsx`
- **Key Modules**:
  1. **Interactive Assembly Canvas**: Real-time visual compositor layering dials, bezels, hands, case finishes, and custom hand-selected gemstones/beads.
  2. **Custom Caseback Engraver**: Text and font customizer rendering preview engravings directly onto 3D simulated caseback.
  3. **Live Dynamic Pricing Engine**: Real-time price calculation dynamically updating as premium materials are toggled.

### 2.4 Checkout & Razorpay Payment Modal
- **Routes**: `/cart`, `/checkout`
- **Components**: `client/src/pages/CartPage.jsx`, `client/src/pages/CheckoutPage.jsx`
- **Key Modules**:
  1. **Order Summary Panel**: Line-item breakdown with insured shipping calculation and promo discount validation.
  2. **Address Selector & Geocoding**: Saved address switcher with autocomplete.
  3. **Razorpay Modal Integration**: Seamless dark-mode Razorpay checkout dialog supporting UPI, Cards, Netbanking, and EMI.

### 2.5 Customer My Orders & Live GPS Tracking
- **Routes**: `/orders`, `/orders/track/:orderId`
- **Components**: `client/src/pages/CustomerOrdersTrackingPage.jsx`, `client/src/pages/TrackParcelPage.jsx`
- **Key Modules**:
  1. **Order Status Timeline**: Visual milestone tracker (Confirmed -> In Vault -> Quality Checked -> Shipped -> Out for Delivery -> Delivered).
  2. **Interactive Google Map**: Live delivery rider location marker moving in real time with dynamic ETA and road route polylines.
  3. **Delivery Security Key**: Display of the one-time delivery security verification code required for handover.

---

## 3. Back-Office Role Management Dashboards

### 3.1 Store Admin Portal (`/admin/*`)
- **Primary Layout**: `client/src/pages/admin/AdminLayout.jsx`
- **Modules (13 Dedicated Pages)**:
  - `Dashboard`: Executive KPI tiles (Gross Revenue, Net Profit, Order Volume, Return Ratio).
  - `Products Management`: Master catalog CRUD, variant configuration, and asset management.
  - `Orders Management`: Omnichannel order processing, status overrides, and invoice generator.
  - `POS Terminal`: In-store walk-in customer checkout terminal with barcode scanner simulation.
  - `Inventory Management`: Cross-warehouse stock sync and supplier reorder queues.
  - `Delivery Operations`: Fleet assignment and 3PL courier integrations.
  - `Customer Support`: Integrated support escalation queue.
  - `Customization Studio`: Custom watch production queue and CAD approval.
  - `Offers & Coupons`: Discount engine with usage quotas and minimum spend thresholds.
  - `Reports & Analytics`: Cohort retention charts, brand sales breakdown, and profit margin analysis.
  - `Settings & Audit Log`: Immutable audit stream of administrative modifications.

### 3.2 Inventory Manager Portal (`/inventory/*`)
- **Primary Layout**: `client/src/pages/inventory/InventoryLayout.jsx`
- **Modules (11 Dedicated Pages)**:
  - `Dashboard`: Vault capacity metrics, fast-moving SKUs, and stock health indicators.
  - `Stock Overview`: Real-time stock levels across luxury vaults with search and low-stock filters.
  - `Stock Adjustments`: Audit-logged manual adjustments with mandatory justification reason.
  - `Stock Movements`: Inter-warehouse transfer logs between Central Vault and Regional Hubs.
  - `Reorder Alerts`: Automated low-stock trigger list with calculated economic order quantities (EOQ).
  - `Purchase Requests`: Formal replenishment requests routed to Store Admin for financial approval.
  - `Warehouse Management`: Bin and shelf location mapping for high-security timepiece storage.
  - `Inventory Reports`: Stock valuation statements and aging inventory analysis.

### 3.3 Delivery Manager Portal (`/delivery/*`)
- **Primary Layout**: `client/src/pages/delivery/DeliveryLayout.jsx`
- **Modules (11 Dedicated Pages)**:
  - `Dashboard`: Active shipments, on-time delivery rate, out-for-delivery counter, and SLA breaches.
  - `Delivery Orders`: Comprehensive table of dispatch-ready orders with courier assignment controls.
  - `Assign Deliveries`: Smart assignment modal matching rider capacity and delivery zones.
  - `Shipment Tracking`: Live multi-shipment radar monitoring all couriers on a centralized map.
  - `Delivery Partners`: Management of 3PL logistics carriers (BlueDart Apex, DHL Express, FedEx) and in-house riders.
  - `Route Planning`: Multi-stop route optimization using Google Maps Directions API.
  - `Delivery Attempts`: Exception management tracking failed attempts, customer unavailable notes, and rescheduled slots.
  - `Returns & Pickups`: Reverse logistics handling return inspections and vault restocking.
  - `Service Areas`: Geofenced operational zones and pincode delivery capability management.

### 3.4 Delivery Partner / Rider Mobile Dashboard (`/rider/*`)
- **Primary Component**: `client/src/pages/delivery/DeliveryPartnerDashboardPage.jsx`
- **Key Modules**:
  - `Assigned Shipments`: Clean mobile-first list of pending deliveries prioritized by delivery window.
  - `Live Turn-by-Turn GPS`: Integrated navigation interface routing the courier directly to the customer's doorstep.
  - `Customer Contact Sheet`: Masked calling and messaging shortcuts.
  - `Delivery Handover Verification`: Dual security protocol:
    1. **Customer OTP Entry**: 6-digit code verification eliminating false deliveries.
    2. **Camera Proof of Delivery**: Photo capture and on-screen signature pad.

### 3.5 Customer Support Executive Portal (`/support/*`)
- **Primary Layout**: `client/src/pages/support/CustomerSupportLayout.jsx`
- **Modules (12 Dedicated Pages)**:
  - `Dashboard`: Open tickets, first-contact resolution (FCR) rate, and live chat queues.
  - `Support Tickets`: Omnichannel ticketing queue with priority badges and SLA countdowns.
  - `Live Concierge Chat`: Real-time WebSocket messaging interface with luxury watch advisory capabilities.
  - `Customers Directory`: VIP client purchase history, preferences, and previous interactions.
  - `Orders & Returns`: Order lookup tool with fast-track return initiation.
  - `Refunds & Replacements`: Direct integration with Razorpay refund service with audit confirmation.
  - `Escalations Desk`: High-priority dispute management for high-value horology clients.
  - `Knowledge Base`: Horology technical manuals, movement warranty guides, and FAQs.
  - `Canned Responses`: Quick-response macros for common inquiries.
