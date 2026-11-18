# WatchHub RESTful API Documentation & Reference Specification

Comprehensive specification of all endpoints exposed by the WatchHub backend service (`Node.js/Express`). All endpoints are prefixed with `/api` and adhere to JSON-over-HTTP RESTful standards with standard status codes, JWT Bearer authentication, and Role-Based Access Control (RBAC).

---

## 1. Authentication & Security Architecture

### Authentication Header
Protected routes require an `Authorization` header containing a valid JSON Web Token (JWT):
```http
Authorization: Bearer <jwt_access_token>
```

### Rate Limiting & Protections
- **Global API Rate Limit**: Standard API routes are throttled to 100 requests per 15-minute window per IP.
- **Auth Endpoint Rate Limit**: `/api/auth/*` endpoints (login, OTP generation, password reset) enforce strict throttling of 5 to 10 requests per 15-minute window.
- **CORS Configuration**: Restricted to verified origins (Production domains on Vercel and `http://localhost:5173` / `http://localhost:3000`).
- **Security Headers**: Managed by `helmet`, including Content Security Policy (CSP), HSTS, and frame protection.

---

## 2. Global & System Endpoints

### 2.1 Health Check
- **Endpoint**: `GET /api/health`
- **Auth Required**: None (Public)
- **Description**: Verifies service uptime, database connectivity, and timestamp.
- **Response `200 OK`**:
```json
{
  "status": "ok",
  "service": "watchhub-backend",
  "timestamp": "2026-11-18T14:40:00.000Z",
  "uptime": 86420.5,
  "database": "connected"
}
```

### 2.2 API Information
- **Endpoint**: `GET /api`
- **Auth Required**: None (Public)
- **Response `200 OK`**:
```json
{
  "name": "WatchHub Luxury Watches API",
  "version": "2.4.0",
  "status": "active",
  "docs": "/docs/API_Documentation.md"
}
```

### 2.3 Newsletter Subscription
- **Endpoint**: `POST /api/newsletter`
- **Auth Required**: None (Public)
- **Request Body**:
```json
{
  "email": "customer@example.com"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Thank you for subscribing to WatchHub Haute Horlogerie chronicles."
}
```

---

## 3. Authentication & User Identity (`/api/auth`)

### 3.1 Email OTP Registration: Step 1 - Send OTP
- **Endpoint**: `POST /api/auth/send-register-otp`
- **Auth Required**: None (Public)
- **Description**: Verifies email uniqueness, hashes an OTP, sends a 6-digit code via Resend Email API, and stores verification record with a 5-minute TTL.
- **Request Body**:
```json
{
  "email": "alex.morgan@example.com",
  "name": "Alex Morgan",
  "mobile": "+19876543210"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Verification OTP sent to alex.morgan@example.com. Code valid for 5 minutes."
}
```
- **Response `400 Bad Request`**:
```json
{
  "success": false,
  "error": "A user with this email address is already registered."
}
```

### 3.2 Email OTP Registration: Step 2 - Verify & Register
- **Endpoint**: `POST /api/auth/verify-register-otp`
- **Auth Required**: None (Public)
- **Description**: Validates the 6-digit code, verifies attempt count (< 5), creates user with `customer` role and status `active`, and returns JWT auth tokens.
- **Request Body**:
```json
{
  "email": "alex.morgan@example.com",
  "name": "Alex Morgan",
  "password": "LuxuryPassword@2026",
  "mobile": "+19876543210",
  "otp": "849201"
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "message": "Account created successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsIn...",
  "user": {
    "id": "672901abcf89123456789012",
    "name": "Alex Morgan",
    "email": "alex.morgan@example.com",
    "role": "customer",
    "isVerified": true
  }
}
```

### 3.3 Email & Password Login
- **Endpoint**: `POST /api/auth/login`
- **Auth Required**: None (Public)
- **Request Body**:
```json
{
  "email": "alex.morgan@example.com",
  "password": "LuxuryPassword@2026"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsIn...",
  "user": {
    "id": "672901abcf89123456789012",
    "name": "Alex Morgan",
    "email": "alex.morgan@example.com",
    "role": "customer"
  }
}
```

