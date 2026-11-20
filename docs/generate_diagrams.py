#!/usr/bin/env python3
"""
WatchHub Master Architecture & Technical Diagram Generator
Generates all 24 mandatory publication-grade technical diagrams in high-resolution PNG & SVG
for the 65-85 page academic engineering report.
"""

import os
import math
from PIL import Image, ImageDraw, ImageFont

DIAGRAM_DIR = os.path.join(os.path.dirname(__file__), 'diagrams')
os.makedirs(DIAGRAM_DIR, exist_ok=True)

# Color Palette (Dark Navy & Luxury Gold + Cyan)
DARK_BG = (7, 13, 28)
CARD_BG = (15, 23, 42)
CARD_HEADER = (22, 33, 58)
BORDER_COLOR = (37, 51, 82)
CYAN_ACCENT = (0, 217, 232)
GOLD_ACCENT = (231, 180, 63)
WHITE = (248, 250, 252)
GRAY = (166, 177, 200)
EMERALD = (16, 185, 129)
ROSE = (244, 63, 94)
PURPLE = (168, 85, 247)

def get_font(size=14, bold=False):
    font_name = 'segoeuib.ttf' if bold else 'segoeui.ttf'
    try:
        return ImageFont.truetype(font_name, size)
    except:
        return ImageFont.truetype('arial.ttf', size)

def draw_canvas(w=1400, h=800, title="", figure_num=1):
    img = Image.new('RGB', (w, h), DARK_BG)
    draw = ImageDraw.Draw(img)
    
    # Grid lines subtle
    for x in range(0, w, 50):
        draw.line([x, 0, x, h], fill=(12, 20, 40), width=1)
    for y in range(0, h, 50):
        draw.line([0, y, w, y], fill=(12, 20, 40), width=1)
        
    # Header strip
    t_font = get_font(20, bold=True)
    sub_font = get_font(12, bold=False)
    fig_font = get_font(12, bold=True)
    
    draw.text((40, 22), f"FIGURE {figure_num}: {title.upper()}", fill=WHITE, font=t_font)
    draw.text((40, 50), "WatchHub – Haute Horlogerie Luxury E-Commerce & Operations Ecosystem", fill=GOLD_ACCENT, font=sub_font)
    draw.text((w - 240, 50), "Technical System Specification", fill=CYAN_ACCENT, font=fig_font)
    draw.line([40, 72, w - 40, 72], fill=BORDER_COLOR, width=2)
    
    return img, draw

def draw_rounded_rect(draw, bbox, radius=10, fill=CARD_BG, outline=BORDER_COLOR, width=2):
    x0, y0, x1, y1 = bbox
    draw.rounded_rectangle([x0, y0, x1, y1], radius=radius, fill=fill, outline=outline, width=width)

def draw_card(draw, x, y, w, h, title, subtitle=None, items=None, border=BORDER_COLOR, title_color=CYAN_ACCENT, header_bg=CARD_HEADER):
    draw_rounded_rect(draw, [x, y, x + w, y + h], radius=10, fill=CARD_BG, outline=border, width=2)
    # Header strip
    draw_rounded_rect(draw, [x, y, x + w, y + 32], radius=10, fill=header_bg, outline=border, width=1)
    draw.rectangle([x, y + 20, x + w, y + 32], fill=header_bg)
    
    t_font = get_font(13, bold=True)
    draw.text((x + 12, y + 8), title, fill=title_color, font=t_font)
    
    curr_y = y + 40
    if subtitle:
        s_font = get_font(11, bold=True)
        draw.text((x + 12, curr_y), subtitle, fill=GOLD_ACCENT, font=s_font)
        curr_y += 18
        
    if items:
        i_font = get_font(11, bold=False)
        for it in items:
            draw.text((x + 12, curr_y), f"• {it}", fill=WHITE, font=i_font)
            curr_y += 16

def draw_arrow(draw, start, end, color=CYAN_ACCENT, width=2, head_size=8, label=None):
    x0, y0 = start
    x1, y1 = end
    draw.line([x0, y0, x1, y1], fill=color, width=width)
    
    angle = math.atan2(y1 - y0, x1 - x0)
    angle1 = angle + math.pi * 5 / 6
    angle2 = angle - math.pi * 5 / 6
    
    ax1 = x1 + head_size * math.cos(angle1)
    ay1 = y1 + head_size * math.sin(angle1)
    ax2 = x1 + head_size * math.cos(angle2)
    ay2 = y1 + head_size * math.sin(angle2)
    
    draw.polygon([(x1, y1), (ax1, ay1), (ax2, ay2)], fill=color)

    if label:
        mid_x = (x0 + x1) / 2
        mid_y = (y0 + y1) / 2 - 12
        font = get_font(11, bold=True)
        draw.text((mid_x, mid_y), label, fill=GOLD_ACCENT, font=font, anchor="ms")

def draw_step_box(draw, x, y, w, h, step_num, title, desc, accent=CYAN_ACCENT):
    draw_rounded_rect(draw, [x, y, x + w, y + h], radius=10, fill=CARD_BG, outline=accent, width=2)
    draw.ellipse([x + 10, y + 10, x + 34, y + 34], fill=accent)
    draw.text((x + 22, y + 22), str(step_num), fill=(0,0,0), font=get_font(12, bold=True), anchor="mm")
    draw.text((x + 42, y + 12), title, fill=WHITE, font=get_font(13, bold=True))
    draw.text((x + 42, y + 28), desc, fill=GRAY, font=get_font(10, bold=False))

def save_diagram(img, name):
    png_path = os.path.join(DIAGRAM_DIR, f"{name}.png")
    img.save(png_path, "PNG")
    print(f"Generated: {name}.png")

# ==============================================================================
# 1. OVERALL SYSTEM ARCHITECTURE
# ==============================================================================
def gen_diag_1():
    img, draw = draw_canvas(1400, 800, "Overall System Architecture", 1)
    
    # 4 Vertical Columns / Layers
    draw_card(draw, 50, 100, 260, 650, "1. Presentation Layer", "Client Applications", [
        "React 18 Single Page App (SPA)",
        "Progressive Web App (PWA)",
        "Standalone Mobile Android APK",
        "Tailwind CSS 3 Luxury Design",
        "Vite 6 Optimized Bundler",
        "Lucide React Horology Icons",
        "Recharts Data Analytics",
        "Responsive Six-Role Interfaces"
    ], border=CYAN_ACCENT)
    
    draw_card(draw, 370, 100, 280, 650, "2. API Gateway & Routing", "Vercel Edge / Express.js", [
        "Vercel Serverless Function Bridge",
        "Express RESTful Router",
        "Helmet Security Middleware",
        "CORS Production Whitelist",
        "Cookie Parser & Rate Limiter",
        "JWT Verification Middleware",
        "Role-Based Access Guard (RBAC)",
        "Centralized Error Handler"
    ], border=GOLD_ACCENT)
    
    draw_card(draw, 710, 100, 310, 650, "3. Business Services", "Core Application Logic", [
        "Auth & Security Service (OTP/JWT)",
        "Catalog & 3D Customizer Engine",
        "Order Fulfillment & Checkout",
        "Inventory Vault & Barcode Pick/Pack",
        "Logistics & Live Courier Tracking",
        "Customer Support CRM & Helpdesk",
        "Socket.IO WebSocket Event Hub",
        "Audit Log & State Reconciliation"
    ], border=PURPLE)
    
    draw_card(draw, 1080, 100, 270, 650, "4. Data & External Tier", "Cloud Persistence & APIs", [
        "MongoDB Atlas Sharded Cluster",
        "Mongoose ODM with Schemas",
        "Razorpay Payment Gateway API",
        "Resend SMTP Email OTP Service",
        "Google Maps Platform API",
        "Local PWA Cache Storage",
        "Vercel CDN Edge Network",
        "Audit Trail & Location History"
    ], border=EMERALD)

    # Connecting Arrows
    draw_arrow(draw, (310, 220), (370, 220), label="HTTPS / WSS")
    draw_arrow(draw, (370, 340), (310, 340), label="JSON / UI State")
    draw_arrow(draw, (650, 250), (710, 250), label="Routed Invocation")
    draw_arrow(draw, (1020, 250), (1080, 250), label="Mongoose / REST")
    draw_arrow(draw, (1080, 420), (1020, 420), label="DB Docs / Webhooks")
    
    save_diagram(img, "arch_overall")

