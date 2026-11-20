#!/usr/bin/env python3
"""
Adds comprehensive academic modules, tables, and code listings to
report_chapters_part1.py and report_chapters_part2.py to reach 72-76 pages.
"""

def add_depth_to_part1():
    with open('docs/report_chapters_part1.py', 'r', encoding='utf-8') as f:
        code = f.read()

    # Chapter 6 expansions: Detailed module tables for each role
    ch6_tables = '''
    story.append(Paragraph("Table 6.2: Customer Storefront Functional Modules & Interaction Flow", h3))
    cust_mod_data = [
        [Paragraph("<b>Module Name</b>", tbl_hdr), Paragraph("<b>Route / State</b>", tbl_hdr), Paragraph("<b>Component Stack</b>", tbl_hdr), Paragraph("<b>Primary User Interaction & Real-Time Behavior</b>", tbl_hdr)],
        [Paragraph("Hero Discovery Showcase", tbl_cell), Paragraph("`/` (Landing)", tbl_cell), Paragraph("`HeroSection.tsx`, Lucide", tbl_cell), Paragraph("Cinematic video loop background, featured luxury collections, Call-to-Action to 3D Customizer", tbl_cell)],
        [Paragraph("Brand Collections Gallery", tbl_cell), Paragraph("`/#brands`", tbl_cell), Paragraph("`BrandGrid.tsx`, Swiper", tbl_cell), Paragraph("Logos and curated catalogs for Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier, TAG Heuer", tbl_cell)],
        [Paragraph("Uncropped Watch Catalog", tbl_cell), Paragraph("`/products`", tbl_cell), Paragraph("`ProductList.tsx`, FilterBar", tbl_cell), Paragraph("Multi-attribute faceted filtering by brand, case material, movement caliber, price range in INR", tbl_cell)],
        [Paragraph("3D Customizer Studio", tbl_cell), Paragraph("`/customize`", tbl_cell), Paragraph("`CustomizerStudio.tsx`, Canvas", tbl_cell), Paragraph("Interactive dial, bezel, strap and laser engraving customization with live price recalculation", tbl_cell)],
        [Paragraph("9-Stage Assembly Cinema", tbl_cell), Paragraph("`/#cinema`", tbl_cell), Paragraph("`HorologyCinema.tsx`, Video", tbl_cell), Paragraph("Interactive video player navigating all 9 mechanical watch assembly stages with technical cues", tbl_cell)],
        [Paragraph("Cart Drawer & Currency", tbl_cell), Paragraph("Global Modal", tbl_cell), Paragraph("`CartDrawer.tsx`, StateHook", tbl_cell), Paragraph("Itemized cart list, promotional coupons, real-time total amount with taxes in INR paise", tbl_cell)],
        [Paragraph("Multi-Factor OTP Portal", tbl_cell), Paragraph("`/login`, `/register`", tbl_cell), Paragraph("`AuthModal.tsx`, ResendHook", tbl_cell), Paragraph("Passwordless email login and registration with 6-digit OTP delivery and automatic 300s countdown", tbl_cell)],
        [Paragraph("Razorpay Checkout", tbl_cell), Paragraph("Checkout Flow", tbl_cell), Paragraph("`RazorpayModal.tsx`, Crypto", tbl_cell), Paragraph("Standard multi-tier checkout modal with UPI, NetBanking, Credit Cards; server-side HMAC verify", tbl_cell)],
        [Paragraph("Live Telemetry Tracker", tbl_cell), Paragraph("`/orders/:id/track`", tbl_cell), Paragraph("`OrderTracker.tsx`, Maps API", tbl_cell), Paragraph("Real-time courier vehicle marker moving on Google Maps via Socket.IO with distance & ETA", tbl_cell)],
    ]
    t_cust_mod = Table(cust_mod_data, colWidths=[90, 85, 120, 200])
    t_cust_mod.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), HEADER_BG),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT]),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
    ]))
    story.append(t_cust_mod)
    story.append(Spacer(1, 10))
    story.append(PageBreak())

    story.append(Paragraph("Table 6.3: 3D Bespoke Studio Customization Layers & Surcharge Matrix", h3))
    custom_layers_data = [
        [Paragraph("<b>Component Layer</b>", tbl_hdr), Paragraph("<b>Material / Finish Option</b>", tbl_hdr), Paragraph("<b>Visual Shader / SVG Filter</b>", tbl_hdr), Paragraph("<b>Price Adjustment (INR)</b>", tbl_hdr)],
        [Paragraph("Case Metal", tbl_cell), Paragraph("Oystersteel 904L", tbl_cell), Paragraph("Brushed metallic linear gradient (#CBD5E1 -> #64748B)", tbl_cell), Paragraph("Base Price (₹0)", tbl_cell)],
        [Paragraph("Case Metal", tbl_cell), Paragraph("18K Yellow Gold", tbl_cell), Paragraph("Specular golden metallic gradient (#E7B43F -> #B8860B)", tbl_cell), Paragraph("+ ₹4,50,000", tbl_cell)],
        [Paragraph("Case Metal", tbl_cell), Paragraph("18K Rose Gold", tbl_cell), Paragraph("Warm copper-rose reflection gradient (#E0A996 -> #A85A48)", tbl_cell), Paragraph("+ ₹4,80,000", tbl_cell)],
        [Paragraph("Case Metal", tbl_cell), Paragraph("950 Platinum", tbl_cell), Paragraph("High-polish mirror platinum sheen (#F1F5F9 -> #94A3B8)", tbl_cell), Paragraph("+ ₹8,50,000", tbl_cell)],
        [Paragraph("Dial Finish", tbl_cell), Paragraph("Sunburst Royal Blue", tbl_cell), Paragraph("Radial anisotropic sunburst refraction (#0A192F -> #00D9E8)", tbl_cell), Paragraph("+ ₹75,000", tbl_cell)],
        [Paragraph("Dial Finish", tbl_cell), Paragraph("Emerald Forest Green", tbl_cell), Paragraph("Deep saturated guilloche texture (#064E3B -> #10B981)", tbl_cell), Paragraph("+ ₹90,000", tbl_cell)],
        [Paragraph("Dial Finish", tbl_cell), Paragraph("Onyx Piano Black", tbl_cell), Paragraph("Glossy deep obsidian lacquer (#020617)", tbl_cell), Paragraph("Included (₹0)", tbl_cell)],
        [Paragraph("Bezel Insert", tbl_cell), Paragraph("Cerachrom Ceramic Black", tbl_cell), Paragraph("High-durability scratchproof ceramic luster with platinum graduations", tbl_cell), Paragraph("+ ₹1,20,000", tbl_cell)],
        [Paragraph("Caseback Engraving", tbl_cell), Paragraph("Custom Laser Text (24 chars)", tbl_cell), Paragraph("Vector path font rasterization onto 3D backplate canvas", tbl_cell), Paragraph("+ ₹25,000", tbl_cell)],
    ]
    t_cust_layer = Table(custom_layers_data, colWidths=[90, 115, 185, 105])
    t_cust_layer.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), HEADER_BG),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT]),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
    ]))
    story.append(t_cust_layer)
    story.append(Spacer(1, 10))
'''

    # Chapter 7 expansions: Third-party integration tables and code
    ch7_tables = '''
    story.append(Paragraph("Table 7.1: Third-Party Cloud Services Engineering Matrix", h3))
    cloud_svc_data = [
        [Paragraph("<b>Provider Name</b>", tbl_hdr), Paragraph("<b>Service Integration Scope</b>", tbl_hdr), Paragraph("<b>API Protocol / SDK</b>", tbl_hdr), Paragraph("<b>Failover & SLA Mechanism</b>", tbl_hdr)],
        [Paragraph("Resend Inc.", tbl_cell), Paragraph("Transactional Email & 6-Digit OTP Dispatch", tbl_cell), Paragraph("HTTPS REST API v1 (`api.resend.com`)", tbl_cell), Paragraph("Secondary webhook retry queue, 99.99% delivery SLA", tbl_cell)],
        [Paragraph("Razorpay", tbl_cell), Paragraph("Multi-Tier Payment Capture & Verification", tbl_cell), Paragraph("Razorpay Node.js SDK 2.9.4 + REST", tbl_cell), Paragraph("Server-side HMAC verification; idempotency keys", tbl_cell)],
        [Paragraph("Google Maps", tbl_cell), Paragraph("Geocoding, Static Maps & Dynamic Directions", tbl_cell), Paragraph("JavaScript Maps API + DirectionsService", tbl_cell), Paragraph("Client-side fallback tile cache; domain restriction", tbl_cell)],
        [Paragraph("Vercel Edge", tbl_cell), Paragraph("Edge Routing, Serverless Functions, Global CDN", tbl_cell), Paragraph("Vercel CLI + Build Engine", tbl_cell), Paragraph("Global Anycast DNS, sub-100ms cold starts", tbl_cell)],
        [Paragraph("MongoDB Atlas", tbl_cell), Paragraph("Managed Distributed Document Cluster", tbl_cell), Paragraph("MongoDB Wire Protocol (Mongoose 8.5.2)", tbl_cell), Paragraph("Triple-replica primary/secondary failover (<5s)", tbl_cell)],
    ]
    t_cloud_svc = Table(cloud_svc_data, colWidths=[85, 135, 140, 135])
    t_cloud_svc.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), HEADER_BG),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT]),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
    ]))
    story.append(t_cloud_svc)
    story.append(Spacer(1, 10))
    story.append(PageBreak())

    story.append(Paragraph("7.2.2 Production Cryptographic Verification Controller Implementation", h3))
    story.append(Paragraph(
        "Below is the exact production controller implementation for `POST /api/payment/verify` in `server/controllers/paymentController.js`, demonstrating strict timing-safe cryptographic verification:",
        body
    ))
    story.append(Paragraph(
        "const crypto = require('crypto');<br/>"
        "const Order = require('../models/Order');<br/>"
        "const Payment = require('../models/Payment');<br/><br/>"
        "exports.verifyRazorpayPayment = async (req, res) => {<br/>"
        "&nbsp;&nbsp;try {<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;const text = razorpay_order_id + '|' + razorpay_payment_id;<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;const expectedSignature = crypto<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.update(text)<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.digest('hex');<br/><br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;const isAuthentic = crypto.timingSafeEqual(<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Buffer.from(expectedSignature, 'utf-8'),<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Buffer.from(razorpay_signature, 'utf-8')<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;);<br/><br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;if (!isAuthentic) {<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return res.status(400).json({ success: false, message: 'Invalid payment signature. Potential tampering detected.' });<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;}<br/><br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;// Atomic order state update<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;const order = await Order.findOneAndUpdate(<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ razorpayOrderId: razorpay_order_id },<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ paymentStatus: 'Paid', orderStatus: 'Processing', paidAt: Date.now() },<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ new: true }<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;);<br/><br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;return res.status(200).json({ success: true, message: 'Payment verified and order booked.', order });<br/>"
        "&nbsp;&nbsp;} catch (err) {<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;return res.status(500).json({ success: false, error: err.message });<br/>"
        "&nbsp;&nbsp;}<br/>"
        "};",
        code_style
    ))
    story.append(Spacer(1, 10))
    story.append(PageBreak())
'''

    # Inject into Chapter 6
    if 'Table 6.1: Nine-Stage Mechanical Watchmaking Assembly Architecture' in code:
        parts = code.split('story.append(t_cinema)\n    story.append(PageBreak())')
        if len(parts) >= 2:
            code = parts[0] + 'story.append(t_cinema)\n    story.append(Spacer(1, 10))\n' + ch6_tables + parts[1]

    # Inject into Chapter 7
    if 'Figure 7.5: Real-Time GPS Tracking & Telemetry Architecture.' in code:
        parts = code.split('Paragraph("Figure 7.5: Real-Time GPS Tracking & Telemetry Architecture.", caption),\n            Spacer(1, 6)\n        ]))')
        if len(parts) >= 2:
            code = parts[0] + 'Paragraph("Figure 7.5: Real-Time GPS Tracking & Telemetry Architecture.", caption),\n            Spacer(1, 6)\n        ]))\n' + ch7_tables + parts[1]

    with open('docs/report_chapters_part1.py', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Part 1 deep enrichment complete.")

def add_depth_to_part2():
    with open('docs/report_chapters_part2.py', 'r', encoding='utf-8') as f:
        code = f.read()

    # Appendices expansions: Detailed REST API endpoints table (35+ endpoints)
    app_b_extended = '''
    story.append(Paragraph("Table App B.1: WatchHub Comprehensive REST API Endpoint Specification (Core Services)", h3))
    api_ext_data = [
        [Paragraph("<b>Method</b>", tbl_hdr), Paragraph("<b>Endpoint Route Path</b>", tbl_hdr), Paragraph("<b>RBAC Clearance</b>", tbl_hdr), Paragraph("<b>Request Payload</b>", tbl_hdr), Paragraph("<b>Success Status</b>", tbl_hdr)],
        [Paragraph("POST", tbl_cell), Paragraph("/api/auth/register", tbl_cell), Paragraph("Public", tbl_cell), Paragraph("{ name, email, mobile, password }", tbl_cell), Paragraph("201 Created (OTP sent)", tbl_cell)],
        [Paragraph("POST", tbl_cell), Paragraph("/api/auth/verify-otp", tbl_cell), Paragraph("Public", tbl_cell), Paragraph("{ email, otp }", tbl_cell), Paragraph("200 OK (JWT issued)", tbl_cell)],
        [Paragraph("POST", tbl_cell), Paragraph("/api/auth/login", tbl_cell), Paragraph("Public", tbl_cell), Paragraph("{ email, password }", tbl_cell), Paragraph("200 OK (Cookie set)", tbl_cell)],
        [Paragraph("POST", tbl_cell), Paragraph("/api/auth/request-otp", tbl_cell), Paragraph("Public", tbl_cell), Paragraph("{ email }", tbl_cell), Paragraph("200 OK (OTP sent)", tbl_cell)],
        [Paragraph("POST", tbl_cell), Paragraph("/api/auth/forgot-password", tbl_cell), Paragraph("Public", tbl_cell), Paragraph("{ email, newPassword, otp }", tbl_cell), Paragraph("200 OK (Password reset)", tbl_cell)],
        [Paragraph("GET", tbl_cell), Paragraph("/api/auth/me", tbl_cell), Paragraph("Authenticated", tbl_cell), Paragraph("None (Bearer Token in Header)", tbl_cell), Paragraph("200 OK (User profile)", tbl_cell)],
        [Paragraph("GET", tbl_cell), Paragraph("/api/products", tbl_cell), Paragraph("Public", tbl_cell), Paragraph("Query: ?brand=&minPrice=&maxPrice=&page=", tbl_cell), Paragraph("200 OK (Paginated models)", tbl_cell)],
        [Paragraph("GET", tbl_cell), Paragraph("/api/products/:id", tbl_cell), Paragraph("Public", tbl_cell), Paragraph("URL Param: id (ObjectId)", tbl_cell), Paragraph("200 OK (Full specs JSON)", tbl_cell)],
        [Paragraph("POST", tbl_cell), Paragraph("/api/products", tbl_cell), Paragraph("StoreAdmin / SuperAdmin", tbl_cell), Paragraph("{ sku, name, brand, price, stock, movement }", tbl_cell), Paragraph("201 Created", tbl_cell)],
        [Paragraph("PUT", tbl_cell), Paragraph("/api/products/:id", tbl_cell), Paragraph("StoreAdmin / SuperAdmin", tbl_cell), Paragraph("{ price, stock, reorderLevel }", tbl_cell), Paragraph("200 OK (Updated)", tbl_cell)],
        [Paragraph("DELETE", tbl_cell), Paragraph("/api/products/:id", tbl_cell), Paragraph("SuperAdmin Only", tbl_cell), Paragraph("URL Param: id", tbl_cell), Paragraph("200 OK (Deleted)", tbl_cell)],
        [Paragraph("POST", tbl_cell), Paragraph("/api/orders/create", tbl_cell), Paragraph("Customer", tbl_cell), Paragraph("{ items: [{ productId, quantity }], address }", tbl_cell), Paragraph("201 Created (Razorpay order)", tbl_cell)],
        [Paragraph("POST", tbl_cell), Paragraph("/api/payment/verify", tbl_cell), Paragraph("Customer", tbl_cell), Paragraph("{ razorpay_order_id, payment_id, signature }", tbl_cell), Paragraph("200 OK (Order Paid)", tbl_cell)],
        [Paragraph("GET", tbl_cell), Paragraph("/api/orders/my-orders", tbl_cell), Paragraph("Customer", tbl_cell), Paragraph("None", tbl_cell), Paragraph("200 OK (Order list)", tbl_cell)],
        [Paragraph("GET", tbl_cell), Paragraph("/api/orders/:id", tbl_cell), Paragraph("Customer / Staff", tbl_cell), Paragraph("URL Param: id", tbl_cell), Paragraph("200 OK (Order details)", tbl_cell)],
        [Paragraph("GET", tbl_cell), Paragraph("/api/inventory/vault", tbl_cell), Paragraph("InventoryMgr", tbl_cell), Paragraph("None", tbl_cell), Paragraph("200 OK (Bin inventory list)", tbl_cell)],
        [Paragraph("POST", tbl_cell), Paragraph("/api/inventory/allocate", tbl_cell), Paragraph("InventoryMgr", tbl_cell), Paragraph("{ orderId, vaultBinId, serialNumber }", tbl_cell), Paragraph("200 OK (Bin locked)", tbl_cell)],
        [Paragraph("POST", tbl_cell), Paragraph("/api/delivery/assign", tbl_cell), Paragraph("DeliveryMgr", tbl_cell), Paragraph("{ orderId, riderId }", tbl_cell), Paragraph("200 OK (Rider assigned)", tbl_cell)],
        [Paragraph("POST", tbl_cell), Paragraph("/api/delivery/verify-handover", tbl_cell), Paragraph("DeliveryPartner", tbl_cell), Paragraph("{ orderId, deliveryOtp, podPhotoBase64 }", tbl_cell), Paragraph("200 OK (Status: Delivered)", tbl_cell)],
        [Paragraph("GET", tbl_cell), Paragraph("/api/app/version", tbl_cell), Paragraph("Public", tbl_cell), Paragraph("None", tbl_cell), Paragraph("200 OK ({ version: 'v1.1.0' })", tbl_cell)],
    ]
    t_api_ext = Table(api_ext_data, colWidths=[55, 135, 105, 125, 75])
    t_api_ext.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), HEADER_BG),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT]),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
    ]))
    story.append(t_api_ext)
    story.append(PageBreak())
'''

    # Inject into Appendix B
    if 'Table App B: Complete REST API Endpoint Directory' in code or 'Appendix B: Complete REST API Endpoint Directory' in code:
        parts = code.split('story.append(t_appb)\n    story.append(PageBreak())')
        if len(parts) >= 2:
            code = parts[0] + 'story.append(t_appb)\n    story.append(Spacer(1, 10))\n' + app_b_extended + parts[1]

    with open('docs/report_chapters_part2.py', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Part 2 deep enrichment complete.")

if __name__ == '__main__':
    add_depth_to_part1()
    add_depth_to_part2()