### 3.4 Passwordless Email OTP Login: Step 1 - Send OTP
- **Endpoint**: `POST /api/auth/send-login-otp`
- **Auth Required**: None (Public)
- **Request Body**:
```json
{
  "email": "alex.morgan@example.com"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "If an account exists with this email, a login OTP has been dispatched."
}
```

### 3.5 Passwordless Email OTP Login: Step 2 - Verify OTP
- **Endpoint**: `POST /api/auth/verify-login-otp`
- **Auth Required**: None (Public)
- **Request Body**:
```json
{
  "email": "alex.morgan@example.com",
  "otp": "592814"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "user": {
    "id": "672901abcf89123456789012",
    "name": "Alex Morgan",
    "email": "alex.morgan@example.com",
    "role": "customer"
  }
}
```

### 3.6 Password Reset: Step 1 - Send Reset OTP
- **Endpoint**: `POST /api/auth/forgot-password`
- **Auth Required**: None (Public)
- **Request Body**:
```json
{
  "email": "alex.morgan@example.com"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Password reset verification code dispatched to your email."
}
```

### 3.7 Password Reset: Step 2 - Verify Code & Update Password
- **Endpoint**: `POST /api/auth/reset-password`
- **Auth Required**: None (Public)
- **Request Body**:
```json
{
  "email": "alex.morgan@example.com",
  "otp": "410293",
  "newPassword": "NewStrongLuxuryPassword#2026"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Password has been successfully updated. Please sign in with your new credentials."
}
```

### 3.8 Token Refresh
- **Endpoint**: `POST /api/auth/refresh-token`
- **Auth Required**: None (Requires valid refresh token in body or cookies)
- **Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsIn..."
}
```
- **Response `200 OK`**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsIn..."
}
```

---

## 4. Product Catalog & Haute Horlogerie Inventory (`/api/products`)

### 4.1 Search & Filter Timepieces
- **Endpoint**: `GET /api/products`
- **Auth Required**: None (Public)
- **Query Parameters**:
  - `brand` (string, optional): e.g., `Rolex`, `Omega`, `Patek Philippe`, `TAG Heuer`, `Breitling`, `Tissot`, `Seiko`, `Apple Watch`
  - `category` (string, optional): e.g., `Luxury Sports`, `Dress Timepieces`, `Chronographs`, `Smart Horology`, `Diving & Aviation`
  - `gender` (string, optional): `Men`, `Women`, `Unisex`
  - `minPrice` / `maxPrice` (number, optional)
  - `movement` (string, optional): `Automatic`, `Manual-Wind`, `Quartz`, `Spring Drive`
  - `inStock` (boolean, optional)
  - `search` (string, optional): Full-text search across title, brand, reference number, and description.
  - `page` / `limit` (number, default: page=1, limit=12)
  - `sort` (string, optional): `price_asc`, `price_desc`, `rating_desc`, `newest`
- **Response `200 OK`**:
```json
{
  "success": true,
  "total": 48,
  "page": 1,
  "totalPages": 4,
  "products": [
    {
      "_id": "672901a1cf89123456789001",
      "name": "Submariner Date 41mm Oystersteel",
      "brand": "Rolex",
      "model": "Submariner Date",
      "sku": "ROL-SUB-126610LN",
      "price": 14500,
      "stock": 4,
      "images": ["/assets/images/watches/rolex-submariner.png"],
      "movement": "Automatic",
      "rating": 4.95,
      "reviewCount": 38,
      "specifications": {
        "caseDiameter": "41 mm",
        "caseMaterial": "Oystersteel (904L)",
        "waterResistance": "300 meters / 1,000 feet",
        "powerReserve": "70 hours"
      }
    }
  ]
}
```

### 4.2 Product Detail by Slug or ID
- **Endpoint**: `GET /api/products/:identifier`
- **Auth Required**: None (Public)
- **Response `200 OK`**: Full product schema including variants, technical specifications, warranty terms, and high-resolution asset URLs.