# ==============================================================================
# 2. FOUR-TIER ARCHITECTURE
# ==============================================================================
def gen_diag_2():
    img, draw = draw_canvas(1400, 800, "Four-Tier Enterprise Architecture", 2)
    
    tiers = [
        ("Tier 1: Presentation Tier (Client)", "Browser, PWA & Android Mobile Devices", [
            "Customer Storefront, 3D Atelier & Customizer Studio",
            "Store Admin, Inventory Manager & Super Admin Dashboards",
            "Delivery Partner Mobile GPS Navigation & Waypoints",
            "Customer Support Executive Helpdesk & Live Chat"
        ], CYAN_ACCENT, 110),
        ("Tier 2: API Gateway & Security Tier", "Vercel Edge & Express Middleware", [
            "TLS 1.3 Strict HTTPS Termination & HSTS Enforcement",
            "JWT Bearer Token Extraction & Authorization Guard",
            "CORS Domain Validation & Helmet Security Headers",
            "Rate Limiting & Request Throttling Protection"
        ], GOLD_ACCENT, 270),
        ("Tier 3: Domain Business Logic Tier", "Node.js Application Services", [
            "Order Processing & Stock Allocation Service",
            "Real-Time Socket.IO Location Broadcast Engine",
            "OTP Generation, Expiration & Cryptographic Hashing",
            "Razorpay Payment Verification & HMAC-SHA256 Signing"
        ], PURPLE, 430),
        ("Tier 4: Persistence & Cloud Services Tier", "MongoDB Atlas & External Partners", [
            "MongoDB Atlas Multi-Region Cluster (Collections & TTL)",
            "Razorpay Payment Gateway & Instant UPI Refunds",
            "Resend Email Infrastructure (Automated Verification OTPs)",
            "Google Maps Distance Matrix & Geocoding APIs"
        ], EMERALD, 590),
    ]
    
    for title, sub, items, color, y in tiers:
        draw_card(draw, 100, y, 1200, 130, title, sub, items, border=color)
        if y < 590:
            draw_arrow(draw, (700, y + 130), (700, y + 160), color=WHITE, head_size=8)
            draw_arrow(draw, (720, y + 160), (720, y + 130), color=GRAY, head_size=8)
            
    save_diagram(img, "arch_four_tier")

# ==============================================================================
# 3. DFD LEVEL 0 (CONTEXT DIAGRAM)
# ==============================================================================
def gen_diag_3():
    img, draw = draw_canvas(1400, 800, "DFD Level 0 – Context Architecture Diagram", 3)
    
    # Center System Bubble
    cx, cy, r = 700, 420, 140
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=CARD_HEADER, outline=CYAN_ACCENT, width=4)
    draw.text((cx, cy - 25), "0.0", fill=GOLD_ACCENT, font=get_font(24, bold=True), anchor="mm")
    draw.text((cx, cy + 5), "WATCHHUB", fill=WHITE, font=get_font(20, bold=True), anchor="mm")
    draw.text((cx, cy + 30), "HAUTE HORLOGERIE PLATFORM", fill=CYAN_ACCENT, font=get_font(12, bold=True), anchor="mm")
    
    # Surrounding Entities
    entities = [
        ("Customer", 120, 160, ["Browses Catalog & Configures Watches", "Places Orders & Authorizes Payments", "Receives Delivery OTP & Real-Time Tracking"]),
        ("Store Admin", 120, 520, ["Manages Products, Pricing & Promos", "Processes POS Orders & Audits", "Configures Store Operating Rules"]),
        ("Inventory Manager", 520, 100, ["Monitors Vault Stock & Bin Locations", "Authorizes Reorder Purchase Orders", "Performs Stock Inward & Adjustments"]),
        ("Delivery Partner", 1000, 160, ["Receives Dispatch Route Waypoints", "Broadcasts Real-Time GPS Milestones", "Verifies OTP & Submits Delivery Proof"]),
        ("Payment Gateway (Razorpay)", 1000, 520, ["Receives Payment Authentication", "Processes UPI/Card Transactions", "Emits Webhook Handshake Events"]),
        ("Communication API (Resend)", 520, 680, ["Receives 6-Digit Verification OTPs", "Delivers Customer Welcome Emails", "Dispatches Digital Invoices"]),
    ]
    
    for name, x, y, notes in entities:
        draw_card(draw, x, y, 280, 110, name, items=notes, border=GOLD_ACCENT)
        # Draw connection to center
        card_cx = x + 140
        card_cy = y + 55
        draw_arrow(draw, (card_cx, card_cy), (cx, cy), color=WHITE, head_size=8)
        
    save_diagram(img, "dfd_level_0")

# ==============================================================================
# 4. DFD LEVEL 1 (DECOMPOSED SYSTEM PROCESSES)
# ==============================================================================
def gen_diag_4():
    img, draw = draw_canvas(1400, 800, "DFD Level 1 – Subsystem Decomposition", 4)
    
    processes = [
        (1, "1.0 Auth & Access Control", 80, 120, ["Customer Email OTP Verification", "Role-Based Token Issuance", "Session Token Revocation"]),
        (2, "2.0 Catalog & Atelier Studio", 520, 120, ["Product Specs & 3D Assets", "Dynamic Price Estimation", "Real-Time Stock Availability"]),
        (3, "3.0 Order & Checkout Engine", 960, 120, ["Cart Calculation & Validation", "Razorpay Order Creation", "Order State Transition"]),
        (4, "4.0 Inventory Vault System", 80, 460, ["Multi-Vault Location Registry", "Stock Ledger Inward/Outward", "Low-Stock Reorder Triggers"]),
        (5, "5.0 Dispatch & Logistics Hub", 520, 460, ["Courier Waypoint Generation", "Socket.IO Live GPS Relay", "OTP Handover & Proof Upload"]),
        (6, "6.0 Customer Support CRM", 960, 460, ["Helpdesk Ticket Routing", "Instant UPI Refund Authorization", "VIP Customer Chat History"]),
    ]
    
    for pid, name, x, y, tasks in processes:
        draw_card(draw, x, y, 360, 150, name, items=tasks, border=CYAN_ACCENT)
        
    # Data Stores at bottom
    draw_card(draw, 240, 670, 420, 80, "D1: MongoDB Primary Vault", "Users, Products, Orders, Payments, Logs", border=EMERALD)
    draw_card(draw, 740, 670, 420, 80, "D2: Real-Time Cache & TTL Store", "OTP Verification, Active Sessions, Socket Waypoints", border=PURPLE)
    
    # Interconnecting arrows
    draw_arrow(draw, (440, 190), (520, 190), label="Auth Session")
    draw_arrow(draw, (880, 190), (960, 190), label="Cart Checkout")
    draw_arrow(draw, (1140, 270), (1140, 460), label="Placed Order")
    draw_arrow(draw, (960, 530), (880, 530), label="Logistics Handover")
    draw_arrow(draw, (520, 530), (440, 530), label="Inventory Lock")
    
    save_diagram(img, "dfd_level_1")

