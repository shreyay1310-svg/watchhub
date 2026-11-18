# WatchHub — Data Flow Diagrams (DFD)

This document provides complete multi-level Data Flow Diagrams (DFD Levels 0, 1, and 2) modeling the movement, transformation, and storage of data across the **WatchHub Luxury Watch E-Commerce & Management Platform**.

---

## 1. DFD Level 0 — System Context Diagram

```mermaid
flowchart TD
    Customer["👤 Customer"]
    Admin["🏪 Store Admin"]
    InvMgr["📦 Inventory Manager"]
    DelMgr["🚚 Delivery Manager"]
    DelRider["🛵 Delivery Partner"]
    SupportMgr["🎧 Customer Support"]

    Razorpay["💳 Razorpay Gateway"]
    Resend["📧 Resend Email Gateway"]
    Maps["🗺️ Google Maps API"]

    WatchHub(("👑 WatchHub Central Platform"))

    Customer -->|Registration, Orders, Payments, Support Queries| WatchHub
    WatchHub -->|Order Confirmations, Tracking Updates, Products| Customer

    Admin -->|Product CRUD, Promotions, Store Settings| WatchHub
    WatchHub -->|Sales Analytics, Audit Logs, Store Metrics| Admin

    InvMgr -->|Stock Adjustments, Reorder Requests, Warehouses| WatchHub
    WatchHub -->|Low Stock Alerts, Inventory Valuations| InvMgr

    DelMgr -->|Courier Assignment, Route Optimization| WatchHub
    WatchHub -->|Shipment Manifests, Delivery Reports| DelMgr

    DelRider -->|GPS Telemetry, Delivery OTP, Proof of Delivery| WatchHub
    WatchHub -->|Assigned Deliveries, Navigation Waypoints| DelRider

    SupportMgr -->|Ticket Responses, Refund Authorizations| WatchHub
    WatchHub -->|Inbound Tickets, Live Chats, Escalation Alerts| SupportMgr

    WatchHub <-->|Payment Orders, Webhooks, Signature Verification| Razorpay
    WatchHub -->|Transactional OTPs, Order Receipts| Resend
    WatchHub <-->|Geocoding, Distance Matrix, Map Render| Maps
```

---

## 2. DFD Level 1 — Functional Decomposition Diagram

```mermaid
flowchart TD
    subgraph DataStores["Data Stores"]
        D1[("D1: Users")]
        D2[("D2: Products")]
        D3[("D3: Orders")]
        D4[("D4: Payments")]
        D5[("D5: Location Histories")]
        D6[("D6: OTP Verifications")]
        D7[("D7: Audit Logs")]
    end

    Customer["👤 Customer"]
    Admin["🏪 Store Admin"]
    InvMgr["📦 Inventory Manager"]
    DelRider["🛵 Delivery Partner"]
    Support["🎧 Support Manager"]

    P1["1.0 Authentication & RBAC Engine"]
    P2["2.0 Product & Catalog Service"]
    P3["3.0 Cart, Bespoke Watch & Order Service"]
    P4["4.0 Payment Gateway & Reversal Engine"]
    P5["5.0 Inventory & Warehouse Management"]
    P6["6.0 Logistics Dispatch & Real-Time GPS Tracking"]
    P7["7.0 Customer Support, CRM & Escalation Engine"]

    Customer -->|Sign Up / Login Credentials| P1
    P1 <-->|Read / Write Credentials & Roles| D1
    P1 <-->|Generate / Validate OTP Hash| D6

    Admin -->|Add / Update Watches| P2
    P2 <-->|Read / Write Catalog & Stock| D2

    Customer -->|Browse & Add to Cart / Custom Watch| P3
    P3 -->|Query Catalog Specs| D2
    P3 <-->|Create & Query Orders| D3
    P3 -->|Reserve Stock| P5

    P3 -->|Initiate Checkout| P4
    P4 <-->|Record Payments & Signatures| D4
    P4 -->|Update Payment Status| D3

    P5 <-->|Stock Adjustments & Low Stock Triggers| D2
    P5 -->|Log Changes| D7

    P6 <-->|Read Pending Shipments & Assign Riders| D3
    DelRider -->|Stream GPS Coordinates| P6
    P6 -->|Write Location Records| D5
    P6 -->|Broadcast Live Coordinates| Customer

    Customer -->|Submit Inquiries & Return Requests| P7
    Support -->|Resolve Tickets & Authorize Refunds| P7
    P7 -->|Lookup Order History| D3
    P7 -->|Trigger Razorpay Reversal| P4
```

