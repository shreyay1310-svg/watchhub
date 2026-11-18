# WatchHub Database Dictionary & Data Schema Reference

This document provides a comprehensive database data dictionary for the **WatchHub Luxury Horology E-Commerce & Operations Platform**. The backend utilizes **MongoDB** via the **Mongoose ODM**.

---

## 1. Entity Summary

| Model Name | Collection Name | Primary Identifier | Purpose | Timestamps |
|:---|:---|:---|:---|:---:|
| **User** | `users` | `_id` (ObjectId) | User identity, authentication, 6-role RBAC, and address book | Yes |
| **Product** | `products` | `_id` (ObjectId) | Haute Horlogerie catalog, technical specifications, and variants | Yes |
| **Order** | `orders` | `_id` (ObjectId) | E-commerce orders, line items, delivery status, and tracking IDs | Yes |
| **Payment** | `payments` | `_id` (ObjectId) | Razorpay transaction records, signatures, and refund history | Yes |
| **LocationHistory** | `locationhistories` | `_id` (ObjectId) | Real-time GPS coordinate telemetry logs from delivery partners | Yes |
| **OtpVerification** | `otpverifications` | `_id` (ObjectId) | Ephemeral OTP storage with Resend integration and auto-cleanup TTL | Yes |
| **AuditLog** | `auditlogs` | `_id` (ObjectId) | Immutable compliance log for administrative modifications | Yes |

---

## 2. Collection: `users` (Model: `User`)

Stores all user identities across the platform, including customers and back-office staff.

### Fields Specification

| Field Name | Type | Constraints | Default | Description |
|:---|:---|:---|:---|:---|
| `_id` | ObjectId | Auto-generated, Primary Key | `ObjectId()` | Unique MongoDB identifier |
| `name` | String | `required: true`, `trim: true` | - | Full name of the user |
| `email` | String | `required: true`, `unique: true`, `lowercase: true`, `trim: true` | - | Primary login and communication email address |
| `phone` | String | `trim: true` | `null` | Primary contact mobile number |
| `password` | String | `required: true`, `minlength: 6` | - | Bcrypt hashed password (10 salt rounds) |
| `role` | String | `enum: ['Customer', 'Super Admin', 'Store Admin', 'Inventory Manager', 'Delivery Manager', 'Customer Support Executive']` | `'Customer'` | Role-Based Access Control role |
| `permissions` | Array of Strings | Optional | `[]` | Granular permission tokens for enterprise access overrides |
| `avatar` | String | Optional | `'👤'` | Profile image URL or luxury avatar icon |
| `isActive` | Boolean | `required: true` | `true` | Account active status switch |
| `isEmailVerified`| Boolean | `required: true` | `false` | Verified via 6-digit Resend Email OTP |
| `isPhoneVerified`| Boolean | `required: true` | `false` | Verified via SMS OTP gateway |
| `addresses` | Array of Subdocuments | Embedded Array | `[]` | Multi-address shipping directory (schema below) |
| `createdAt` | Date | Auto-generated | Current Timestamp | Document creation timestamp |
| `updatedAt` | Date | Auto-generated | Current Timestamp | Last document update timestamp |

### Embedded Schema: `addresses`

| Sub-field Name | Type | Constraints | Default | Description |
|:---|:---|:---|:---|:---|
| `addressId` | String | Unique within user | `addr_<timestamp>_<random>` | Custom client reference ID |
| `fullName` | String | Optional | `null` | Consignee recipient name |
| `street` | String | Optional | `null` | Street address / Suite details |
| `apartment` | String | Optional | `null` | Flat, apartment, building name |
| `landmark` | String | Optional | `null` | Nearby prominent navigation landmark |
| `city` | String | Optional | `null` | Destination city |
| `state` | String | Optional | `null` | State or administrative province |
| `pincode` | String | Optional | `null` | Postal / ZIP routing code |
| `country` | String | Optional | `'India'` | Destination sovereign state |
| `phone` | String | Optional | `null` | Delivery point-of-contact phone |
| `addressType` | String | `enum: ['Home', 'Office', 'Other']`| `'Home'` | Location category |
| `lat` | Number | Optional | `null` | Geocoded latitude coordinate |
| `lng` | Number | Optional | `null` | Geocoded longitude coordinate |
| `isDefault` | Boolean | Optional | `false` | Flag indicating default shipping destination |

### Indexes
- `{ email: 1 }` (Unique Index)

---

## 3. Collection: `products` (Model: `Product`)

Maintains all watch master catalog records, inventory levels, luxury attributes, and technical horological specs.

### Fields Specification