# ==============================================================================
# 5. DFD LEVEL 2 (ORDER PROCESSING & FULFILLMENT)
# ==============================================================================
def gen_diag_5():
    img, draw = draw_canvas(1400, 800, "DFD Level 2 – Order Lifecycle & Fulfillment Detail", 5)
    
    steps = [
        ("3.1 Validate Cart & Stock", 60, 140, 280, 110, ["Check vault stock quantity", "Lock inventory reservation", "Calculate taxes & shipping"]),
        ("3.2 Initiate Razorpay Gateway", 400, 140, 280, 110, ["Generate gateway order ID", "Invoke client payment SDK", "Await webhook callback"]),
        ("3.3 Verify Cryptographic HMAC", 740, 140, 280, 110, ["Compare HMAC-SHA256 hash", "Validate payment signature", "Persist payment record"]),
        ("3.4 Emit Order Confirmation", 1080, 140, 260, 110, ["Send email invoice via Resend", "Trigger warehouse pick/pack", "Update customer order history"]),
        ("3.5 Warehouse Pick & Pack", 1080, 440, 260, 110, ["Scan item QR/barcode", "Attach tamper-proof seal", "Assign courier waybill"]),
        ("3.6 Assign Delivery Partner", 740, 440, 280, 110, ["Calculate nearest rider", "Transmit pickup coords", "Generate delivery OTP"]),
        ("3.7 GPS Transit & Milestones", 400, 440, 280, 110, ["Stream rider live location", "Update client ETA map", "Milestone waypoint logs"]),
        ("3.8 OTP Handover & Completion", 60, 440, 280, 110, ["Customer provides 6-digit OTP", "Rider captures photo proof", "Mark order Completed"]),
    ]
    
    for name, x, y, w, h, items in steps:
        draw_card(draw, x, y, w, h, name, items=items, border=GOLD_ACCENT)
        
    draw_arrow(draw, (340, 195), (400, 195))
    draw_arrow(draw, (680, 195), (740, 195))
    draw_arrow(draw, (1020, 195), (1080, 195))
    draw_arrow(draw, (1210, 250), (1210, 440))
    draw_arrow(draw, (1080, 495), (1020, 495))
    draw_arrow(draw, (740, 495), (680, 495))
    draw_arrow(draw, (400, 495), (340, 495))
    
    save_diagram(img, "dfd_level_2")

# ==============================================================================
# 6. ENTITY RELATIONSHIP DIAGRAM (ERD)
# ==============================================================================
def gen_diag_6():
    img, draw = draw_canvas(1400, 800, "Database Entity Relationship Diagram (ERD)", 6)
    
    entities = [
        ("User", 60, 120, 280, 250, [
            "PK _id: ObjectId",
            "name: String",
            "email: String (Indexed Unique)",
            "password: String (Bcrypt Hash)",
            "role: Enum (6 Roles)",
            "mobile: String",
            "isEmailVerified: Boolean",
            "status: String",
            "createdAt: Date"
        ], CYAN_ACCENT),
        ("Product", 400, 120, 280, 250, [
            "PK _id: ObjectId",
            "sku: String (Indexed Unique)",
            "name: String",
            "brand: String",
            "category: String",
            "price: Number",
            "stock: Number",
            "images: Array[String]",
            "movement: String",
            "isCustomizable: Boolean"
        ], GOLD_ACCENT),
        ("Order", 740, 120, 280, 250, [
            "PK _id: ObjectId",
            "orderNumber: String (Unique)",
            "FK customerId: ObjectId -> User",
            "items: Array[OrderItem]",
            "totalAmount: Number",
            "paymentStatus: Enum",
            "orderStatus: Enum",
            "deliveryOtp: String",
            "trackingNumber: String"
        ], PURPLE),
        ("Payment", 1080, 120, 260, 250, [
            "PK _id: ObjectId",
            "FK orderId: ObjectId -> Order",
            "razorpayOrderId: String",
            "razorpayPaymentId: String",
            "signature: String",
            "method: String",
            "amount: Number",
            "status: Enum",
            "createdAt: Date"
        ], EMERALD),
        ("OtpVerification", 60, 450, 280, 240, [
            "PK _id: ObjectId",
            "email: String (Indexed)",
            "otp: String (6-digit hashed)",
            "purpose: Enum",
            "expiresAt: Date (TTL Index)",
            "verified: Boolean",
            "attempts: Number"
        ], ROSE),
        ("LocationHistory", 400, 450, 280, 240, [
            "PK _id: ObjectId",
            "FK orderId: ObjectId -> Order",
            "FK riderId: ObjectId -> User",
            "coordinates: [Lng, Lat]",
            "accuracy: Number",
            "speed: Number",
            "timestamp: Date"
        ], CYAN_ACCENT),
        ("AuditLog", 740, 450, 280, 240, [
            "PK _id: ObjectId",
            "FK userId: ObjectId -> User",
            "role: String",
            "action: String",
            "module: String",
            "ipAddress: String",
            "timestamp: Date"
        ], GOLD_ACCENT),
    ]
    
    for name, x, y, w, h, fields, color in entities:
        draw_card(draw, x, y, w, h, f"Entity: {name}", items=fields, border=color)
        
    # Relationships
    draw_arrow(draw, (340, 240), (400, 240), label="Purchases")
    draw_arrow(draw, (680, 240), (740, 240), label="Contains")
    draw_arrow(draw, (1020, 240), (1080, 240), label="Settled by")
    draw_arrow(draw, (200, 370), (200, 450), label="Validates")
    draw_arrow(draw, (880, 370), (540, 450), label="Tracks Waypoints")
    draw_arrow(draw, (200, 370), (740, 480), label="Audits Activity")
    
    save_diagram(img, "er_diagram")

# ==============================================================================
# 7. MONGODB COLLECTION RELATIONSHIPS & INDEXES
# ==============================================================================
def gen_diag_7():
    img, draw = draw_canvas(1400, 800, "MongoDB Collection Architecture & Indexing Matrix", 7)
    
    cols = [
        ("Collection: users", 80, 120, 360, 280, [
            "{ email: 1 } -> UNIQUE, SPARSE",
            "{ role: 1 } -> SECONDARY INDEX",
            "{ createdAt: -1 } -> SORTING INDEX",
            "Embedded: shippingAddresses[]",
            "Embedded: preferences{}",
            "Encryption: Bcrypt Salt Rounds 10"
        ], CYAN_ACCENT),
        ("Collection: products", 520, 120, 360, 280, [
            "{ sku: 1 } -> UNIQUE INDEX",
            "{ brand: 1, category: 1 } -> COMPOUND",
            "{ price: 1 } -> RANGE SCAN",
            "{ name: 'text', brand: 'text' } -> TEXT SEARCH",
            "Embedded: specifications{}",
            "Embedded: customizationOptions[]"
        ], GOLD_ACCENT),
        ("Collection: orders", 960, 120, 360, 280, [
            "{ orderNumber: 1 } -> UNIQUE",
            "{ customerId: 1 } -> FOREIGN LOOKUP",
            "{ orderStatus: 1 } -> PIPELINE FILTER",
            "{ createdAt: -1 } -> CHRONOLOGICAL",
            "Embedded: items[ { productId, qty, price } ]",
            "Embedded: courierWaypoints[]"
        ], PURPLE),
        ("Collection: otp_verifications", 80, 470, 360, 250, [
            "{ expiresAt: 1 } -> TTL INDEX (300s)",
            "{ email: 1, purpose: 1 } -> COMPOUND",
            "Automatic MongoDB background purge",
            "Security: Max 3 attempt lock"
        ], ROSE),
        ("Collection: location_histories", 520, 470, 360, 250, [
            "{ coordinates: '2dsphere' } -> GEOSPATIAL",
            "{ orderId: 1, timestamp: -1 } -> COMPOUND",
            "High-throughput GPS telemetry storage",
            "Sub-meter geo-fencing calculation"
        ], EMERALD),
        ("Collection: audit_logs", 960, 470, 360, 250, [
            "{ timestamp: -1 } -> TTL / ARCHIVE",
            "{ userId: 1 } -> FORENSIC LOOKUP",
            "{ action: 1 } -> COMPLIANCE SCAN",
            "Immutable append-only architecture"
        ], WHITE),
    ]
    
    for title, x, y, w, h, items, color in cols:
        draw_card(draw, x, y, w, h, title, "Indexes & Data Integrity Rules", items=items, border=color)
        
    save_diagram(img, "mongodb_relationships")