### 4.3 Create Product
- **Endpoint**: `POST /api/products`
- **Auth Required**: Bearer JWT (Role: `admin` or `inventory_manager`)
- **Request Body**: Complete product payload with brand, title, sku, price, stock, category, and specifications.
- **Response `201 Created`**

### 4.4 Update Product Details & Pricing
- **Endpoint**: `PUT /api/products/:id`
- **Auth Required**: Bearer JWT (Role: `admin` or `inventory_manager`)
- **Response `200 OK`**

### 4.5 Delete / Archive Product
- **Endpoint**: `DELETE /api/products/:id`
- **Auth Required**: Bearer JWT (Role: `admin`)
- **Response `200 OK`**

---

## 5. Payments & Financial Transactions (`/api/payments`)

### 5.1 Initialize Razorpay Order
- **Endpoint**: `POST /api/payments/create-razorpay-order`
- **Auth Required**: Bearer JWT (`customer`, `admin`)
- **Description**: Computes secure server-side total, verifies live stock availability, generates a unique order reference, and communicates with Razorpay API.
- **Request Body**:
```json
{
  "items": [
    {
      "productId": "672901a1cf89123456789001",
      "quantity": 1,
      "customization": null
    }
  ],
  "shippingAddress": {
    "street": "742 Evergreen Terrace",
    "city": "Springfield",
    "state": "OR",
    "zipCode": "97477",
    "country": "USA"
  }
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "razorpayOrderId": "order_OzB9K1283MqaZ0",
  "amount": 1450000,
  "currency": "INR",
  "keyId": "rzp_test_YourKeyIdHere"
}
```

### 5.2 Verify Razorpay Payment Signature
- **Endpoint**: `POST /api/payments/verify-razorpay-payment`
- **Auth Required**: Bearer JWT (`customer`)
- **Description**: Validates `razorpay_signature` using HMAC-SHA256 against Razorpay Key Secret. On success, transitions order status to `confirmed`, creates a `Payment` record, deducts stock, and sends confirmation emails.
- **Request Body**:
```json
{
  "razorpay_order_id": "order_OzB9K1283MqaZ0",
  "razorpay_payment_id": "pay_OzBA4198274092",
  "razorpay_signature": "5b4c1068e83f3e827ab1..."
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "orderId": "672901a9cf89123456789045",
  "orderNumber": "WH-2026-9045",
  "paymentStatus": "completed",
  "receiptUrl": "/receipts/WH-2026-9045.pdf"
}
```

### 5.3 Process Refund
- **Endpoint**: `POST /api/payments/refund`
- **Auth Required**: Bearer JWT (Role: `admin` or `support_manager`)
- **Request Body**:
```json
{
  "orderId": "672901a9cf89123456789045",
  "amount": 14500,
  "reason": "Customer cancellation within 24h grace window"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "refundId": "rfnd_OzC82194829104",
  "status": "processed",
  "amount": 14500
}
```

---

## 6. Delivery Management & Partner Operations (`/api/delivery`)

### 6.1 List Delivery Orders
- **Endpoint**: `GET /api/delivery/orders`
- **Auth Required**: Bearer JWT (`admin`, `delivery_manager`)
- **Query Parameters**: `status`, `zone`, `courierPartner`, `page`, `limit`
- **Response `200 OK`**: Paginated list of active shipments with courier assignments and AWB codes.

### 6.2 Assign Courier or In-House Rider
- **Endpoint**: `POST /api/delivery/assign`
- **Auth Required**: Bearer JWT (`admin`, `delivery_manager`)
- **Request Body**:
```json
{
  "orderId": "672901a9cf89123456789045",
  "courierPartner": "BlueDart Apex Luxury",
  "assignedRiderId": "672901b0cf89123456789088",
  "trackingNumber": "BD-LUX-99482103",
  "estimatedDeliveryDate": "2026-11-20T18:00:00.000Z"
}
```
- **Response `200 OK`**: Updated shipment status (`shipped`).

