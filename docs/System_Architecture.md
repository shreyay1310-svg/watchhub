# WatchHub — High-Level System Architecture

This document details the multi-tier architectural blueprint of the **WatchHub Luxury Watch E-Commerce & Management Platform**, highlighting component interactions, communication protocols, security boundaries, and external cloud service integrations.

---

## 1. Architectural Diagram

```mermaid
flowchart TD
    subgraph Clients["1. Multi-Role Client Tier (React + TypeScript)"]
        A1["👑 Customer Storefront<br/>(Catalog, 3D Bespoke, Cart, Tracking)"]
        A2["🏪 Store Admin Portal<br/>(POS, Products, Orders, Analytics)"]
        A3["📦 Inventory Manager Portal<br/>(Stock Valuation, Warehouses, Alerts)"]
        A4["🚚 Delivery Manager Portal<br/>(Rider Dispatch, Route Planning, AWB)"]
        A5["🛵 Delivery Partner Mobile Web<br/>(Assigned Deliveries, GPS, Proof of Delivery)"]
        A6["🎧 Customer Support Manager<br/>(Live Chat, 360 CRM, Razorpay Refunds, Escalations)"]
    end

    subgraph Edge["2. Edge & Ingress Tier"]
        B1["Vercel Global CDN<br/>(Edge Caching, Asset Distribution, SSL/TLS)"]
        B2["Express Routing & Reverse Proxy<br/>(Rate Limiting, Helmet Security Headers, CORS)"]
    end

    subgraph AuthLayer["3. Authentication & Security Middleware"]
        C1["JWT Authentication Filter<br/>(Access Token Bearer & Refresh Cookie)"]
        C2["Role-Based Access Control (RBAC)<br/>(Role Permission Verification Guard)"]
        C3["Cryptographic OTP Engine<br/>(HMAC-SHA256 Hashing, 60s Cooldown)"]
    end

    subgraph BackendServices["4. Business Logic Services & Controllers"]
        D1["Product & Category Controller"]
        D2["Order & Checkout Controller"]
        D3["Inventory & Movement Service"]
        D4["Delivery & Dispatch Engine"]
        D5["Support Ticket & CRM Controller"]
        D6["Socket.IO Real-Time Engine<br/>(Room: track_orderId, Live Chat)"]
    end

    subgraph Storage["5. Persistent Data Tier"]
        E1[("MongoDB Database<br/>(Replica Set, Mongoose ODM)")]
        E2[("Collections:<br/>users, products, orders, payments,<br/>locationhistories, otpverifications, auditlogs")]
    end

    subgraph ThirdParty["6. Third-Party Integrations & Cloud Services"]
        F1["💳 Razorpay Payment Gateway<br/>(Standard Checkout, Webhooks, Reversals)"]
        F2["🗺️ Google Maps JavaScript API<br/>(Distance Matrix, Geocoding, Map Pins)"]
        F3["📍 Browser Geolocation API<br/>(Rider GPS Telemetry)"]
        F4["📧 Resend Email Gateway<br/>(Transactional OTPs, Luxury HTML Templates)"]
        F5["📱 MSG91 & Fast2SMS Gateway<br/>(Mobile SMS Verification)"]
    end

    Clients -->|HTTPS REST / WSS| Edge
    Edge --> AuthLayer
    AuthLayer --> BackendServices
    BackendServices --> Storage
    BackendServices <--> ThirdParty
    D6 <-->|Real-Time Coordinates| A5
    D6 <-->|Real-Time Map Updates| A1
    D2 <-->|Order & Signature Verify| F1
    D4 <-->|Reverse Pickup & Geocoding| F2
```

---

## 2. Tier Breakdown & Technology Roles

### 2.1 Client Presentation Tier (Frontend)
- **Framework**: React 18 + TypeScript bundled with Vite.
- **Styling**: Tailwind CSS with custom luxury Dark Navy (`#070918`, `#091426`), Gold (`#E7B43F`), and Cyan (`#00D9E8`) themes.
- **State Management**: React Context API (`AuthContext`, `CartContext`, `WishlistContext`, `OrderContext`).
- **Charting & Data Visualization**: Recharts (Interactive Donut charts, Weekly Area volume curves, CSAT Line charts).
- **Icons**: Lucide React.
- **Navigation**: React Router DOM v6 with role-guarded routing (`RoleProtectedRoute`).

### 2.2 Server Application Tier (Backend)
- **Runtime**: Node.js v20+ with Express.js framework.
- **Security Middlewares**:
  - `helmet`: Applies 15+ secure HTTP headers (HSTS, Content Security Policy, XSS Protection).
  - `cors`: Strict origin validation allowing requests only from verified client domains.
  - `cookieParser`: Handles secure HTTP-only refresh tokens.
  - `morgan`: Structured HTTP request logging.
- **Real-Time Communication**: Socket.IO server mounted on the Node HTTP server. Allows delivery partners to stream GPS telemetry directly to customers tracking parcels via room-based events (`track_<orderId>`).

### 2.3 Data Storage Tier (Database)
- **Database Engine**: MongoDB.
- **Object Data Modeling (ODM)**: Mongoose v8.
- **High-Performance Patterns**:
  - Embedded subdocuments for atomic line items (`order.items`) and address lists (`user.addresses`).
  - Referenced models for high-frequency writes (`locationhistories`) and independent audit trails (`payments`).
  - Automated TTL cleanup (`otpverifications.expiresAt` with `expireAfterSeconds: 0`).

---

## 3. Communication Protocols & Security Boundaries

```mermaid
sequenceDiagram
    autonumber
    actor Client as Customer / Store Staff
    participant Edge as Vercel Edge / Express
    participant Auth as Auth Middleware (JWT/RBAC)
    participant Ctrl as API Controller
    participant DB as MongoDB
    participant Ext as Cloud Provider (Razorpay / Resend)

    Client->>Edge: HTTPS POST /api/auth/verify-email-otp
    Edge->>Auth: Validate CORS & Request Payload
    Auth->>Ctrl: Dispatch to authController
    Ctrl->>DB: Query OtpVerification by identifier
    DB-->>Ctrl: Return stored otpHash & attempts
    Ctrl->>Ctrl: Compute HMAC-SHA256 & Compare
    Ctrl->>DB: Invalidate OTP & Set user.isEmailVerified = true
    Ctrl->>Auth: Generate Access (1h) & Refresh (7d) JWTs
    Ctrl-->>Client: 200 OK + JWT Tokens + User Profile
```

---

## 4. Socket.IO Real-Time Architecture

The platform incorporates real-time WebSockets to bridge the physical logistics and customer portals:
1. **Room Channel Structure**: `track_${orderId}`.
2. **Telemetry Flow**:
   - The Delivery Partner triggers the `navigator.geolocation.watchPosition` API.
   - Coordinates (`lat`, `lng`, `speed`, `heading`) are emitted to the server via event `rider_location`.
   - The server validates the rider's active assignment, persists the record into `LocationHistory`, and broadcasts the event `rider_location_update` directly to the customer's open tracking room.
   - The customer's Google Map marker smoothly animates without requiring full page polling.