# ==============================================================================
# 8. USE CASE DIAGRAM
# ==============================================================================
def gen_diag_8():
    img, draw = draw_canvas(1400, 800, "Comprehensive Actor Use Case Diagram", 8)
    
    # 6 Actors on sides
    actors = [
        ("Customer", 80, 140),
        ("Delivery Partner", 80, 360),
        ("Customer Support", 80, 580),
        ("Store Admin", 1120, 140),
        ("Inventory Manager", 1120, 360),
        ("Super Admin", 1120, 580),
    ]
    
    for name, ax, ay in actors:
        draw.ellipse([ax, ay, ax + 50, ay + 50], fill=CARD_HEADER, outline=GOLD_ACCENT, width=2)
        draw.text((ax + 25, ay + 25), "👤", font=get_font(20), anchor="mm")
        draw.text((ax + 25, ay + 65), name, fill=WHITE, font=get_font(12, bold=True), anchor="mt")
        
    # Use cases in middle
    cases = [
        ("UC-01: Browse Catalog & Filter Brands", 340, 120),
        ("UC-02: Configure 3D Bespoke Timepiece", 700, 120),
        ("UC-03: Authenticate via Email/SMS OTP", 340, 240),
        ("UC-04: Execute Razorpay Checkout", 700, 240),
        ("UC-05: Real-Time Courier GPS Tracking", 340, 360),
        ("UC-06: OTP Delivery Handover & Proof", 700, 360),
        ("UC-07: Vault Stock Ledger & Reorder", 340, 480),
        ("UC-08: POS Terminal Order Processing", 700, 480),
        ("UC-09: Live Support Helpdesk & Refund", 340, 600),
        ("UC-10: Super Admin Version Management", 700, 600),
    ]
    
    for title, cx, cy in cases:
        draw_rounded_rect(draw, [cx, cy, cx + 280, cy + 50], radius=25, fill=CARD_BG, outline=CYAN_ACCENT, width=1)
        draw.text((cx + 140, cy + 25), title, fill=WHITE, font=get_font(11, bold=True), anchor="mm")
        
    # Connect Actor lines
    draw.line([130, 165, 340, 145], fill=GRAY, width=1)
    draw.line([130, 165, 700, 145], fill=GRAY, width=1)
    draw.line([130, 165, 700, 265], fill=GRAY, width=1)
    draw.line([130, 385, 340, 385], fill=GRAY, width=1)
    draw.line([130, 385, 700, 385], fill=GRAY, width=1)
    draw.line([130, 605, 340, 625], fill=GRAY, width=1)
    draw.line([1120, 165, 980, 145], fill=GRAY, width=1)
    draw.line([1120, 165, 980, 495], fill=GRAY, width=1)
    draw.line([1120, 385, 620, 495], fill=GRAY, width=1)
    draw.line([1120, 605, 980, 625], fill=GRAY, width=1)
    
    save_diagram(img, "use_case_overall")

# ==============================================================================
# 9. UML CLASS DIAGRAM
# ==============================================================================
def gen_diag_9():
    img, draw = draw_canvas(1400, 800, "UML Detailed Domain Class Diagram", 9)
    
    classes = [
        ("User", 60, 120, 260, 280, [
            "+ id: ObjectId",
            "+ name: String",
            "+ email: String",
            "+ role: UserRole",
            "+ mobile: String",
            "+ isVerified: Boolean"
        ], [
            "+ register(): Boolean",
            "+ authenticate(): JWT",
            "+ verifyOtp(otp): Boolean",
            "+ switchRole(role): Token"
        ], CYAN_ACCENT),
        ("Product", 380, 120, 280, 280, [
            "+ id: ObjectId",
            "+ sku: String",
            "+ name: String",
            "+ brand: String",
            "+ price: Number",
            "+ stock: Number"
        ], [
            "+ checkStock(qty): Boolean",
            "+ updateStock(delta): Void",
            "+ getCustomizerSpecs(): JSON",
            "+ calculateDiscount(): Number"
        ], GOLD_ACCENT),
        ("Order", 720, 120, 300, 280, [
            "+ id: ObjectId",
            "+ orderNumber: String",
            "+ customerId: ObjectId",
            "+ items: List<OrderItem>",
            "+ totalAmount: Number",
            "+ status: OrderStatus"
        ], [
            "+ calculateTotal(): Number",
            "+ confirmPayment(payId): Void",
            "+ assignCourier(riderId): Void",
            "+ verifyDelivery(otp): Boolean"
        ], PURPLE),
        ("Payment", 1080, 120, 260, 280, [
            "+ id: ObjectId",
            "+ orderId: ObjectId",
            "+ gatewayId: String",
            "+ amount: Number",
            "+ signature: String"
        ], [
            "+ createRazorpayOrder(): String",
            "+ verifyHmacSignature(): Boolean",
            "+ initiateRefund(amount): Boolean"
        ], EMERALD),
        ("Shipment", 380, 450, 280, 260, [
            "+ id: ObjectId",
            "+ orderId: ObjectId",
            "+ riderId: ObjectId",
            "+ waybillNumber: String",
            "+ currentStatus: String"
        ], [
            "+ updateLocation(coords): Void",
            "+ calculateETA(): Number",
            "+ completeHandover(otp): Void"
        ], ROSE),
        ("AuditLog", 720, 450, 300, 260, [
            "+ id: ObjectId",
            "+ userId: ObjectId",
            "+ action: String",
            "+ module: String",
            "+ timestamp: Date"
        ], [
            "+ logEvent(action, payload): Void",
            "+ getAuditTrail(filter): List",
            "+ exportCompliance(): CSV"
        ], WHITE),
    ]
    
    for name, x, y, w, h, attrs, methods, color in classes:
        draw_rounded_rect(draw, [x, y, x + w, y + h], radius=10, fill=CARD_BG, outline=color, width=2)
        draw_rounded_rect(draw, [x, y, x + w, y + 30], radius=10, fill=CARD_HEADER, outline=color, width=1)
        draw.rectangle([x, y + 20, x + w, y + 30], fill=CARD_HEADER)
        draw.text((x + 12, y + 6), f"class {name}", fill=color, font=get_font(13, bold=True))
        
        # Attributes
        cy = y + 38
        for at in attrs:
            draw.text((x + 12, cy), at, fill=WHITE, font=get_font(11, bold=False))
            cy += 16
            
        draw.line([x, cy + 4, x + w, cy + 4], fill=BORDER_COLOR, width=1)
        cy += 10
        # Methods
        for m in methods:
            draw.text((x + 12, cy), m, fill=GRAY, font=get_font(11, bold=False))
            cy += 16
            
    # Connect
    draw_arrow(draw, (320, 260), (380, 260), label="1..*")
    draw_arrow(draw, (660, 260), (720, 260), label="1..*")
    draw_arrow(draw, (1020, 260), (1080, 260), label="1..1")
    draw_arrow(draw, (870, 400), (520, 450), label="1..1")
    
    save_diagram(img, "uml_class_diagram")