| Field Name | Type | Constraints | Default | Description |
|:---|:---|:---|:---|:---|
| `_id` | ObjectId | Auto-generated, Primary Key | `ObjectId()` | Unique MongoDB identifier |
| `name` | String | `required: true`, `trim: true` | - | Watch timepiece title |
| `sku` | String | `required: true`, `unique: true`, `uppercase: true` | - | Stock Keeping Unit (e.g., `ROL-SUB-126610LN`) |
| `brand` | String | `required: true`, `trim: true` | - | Horology brand (e.g., Rolex, Patek Philippe, Omega) |
| `category` | String | `required: true` | - | Primary catalog category |
| `subcategory` | String | Optional | `'Wristwatch'` | Subcategory specification |
| `productType` | String | Optional | `'Analog'` | Movement/display type (Analog, Chrono, Tourbillon) |
| `gender` | String | `enum: ['Men', 'Women', 'Couple', 'Unisex', 'Kids']` | `'Men'` | Target audience |
| `description` | String | `required: true` | - | Horological narrative, provenance, and detail |
| `price` | Number | `required: true`, `min: 0` | - | Active selling price in base currency |
| `originalPrice`| Number | `required: true`, `min: 0` | - | Manufacturer suggested retail price (MSRP) |
| `costPrice` | Number | Optional | `0` | Procurement / Wholesale cost |
| `discount` | Number | Optional | `0` | Discount percentage applied |
| `tax` | Number | Optional | `18` | Applicable GST / VAT rate (%) |
| `profitMargin` | Number | Optional | `0` | Calculated profit margin |
| `stock` | Number | `required: true`, `min: 0` | `0` | Available warehouse inventory units |
| `lowStockThreshold` | Number | Optional | `10` | Automatic reorder warning threshold |
| `warehouseLocation` | String | Optional | `'Warehouse Zone A - Luxury Vault'` | Vault or bin storage identifier |
| `barcode` | String | Optional | `null` | EAN / UPC international barcode |
| `emoji` | String | Optional | `'⌚'` | Visual fallback glyph |
| `image` | String | Optional | `null` | Primary high-res product photo URL |
| `images` | Array of Strings | Optional | `[]` | Secondary gallery photo URLs |
| `specifications`| Object | Embedded Schema | See below | Technical horological parameters |
| `variants` | Array of Subdocs | Embedded Schema | See below | Color, material, and strap variations |
| `seo` | Object | Embedded Schema | See below | Search engine optimization metadata |
| `rating` | Number | `min: 0`, `max: 5` | `4.5` | Verified customer average review rating |
| `reviewsCount` | Number | Optional | `0` | Total number of published reviews |
| `warranty` | String | Optional | `'2 Years Manufacturer Warranty'` | Luxury warranty duration & terms |
| `waterproof` | String | Optional | `'50M Water Resistant'` | Water resistance rating text |
| `isTrending` | Boolean | Optional | `false` | Display in trending carousels |
| `isNewArrival` | Boolean | Optional | `false` | Display in new releases section |
| `isFeatured` | Boolean | Optional | `false` | Display in homepage hero showcase |
| `status` | String | `enum: ['Active', 'Draft', 'Archived', 'Out of Stock']` | `'Active'` | Catalog lifecycle state |

### Embedded Schema: `specifications`
- `dialSize`: String (e.g., `'41 mm'`)
- `dialShape`: String (Default: `'Round'`)
- `dialColor`: String (e.g., `'Sunburst Blue'`)
- `caseMaterial`: String (e.g., `'Oystersteel 904L'`)
- `caseColor`: String (e.g., `'Polished Silver'`)
- `strapMaterial`: String (e.g., `'Alligator Leather'`)
- `strapColor`: String (e.g., `'Midnight Navy'`)
- `movementType`: String (e.g., `'Automatic In-House Calibre 3235'`)
- `displayType`: String (e.g., `'Analog with Date Display'`)
- `waterResistance`: String (e.g., `'300 Meters / 1,000 Feet'`)
- `watchWeight`: String (e.g., `'155 grams'`)
- `countryOfOrigin`: String (e.g., `'Switzerland'`)

### Embedded Schema: `variants`
- `_id`: ObjectId
- `variantSku`: String
- `dialColor`: String
- `strapColor`: String
- `caseMaterial`: String
- `size`: String
- `price`: Number
- `stock`: Number (Default: 0)
- `image`: String

### Indexes
- `{ sku: 1 }` (Unique Index)
- `{ brand: 1, category: 1 }` (Compound Search Index)

---

## 4. Collection: `orders` (Model: `Order`)

Represents all customer purchase orders from checkout through final delivery or return.

### Fields Specification

