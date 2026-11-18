# WatchHub — Unified Modeling Language (UML) Diagrams

This document contains the complete formal UML behavioral and structural models for the **WatchHub Luxury Watch E-Commerce & Management Platform**, modeled with Mermaid syntax.

---

## 1. Overall System Use Case Diagram

```mermaid
flowchart LR
    subgraph Actors["System Actors"]
        Customer["👤 Customer"]
        Admin["🏪 Store Admin"]
        InvMgr["📦 Inventory Manager"]
        DelMgr["🚚 Delivery Manager"]
        DelRider["🛵 Delivery Partner"]
        Support["🎧 Customer Support"]
    end

    subgraph CustomerUseCases["Customer Use Cases"]
        UC1["Browse & Filter Watches"]
        UC2["Design Bespoke Beaded Watch"]
        UC3["Manage Wishlist & Cart"]
        UC4["Checkout & Pay via Razorpay"]
        UC5["Track Live Shipment & GPS"]
        UC6["Request Return & Refund"]
        UC7["Live Concierge Chat"]
    end

    subgraph AdminUseCases["Store Admin Use Cases"]
        UC8["Manage Timepiece Products & SKUs"]
        UC9["POS Terminal Sales"]
        UC10["Manage Discounts & Offers"]
        UC11["View Store Analytics & Revenue"]
    end

    subgraph InventoryUseCases["Inventory Manager Use Cases"]
        UC12["Monitor Warehouse Stock Levels"]
        UC13["Stock Adjustments & Movements"]
        UC14["Low-Stock Reorder Triggers"]
        UC15["Purchase Requests"]
    end

    subgraph DeliveryUseCases["Logistics Use Cases"]
        UC16["Assign Deliveries to Riders"]
        UC17["Route Planning & Geocoding"]
        UC18["Manage Returns & Reverse Pickups"]
        UC19["Stream Live Rider GPS Coordinates"]
        UC20["Verify Customer Delivery OTP"]
    end

    subgraph SupportUseCases["Support Use Cases"]
        UC21["Triage Tickets & SLA Overrules"]
        UC22["Direct Concierge Messaging"]
        UC23["Authorize Razorpay Refunds"]
        UC24["Manage Knowledge Base Articles"]
    end

    Customer --> UC1
    Customer --> UC2
    Customer --> UC3
    Customer --> UC4
    Customer --> UC5
    Customer --> UC6
    Customer --> UC7

    Admin --> UC8
    Admin --> UC9
    Admin --> UC10
    Admin --> UC11

    InvMgr --> UC12
    InvMgr --> UC13
    InvMgr --> UC14
    InvMgr --> UC15

    DelMgr --> UC16
    DelMgr --> UC17
    DelMgr --> UC18

    DelRider --> UC19
    DelRider --> UC20

    Support --> UC21
    Support --> UC22
    Support --> UC23
    Support --> UC24
```

---

## 2. Sequence Diagram: Resend Email OTP Verification

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Customer (Browser)
    participant Client as React Client (SignupPage)
    participant Server as Express Server (/api/auth)
    participant OTPService as Cryptographic OTP Service
    participant DB as MongoDB (OtpVerification)
    participant Resend as Resend Cloud API

    Customer->>Client: Enter Name, Email, Password & Submit
    Client->>Server: POST /api/auth/send-email-otp { email, purpose: "registration" }
    Server->>OTPService: requestAndSendOtp(email, "email")
    OTPService->>DB: Check 60-Second Cooldown (resendCooldownUntil)
    DB-->>OTPService: Cooldown verified
    OTPService->>OTPService: Generate 6-Digit Random Code (crypto.randomInt)
    OTPService->>OTPService: Compute HMAC-SHA256 Hash
    OTPService->>DB: Invalidate previous OTP & Save { otpHash, expiresAt: 5m }
    OTPService->>Resend: POST /emails (Luxury WatchHub HTML Template)
    Resend-->>Customer: Deliver Email with 6-Digit Code
    Resend-->>OTPService: { data: { id: "01a1ede..." }, error: null }
    OTPService-->>Server: Dispatch Success (Plain OTP withheld)
    Server-->>Client: 200 OK { status: "success", cooldownSeconds: 60 }

    Customer->>Client: Enters 6-Digit Code into OtpInput
    Client->>Server: POST /api/auth/verify-email-otp { email, otp, password, name }
    Server->>OTPService: verifyOtp(email, otp)
    OTPService->>DB: Find OtpVerification Record
    DB-->>OTPService: Return otpHash & attempts
    OTPService->>OTPService: Compare inputHash with stored otpHash
    OTPService->>DB: Invalidate OTP (Delete Record - Single Use)
    Server->>DB: Create User { isEmailVerified: true }
    Server-->>Client: 200 OK + JWT Tokens + User Profile
    Client-->>Customer: Celebration Screen & Auto-Redirect