# ==============================================================================
# 10. AUTHENTICATION SEQUENCE DIAGRAM
# ==============================================================================
def gen_diag_10():
    img, draw = draw_canvas(1400, 800, "Authentication & OTP Verification Sequence", 10)
    
    participants = [
        ("Client (React PWA)", 120),
        ("API Gateway", 380),
        ("Auth Controller", 640),
        ("MongoDB Atlas", 900),
        ("Resend Email API", 1180),
    ]
    
    for name, px in participants:
        draw_rounded_rect(draw, [px - 80, 100, px + 80, 140], radius=8, fill=CARD_HEADER, outline=CYAN_ACCENT, width=2)
        draw.text((px, 120), name, fill=WHITE, font=get_font(11, bold=True), anchor="mm")
        draw.line([px, 140, px, 720], fill=BORDER_COLOR, width=1)
        
    messages = [
        (120, 380, 180, "1. POST /api/auth/register (name, email, pass)", CYAN_ACCENT),
        (380, 640, 220, "2. Invoke registerCustomer()", CYAN_ACCENT),
        (640, 900, 260, "3. Query existing user by email", GOLD_ACCENT),
        (900, 640, 300, "4. Return: null (User does not exist)", WHITE),
        (640, 640, 340, "5. Generate crypto 6-digit OTP & Bcrypt hash pass", PURPLE),
        (640, 900, 380, "6. Insert OtpVerification (5 min TTL)", EMERALD),
        (640, 1180, 420, "7. Send Transactional OTP Email (Resend REST API)", ROSE),
        (1180, 640, 460, "8. Resend HTTP 200 (Message Delivered)", WHITE),
        (640, 120, 500, "9. Return 200: OTP Sent to Email Inbox", GOLD_ACCENT),
        (120, 380, 540, "10. POST /api/auth/verify-otp (email, enteredOtp)", CYAN_ACCENT),
        (380, 640, 580, "11. Validate entered OTP against DB record", CYAN_ACCENT),
        (640, 900, 620, "12. Create User record (isEmailVerified: true)", EMERALD),
        (640, 120, 660, "13. Return Signed JWT Token & Role Header", GOLD_ACCENT),
    ]
    
    for x1, x2, y, text, color in messages:
        if x1 == x2:
            draw.arc([x1, y - 10, x1 + 50, y + 20], 270, 90, fill=color, width=2)
            draw.text((x1 + 60, y + 5), text, fill=color, font=get_font(10, bold=True))
        else:
            draw_arrow(draw, (x1, y), (x2, y), color=color, width=2, head_size=6)
            draw.text(((x1 + x2) / 2, y - 10), text, fill=color, font=get_font(10, bold=True), anchor="ms")
            
    save_diagram(img, "seq_authentication")

# ==============================================================================
# 11. PAYMENT SEQUENCE DIAGRAM
# ==============================================================================
def gen_diag_11():
    img, draw = draw_canvas(1400, 800, "Razorpay Payment Gateway Verification Sequence", 11)
    
    participants = [
        ("Customer Client", 140),
        ("Express Backend", 460),
        ("Razorpay Orders API", 780),
        ("Razorpay Checkout SDK", 1100),
    ]
    
    for name, px in participants:
        draw_rounded_rect(draw, [px - 90, 100, px + 90, 140], radius=8, fill=CARD_HEADER, outline=GOLD_ACCENT, width=2)
        draw.text((px, 120), name, fill=WHITE, font=get_font(11, bold=True), anchor="mm")
        draw.line([px, 140, px, 720], fill=BORDER_COLOR, width=1)
        
    messages = [
        (140, 460, 180, "1. POST /api/payments/create-order (amount, cartItems)", CYAN_ACCENT),
        (460, 780, 230, "2. POST /v1/orders (amount_in_paise, currency: 'INR')", GOLD_ACCENT),
        (780, 460, 280, "3. Return order_id: 'order_Nx8Y...', status: 'created'", WHITE),
        (460, 140, 330, "4. Return order payload + Razorpay Key ID", CYAN_ACCENT),
        (140, 1100, 380, "5. Initialize Razorpay Checkout Modal (UPI/Cards)", PURPLE),
        (1100, 140, 440, "6. Payment Authorized: returns razorpay_payment_id, signature", EMERALD),
        (140, 460, 500, "7. POST /api/payments/verify (order_id, payment_id, signature)", CYAN_ACCENT),
        (460, 460, 550, "8. Compute expected = HMAC_SHA256(order_id + '|' + payment_id, secret)", ROSE),
        (460, 460, 600, "9. Validate expected === signature (Timing-safe compare)", EMERALD),
        (460, 140, 650, "10. Return HTTP 200: Payment Verified! Order Placed", GOLD_ACCENT),
    ]
    
    for x1, x2, y, text, color in messages:
        if x1 == x2:
            draw.arc([x1, y - 10, x1 + 60, y + 25], 270, 90, fill=color, width=2)
            draw.text((x1 + 70, y + 5), text, fill=color, font=get_font(10, bold=True))
        else:
            draw_arrow(draw, (x1, y), (x2, y), color=color, width=2, head_size=6)
            draw.text(((x1 + x2) / 2, y - 10), text, fill=color, font=get_font(10, bold=True), anchor="ms")
            
    save_diagram(img, "seq_payment")

# ==============================================================================
# 12. OTP VERIFICATION FLOWCHART
# ==============================================================================
def gen_diag_12():
    img, draw = draw_canvas(1400, 800, "Cryptographic Email OTP Lifecycle Flowchart", 12)
    
    flow_steps = [
        ("1. User Inputs Email & Password", 100, 130, 320, 80, CYAN_ACCENT),
        ("2. Backend Validates Syntax & Duplication", 100, 250, 320, 80, GOLD_ACCENT),
        ("3. Generate Cryptographic 6-Digit Number", 100, 370, 320, 80, PURPLE),
        ("4. Hash OTP with Salt & Insert TTL Record", 100, 490, 320, 80, EMERALD),
        ("5. Transmit Email Payload via Resend API", 540, 490, 320, 80, ROSE),
        ("6. Client Displays 6-Box Verification UI", 540, 370, 320, 80, CYAN_ACCENT),
        ("7. User Submits 6 Digits (Countdown 5:00)", 540, 250, 320, 80, WHITE),
        ("8. Verify Hashes & Check Expiration Time", 980, 250, 340, 80, GOLD_ACCENT),
        ("9. If Valid: Activate Account & Issue JWT", 980, 370, 340, 80, EMERALD),
        ("10. If Invalid/Expired: Return 400 & Lock 3x", 980, 490, 340, 80, ROSE),
    ]
    
    for text, x, y, w, h, col in flow_steps:
        draw_rounded_rect(draw, [x, y, x + w, y + h], radius=10, fill=CARD_BG, outline=col, width=2)
        draw.text((x + w/2, y + h/2), text, fill=WHITE, font=get_font(11, bold=True), anchor="mm")
        
    draw_arrow(draw, (260, 210), (260, 250))
    draw_arrow(draw, (260, 330), (260, 370))
    draw_arrow(draw, (260, 450), (260, 490))
    draw_arrow(draw, (420, 530), (540, 530))
    draw_arrow(draw, (700, 490), (700, 450))
    draw_arrow(draw, (700, 370), (700, 330))
    draw_arrow(draw, (860, 290), (980, 290))
    draw_arrow(draw, (1150, 330), (1150, 370), label="Success")
    draw_arrow(draw, (1150, 450), (1150, 490), label="Mismatch")
    
    save_diagram(img, "flow_otp_verification")

# ==============================================================================
# 13. ORDER PROCESSING FLOWCHART
# ==============================================================================
def gen_diag_13():
    img, draw = draw_canvas(1400, 800, "End-to-End Order Processing & State Machine", 13)
    
    states = [
        ("STATE 1: CART_PENDING", 80, 150, "User configures items & checks out", CYAN_ACCENT),
        ("STATE 2: PAYMENT_PROCESSING", 80, 310, "Awaiting Razorpay gateway authorization", GOLD_ACCENT),
        ("STATE 3: ORDER_CONFIRMED", 80, 470, "Payment verified, inventory allocated", EMERALD),
        ("STATE 4: PICK_AND_PACK", 520, 470, "Vault barcode scanned, sealed in case", PURPLE),
        ("STATE 5: DISPATCHED_IN_TRANSIT", 520, 310, "Assigned to rider with milestone GPS", CYAN_ACCENT),
        ("STATE 6: OUT_FOR_DELIVERY", 520, 150, "Rider enters customer geofence radius", GOLD_ACCENT),
        ("STATE 7: OTP_VERIFIED_DELIVERED", 960, 150, "6-digit OTP validated, POD photo saved", EMERALD),
        ("EXCEPTION: REFUNDED / CANCELLED", 960, 310, "Instant UPI reversal & stock restored", ROSE),
    ]
    
    for title, x, y, desc, col in states:
        draw_card(draw, x, y, 360, 100, title, desc, border=col)
        
    draw_arrow(draw, (260, 250), (260, 310))
    draw_arrow(draw, (260, 410), (260, 470))
    draw_arrow(draw, (440, 520), (520, 520))
    draw_arrow(draw, (700, 470), (700, 410))
    draw_arrow(draw, (700, 310), (700, 250))
    draw_arrow(draw, (880, 200), (960, 200))
    draw_arrow(draw, (700, 360), (960, 360), label="Cancellation")
    
    save_diagram(img, "flow_order_processing")