| Field Name | Type | Constraints | Default | Description |
|:---|:---|:---|:---|:---|
| `_id` | ObjectId | Auto-generated, Primary Key | `ObjectId()` | Unique MongoDB identifier |
| `orderId` | String | `required: true`, `unique: true` | - | Human-friendly order reference (e.g., `WH-2026-9045`) |
| `customer` | ObjectId | `ref: 'User'` | `null` | Reference to customer document |
| `customerName` | String | `required: true` | - | Customer full name at time of order |
| `customerEmail`| String | `required: true` | - | Communication email for notifications |
| `customerPhone`| String | Optional | `null` | Contact number for delivery confirmation |
| `items` | Array of Subdocs | Embedded Array | `[]` | Purchased watch items (schema below) |
| `shippingAddress` | Object | Embedded Schema | See below | Geocoded destination delivery point |
| `payment` | Object | Embedded Schema | See below | Razorpay payment snapshot |
| `orderStatus` | String | `enum: ['Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Return Requested', 'Returned']` | `'Processing'` | Current lifecycle stage of the order |
| `delivery` | Object | Embedded Schema | See below | Assigned rider and courier metadata |
| `subtotal` | Number | Optional | `0` | Order subtotal before discounts |
| `discount` | Number | Optional | `0` | Promo coupon discount deduction |
| `shippingCharges` | Number | Optional | `0` | White-glove insured delivery charge |
| `totalAmount` | Number | `required: true` | - | Net payable invoice amount |
| `createdAt` | Date | Auto-generated | Current Timestamp | Order placement timestamp |
| `updatedAt` | Date | Auto-generated | Current Timestamp | Order status update timestamp |

### Embedded Schema: `items`
- `product`: ObjectId (`ref: 'Product'`)
- `name`: String
- `sku`: String
- `price`: Number
- `quantity`: Number (Default: 1)
- `emoji`: String

### Embedded Schema: `payment`
- `method`: String (`enum: ['Online', 'UPI', 'Card', 'COD', 'Net Banking', 'Wallet']`, Default: `'Online'`)
- `status`: String (`enum: ['Created', 'Pending', 'Authorized', 'Captured', 'Completed', 'Failed', 'Refunded', 'Partially Refunded']`, Default: `'Pending'`)
- `transactionId`: String
- `razorpayOrderId`: String (Indexed)
- `razorpayPaymentId`: String (Indexed)
- `razorpaySignature`: String
- `amount`: Number

### Embedded Schema: `delivery`
- `assignedTo`: ObjectId (`ref: 'User'`)
- `courierName`: String (Default: `'BlueDart Express'`)
- `trackingId`: String
- `estimatedDelivery`: Date
- `deliveredAt`: Date

### Indexes
- `{ orderId: 1 }` (Unique Index)
- `{ 'payment.razorpayOrderId': 1 }` (Lookup Index)
- `{ 'payment.razorpayPaymentId': 1 }` (Lookup Index)
- `{ customer: 1, orderStatus: 1 }` (Customer History Compound Index)

---

## 5. Collection: `payments` (Model: `Payment`)

Stores detailed financial audit logs for every transaction, Razorpay capture, and refund.

### Fields Specification

| Field Name | Type | Constraints | Default | Description |
|:---|:---|:---|:---|:---|
| `_id` | ObjectId | Auto-generated, Primary Key | `ObjectId()` | Unique MongoDB identifier |
| `orderId` | String | `required: true`, Index | - | Reference to business `orderId` |
| `orderRef` | ObjectId | `ref: 'Order'` | `null` | Mongoose reference to Order document |
| `user` | ObjectId | `ref: 'User'` | `null` | Reference to paying User |
| `razorpayOrderId` | String | `required: true`, `unique: true` | - | Razorpay unique order reference |
| `razorpayPaymentId` | String | Index | `null` | Razorpay payment capture identifier |
| `razorpaySignature` | String | Optional | `null` | Cryptographic signature string |
| `amount` | Number | `required: true` | - | Transaction value in currency units |
| `currency` | String | Optional | `'INR'` | ISO 4217 currency code |
| `status` | String | `enum: ['created', 'authorized', 'captured', 'refunded', 'failed']` | `'created'` | Gateway transaction lifecycle state |
| `method` | String | Optional | `null` | Gateway payment method (card, netbanking, upi) |
| `bank` | String | Optional | `null` | Issuing bank code |
| `wallet` | String | Optional | `null` | Digital wallet provider |
| `vpa` | String | Optional | `null` | Customer Virtual Payment Address (UPI ID) |
| `email` | String | Optional | `null` | Billing contact email |
| `contact` | String | Optional | `null` | Billing contact mobile |
| `errorCode` | String | Optional | `null` | Gateway error code if transaction failed |
| `errorDescription` | String | Optional | `null` | Detailed error reason from gateway |
| `capturedAt` | Date | Optional | `null` | Exact settlement capture timestamp |
| `refunds` | Array of Subdocs | Embedded Array | `[]` | List of refund events (schema below) |

### Embedded Schema: `refunds`
- `refundId`: String
- `amount`: Number
- `status`: String
- `speed`: String
- `notes`: String
- `processedBy`: String
- `createdAt`: Date (Default: `Date.now`)