### 6.3 Rider Delivery Complete via OTP & Camera Proof
- **Endpoint**: `POST /api/delivery/complete-with-otp`
- **Auth Required**: Bearer JWT (`delivery_partner`, `admin`)
- **Request Body**:
```json
{
  "orderId": "672901a9cf89123456789045",
  "deliveryOtp": "829104",
  "photoProofUrl": "https://storage.watchhub.com/delivery_proofs/WH-9045.jpg",
  "recipientSignature": "data:image/png;base64,iVBORw0KGgo...",
  "notes": "Delivered in person to recipient at residence."
}
```
- **Response `200 OK`**: Order updated to `delivered`.

---

## 7. Real-Time Telemetry & Tracking (`/api/tracking`)

### 7.1 Customer Order Tracking Summary
- **Endpoint**: `GET /api/tracking/order/:orderId`
- **Auth Required**: None (Public with Order ID + Mobile verification, or Bearer JWT)
- **Response `200 OK`**:
```json
{
  "orderId": "WH-2026-9045",
  "status": "out_for_delivery",
  "currentLocation": {
    "latitude": 40.712776,
    "longitude": -74.005974,
    "address": "Lexington Ave, Manhattan, NY"
  },
  "destination": {
    "latitude": 40.758896,
    "longitude": -73.985130,
    "address": "Times Square, Manhattan, NY"
  },
  "estimatedArrivalMinutes": 18,
  "rider": {
    "name": "Marcus Vance",
    "mobile": "+1234567890",
    "vehicle": "Electric Van #12"
  },
  "checkpointHistory": [
    { "status": "order_placed", "timestamp": "2026-11-16T10:00:00Z" },
    { "status": "quality_inspection", "timestamp": "2026-11-16T14:30:00Z" },
    { "status": "shipped", "timestamp": "2026-11-17T09:15:00Z" },
    { "status": "out_for_delivery", "timestamp": "2026-11-18T13:45:00Z" }
  ]
}
```

### 7.2 Rider Location Telemetry Ingestion
- **Endpoint**: `POST /api/tracking/rider-telemetry`
- **Auth Required**: Bearer JWT (`delivery_partner`)
- **Request Body**:
```json
{
  "orderId": "672901a9cf89123456789045",
  "latitude": 40.713500,
  "longitude": -74.004800,
  "speed": 34.2,
  "heading": 42.1
}
```
- **Response `200 OK`**: Location record appended to `LocationHistory` and broadcasted over Socket.IO room `track_672901a9cf89123456789045`.

---

## 8. Inventory & Warehouse Management (`/api/inventory`)

### 8.1 Stock Overview & Reorder Alerts
- **Endpoint**: `GET /api/inventory/overview`
- **Auth Required**: Bearer JWT (`admin`, `inventory_manager`)
- **Response `200 OK`**:
```json
{
  "totalSKUs": 142,
  "totalStockValue": 3840000,
  "lowStockAlertsCount": 3,
  "lowStockItems": [
    {
      "sku": "PAT-NAU-5711",
      "name": "Patek Philippe Nautilus 5711/1A",
      "currentStock": 1,
      "reorderLevel": 2
    }
  ]
}
```

### 8.2 Log Stock Adjustment
- **Endpoint**: `POST /api/inventory/adjustments`
- **Auth Required**: Bearer JWT (`admin`, `inventory_manager`)
- **Request Body**:
```json
{
  "productId": "672901a1cf89123456789001",
  "warehouseId": "WH-CENTRAL-01",
  "quantityChange": 2,
  "reason": "Restock shipment arrival",
  "referenceDoc": "PO-2026-881"
}
```
- **Response `200 OK`**

---

## 9. Customer Support & Escalations (`/api/support`)

### 9.1 Support Ticket Queue
- **Endpoint**: `GET /api/support/tickets`
- **Auth Required**: Bearer JWT (`admin`, `support_manager`)
- **Query Parameters**: `status` (open, pending, resolved, closed), `priority` (low, medium, high, urgent), `assignedTo`
- **Response `200 OK`**: Array of ticket documents with customer details and conversation threads.