# ==============================================================================
# 14. INVENTORY MANAGEMENT FLOWCHART
# ==============================================================================
def gen_diag_14():
    img, draw = draw_canvas(1400, 800, "Inventory Vault Stock Lifecycle & Reorder Automation", 14)
    
    steps = [
        ("1. Vault Stock Ledger Entry", 100, 140, ["Serial number & barcode generation", "Bin location assignment (e.g. Bay Vault-02)", "Cost basis & luxury valuation recording"], CYAN_ACCENT),
        ("2. Real-Time Reservation Lock", 100, 380, ["Decrements available stock upon checkout", "Prevents flash-sale overselling race conditions", "Auto-releases if payment fails within 15 min"], GOLD_ACCENT),
        ("3. Automated Threshold Monitoring", 540, 140, ["Compares on-hand units against reorder level", "Triggers urgent Store Admin & Vault alerts", "Classifies: Optimal, Low Stock, or Critical"], PURPLE),
        ("4. Purchase Order Procurement", 540, 380, ["Automated PO creation for Swiss manufacturers", "Vendor quotation & lead-time confirmation", "Supplier shipping milestone tracking"], EMERALD),
        ("5. Quality Inspection & Inwarding", 980, 140, ["Chronometer accuracy rate verification", "Ultrasonic cleaning & cosmetic audit", "Stock ledger increment & customer notify"], ROSE),
        ("6. Inter-Warehouse Transfer", 980, 380, ["Rebalancing stock between regional vaults", "Tamper-evident transport container locks", "Chain-of-custody transfer confirmation"], WHITE),
    ]
    
    for title, x, y, items, col in steps:
        draw_card(draw, x, y, 340, 170, title, items=items, border=col)
        
    draw_arrow(draw, (270, 310), (270, 380))
    draw_arrow(draw, (440, 225), (540, 225))
    draw_arrow(draw, (710, 310), (710, 380))
    draw_arrow(draw, (880, 225), (980, 225))
    draw_arrow(draw, (980, 465), (880, 465))
    
    save_diagram(img, "flow_inventory_management")

# ==============================================================================
# 15. DELIVERY MANAGEMENT FLOWCHART
# ==============================================================================
def gen_diag_15():
    img, draw = draw_canvas(1400, 800, "Delivery Logistics & Handover Verification Workflow", 15)
    
    cards = [
        ("Stage 1: Dispatch Hub Assignment", 80, 140, ["Delivery Manager reviews pending orders", "Selects nearest verified courier rider", "Attaches tamper-evident vault seal code"], CYAN_ACCENT),
        ("Stage 2: Rider Mobile Acceptance", 80, 450, ["Rider receives notification on Android APK", "Reviews customer address & waypoint route", "Confirms package pickup at warehouse vault"], GOLD_ACCENT),
        ("Stage 3: Waypoint Milestone Transit", 540, 140, ["Continuous GPS telemetry streaming via Socket.IO", "Live marker positioning on customer Google Map", "Dynamic ETA calculation & traffic re-routing"], PURPLE),
        ("Stage 4: Geofence Arrival Alert", 540, 450, ["Rider arrives within 100m geofence radius", "Customer receives SMS/App 'Rider Arrived' alert", "Customer prepares confidential 6-digit OTP"], EMERALD),
        ("Stage 5: Secure Handover Verification", 980, 140, ["Rider inputs customer's 6-digit delivery OTP", "Backend cryptographically verifies OTP match", "Unlocks delivery completion confirmation"], ROSE),
        ("Stage 6: Proof of Delivery & Close", 980, 450, ["Rider uploads camera photo proof of package", "Customer receives digital signed receipt", "Order status transitions to DELIVERED"], WHITE),
    ]
    
    for title, x, y, items, col in cards:
        draw_card(draw, x, y, 360, 180, title, items=items, border=col)
        
    draw_arrow(draw, (260, 320), (260, 450))
    draw_arrow(draw, (440, 540), (540, 230))
    draw_arrow(draw, (720, 320), (720, 450))
    draw_arrow(draw, (900, 540), (980, 230))
    draw_arrow(draw, (1160, 320), (1160, 450))
    
    save_diagram(img, "flow_delivery_management")

# ==============================================================================
# 16. GPS TRACKING ARCHITECTURE
# ==============================================================================
def gen_diag_16():
    img, draw = draw_canvas(1400, 800, "Real-Time Telemetry & GPS Tracking Architecture", 16)
    
    draw_card(draw, 60, 140, 320, 520, "1. Rider Mobile Terminal", "Android Native APK / PWA", [
        "HTML5 Geolocation API / Android Native Bridge",
        "High-accuracy GPS chip sensor polling (5s)",
        "Kalman filter smoothing for GPS jitter",
        "Battery-efficient background telemetry",
        "Offline waypoint buffer during tunnel transit",
        "Encrypted WSS connection to Socket.IO hub"
    ], border=CYAN_ACCENT)
    
    draw_card(draw, 440, 140, 340, 520, "2. Real-Time Socket.IO Server", "Express.js WebSocket Hub", [
        "WebSocket connection state management",
        "Channel isolation: Room 'order_TRACK_ID'",
        "Authentication handshake via JWT token",
        "Payload: { lat, lng, speed, heading, accuracy }",
        "Persistence to MongoDB LocationHistory collection",
        "Broadcast event: 'riderLocationUpdate'"
    ], border=GOLD_ACCENT)
    
    draw_card(draw, 840, 140, 320, 520, "3. Customer Google Maps Interface", "React Frontend Visualizer", [
        "Google Maps JavaScript API v3 Canvas",
        "Smooth SVG courier motorcycle icon interpolation",
        "Dynamic polyline path rendering from origin",
        "Live ETA countdown calculation (Distance Matrix)",
        "Turn-by-turn waypoint milestone progress bar",
        "Delivery OTP security card overlay"
    ], border=EMERALD)
    
    draw_arrow(draw, (380, 300), (440, 300), label="WSS Telemetry")
    draw_arrow(draw, (780, 300), (840, 300), label="WSS Broadcast")
    
    save_diagram(img, "arch_gps_tracking")

# ==============================================================================
# 17. SOCKET.IO COMMUNICATION ARCHITECTURE
# ==============================================================================
def gen_diag_17():
    img, draw = draw_canvas(1400, 800, "Socket.IO Multi-Room Event Routing Topology", 17)
    
    # Center Hub
    draw_card(draw, 500, 150, 400, 480, "Socket.IO Server Engine", "Event Routing & Room Manager", [
        "Client Connection Handshake (Transport: WebSocket)",
        "JWT Identity Verification on Connection",
        "Room: 'order_<id>' -> Order live tracking",
        "Room: 'chat_<ticketId>' -> Support live chat",
        "Room: 'admin_broadcast' -> Inventory & system alerts",
        "Heartbeat Ping/Pong (25s interval, 20s timeout)",
        "Automatic reconnection & exponential backoff"
    ], border=GOLD_ACCENT)
    
    # 4 Clients around
    draw_card(draw, 80, 150, 320, 180, "Client 1: Customer PWA", "Event: joinOrderRoom", [
        "Listens: 'riderLocationUpdate'",
        "Listens: 'orderStatusChanged'",
        "Emits: 'chatCustomerMessage'"
    ], border=CYAN_ACCENT)
    
    draw_card(draw, 80, 450, 320, 180, "Client 2: Rider Mobile App", "Event: startDeliveryTrip", [
        "Emits: 'updateLocation' (Coords)",
        "Listens: 'orderCancelled'",
        "Emits: 'requestOtpVerify'"
    ], border=EMERALD)
    
    draw_card(draw, 1000, 150, 320, 180, "Client 3: Support Executive", "Event: joinSupportDesk", [
        "Listens: 'newTicketRaised'",
        "Emits: 'supportAgentReply'",
        "Listens: 'typingStatus'"
    ], border=PURPLE)
    
    draw_card(draw, 1000, 450, 320, 180, "Client 4: Store Admin Console", "Event: subscribeSystem", [
        "Listens: 'lowStockAlert'",
        "Listens: 'newOrderPlaced'",
        "Listens: 'paymentSuccess'"
    ], border=ROSE)
    
    draw_arrow(draw, (400, 240), (500, 240))
    draw_arrow(draw, (400, 540), (500, 540))
    draw_arrow(draw, (1000, 240), (900, 240))
    draw_arrow(draw, (1000, 540), (900, 540))
    
    save_diagram(img, "diagram_socketio")