```

---

## 3. Sequence Diagram: Razorpay Payment & Verification

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Customer
    participant Client as React Client (CheckoutPage)
    participant Server as Express Server (/api/payments)
    participant DB as MongoDB
    participant Razorpay as Razorpay Payment Gateway

    Customer->>Client: Click "Place Order & Pay with Razorpay"
    Client->>Server: POST /api/payments/create-order { amount, orderId }
    Server->>Razorpay: razorpay.orders.create({ amount: amountInPaise, currency: "INR" })
    Razorpay-->>Server: Return { id: "order_K8d...", amount, status: "created" }
    Server->>DB: Save Payment { razorpayOrderId, status: "Created" }
    Server-->>Client: Return { razorpayOrderId, keyId, amount }

    Client->>Razorpay: Open Razorpay Checkout Modal (UPI / Card / NetBanking)
    Customer->>Razorpay: Complete Biometric / UPI PIN Authentication
    Razorpay-->>Client: Return { razorpay_payment_id, razorpay_order_id, razorpay_signature }

    Client->>Server: POST /api/payments/verify-payment { orderId, paymentId, signature }
    Server->>Server: Compute HMAC-SHA256(orderId + "|" + paymentId, secret)
    Server->>Server: Compare generatedSignature === razorpay_signature
    alt Signature Valid
        Server->>DB: Update Payment { status: "Captured", razorpayPaymentId }
        Server->>DB: Update Order { orderStatus: "Confirmed", "payment.status": "Captured" }
        Server->>DB: Decrement Product Warehouse Stock
        Server-->>Client: 200 OK { verified: true, orderId }
        Client-->>Customer: Display Order Confirmation & Tracking AWB
    else Signature Invalid
        Server->>DB: Update Payment { status: "Failed" }
        Server-->>Client: 400 Bad Request { verified: false, message: "Tampered Signature" }
    end
```

---

## 4. Sequence Diagram: Live GPS Delivery Tracking & Socket.IO Telemetry

```mermaid
sequenceDiagram
    autonumber
    actor Rider as Delivery Partner (Mobile)
    actor Customer as Customer (Tracking Page)
    participant ClientRider as Rider React App
    participant ClientCustomer as Customer React App
    participant Socket as Socket.IO Server
    participant DB as MongoDB (LocationHistory)

    Customer->>ClientCustomer: Open /track-order/:orderId
    ClientCustomer->>Socket: emit("join_tracking", orderId)
    Socket-->>ClientCustomer: Joined room "track_orderId"

    Rider->>ClientRider: Toggle "On Duty" & Start Delivery
    ClientRider->>ClientRider: navigator.geolocation.watchPosition()
    loop Every 5-10 Seconds
        ClientRider->>Socket: emit("rider_location", { orderId, riderId, lat, lng, speed, heading })
        Socket->>DB: Save LocationHistory { orderId, riderId, lat, lng, timestamp }
        Socket->>ClientCustomer: Broadcast to room "track_orderId": emit("rider_location_update", coordinates)
        ClientCustomer->>ClientCustomer: Smoothly reposition Google Maps Marker & Waypoint
    end

    Rider->>Customer: Arrive at Delivery Address
    Customer->>Rider: Provide Secure 4-Digit Delivery OTP
    Rider->>ClientRider: Enter OTP into App & Submit
    ClientRider->>Socket: POST /api/delivery/verify-otp { orderId, otp }
    Socket->>DB: Mark Order status: "Delivered"
    Socket->>ClientCustomer: emit("order_status_update", "Delivered")
    ClientCustomer-->>Customer: Update Timeline to "Delivered Successfully"
```

---

## 5. Activity Diagram: Customer Support Ticket Resolution & Razorpay Refund

```mermaid
flowchart TD
    Start([Customer Submits Complaint / Return]) --> A1[Create Support Ticket]
    A1 --> A2{SLA Priority Check}

    A2 -->|Critical / L3| A3[Alert Concierge Lead & Start 2h Countdown]
    A2 -->|Normal / L1-L2| A4[Round-Robin Auto-Assign to Support Executive]

    A3 --> A5[Executive Reviews Inspection & Watch Lugs Seal]
    A4 --> A5

    A5 --> A6{Is Return / Refund Valid?}

    A6 -->|Seal Broken / Wear Observed| A7[Reject Request with Photographic Evidence]
    A7 --> A8[Notify Customer & Close Ticket]

    A6 -->|Authentic & Intact Within 7 Days| A9[Approve Refund]
    A9 --> A10[Trigger Razorpay API Refund Reversal]
    A10 --> A11[Razorpay Direct Bank / UPI Reversal]
    A11 --> A12[Update Payment Document: status = 'Refunded']
    A12 --> A13[Generate Email Confirmation via Resend]
    A13 --> A14[Customer Receives Refund & CSAT Survey]
    A14 --> End([Ticket Closed as Resolved])
```