### Indexes
- `{ razorpayOrderId: 1 }` (Unique Index)
- `{ orderId: 1 }` (Lookup Index)
- `{ razorpayPaymentId: 1 }` (Lookup Index)

---

## 6. Collection: `locationhistories` (Model: `LocationHistory`)

Time-series GPS telemetry coordinates emitted by active riders delivering luxury orders.

### Fields Specification

| Field Name | Type | Constraints | Default | Description |
|:---|:---|:---|:---|:---|
| `_id` | ObjectId | Auto-generated, Primary Key | `ObjectId()` | Unique MongoDB identifier |
| `orderId` | String | `required: true`, Index | - | Associated WatchHub order identifier |
| `shipmentId` | String | Index | `null` | Courier consignment / AWB number |
| `riderId` | String | `required: true`, Index | - | Delivery partner user identifier |
| `riderName` | String | Optional | `null` | Name of the active courier |
| `lat` | Number | `required: true` | - | GPS WGS84 Latitude coordinate |
| `lng` | Number | `required: true` | - | GPS WGS84 Longitude coordinate |
| `speed` | Number | Optional | `null` | Current vehicle speed (km/h) |
| `heading` | Number | Optional | `null` | Compass heading angle (0-360 degrees) |
| `accuracy` | Number | Optional | `null` | GPS signal horizontal accuracy (meters) |
| `timestamp` | Date | Index | `Date.now` | Telemetry acquisition timestamp |

### Indexes
- `{ orderId: 1, timestamp: -1 }` (Compound Live Tracking Index)
- `{ riderId: 1, timestamp: -1 }` (Rider History Index)

---

## 7. Collection: `otpverifications` (Model: `OtpVerification`)

Ephemeral security store for email and SMS One-Time Passwords. Utilizes MongoDB native TTL auto-deletion.

### Fields Specification

| Field Name | Type | Constraints | Default | Description |
|:---|:---|:---|:---|:---|
| `_id` | ObjectId | Auto-generated, Primary Key | `ObjectId()` | Unique MongoDB identifier |
| `identifier` | String | `required: true`, Index, `trim: true`, `lowercase: true` | - | Email address or E.164 phone number |
| `otpHash` | String | `required: true` | - | SHA-256 / Bcrypt cryptographic hash of the 6-digit OTP |
| `channel` | String | `enum: ['email', 'mobile', 'sms']` | `'mobile'` | Transmission medium (Resend email vs SMS gateway) |
| `purpose` | String | `enum: ['registration', 'login', 'password_reset', 'sensitive_action']` | `'registration'` | Security verification context |
| `attempts` | Number | `default: 0`, `max: 5` | `0` | Failed verification attempt counter (brute-force defense) |
| `isVerified` | Boolean | Optional | `false` | State flag set to true upon successful verification |
| `resendCooldownUntil` | Date | Optional | `Date.now() + 60s` | Minimum cooldown timestamp before next OTP dispatch |
| `expiresAt` | Date | Index (`expires: 300`) | `Date.now() + 5min` | TTL expiry timestamp (record automatically purged by MongoDB) |

### Indexes
- `{ identifier: 1 }` (Lookup Index)
- `{ expiresAt: 1 }` with `{ expireAfterSeconds: 0 }` (Native MongoDB TTL Index)

---

## 8. Collection: `auditlogs` (Model: `AuditLog`)

Immutable audit log recording critical back-office operations for corporate compliance and fraud prevention.

### Fields Specification

| Field Name | Type | Constraints | Default | Description |
|:---|:---|:---|:---|:---|
| `_id` | ObjectId | Auto-generated, Primary Key | `ObjectId()` | Unique MongoDB identifier |
| `action` | String | `required: true` | - | Operation code (e.g., `PRICE_OVERRIDE`, `REFUND_ISSUED`) |
| `module` | String | `required: true` | - | Target sub-system (e.g., `INVENTORY`, `PAYMENTS`, `SECURITY`) |
| `performedBy.userId` | String | Optional | `null` | ID of the administrative actor |
| `performedBy.name` | String | Optional | `null` | Name of the administrative actor |
| `performedBy.role` | String | Optional | `null` | Role of the actor at time of action |
| `targetId` | String | Optional | `null` | Target resource identifier (Order ID, Product SKU) |
| `details` | Mixed | Optional | `null` | JSON delta snapshot before and after modification |
| `ipAddress` | String | Optional | `null` | Origin IPv4 / IPv6 client address |
| `createdAt` | Date | Auto-generated | Current Timestamp | Action execution timestamp |
| `updatedAt` | Date | Auto-generated | Current Timestamp | Last record update timestamp |

### Indexes
- `{ module: 1, createdAt: -1 }` (Module History Index)
- `{ 'performedBy.userId': 1, createdAt: -1 }` (Actor Activity Index)