# ==============================================================================
# 18. RBAC HIERARCHY DIAGRAM
# ==============================================================================
def gen_diag_18():
    img, draw = draw_canvas(1400, 800, "Role-Based Access Control (RBAC) Governance Matrix", 18)
    
    roles = [
        ("1. Super Admin", 500, 120, 400, 90, "Root Enterprise Authority: Release publishing, audit logs, role assignments, global database oversight", ROSE),
        ("2. Store Admin", 500, 250, 400, 90, "Commercial Operations: POS terminals, product catalog, customer CRM, coupons, financial reports", GOLD_ACCENT),
        ("3. Inventory Manager", 120, 390, 360, 110, "Vault Operations: Stock inwarding, bin registry, reorder triggers, valuation audits, supplier management", CYAN_ACCENT),
        ("4. Delivery Manager", 520, 390, 360, 110, "Logistics Operations: Courier dispatch, route planning, rider allocation, SLA delivery compliance", PURPLE),
        ("5. Customer Support", 920, 390, 360, 110, "Support Operations: Helpdesk ticketing, live chat, instant UPI refunds, VIP relationship management", EMERALD),
        ("6. Delivery Partner", 320, 560, 360, 100, "Field Operations: Mobile GPS navigation, order pickup, OTP verification, photo proof submission", WHITE),
        ("7. Customer / User", 720, 560, 360, 100, "End Consumer: Browse catalog, 3D customizer, shopping cart, Razorpay payment, live tracking", CYAN_ACCENT),
    ]
    
    for title, x, y, w, h, desc, col in roles:
        draw_card(draw, x, y, w, h, title, desc, border=col)
        
    draw_arrow(draw, (700, 210), (700, 250))
    draw_arrow(draw, (600, 340), (300, 390))
    draw_arrow(draw, (700, 340), (700, 390))
    draw_arrow(draw, (800, 340), (1100, 390))
    draw_arrow(draw, (700, 500), (500, 560))
    draw_arrow(draw, (700, 500), (900, 560))
    
    save_diagram(img, "rbac_hierarchy")

# ==============================================================================
# 19. CLOUD DEPLOYMENT & EDGE INFRASTRUCTURE
# ==============================================================================
def gen_diag_19():
    img, draw = draw_canvas(1400, 800, "Production Cloud Infrastructure & Edge Deployment Topology", 19)
    
    draw_card(draw, 60, 130, 340, 520, "Vercel Global Edge Network", "Frontend Hosting & Serverless", [
        "Vercel Edge CDN (300+ PoPs worldwide)",
        "Zero-downtime atomic deployments",
        "React Vite production static assets",
        "PWA Workbox service worker caching",
        "Serverless Node.js API runtime (/api/*)",
        "Strict HSTS TLS 1.3 automated SSL",
        "Custom domain: watchhub.in"
    ], border=CYAN_ACCENT)
    
    draw_card(draw, 450, 130, 360, 520, "Backend Application Services", "Containerized / Serverless Runtime", [
        "Express RESTful API routing",
        "Helmet Content-Security-Policy",
        "Socket.IO WebSocket persistent engine",
        "JWT token validation & cookie parser",
        "In-memory version release controller",
        "Razorpay webhook HMAC validator",
        "Health monitor: /api/health (200 OK)"
    ], border=GOLD_ACCENT)
    
    draw_card(draw, 860, 130, 360, 520, "Managed Cloud Data & Services", "Enterprise Persistence", [
        "MongoDB Atlas (AWS ap-south-1 Mumbai)",
        "Triple-replicated primary/secondary replica set",
        "Automated continuous cloud backups & snapshots",
        "Razorpay Production Payments API",
        "Resend Transactional Email SMTP/REST",
        "Google Maps Platform Directions API"
    ], border=EMERALD)
    
    draw_arrow(draw, (400, 320), (450, 320), label="Serverless Proxy")
    draw_arrow(draw, (810, 320), (860, 320), label="TLS 1.3 Driver")
    
    save_diagram(img, "cloud_deployment")

# ==============================================================================
# 20. CUSTOMER JOURNEY DIAGRAM
# ==============================================================================
def gen_diag_20():
    img, draw = draw_canvas(1400, 800, "Haute Horlogerie Customer Experience Journey", 20)
    
    steps = [
        ("Step 1: Discovery", 60, 150, ["Explore 60+ global watch brands", "High-res uncropped timepiece views", "Inside Watchmaking 9-stage film"], CYAN_ACCENT),
        ("Step 2: 3D Atelier Studio", 380, 150, ["Select case, dial color & bezel", "Real-time mechanical preview", "Add custom horology engraving"], GOLD_ACCENT),
        ("Step 3: Verification", 700, 150, ["One-click passwordless login", "6-digit confidential email OTP", "Secure JWT token issued"], PURPLE),
        ("Step 4: Secure Checkout", 1020, 150, ["Razorpay multi-tier gateway", "UPI, Card, NetBanking & EMI", "Cryptographic HMAC confirmation"], EMERALD),
        ("Step 5: Pick & Pack", 1020, 450, ["Vault barcode scan verification", "Luxury presentation box packing", "Tamper-evident security sealing"], ROSE),
        ("Step 6: Live GPS Tracking", 700, 450, ["Real-time rider location on map", "Milestone waypoint progress bar", "Dynamic traffic-aware ETA"], CYAN_ACCENT),
        ("Step 7: OTP Handover", 380, 450, ["Confidential OTP handover", "Rider photo verification upload", "Instant digital warranty card"], GOLD_ACCENT),
        ("Step 8: Post-Sale Atelier", 60, 450, ["Complimentary servicing registry", "VIP Support live chat concierge", "Exclusive horology event invites"], EMERALD),
    ]
    
    for title, x, y, items, col in steps:
        draw_card(draw, x, y, 280, 150, title, items=items, border=col)
        
    draw_arrow(draw, (340, 225), (380, 225))
    draw_arrow(draw, (660, 225), (700, 225))
    draw_arrow(draw, (980, 225), (1020, 225))
    draw_arrow(draw, (1160, 300), (1160, 450))
    draw_arrow(draw, (1020, 525), (980, 525))
    draw_arrow(draw, (700, 525), (660, 525))
    draw_arrow(draw, (380, 525), (340, 525))
    
    save_diagram(img, "customer_journey")

# ==============================================================================
# 21. RAZORPAY INTEGRATION & HMAC VERIFICATION
# ==============================================================================
def gen_diag_21():
    img, draw = draw_canvas(1400, 800, "Razorpay Integration Architecture & HMAC Verification Flow", 21)
    
    draw_card(draw, 80, 140, 340, 500, "1. Client Initiates Checkout", "React Frontend", [
        "User clicks 'Proceed to Payment'",
        "Sends cart items & total amount to API",
        "Awaits Razorpay Order ID from backend",
        "Opens Razorpay Checkout popup modal",
        "Customer selects UPI (GPay/PhonePe), Card, or NetBanking",
        "On success, captures payment_id, order_id, signature"
    ], border=CYAN_ACCENT)
    
    draw_card(draw, 480, 140, 360, 500, "2. Cryptographic Backend Verification", "Express Payment Controller", [
        "Backend receives verification payload",
        "Retrieves RAZORPAY_KEY_SECRET from .env",
        "Creates raw message string: 'order_id|payment_id'",
        "Computes HMAC-SHA256 signature using secret",
        "Compares generated digest with received signature",
        "Uses timingSafeEqual to prevent timing attacks",
        "Updates Order paymentStatus = 'PAID'"
    ], border=GOLD_ACCENT)
    
    draw_card(draw, 900, 140, 340, 500, "3. Razorpay Server Webhooks", "Asynchronous Event Validation", [
        "Razorpay fires 'payment.captured' webhook",
        "Validates X-Razorpay-Signature header",
        "Idempotent database transaction handling",
        "Dispatches automated receipt email via Resend",
        "Notifies Store Admin via WebSocket event",
        "Triggers warehouse fulfillment queue"
    ], border=EMERALD)
    
    draw_arrow(draw, (420, 320), (480, 320), label="Submit Signature")
    draw_arrow(draw, (840, 320), (900, 320), label="Webhook Match")
    
    save_diagram(img, "razorpay_integration")