---

## 3. DFD Level 2 — Detailed Subsystem Data Flows

### 3.1 DFD 2.1: Customer Registration & Resend Email OTP Verification

```mermaid
flowchart LR
    Customer["👤 Customer"]
    P11["1.1 Validate Input & Check Duplicate Email"]
    P12["1.2 Generate Cryptographic 6-Digit Code"]
    P13["1.3 HMAC-SHA256 Hash & Persist"]
    P14["1.4 Dispatch Luxury Email via Resend"]
    P15["1.5 Verify OTP Code & Attempts"]
    P16["1.6 Activate User & Issue JWT"]

    D1[("D1: Users")]
    D6[("D6: OTP Verifications")]
    Resend["📧 Resend API"]

    Customer -->|Name, Email, Password| P11
    P11 -->|Check Existing Email| D1
    P11 -->|Trigger Code| P12
    P12 -->|Plain OTP| P13
    P13 -->|Save Hash, 5m TTL, 60s Cooldown| D6
    P12 -->|Plain OTP| P14
    P14 -->|Send HTML Email| Resend
    Resend -->|Delivers Code| Customer

    Customer -->|Enters 6 Digits| P15
    P15 <-->|Compare Hashes & Check Attempts| D6
    P15 -->|On Success: Invalidate Code| D6
    P15 -->|Create User Record| P16
    P16 -->|Save Active User| D1
    P16 -->|Return JWT Tokens| Customer
```

### 3.2 DFD 2.2: Timepiece Purchase, Razorpay Checkout & Stock Deduction

```mermaid
flowchart LR
    Customer["👤 Customer"]
    P21["2.1 Checkout Submission"]
    P22["2.2 Razorpay Order Creation"]
    P23["2.3 Client Payment Capture"]
    P24["2.4 HMAC Signature Verification"]
    P25["2.5 Deduct Warehouse Stock"]
    P26["2.6 Create Confirmed Order"]

    D2[("D2: Products")]
    D3[("D3: Orders")]
    D4[("D4: Payments")]
    Razorpay["💳 Razorpay Gateway"]

    Customer -->|Cart Items & Shipping Address| P21
    P21 -->|Calculate Total Amount| P22
    P22 <-->|Create Order rzp_order_id| Razorpay
    P22 -->|Open Checkout Modal| Customer
    Customer -->|Pay via UPI / Card / NetBanking| Razorpay
    Razorpay -->|Payment ID & Signature| P23
    P23 -->|Verify crypto.createHmac| P24
    P24 -->|Record Payment Capture| D4
    P24 -->|Decrement SKU Inventory| P25
    P25 <-->|Update Stock Balance| D2
    P24 -->|Save Confirmed Order| P26
    P26 -->|Write Order Document| D3
    P26 -->|Return Invoice & Tracking ID| Customer
```

### 3.3 DFD 2.3: Delivery Assignment & Real-Time GPS Tracking

```mermaid
flowchart LR
    DelMgr["🚚 Delivery Manager"]
    DelRider["🛵 Delivery Partner"]
    Customer["👤 Customer"]

    P31["3.1 Assign Shipment to Rider"]
    P32["3.2 Ingest Geolocation Stream"]
    P33["3.3 Store Location Telemetry"]
    P34["3.4 Socket.IO Broadcast to Room"]
    P35["3.5 Delivery OTP Verification"]

    D3[("D3: Orders")]
    D5[("D5: Location Histories")]
    Maps["🗺️ Google Maps API"]

    DelMgr -->|Select Order & Rider| P31
    P31 -->|Update order.delivery.assignedTo| D3
    P31 -->|Notify Rider| DelRider

    DelRider -->|watchPosition coordinates| P32
    P32 -->|lat, lng, speed, heading| P33
    P33 -->|Write Time-Series Coordinate| D5
    P32 -->|Emit rider_location_update| P34
    P34 -->|Stream to track_orderId| Customer
    Customer <-->|Render Live Marker & Route| Maps

    DelRider -->|Customer Enters Delivery OTP| P35
    P35 -->|Validate OTP & Mark Delivered| D3
```