### 9.2 Create Ticket / Chat Inbound
- **Endpoint**: `POST /api/support/tickets`
- **Auth Required**: Bearer JWT (`customer`, `admin`, `support_manager`)
- **Request Body**:
```json
{
  "subject": "Bezel Engraving Request for Custom Watch",
  "orderId": "672901a9cf89123456789045",
  "priority": "medium",
  "message": "Can I update the roman numeral font on the back case before assembly starts?"
}
```
- **Response `201 Created`**

### 9.3 Reply to Ticket
- **Endpoint**: `POST /api/support/tickets/:id/reply`
- **Auth Required**: Bearer JWT (`customer`, `support_manager`, `admin`)
- **Request Body**:
```json
{
  "message": "Yes, our master engraver has updated your order notes.",
  "attachments": []
}
```
- **Response `200 OK`**

---

## 10. DIY Custom Watch Studio (`/api/custom-watch`)

### 10.1 Get Custom Watch Components
- **Endpoint**: `GET /api/custom-watch/components`
- **Auth Required**: None (Public)
- **Response `200 OK`**: Returns valid cases, dials, bezels, hands, movements, and strap/bead configurations with compatibility constraints and incremental pricing.

### 10.2 Save Custom Watch Design
- **Endpoint**: `POST /api/custom-watch/designs`
- **Auth Required**: Bearer JWT (`customer`)
- **Request Body**:
```json
{
  "designName": "Royal Chrono Azure",
  "components": {
    "case": "case_titanium_42mm",
    "dial": "dial_sunburst_blue",
    "bezel": "bezel_ceramic_black",
    "hands": "hands_breguet_rose_gold",
    "movement": "mov_automatic_valjoux_7750",
    "strap": "strap_alligator_navy"
  },
  "customEngraving": "HOROLOGY 2026"
}
```
- **Response `201 Created`**

---

## 11. Store Admin Management & Audit Logs (`/api/dashboard` & `/api/users`)

### 11.1 Executive Analytics Overview
- **Endpoint**: `GET /api/dashboard/admin/metrics`
- **Auth Required**: Bearer JWT (Role: `admin`)
- **Response `200 OK`**: High-level financial KPIs (Gross Revenue, Net Profit, Average Order Value, Return Rates, Active Deliveries).

### 11.2 User Management: List Users
- **Endpoint**: `GET /api/users`
- **Auth Required**: Bearer JWT (Role: `admin`)
- **Query Parameters**: `role`, `status`, `search`, `page`, `limit`
- **Response `200 OK`**

### 11.3 Audit Log Stream
- **Endpoint**: `GET /api/dashboard/audit-logs`
- **Auth Required**: Bearer JWT (Role: `admin`)
- **Response `200 OK`**: Paginated stream of sensitive administrative actions (price adjustments, inventory overrides, role changes, refund approvals).

---

## 12. Standard Error Responses

All API errors return a uniform JSON schema:

```json
{
  "success": false,
  "error": "Human-readable error description.",
  "code": "SPECIFIC_ERROR_CODE",
  "details": null
}
```

### Common HTTP Status Codes
| HTTP Status | Meaning | Typical Trigger |
|:---|:---|:---|
| `200 OK` | Success | Successful read or standard update. |
| `201 Created` | Created | Resource successfully created (User, Order, Ticket). |
| `400 Bad Request` | Validation Error | Missing required fields, invalid OTP, insufficient stock. |
| `401 Unauthorized` | Auth Required | Missing or malformed Bearer token. |
| `403 Forbidden` | RBAC Access Denied | Authenticated user lacks the required role. |
| `404 Not Found` | Resource Missing | Product ID, Order ID, or User ID not found. |
| `429 Too Many Requests`| Rate Limit Exceeded | Auth or OTP burst exceeded. |
| `500 Server Error` | Internal Failure | Unhandled database error or 3rd party API failure. |