# ==============================================================================
# 22. CI/CD WORKFLOW DIAGRAM
# ==============================================================================
def gen_diag_22():
    img, draw = draw_canvas(1400, 800, "Automated GitHub Actions CI/CD Deployment Pipeline", 22)
    
    stages = [
        ("1. Git Commit & Push", 80, 160, ["Developer commits code", "Pushes to 'main' branch", "Triggers GitHub webhook"], CYAN_ACCENT),
        ("2. Dependency Installation", 380, 160, ["Node.js 20 Ubuntu runner", "npm ci root & server packages", "npm ci client packages"], GOLD_ACCENT),
        ("3. Build & Audit Verification", 680, 160, ["Vite production client build", "Vite-plugin-pwa Workbox packaging", "Verify sw.js & manifest.webmanifest"], PURPLE),
        ("4. Vercel Prebuilt Deployment", 980, 160, ["vercel pull --environment=production", "vercel build --prod prebuilt assets", "Deploy to Vercel Global Edge"], EMERALD),
        ("5. Automated Health Checks", 980, 460, ["curl /api/health (Expect 200 OK)", "curl /api/app/version (Check v1.1.0)", "Verify MongoDB connectivity"], ROSE),
        ("6. PWA Version Broadcast", 680, 460, ["Service worker detects new hash", "PWA prompts 'Update Available'", "Prompt-based refresh without data loss"], CYAN_ACCENT),
        ("7. Production Live Status", 380, 460, ["Zero downtime transition", "Rollback snapshot preserved", "Super Admin release history logged"], GOLD_ACCENT),
    ]
    
    for title, x, y, items, col in stages:
        draw_card(draw, x, y, 260, 160, title, items=items, border=col)
        
    draw_arrow(draw, (340, 240), (380, 240))
    draw_arrow(draw, (640, 240), (680, 240))
    draw_arrow(draw, (940, 240), (980, 240))
    draw_arrow(draw, (1110, 320), (1110, 460))
    draw_arrow(draw, (980, 540), (940, 540))
    draw_arrow(draw, (680, 540), (640, 540))
    
    save_diagram(img, "cicd_workflow")

# ==============================================================================
# 23. DATA SECURITY & ENCRYPTION ARCHITECTURE
# ==============================================================================
def gen_diag_23():
    img, draw = draw_canvas(1400, 800, "Enterprise Multi-Layer Data Security & Threat Mitigation", 23)
    
    layers = [
        ("Layer 1: Network & Transport Security", 100, 130, ["TLS 1.3 Strict HTTPS encryption", "HSTS max-age=31536000 preload", "DDoS mitigation at Vercel Edge", "CORS Origin Whitelist validation"], CYAN_ACCENT),
        ("Layer 2: Application & API Security", 100, 280, ["Helmet security headers (X-Frame-Options, XSS)", "Express rate limiting (max 100 req / 15m)", "Input sanitization & parameter pollution guard", "Zero sensitive credential exposure in client"], GOLD_ACCENT),
        ("Layer 3: Authentication & Identity", 100, 430, ["Bcrypt password hashing (Salt Rounds: 10)", "Cryptographic 6-digit email OTP (5 min TTL)", "JWT Bearer tokens with signature validation", "HttpOnly secure SameSite cookies"], PURPLE),
        ("Layer 4: Database & Storage Vault", 100, 580, ["MongoDB Atlas IP Access Whitelist (0.0.0.0/0)", "AES-256 encryption at rest on Atlas disk", "TLS connection pooling with Mongoose", "Immutable audit logging for forensic trails"], EMERALD),
    ]
    
    for title, x, y, items, col in layers:
        draw_card(draw, x, y, 1200, 120, title, items=items, border=col)
        
    save_diagram(img, "data_security")

# ==============================================================================
# 24. OVERALL APPLICATION NAVIGATION FLOW
# ==============================================================================
def gen_diag_24():
    img, draw = draw_canvas(1400, 800, "Comprehensive Application Navigation & Routing Flow", 24)
    
    nodes = [
        ("PUBLIC STOREFRONT", 80, 120, 280, 130, ["/", "/products", "/categories", "/brands", "/product/:id", "/customize-watch", "/editorial-stories"], CYAN_ACCENT),
        ("CUSTOMER PORTAL", 80, 310, 280, 130, ["/cart", "/checkout", "/account", "/wishlist", "/track-parcel", "/warranty-service"], GOLD_ACCENT),
        ("AUTH SUBSYSTEM", 80, 500, 280, 130, ["/login", "/signup", "/email-verify", "/email-otp-login", "/forgot-password", "/reset-password"], PURPLE),
        ("SUPER ADMIN (Releases)", 540, 120, 320, 130, ["/super-admin/dashboard", "/super-admin/releases", "/admin/audit-logs", "/admin/users"], ROSE),
        ("STORE ADMIN (13 Modules)", 540, 310, 320, 130, ["/store-admin/dashboard", "/store-admin/pos", "/store-admin/products", "/store-admin/orders", "/store-admin/reports"], GOLD_ACCENT),
        ("INVENTORY MANAGER (11 Modules)", 540, 500, 320, 130, ["/inventory-manager/dashboard", "/inventory-manager/vault", "/inventory-manager/reorder", "/inventory-manager/audit"], CYAN_ACCENT),
        ("DELIVERY MANAGER (11 Modules)", 980, 120, 320, 130, ["/delivery-manager/dashboard", "/delivery-manager/dispatch", "/delivery-manager/routes", "/delivery-manager/riders"], PURPLE),
        ("DELIVERY PARTNER (4 Views)", 980, 310, 320, 130, ["/delivery-partner/dashboard", "/delivery-partner/navigation", "/delivery-partner/otp-verify", "/delivery-partner/history"], EMERALD),
        ("CUSTOMER SUPPORT (12 Modules)", 980, 500, 320, 130, ["/customer-support/dashboard", "/customer-support/tickets", "/customer-support/chat", "/customer-support/refunds"], WHITE),
    ]
    
    for title, x, y, w, h, items, col in nodes:
        draw_card(draw, x, y, w, h, title, items=items, border=col)
        
    draw_arrow(draw, (360, 185), (540, 185), label="Role Dispatch")
    draw_arrow(draw, (220, 250), (220, 310))
    draw_arrow(draw, (220, 440), (220, 500))
    draw_arrow(draw, (860, 185), (980, 185))
    draw_arrow(draw, (860, 375), (980, 375))
    draw_arrow(draw, (860, 565), (980, 565))
    
    save_diagram(img, "app_navigation")

# Generate all 24 diagrams
if __name__ == '__main__':
    print("Generating all 24 publication-grade technical diagrams...")
    gen_diag_1()
    gen_diag_2()
    gen_diag_3()
    gen_diag_4()
    gen_diag_5()
    gen_diag_6()
    gen_diag_7()
    gen_diag_8()
    gen_diag_9()
    gen_diag_10()
    gen_diag_11()
    gen_diag_12()
    gen_diag_13()
    gen_diag_14()
    gen_diag_15()
    gen_diag_16()
    gen_diag_17()
    gen_diag_18()
    gen_diag_19()
    gen_diag_20()
    gen_diag_21()
    gen_diag_22()
    gen_diag_23()
    gen_diag_24()
    print("All 24 diagrams generated successfully in docs/diagrams/!")
