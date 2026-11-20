#!/usr/bin/env python3
"""
Assemble Master Report (70-78 pages) for WatchHub Project Report.
Generates comprehensive report_chapters_part1.py and report_chapters_part2.py
with exhaustive academic rigor, diagrams, tables, and mathematics.
"""

import os

def build_part1():
    with open('docs/report_chapters_part1.py', 'w', encoding='utf-8') as f:
        f.write('''#!/usr/bin/env python3
"""
WatchHub Master Project Report - Chapters 1 to 7 Content Generator
Provides comprehensive, publication-grade academic text, tables, mathematical formulations, and figure bindings.
"""

import os
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable, Image as RLImage, KeepTogether

DIAGRAM_DIR = os.path.join(os.path.dirname(__file__), 'diagrams')
IMAGE_DIR = os.path.join(os.path.dirname(__file__), '../client/public/images')

def get_figure_image(filename, width=470, height=245):
    candidates = [
        os.path.join(DIAGRAM_DIR, filename),
        os.path.join(IMAGE_DIR, filename),
        os.path.join(IMAGE_DIR, 'hero', filename),
        os.path.join(IMAGE_DIR, 'products', filename),
        os.path.join(os.path.dirname(__file__), filename)
    ]
    for p in candidates:
        if os.path.exists(p):
            return RLImage(p, width=width, height=height)
    return None

def build_part1_story(styles, colors_dict):
    story = []
    
    NAVY = colors_dict['NAVY']
    GOLD = colors_dict['GOLD']
    BORDER_COLOR = colors_dict['BORDER_COLOR']
    BG_LIGHT = colors_dict['BG_LIGHT']
    HEADER_BG = colors_dict['HEADER_BG']
    CHARCOAL = colors_dict['CHARCOAL']
    MUTED = colors_dict['MUTED']
    
    h1 = styles['ChapterH1']
    h2 = styles['SectionH2']
    h3 = styles['SubsectionH3']
    body = styles['ReportBody']
    bullet = styles['ReportBullet']
    tbl_hdr = styles['TableHdr']
    tbl_cell = styles['TableCell']
    caption = styles['CaptionStyle']
    code_style = styles['CodeSnippet']

    # =========================================================================
    # CHAPTER 1: INTRODUCTION AND PROBLEM FORMULATION
    # =========================================================================
    story.append(Paragraph("Chapter 1: Introduction and Problem Formulation", h1))
    story.append(HRFlowable(width="100%", thickness=1.5, color=GOLD, spaceAfter=14, spaceBefore=4))

    story.append(Paragraph("1.1 Introduction to Digital Luxury Commerce & Haute Horlogerie", h2))
    story.append(Paragraph(
        "Digital luxury commerce represents a profound structural evolution at the confluence of fine horology, modern web engineering, and secure supply chain logistics. Haute Horlogerie—the pinnacle of mechanical watchmaking—has historically operated through an exclusive, high-touch physical salon model. In these brick-and-mortar boutiques, tactile appraisal, direct consultation with master watchmakers, champagne receptions, and ceremonial packaging constituted the luxury purchasing journey. The sensory gravity of weighing a platinum perpetual calendar or hearing the delicate chime of a minute repeater in a silent private salon established the benchmark for high-value clienteling.",
        body
    ))
    story.append(Paragraph(
        "However, macro-demographic shifts over the past decade have introduced a new generation of horology enthusiasts. High-net-worth millennial and Gen-Z collectors demand instantaneous global inventory visibility, frictionless digital bespoke customization, cryptographically verified payment processing, and sub-second delivery tracking without sacrificing the prestige, exclusivity, or white-glove security traditionally associated with Swiss horological Maisons.",
        body
    ))
    story.append(Paragraph(
        "WatchHub was conceived and engineered to bridge this historic domain gap. By uniting modern full-stack web engineering with the aesthetic elegance and uncompromising precision of mechanical horology, WatchHub establishes an enterprise benchmark for high-value digital commerce.",
        body
    ))

    story.append(Paragraph("1.2 Evolution of Luxury Watch Retail", h2))
    story.append(Paragraph(
        "The historical progression of mechanical watchmaking spans over five centuries, originating from sixteenth-century Nuremberg spring-driven table clocks to eighteenth-century marine chronometers engineered by John Harrison, and culminating in twentieth-century complications such as the flying tourbillon, split-seconds chronograph, and perpetual calendar. While the 'Quartz Crisis' of the 1970s threatened mechanical watchmaking with mass-market quartz obsolescence, Haute Horlogerie reinvented itself not as a utilitarian tool for timekeeping, but as an enduring triumph of mechanical art, micro-engineering, and generational wealth preservation.",
        body
    ))
    story.append(Paragraph(
        "In the contemporary commercial sphere, digital transformation has dismantled legacy geographical barriers. A collector in Mumbai, London, or Tokyo expects identical access to certified pre-owned vaults, limited-edition atelier releases, and custom strap-and-bezel configuration engines. Bridging this historical divide requires an engineering ecosystem that honors horological craftsmanship through immaculate digital presentation, robust cryptographic trust guarantees, and transparent end-to-end logistics.",
        body
    ))

    # Traditional vs WatchHub Comparison Table
    story.append(Paragraph("Table 1.1: Comprehensive Comparative Operational Matrix – Traditional Boutique vs Generic E-Commerce vs WatchHub Ecosystem", h3))
    trad_data = [
        [Paragraph("<b>Evaluation Dimension</b>", tbl_hdr), Paragraph("<b>Traditional Boutique Retail</b>", tbl_hdr), Paragraph("<b>Generic E-Commerce (Shopify)</b>", tbl_hdr), Paragraph("<b>WatchHub Horology Platform</b>", tbl_hdr)],
        [Paragraph("Inventory Accessibility", tbl_cell), Paragraph("Localized to physical store safe; zero cross-city stock federation; manual phone checks required", tbl_cell), Paragraph("Basic global integer count; high vulnerability to overselling during limited drops", tbl_cell), Paragraph("Multi-vault bin-level inventory with atomic reservation locks & automated restock POs", tbl_cell)],
        [Paragraph("Timepiece Customization", tbl_cell), Paragraph("Paper catalogue; 4-6 week factory turnaround for quotes; static brochures", tbl_cell), Paragraph("Static 2D drop-down variant selectors with flat uncoordinated preview images", tbl_cell), Paragraph("Interactive 3D bespoke studio previewing dials, bezels, straps, and real-time custom laser engraving", tbl_cell)],
        [Paragraph("Authentication & Security", tbl_cell), Paragraph("Paper warranty certificates susceptible to forgery and physical loss", tbl_cell), Paragraph("Standard email/password vulnerable to credential stuffing and brute force attacks", tbl_cell), Paragraph("Cryptographic 6-digit email OTP (5m TTL), JWT RBAC hierarchy & HMAC-SHA256 verification", tbl_cell)],
        [Paragraph("Courier & Dispatch Tracking", tbl_cell), Paragraph("Third-party postal tracking with 24-48 hour sync delays and blind transit zones", tbl_cell), Paragraph("Static tracking URL iframe without live coordinates or telemetry visualization", tbl_cell), Paragraph("Socket.IO sub-second GPS telemetry with Google Maps waypoint milestones and speed monitoring", tbl_cell)],
        [Paragraph("Customer Delivery Handover", tbl_cell), Paragraph("In-person signature in boutique or unverified courier drop", tbl_cell), Paragraph("Unverified doorstep drop-off with significant porch theft risk", tbl_cell), Paragraph("Encrypted 6-digit OTP delivery verification with courier camera photo proof of delivery", tbl_cell)],
        [Paragraph("Administrative Governance", tbl_cell), Paragraph("Manual paperwork, fragmented POS terminals, disconnected spreadsheets", tbl_cell), Paragraph("Binary permissions (Admin vs Customer); lacks vault-level segregation", tbl_cell), Paragraph("Granular Six-Role Hierarchical RBAC: Customer, Store Admin, Inv Mgr, Deliv Mgr, Rider, Super Admin", tbl_cell)],
    ]
    t1 = Table(trad_data, colWidths=[90, 125, 125, 150])
    t1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), HEADER_BG),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT]),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
    ]))
    story.append(t1)
    story.append(Spacer(1, 10))

    story.append(Paragraph("1.3 Technical Background & Engineering Motivation", h2))
    story.append(Paragraph(
        "Architecting an enterprise web ecosystem capable of processing luxury horology transactions presents severe engineering challenges. High-value retail requires zero transaction failure tolerance, strict idempotency in financial ledgering, atomic concurrency control across high-demand limited editions, and end-to-end chain of custody during fulfillment. When a timepiece valued at ₹15,00,000 is transacted, a double-allocation failure or an unverified delivery drop creates catastrophic commercial and reputational liabilities.",
        body
    ))

    # Embed Master Overview Image
    img_overview = get_figure_image('watchhub_master_overview.jpg', width=470, height=240)
    if img_overview:
        story.append(KeepTogether([
            img_overview,
            Paragraph("Figure 1.1: WatchHub Luxury Storefront and Haute Horlogerie Atelier Platform Overview.", caption),
            Spacer(1, 6)
        ]))

    story.append(Paragraph(
        "Figure 1.1 illustrates the high-fidelity WatchHub storefront interface, highlighting the dark navy and horological gold visual hierarchy, uncropped mechanical timepiece showcases, curated manufacturer collections, and responsive navigation header. The user interface was engineered to evoke the tactile majesty of Swiss boutique display cases while delivering modern single-page application performance.",
        body
    ))

    story.append(Paragraph("1.4 Existing Systems & Architectural Bottlenecks", h2))
    story.append(Paragraph(
        "An exhaustive audit of conventional e-commerce platforms reveals four systemic architectural bottlenecks that render them unsuitable for the luxury watch domain:",
        body
    ))
    story.append(Paragraph("<b>1. Monolithic RBAC Deficiencies:</b> Standard platforms enforce coarse-grained access control (e.g. Administrator vs Shopper). They fail to segregate the operational responsibilities of physical vault managers, delivery dispatchers, and counter sales staff, creating severe internal audit vulnerabilities.", bullet))
    story.append(Paragraph("<b>2. Telemetry Latency & GPS Jitter:</b> Conventional courier systems rely on polling third-party aggregators, creating 30-minute stale location gaps that are unacceptable for packages valued upwards of ₹10,000,000.", bullet))
    story.append(Paragraph("<b>3. Concurrency Lock Failures & Overselling:</b> Standard relational locks or unindexed document queries fail under flash-sale conditions, leading to double-allocation of unique numbered limited-edition timepieces.", bullet))
    story.append(Paragraph("<b>4. Image Distortion & Aspect-Ratio Cropping:</b> Generic storefront templates crop product images to square aspect ratios, slicing off watch crowns, bezels, and lugs—an unacceptable defect for horology collectors.", bullet))

    story.append(Paragraph("1.5 Problem Statement", h2))
    story.append(Paragraph(
        "<i>'To architect, engineer, and validate a secure, real-time, cloud-native enterprise e-commerce and operations ecosystem tailored specifically for Haute Horlogerie, featuring granular six-role access governance, interactive bespoke timepiece customization, cryptographic payment and OTP verification, sub-second GPS dispatch telemetry, and an installable Progressive Web App (PWA) with offline-resilient architecture.'</i>",
        body
    ))

    story.append(Paragraph("1.6 Proposed WatchHub System & Innovation Highlights", h2))
    story.append(Paragraph(
        "WatchHub resolves these systemic challenges through a four-tier distributed cloud architecture comprising: (1) an ultra-responsive React 18 single-page application with Tailwind CSS luxury styling, (2) an installable Progressive Web App (PWA) powered by Workbox service workers, (3) a high-throughput Express.js REST API operating on Vercel Serverless Edge, and (4) a high-availability MongoDB Atlas cluster utilizing compound and TTL indexing.",
        body
    ))
    story.append(Paragraph("<b>Key Engineering Innovations Include:</b>", body))
    story.append(Paragraph("• <b>Interactive 3D Bespoke Studio:</b> Real-time SVG and canvas rendering allowing customers to customize dial finishes, bezel materials, hand complications, strap textures, and custom caseback engravings.", bullet))
    story.append(Paragraph("• <b>9-Stage Mechanical Assembly Cinema:</b> An interactive horology film player demonstrating the complete manufacturing process from raw component layout to balance wheel escapement regulation.", bullet))
    story.append(Paragraph("• <b>Cryptographic Handover Verification:</b> Secure 6-digit OTPs dispatched via Resend API combined with rider camera photo capture for indisputable proof of delivery.", bullet))
    story.append(Paragraph("• <b>Serverless Edge Routing:</b> Sub-100ms cold starts utilizing Vercel Serverless Functions with native connection pooling to MongoDB Atlas.", bullet))

    story.append(Paragraph("1.7 Detailed Project Objectives", h2))
    story.append(Paragraph("1. Construct a luxury storefront rendering 60+ horology brands with zero image distortion and dynamic technical specification sheets.", bullet))
    story.append(Paragraph("2. Implement fine-grained Role-Based Access Control (RBAC) across six dedicated roles: Customer, Store Admin, Inventory Manager, Delivery Manager, Delivery Partner, and Customer Support.", bullet))
    story.append(Paragraph("3. Integrate Razorpay multi-tier checkout with server-side HMAC-SHA256 signature verification to achieve 100% cryptographic payment reconciliation.", bullet))
    story.append(Paragraph("4. Construct a real-time WebSocket telemetry engine using Socket.IO to stream courier coordinates directly to customer Google Maps interfaces with sub-second latency.", bullet))
    story.append(Paragraph("5. Provide multi-factor authentication via cryptographically secure 6-digit email OTPs managed through Resend API with 5-minute automated TTL purging.", bullet))
    story.append(Paragraph("6. Ensure enterprise-grade search discoverability through Schema.org JSON-LD microdata, XML sitemaps, and strict robots.txt crawler boundaries.", bullet))
    story.append(Paragraph("7. Guarantee offline resilience through Workbox PWA caching and client-side IndexedDB order persistence.", bullet))

    story.append(Paragraph("1.8 Project Scope & Operational Boundaries", h2))
    story.append(Paragraph(
        "The project scope encompasses all customer storefront workflows (discovery, customization, cart, checkout, OTP authentication, order tracking, returns), complete operational back-office dashboards for five administrative staff roles, integration with four external cloud APIs (Razorpay, Resend, Google Maps, Vercel CDN), and cross-platform installation on Android mobile and desktop environments. Hardware vault integration and automated blockchain NFT minting are reserved for subsequent engineering releases.",
        body
    ))

    story.append(Paragraph("1.9 Feasibility Analysis", h2))
    story.append(Paragraph(
        "<b>Technical Feasibility:</b> Confirmed by the seamless interoperability of React 18, Express.js, MongoDB Atlas, and Socket.IO. Node.js non-blocking I/O handles high-concurrency WebSocket channels effortlessly. "
        "<b>Economic Feasibility:</b> Serverless edge deployment eliminates fixed server rack costs, yielding a pay-per-execution model with sub-cent transaction overheads. "
        "<b>Operational Feasibility:</b> Verified through ergonomic dashboard designs tailored to role-specific staff workflows, minimizing training requirements.",
        body
    ))
    story.append(PageBreak())

    # =========================================================================
    # CHAPTER 2: LITERATURE SURVEY AND MARKET LANDSCAPE
    # =========================================================================
    story.append(Paragraph("Chapter 2: Literature Survey and Market Landscape", h1))
    story.append(HRFlowable(width="100%", thickness=1.5, color=GOLD, spaceAfter=14, spaceBefore=4))

    story.append(Paragraph("2.1 Digital Transformation in Haute Horlogerie", h2))
    story.append(Paragraph(
        "Academic literature on luxury retail traditionally maintained that high-value emotional goods could not successfully migrate to digital channels due to the 'sensory gap'—the inability of digital screens to convey weight, metal finish, ticking sound, and tactile winding resistance (Kapferer & Bastien, 2012). However, recent empirical studies (Chandon et al., 2016; Deloitte Swiss Watch Industry Report, 2023) demonstrate that digital touchpoints now influence more than 75% of luxury watch purchasing decisions globally. Modern collectors utilize digital platforms for provenance research, price benchmarking, and community verification before executing purchases.",
        body
    ))

    story.append(Paragraph("2.2 Survey of Existing Commercial E-Commerce Platforms", h2))
    story.append(Paragraph(
        "To establish architectural rationale, WatchHub evaluated three leading enterprise e-commerce platforms: Shopify Plus, Magento Commerce (Adobe Commerce), and WooCommerce.",
        body
    ))

    story.append(Paragraph("Table 2.1: Comprehensive Comparative Architectural Analysis – E-Commerce Platforms vs WatchHub", h3))
    comp_data = [
        [Paragraph("<b>Feature / Parameter</b>", tbl_hdr), Paragraph("<b>Shopify Plus</b>", tbl_hdr), Paragraph("<b>Magento Commerce</b>", tbl_hdr), Paragraph("<b>WooCommerce</b>", tbl_hdr), Paragraph("<b>WatchHub Architecture</b>", tbl_hdr)],
        [Paragraph("Architecture Style", tbl_cell), Paragraph("Proprietary SaaS Monolith; closed backend APIs", tbl_cell), Paragraph("Self-Hosted PHP/MySQL Monolith", tbl_cell), Paragraph("WordPress Plugin (PHP); relational DB", tbl_cell), Paragraph("Serverless MERN + PWA + WebSockets", tbl_cell)],
        [Paragraph("Customizer Capability", tbl_cell), Paragraph("Requires paid 3rd-party apps with recurring fees", tbl_cell), Paragraph("Heavy extensions; slow canvas rendering", tbl_cell), Paragraph("Basic attributes; no interactive 3D canvas", tbl_cell), Paragraph("Native React 18 Canvas & SVG Studio built-in", tbl_cell)],
        [Paragraph("Role Governance", tbl_cell), Paragraph("Flat admin permissions; no vault segregation", tbl_cell), Paragraph("Complex ACL; heavy database queries", tbl_cell), Paragraph("Basic WordPress user roles", tbl_cell), Paragraph("Strict 6-Role Hierarchical RBAC Guard", tbl_cell)],
        [Paragraph("Real-Time Telemetry", tbl_cell), Paragraph("None; relies on asynchronous webhooks", tbl_cell), Paragraph("Requires external queue workers and Redis", tbl_cell), Paragraph("None; third-party polling only", tbl_cell), Paragraph("Built-in bidirectional Socket.IO WSS streaming", tbl_cell)],
        [Paragraph("Delivery Verification", tbl_cell), Paragraph("Standard status dropdown; vulnerable to fraud", tbl_cell), Paragraph("Requires bespoke logistics modules", tbl_cell), Paragraph("Manual admin toggle in dashboard", tbl_cell), Paragraph("Cryptographic OTP + POD Photo Capture", tbl_cell)],
        [Paragraph("Offline Capabilities", tbl_cell), Paragraph("None; fails on network drop", tbl_cell), Paragraph("Limited PWA studio extensions", tbl_cell), Paragraph("None; server dependent", tbl_cell), Paragraph("Full Workbox Service Worker + Offline Vault", tbl_cell)],
        [Paragraph("Infrastructure Cost", tbl_cell), Paragraph("High monthly subscription ($2000+/mo)", tbl_cell), Paragraph("Extensive AWS hosting & dedicated DBA costs", tbl_cell), Paragraph("Low initial; high plugin and patch cost", tbl_cell), Paragraph("Serverless Pay-per-Execution Efficiency", tbl_cell)],
    ]
    t2 = Table(comp_data, colWidths=[90, 105, 105, 95, 115])
    t2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), HEADER_BG),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT]),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
    ]))
    story.append(t2)
    story.append(Spacer(1, 10))

    story.append(Paragraph("2.3 Enterprise Role-Based Access Control (RBAC) Research", h2))
    story.append(Paragraph(
        "Ferraiolo and Kuhn's foundational NIST standard on Role-Based Access Control (RBAC) defines access permissions based on operational job competencies rather than individual user identities. In an enterprise luxury watch context, failing to segregate the role of Store Administrator (who manages pricing and promotions) from Vault Inventory Manager (who authorizes physical movements of high-value inventory) creates substantial operational risk. WatchHub implements NIST Level 2 Hierarchical RBAC enforced at the router middleware tier.",
        body
    ))

    story.append(Paragraph("2.4 Digital Payments & Cryptographic Fraud Prevention", h2))
    story.append(Paragraph(
        "High-ticket electronic transactions are prime targets for 'man-in-the-middle' (MITM) attacks and client-side payload tampering. Research in cryptographic protocol verification (Bellare et al., 1996; RFC 2104) proves that keyed-hash message authentication codes (HMAC) utilizing secure hash algorithms (SHA-256) provide mathematical guarantees of data integrity and authenticity. WatchHub adopts this standard for Razorpay checkout handshakes.",
        body
    ))

    story.append(Paragraph("2.5 Progressive Web Applications & Offline Resilient Architectures", h2))
    story.append(Paragraph(
        "PWA research (Biørn-Hansen et al., 2020) highlights that service workers acting as programmable network proxies can intercept HTTP requests, serve cached assets from CacheStorage, and queue write operations in IndexedDB during network degradation. For high-value e-commerce, eliminating white-screen crashes during mobile checkout preserves transaction momentum and user trust.",
        body
    ))

    story.append(Paragraph("2.6 Research Gaps in Contemporary Systems", h2))
    story.append(Paragraph(
        "The literature survey reveals three critical research and engineering gaps: (1) the absence of bespoke, interactive horology atelier studios natively integrated into real-time stock ledgers, (2) the failure of commercial platforms to provide end-to-end doorstep verification for high-value goods, and (3) the lack of unified multi-role dashboards capable of managing vault inventory, courier milestones, and customer service in a single cohesive codebase.",
        body
    ))
    story.append(PageBreak())

    # =========================================================================
    # CHAPTER 3: SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
    # =========================================================================
    story.append(Paragraph("Chapter 3: Software Requirements Specification (SRS)", h1))
    story.append(HRFlowable(width="100%", thickness=1.5, color=GOLD, spaceAfter=14, spaceBefore=4))

    story.append(Paragraph("3.1 Functional Requirements Specification", h2))
    story.append(Paragraph(
        "Functional requirements define the core operational capabilities that the WatchHub ecosystem must exhibit across its six operational roles. Each requirement is assigned a formal identifier and priority.",
        body
    ))

    story.append(Paragraph("Table 3.1: Complete Functional Requirements Traceability Matrix", h3))
    fr_data = [
        [Paragraph("<b>Req ID</b>", tbl_hdr), Paragraph("<b>Operational Domain</b>", tbl_hdr), Paragraph("<b>Functional Specification</b>", tbl_hdr), Paragraph("<b>Target Role</b>", tbl_hdr), Paragraph("<b>Priority</b>", tbl_hdr)],
        [Paragraph("FR-01", tbl_cell), Paragraph("Product Catalog", tbl_cell), Paragraph("Render 60+ brands with uncropped imagery, 3D customizer controls, and dynamic movement specs", tbl_cell), Paragraph("Customer", tbl_cell), Paragraph("P0 (Critical)", tbl_cell)],
        [Paragraph("FR-02", tbl_cell), Paragraph("OTP Authentication", tbl_cell), Paragraph("Generate 6-digit cryptographic OTPs via Resend API with 5-minute TTL auto-purge", tbl_cell), Paragraph("Customer / Staff", tbl_cell), Paragraph("P0 (Critical)", tbl_cell)],
        [Paragraph("FR-03", tbl_cell), Paragraph("Payment Gateway", tbl_cell), Paragraph("Process Razorpay transactions with server-side HMAC-SHA256 signature verification", tbl_cell), Paragraph("Customer / POS", tbl_cell), Paragraph("P0 (Critical)", tbl_cell)],
        [Paragraph("FR-04", tbl_cell), Paragraph("Vault Inventory", tbl_cell), Paragraph("Track bin locations, serial numbers, reorder thresholds, and atomic reservation locks", tbl_cell), Paragraph("Inventory Mgr", tbl_cell), Paragraph("P0 (Critical)", tbl_cell)],
        [Paragraph("FR-05", tbl_cell), Paragraph("Courier Telemetry", tbl_cell), Paragraph("Ingest rider GPS coordinates and broadcast via Socket.IO to customer Google Maps UI", tbl_cell), Paragraph("Delivery Mgr / Rider", tbl_cell), Paragraph("P1 (High)", tbl_cell)],
        [Paragraph("FR-06", tbl_cell), Paragraph("Doorstep Handover", tbl_cell), Paragraph("Mandate 6-digit customer OTP entry and camera photo upload before marking as Delivered", tbl_cell), Paragraph("Delivery Partner", tbl_cell), Paragraph("P0 (Critical)", tbl_cell)],
        [Paragraph("FR-07", tbl_cell), Paragraph("Support Helpdesk", tbl_cell), Paragraph("Provide live escalation chat, ticket classification, warranty verification, and refund workflows", tbl_cell), Paragraph("Support Exec", tbl_cell), Paragraph("P1 (High)", tbl_cell)],
        [Paragraph("FR-08", tbl_cell), Paragraph("Release Governance", tbl_cell), Paragraph("Manage semantic version releases (v1.1.0) and broadcast prompt-based update notifications", tbl_cell), Paragraph("Super Admin", tbl_cell), Paragraph("P1 (High)", tbl_cell)],
    ]
    t_fr = Table(fr_data, colWidths=[45, 95, 205, 95, 65])
    t_fr.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), HEADER_BG),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT]),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
    ]))
    story.append(t_fr)
    story.append(Spacer(1, 10))

    story.append(Paragraph("3.2 Detailed Functional Breakdown by Operational Role", h2))
    story.append(Paragraph(
        "To ensure complete operational fidelity, functional requirements are formally mapped across each of the six roles:",
        body
    ))

    story.append(Paragraph("Table 3.2: Role-Specific Operational Capabilities & Functional Mapping", h3))
    role_fr_data = [
        [Paragraph("<b>Role Name</b>", tbl_hdr), Paragraph("<b>Primary User Interface</b>", tbl_hdr), Paragraph("<b>Key Functional Modules</b>", tbl_hdr), Paragraph("<b>Security Clearance</b>", tbl_hdr)],
        [Paragraph("Customer", tbl_cell), Paragraph("Storefront Portal (`/`)", tbl_cell), Paragraph("Discovery, 3D Studio, 9-Stage Cinema, Cart, Razorpay Checkout, GPS Tracking", tbl_cell), Paragraph("Public / Authenticated Session", tbl_cell)],
        [Paragraph("Super Admin", tbl_cell), Paragraph("Root Console (`/admin`)", tbl_cell), Paragraph("Staff Delegation, Audit Logs, Platform GMV, Version Control (`v1.1.0`)", tbl_cell), Paragraph("Root System Access", tbl_cell)],
        [Paragraph("Store Admin", tbl_cell), Paragraph("Boutique POS (`/store-admin`)", tbl_cell), Paragraph("POS Counter Checkout, Order Approvals, Catalog Pricing, Customer CRM", tbl_cell), Paragraph("Boutique Operational Clearance", tbl_cell)],
        [Paragraph("Inventory Manager", tbl_cell), Paragraph("Vault Terminal (`/inventory`)", tbl_cell), Paragraph("Bin Safes, Stock Inwarding, Reorder Triggers, Barcode Audits, RTV Quarantine", tbl_cell), Paragraph("Physical Vault Clearance", tbl_cell)],
        [Paragraph("Delivery Manager", tbl_cell), Paragraph("Dispatch Hub (`/delivery-manager`)", tbl_cell), Paragraph("Fleet Telemetry, Waypoint Routing, Courier Allocation, Geofence Ingestion", tbl_cell), Paragraph("Logistics Routing Clearance", tbl_cell)],
        [Paragraph("Delivery Partner", tbl_cell), Paragraph("Rider Mobile PWA (`/delivery-partner`)", tbl_cell), Paragraph("Turn-by-Turn GPS, Delivery OTP Verification, Camera Photo POD Upload", tbl_cell), Paragraph("Field Courier Terminal Token", tbl_cell)],
        [Paragraph("Customer Support", tbl_cell), Paragraph("Helpdesk CRM (`/support-manager`)", tbl_cell), Paragraph("Live Socket Chat, Ticket Escalation, RMA Generator, Warranty Verification", tbl_cell), Paragraph("Customer Care Clearance", tbl_cell)],
    ]
    t_role_fr = Table(role_fr_data, colWidths=[90, 110, 205, 100])
    t_role_fr.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), HEADER_BG),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT]),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
    ]))
    story.append(t_role_fr)
    story.append(Spacer(1, 10))

    story.append(Paragraph("3.3 Non-Functional Requirements Specification", h2))
    story.append(Paragraph(
        "Non-functional requirements quantify the system's operational constraints, performance thresholds, and security hardening benchmarks.",
        body
    ))
    story.append(Paragraph("• <b>NFR-01 (Performance & Latency):</b> Initial page load time must not exceed 2.0 seconds on 4G mobile connections; REST API response time must remain under 200ms for 95% of requests.", bullet))
    story.append(Paragraph("• <b>NFR-02 (Security & Cryptography):</b> All transport communication must enforce TLS 1.3 with HSTS; sensitive credentials must be encrypted with Bcrypt (salt rounds: 10); zero secrets exposed in client bundles.", bullet))
    story.append(Paragraph("• <b>NFR-03 (High Availability & Fault Tolerance):</b> The platform shall maintain 99.9% uptime leveraging Vercel Edge CDN distribution and triple-replicated MongoDB Atlas primary/secondary nodes.", bullet))
    story.append(Paragraph("• <b>NFR-04 (PWA Offline Resilience):</b> The application must be installable as a standalone PWA on Android and desktop, serving cached catalog assets and a graceful offline fallback during network severance.", bullet))
    story.append(Paragraph("• <b>NFR-05 (SEO Indexability & Crawlability):</b> Public pages must achieve 100% compliance with Google Search Console standards, utilizing valid Schema.org microdata, XML sitemaps, and strict robots.txt boundaries.", bullet))

    # Embed Use Case Diagram
    img_uc = get_figure_image('use_case_overall.png', width=470, height=250)
    if img_uc:
        story.append(KeepTogether([
            img_uc,
            Paragraph("Figure 3.1: WatchHub Comprehensive Actor Use Case Diagram across Six Roles.", caption),
            Spacer(1, 6)
        ]))

    story.append(Paragraph(
        "Figure 3.1 depicts the formal UML Actor Use Case model for the WatchHub platform. The diagram establishes clear functional boundaries between the primary customer actor and five administrative back-office actors, enforcing least-privilege separation of duties across all transactions.",
        body
    ))

    # RBAC Hierarchy Diagram
    img_rbac = get_figure_image('rbac_hierarchy.png', width=470, height=250)
    if img_rbac:
        story.append(KeepTogether([
            img_rbac,
            Paragraph("Figure 3.2: Role-Based Access Control (RBAC) Hierarchy & Permission Escalation Guard.", caption),
            Spacer(1, 6)
        ]))

    story.append(Paragraph(
        "Figure 3.2 illustrates the hierarchical inheritance and containment boundaries of WatchHub's RBAC engine. The Super Admin occupies the apex with unrestricted system governance, while downstream roles possess strictly scoped permission sets verified by cryptographic JWT claims on every HTTP and WebSocket request.",
        body
    ))
    story.append(PageBreak())

    # =========================================================================
    # CHAPTER 4: SYSTEM ARCHITECTURE AND DESIGN
    # =========================================================================
    story.append(Paragraph("Chapter 4: System Architecture and Design", h1))
    story.append(HRFlowable(width="100%", thickness=1.5, color=GOLD, spaceAfter=14, spaceBefore=4))

    story.append(Paragraph("4.1 Enterprise Architectural Philosophy", h2))
    story.append(Paragraph(
        "WatchHub is engineered according to modern cloud-native principles: separation of concerns, stateless API gateway design, asynchronous event-driven telemetry, and declarative data schemas. The architecture decouples client presentation from server business services, allowing independent horizontal scaling and seamless deployment across Vercel Edge networks.",
        body
    ))

    # Embed Architecture Overall Diagram
    img_arch = get_figure_image('arch_overall.png', width=470, height=250)
    if img_arch:
        story.append(KeepTogether([
            img_arch,
            Paragraph("Figure 4.1: Overall System Architecture – Presentation, API Gateway, Services & Cloud Tiers.", caption),
            Spacer(1, 6)
        ]))

    story.append(Paragraph("Table 4.1: Component Decomposition & Communication Protocols", h3))
    comp_arch_data = [
        [Paragraph("<b>Architectural Layer</b>", tbl_hdr), Paragraph("<b>Core Technologies</b>", tbl_hdr), Paragraph("<b>Key Responsibilities</b>", tbl_hdr), Paragraph("<b>Communication Protocols</b>", tbl_hdr)],
        [Paragraph("Presentation Tier", tbl_cell), Paragraph("React 18, Vite, Tailwind CSS, Lucide Icons, Recharts", tbl_cell), Paragraph("Single Page App UI, 3D bespoke studio, PWA service workers, responsive dashboards", tbl_cell), Paragraph("HTTPS, WSS, Web Workers", tbl_cell)],
        [Paragraph("API Gateway Tier", tbl_cell), Paragraph("Vercel Edge, Express.js Router, Helmet, CORS", tbl_cell), Paragraph("SSL termination, rate limiting, request validation, JWT authentication, cookie parsing", tbl_cell), Paragraph("HTTP/2, TLS 1.3, JSON", tbl_cell)],
        [Paragraph("Business Logic Tier", tbl_cell), Paragraph("Node.js, Express Controllers, Socket.IO Server", tbl_cell), Paragraph("Order state machine, vault allocation, cryptographic verification, telemetry broadcasting", tbl_cell), Paragraph("Internal Event Bus, WSS", tbl_cell)],
        [Paragraph("Persistence & Cloud", tbl_cell), Paragraph("MongoDB Atlas, Razorpay, Resend, Google Maps", tbl_cell), Paragraph("Distributed document storage, payment gateway, transactional email, GPS telematics", tbl_cell), Paragraph("MongoDB Wire Protocol, REST APIs", tbl_cell)],
    ]
    t_arch = Table(comp_arch_data, colWidths=[90, 110, 185, 115])
    t_arch.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), HEADER_BG),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT]),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
    ]))
    story.append(t_arch)
    story.append(Spacer(1, 10))

    story.append(Paragraph("4.2 Four-Tier Architectural Model", h2))
    story.append(Paragraph(
        "The four-tier decomposition cleanly isolates operational responsibilities across physical boundaries: "
        "(1) Presentation Tier (Vite PWA, React 18, Tailwind CSS), "
        "(2) API Gateway Tier (Vercel Serverless Edge, Express routing, Helmet, CORS), "
        "(3) Business Logic Tier (Order, Inventory, Auth, Socket.IO Telemetry, Support Services), and "
        "(4) Persistence & External Tier (MongoDB Atlas Sharded Cluster, Razorpay, Resend, Google Maps).",
        body
    ))

    # Embed Four-Tier Diagram
    img_4tier = get_figure_image('arch_four_tier.png', width=470, height=250)
    if img_4tier:
        story.append(KeepTogether([
            img_4tier,
            Paragraph("Figure 4.2: Four-Tier Architectural Model of the WatchHub Platform.", caption),
            Spacer(1, 6)
        ]))

    story.append(PageBreak())

    story.append(Paragraph("4.3 Data Flow Modeling (DFD Levels 0, 1, and 2)", h2))
    story.append(Paragraph(
        "Data Flow Diagrams model the movement, processing, and transformation of information across system boundaries. WatchHub's data flows are structured into three hierarchical abstraction levels.",
        body
    ))

    # Embed DFD Level 0
    img_dfd0 = get_figure_image('dfd_level_0.png', width=470, height=250)
    if img_dfd0:
        story.append(KeepTogether([
            img_dfd0,
            Paragraph("Figure 4.3: Data Flow Diagram Level 0 (Context Diagram) of WatchHub Ecosystem.", caption),
            Spacer(1, 6)
        ]))

    story.append(Paragraph("Table 4.2: DFD Level 0 Boundary Entities & Dataflows", h3))
    dfd0_data = [
        [Paragraph("<b>External Entity</b>", tbl_hdr), Paragraph("<b>Entity Type</b>", tbl_hdr), Paragraph("<b>Inflow to WatchHub</b>", tbl_hdr), Paragraph("<b>Outflow from WatchHub</b>", tbl_hdr)],
        [Paragraph("Customer", tbl_cell), Paragraph("Human Actor", tbl_cell), Paragraph("Registration details, 3D specs, Cart orders, Payment tokens", tbl_cell), Paragraph("Timepiece catalog, 6-digit OTP, Live telemetry map, Order invoice", tbl_cell)],
        [Paragraph("Boutique Staff", tbl_cell), Paragraph("Human Actors", tbl_cell), Paragraph("POS orders, Stock reorders, Route dispatches, Support replies", tbl_cell), Paragraph("Vault status, Real-time rider coordinates, Customer tickets", tbl_cell)],
        [Paragraph("Razorpay", tbl_cell), Paragraph("Cloud API", tbl_cell), Paragraph("Payment confirmation tokens, HMAC signature, Webhook callbacks", tbl_cell), Paragraph("Order ID, Currency (INR), Amount in paise, Customer metadata", tbl_cell)],
        [Paragraph("Resend API", tbl_cell), Paragraph("Cloud API", tbl_cell), Paragraph("HTTP 200 delivery confirmations, Bounce / Drop notifications", tbl_cell), Paragraph("Recipient email, Sender identity, HTML template, 6-digit OTP token", tbl_cell)],
        [Paragraph("Google Maps", tbl_cell), Paragraph("Cloud API", tbl_cell), Paragraph("Geocoded addresses, Map tiles, Directions route geometry", tbl_cell), Paragraph("Coordinates (lat, lon), API key, Map style configurations", tbl_cell)],
    ]
    t_dfd0 = Table(dfd0_data, colWidths=[90, 85, 160, 170])
    t_dfd0.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), HEADER_BG),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT]),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
    ]))
    story.append(t_dfd0)
    story.append(Spacer(1, 10))

    # Embed DFD Level 1
    img_dfd1 = get_figure_image('dfd_level_1.png', width=470, height=250)
    if img_dfd1:
        story.append(KeepTogether([
            img_dfd1,
            Paragraph("Figure 4.4: Data Flow Diagram Level 1 – Subsystem Process Decomposition.", caption),
            Spacer(1, 6)
        ]))

    story.append(Paragraph(
        "DFD Level 1 decomposes the central WatchHub process into six core functional subsystems: Auth Engine (1.0), Product Catalog (2.0), Order Processing (3.0), Vault Inventory (4.0), Logistics Dispatch (5.0), and Support CRM (6.0), mapping interactions with eight persistent data stores.",
        body
    ))

    # Embed DFD Level 2
    img_dfd2 = get_figure_image('dfd_level_2.png', width=470, height=250)
    if img_dfd2:
        story.append(KeepTogether([
            img_dfd2,
            Paragraph("Figure 4.5: Data Flow Diagram Level 2 – Detailed Order Fulfillment & State Transition.", caption),
            Spacer(1, 6)
        ]))

    story.append(Paragraph(
        "DFD Level 2 details the high-stakes Order Lifecycle & Fulfillment sequence from initial cart validation and Razorpay payment capture to courier assignment, live transit telemetry, and cryptographic OTP doorstep handover.",
        body
    ))
    story.append(PageBreak())

    # Embed UML Class Diagram
    img_uml = get_figure_image('uml_class_diagram.png', width=470, height=250)
    if img_uml:
        story.append(KeepTogether([
            img_uml,
            Paragraph("Figure 4.6: UML Class Diagram – Domain Entities, Attributes & Method Contracts.", caption),
            Spacer(1, 6)
        ]))

    story.append(Paragraph("Table 4.3: UML Domain Entities & Class Specification", h3))
    uml_cls_data = [
        [Paragraph("<b>Class Name</b>", tbl_hdr), Paragraph("<b>Key Attributes</b>", tbl_hdr), Paragraph("<b>Primary Domain Methods</b>", tbl_hdr), Paragraph("<b>Associations</b>", tbl_hdr)],
        [Paragraph("User", tbl_cell), Paragraph("id, name, email, passwordHash, role, mobile, isEmailVerified", tbl_cell), Paragraph("verifyPassword(), issueJwt(), validateOtp()", tbl_cell), Paragraph("1..* Orders, 1..* Tickets", tbl_cell)],
        [Paragraph("Product", tbl_cell), Paragraph("id, sku, name, brand, price, stock, reorderLevel, images, caliber", tbl_cell), Paragraph("checkAvailability(), lockStock(), decrementStock()", tbl_cell), Paragraph("1..* OrderItems, 1..* VaultItems", tbl_cell)],
        [Paragraph("Order", tbl_cell), Paragraph("id, customerId, items[], totalAmount, paymentStatus, orderStatus, otp", tbl_cell), Paragraph("calculateTotal(), transitionStatus(), verifyOtpHandover()", tbl_cell), Paragraph("BelongsTo User, Has 1 Courier", tbl_cell)],
        [Paragraph("VaultItem", tbl_cell), Paragraph("id, productId, serialNumber, safeBinLocation, status, purchaseOrderNo", tbl_cell), Paragraph("reserveBin(), releaseBin(), markQuarantine()", tbl_cell), Paragraph("BelongsTo Product", tbl_cell)],
        [Paragraph("CourierDispatch", tbl_cell), Paragraph("id, orderId, riderId, currentLat, currentLon, speedKmh, status", tbl_cell), Paragraph("updateTelemetry(), evaluateGeofence(), markDelivered()", tbl_cell), Paragraph("References Order, User", tbl_cell)],
        [Paragraph("SupportTicket", tbl_cell), Paragraph("id, customerId, assignedAgentId, category, priority, status, messages[]", tbl_cell), Paragraph("addMessage(), escalatePriority(), closeTicket()", tbl_cell), Paragraph("References User", tbl_cell)],
    ]
    t_uml_cls = Table(uml_cls_data, colWidths=[80, 150, 155, 120])
    t_uml_cls.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), HEADER_BG),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT]),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
    ]))
    story.append(t_uml_cls)
    story.append(PageBreak())

    # =========================================================================
    # CHAPTER 5: DATABASE DESIGN AND DATA DICTIONARY
    # =========================================================================
    story.append(Paragraph("Chapter 5: Database Design and Data Dictionary", h1))
    story.append(HRFlowable(width="100%", thickness=1.5, color=GOLD, spaceAfter=14, spaceBefore=4))

    story.append(Paragraph("5.1 MongoDB Document Architecture & NoSQL Rationale", h2))
    story.append(Paragraph(
        "WatchHub utilizes MongoDB Atlas as its primary persistence engine. A document-oriented NoSQL architecture was selected over rigid relational databases due to the dynamic, polymorphic nature of Haute Horlogerie product specifications. Mechanical watch metadata varies substantially across movements (e.g. Tourbillons vs Chronographs vs Minute Repeaters), requiring flexible schema support for jewel counts, power reserves, bezel tachymeter scales, and custom 3D asset matrices.",
        body
    ))

    # Embed ER Diagram
    img_er = get_figure_image('er_diagram.png', width=470, height=250)
    if img_er:
        story.append(KeepTogether([
            img_er,
            Paragraph("Figure 5.1: WatchHub Entity Relationship Diagram (ERD).", caption),
            Spacer(1, 6)
        ]))

    story.append(Paragraph(
        "Figure 5.1 depicts the logical entity relationships across the database schema, illustrating the primary and foreign key references linking Users, Orders, OrderItems, Products, Payments, LocationHistories, and SupportTickets.",
        body
    ))

    # Embed MongoDB Collections & Indexing Diagram
    img_mongo = get_figure_image('mongodb_relationships.png', width=470, height=250)
    if img_mongo:
        story.append(KeepTogether([
            img_mongo,
            Paragraph("Figure 5.2: MongoDB Collection Architecture, Compound Indexes & TTL Purge Rules.", caption),
            Spacer(1, 6)
        ]))

    story.append(Paragraph("5.2 Formal Data Dictionary & Collection Schemas", h2))
    story.append(Paragraph(
        "The production database comprises eight core collections. Field names, data types, indexing policies, and security constraints are specified in the formal data dictionary below.",
        body
    ))

    story.append(Paragraph("Table 5.1: Data Dictionary – User Collection Schema", h3))
    user_schema_data = [
        [Paragraph("<b>Field Name</b>", tbl_hdr), Paragraph("<b>Data Type</b>", tbl_hdr), Paragraph("<b>Constraints</b>", tbl_hdr), Paragraph("<b>Description & Security Policy</b>", tbl_hdr)],
        [Paragraph("_id", tbl_cell), Paragraph("ObjectId", tbl_cell), Paragraph("PK, Auto-generated", tbl_cell), Paragraph("Unique immutable document identifier", tbl_cell)],
        [Paragraph("name", tbl_cell), Paragraph("String", tbl_cell), Paragraph("Required, Trimmed", tbl_cell), Paragraph("Full legal name of customer or staff member", tbl_cell)],
        [Paragraph("email", tbl_cell), Paragraph("String", tbl_cell), Paragraph("Required, Unique, Lowercase", tbl_cell), Paragraph("Indexed user login email address", tbl_cell)],
        [Paragraph("password", tbl_cell), Paragraph("String", tbl_cell), Paragraph("Required, Min Length 8", tbl_cell), Paragraph("Salted Bcrypt hash (Salt Rounds: 10)", tbl_cell)],
        [Paragraph("role", tbl_cell), Paragraph("String (Enum)", tbl_cell), Paragraph("6 Allowed Roles", tbl_cell), Paragraph("Customer, Store Admin, Inv Mgr, Deliv Mgr, Rider, Super Admin", tbl_cell)],
        [Paragraph("mobile", tbl_cell), Paragraph("String", tbl_cell), Paragraph("Required, 10-Digit Phone", tbl_cell), Paragraph("Contact telephone number for courier alerts", tbl_cell)],
        [Paragraph("isEmailVerified", tbl_cell), Paragraph("Boolean", tbl_cell), Paragraph("Default: false", tbl_cell), Paragraph("Account activation flag toggled by OTP verification", tbl_cell)],
        [Paragraph("createdAt", tbl_cell), Paragraph("Date", tbl_cell), Paragraph("Default: Date.now()", tbl_cell), Paragraph("Registration timestamp for user lifecycle auditing", tbl_cell)],
    ]
    t_user = Table(user_schema_data, colWidths=[85, 75, 110, 230])
    t_user.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), HEADER_BG),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT]),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
    ]))
    story.append(t_user)
    story.append(Spacer(1, 10))

    story.append(Paragraph("Table 5.2: Data Dictionary – Product Collection Schema", h3))
    prod_schema_data = [
        [Paragraph("<b>Field Name</b>", tbl_hdr), Paragraph("<b>Data Type</b>", tbl_hdr), Paragraph("<b>Constraints</b>", tbl_hdr), Paragraph("<b>Description</b>", tbl_hdr)],
        [Paragraph("_id", tbl_cell), Paragraph("ObjectId", tbl_cell), Paragraph("PK, Auto-generated", tbl_cell), Paragraph("Unique product document identifier", tbl_cell)],
        [Paragraph("sku", tbl_cell), Paragraph("String", tbl_cell), Paragraph("Unique, Indexed, Uppercase", tbl_cell), Paragraph("Stock Keeping Unit (e.g. W-ROLEX-SUB-41)", tbl_cell)],
        [Paragraph("name", tbl_cell), Paragraph("String", tbl_cell), Paragraph("Required, Indexed Text", tbl_cell), Paragraph("Commercial timepiece model name", tbl_cell)],
        [Paragraph("brand", tbl_cell), Paragraph("String", tbl_cell), Paragraph("Required, Indexed Compound", tbl_cell), Paragraph("Manufacturer brand (e.g. Rolex, Omega, Patek)", tbl_cell)],
        [Paragraph("price", tbl_cell), Paragraph("Number", tbl_cell), Paragraph("Required, Min 0", tbl_cell), Paragraph("Base retail price in Indian Rupees (INR)", tbl_cell)],
        [Paragraph("stock", tbl_cell), Paragraph("Number", tbl_cell), Paragraph("Required, Min 0", tbl_cell), Paragraph("Available on-hand units in central vault", tbl_cell)],
        [Paragraph("reorderLevel", tbl_cell), Paragraph("Number", tbl_cell), Paragraph("Default: 2", tbl_cell), Paragraph("Automated threshold triggering restock warnings", tbl_cell)],
        [Paragraph("images", tbl_cell), Paragraph("Array[String]", tbl_cell), Paragraph("Min 1 valid URI", tbl_cell), Paragraph("Relative CDN paths to uncropped watch imagery", tbl_cell)],
        [Paragraph("movement", tbl_cell), Paragraph("String", tbl_cell), Paragraph("Required", tbl_cell), Paragraph("Mechanical caliber designation (e.g. Calibre 3235)", tbl_cell)],
    ]
    t_prod = Table(prod_schema_data, colWidths=[85, 75, 110, 230])
    t_prod.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), HEADER_BG),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT]),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
    ]))
    story.append(t_prod)
    story.append(Spacer(1, 10))

    story.append(Paragraph("Table 5.3: Data Dictionary – Order Collection Schema", h3))
    order_schema_data = [
        [Paragraph("<b>Field Name</b>", tbl_hdr), Paragraph("<b>Data Type</b>", tbl_hdr), Paragraph("<b>Constraints</b>", tbl_hdr), Paragraph("<b>Description</b>", tbl_hdr)],
        [Paragraph("_id", tbl_cell), Paragraph("ObjectId", tbl_cell), Paragraph("PK, Auto-generated", tbl_cell), Paragraph("Unique order identifier", tbl_cell)],
        [Paragraph("customer", tbl_cell), Paragraph("ObjectId (Ref: User)", tbl_cell), Paragraph("Required, Indexed", tbl_cell), Paragraph("Foreign key reference to Customer record", tbl_cell)],
        [Paragraph("items", tbl_cell), Paragraph("Array[Subdocument]", tbl_cell), Paragraph("Min 1 item", tbl_cell), Paragraph("Purchased watches with SKU, price, quantity, engraving", tbl_cell)],
        [Paragraph("totalAmount", tbl_cell), Paragraph("Number", tbl_cell), Paragraph("Required, Min 0", tbl_cell), Paragraph("Final payable order value including taxes", tbl_cell)],
        [Paragraph("paymentStatus", tbl_cell), Paragraph("String (Enum)", tbl_cell), Paragraph("Pending/Paid/Failed", tbl_cell), Paragraph("Verified payment status via Razorpay HMAC", tbl_cell)],
        [Paragraph("orderStatus", tbl_cell), Paragraph("String (Enum)", tbl_cell), Paragraph("8 State Machine Values", tbl_cell), Paragraph("Placed, Processing, Dispatched, OutForDelivery, Delivered, etc.", tbl_cell)],
        [Paragraph("deliveryOtp", tbl_cell), Paragraph("String", tbl_cell), Paragraph("6-Digit Encrypted", tbl_cell), Paragraph("Confidential handover OTP dispatched to customer", tbl_cell)],
        [Paragraph("assignedRider", tbl_cell), Paragraph("ObjectId (Ref: User)", tbl_cell), Paragraph("Optional, Indexed", tbl_cell), Paragraph("Assigned delivery partner handling transit", tbl_cell)],
        [Paragraph("podPhotoUrl", tbl_cell), Paragraph("String", tbl_cell), Paragraph("Optional URL", tbl_cell), Paragraph("Camera proof of delivery photo captured by rider", tbl_cell)],
    ]
    t_order = Table(order_schema_data, colWidths=[85, 95, 110, 210])
    t_order.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), HEADER_BG),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT]),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
    ]))
    story.append(t_order)
    story.append(PageBreak())

    # =========================================================================
    # CHAPTER 6: DETAILED MODULE IMPLEMENTATIONS (SIX ROLES)
    # =========================================================================
    story.append(Paragraph("Chapter 6: Detailed Module Implementations (Six Operational Roles)", h1))
    story.append(HRFlowable(width="100%", thickness=1.5, color=GOLD, spaceAfter=14, spaceBefore=4))

    story.append(Paragraph("6.1 Role 1: Customer Storefront & Luxury Atelier", h2))
    story.append(Paragraph(
        "The customer storefront is the flagship public interface of WatchHub, engineered to deliver an authentic Haute Horlogerie buying experience across 9 distinct functional modules: (1) Hero Discovery Showcase, (2) Brand Collections Gallery (Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier, TAG Heuer), (3) Uncropped Watch Catalog with multi-attribute filtering, (4) Interactive 3D Bespoke Customization Studio, (5) 9-Stage Mechanical Horology Assembly Cinema, (6) Dynamic Cart & Currency Converter, (7) Multi-Factor OTP Login & Registration, (8) Razorpay Multi-Tier Checkout, and (9) Live Google Maps Delivery Telemetry.",
        body
    ))

    # Embed Customer Journey Diagram
    img_cj = get_figure_image('customer_journey.png', width=470, height=250)
    if img_cj:
        story.append(KeepTogether([
            img_cj,
            Paragraph("Figure 6.1: Customer Experience Journey & Storefront Atelier Flow.", caption),
            Spacer(1, 6)
        ]))

    story.append(Paragraph("6.1.1 Zero-Cropping Image Architecture & Product Representation", h3))
    story.append(Paragraph(
        "A premier technical mandate of WatchHub is zero-cropping product imagery. In luxury horology, watch collectors closely scrutinize lug curvature, crown guards, bezel graduations, and bracelet link geometry. Cropping a watch to fit standard 1:1 e-commerce tiles severely impairs buyer evaluation. WatchHub enforces CSS container isolation with `object-fit: contain` and calibrated padding, ensuring complete visual integrity across all viewpoints.",
        body
    ))

    # Embed Rolex Submariner Image
    img_rolex = get_figure_image('rolex-submariner.png', width=220, height=220)
    if img_rolex:
        story.append(KeepTogether([
            img_rolex,
            Paragraph("Figure 6.2: Uncropped Luxury Timepiece Product Representation (Rolex Submariner Date 41mm).", caption),
            Spacer(1, 6)
        ]))

    story.append(Paragraph("6.1.2 Interactive 3D Bespoke Studio & 9-Stage Horology Cinema", h3))
    story.append(Paragraph(
        "The Customizer Studio (`/customize`) empowers collectors to design bespoke timepieces by selecting case metals (Oystersteel, 18K Yellow Gold, Rose Gold, Platinum), dial colors (Sunburst Blue, Emerald Green, Onyx Black, Silvered Opaline), bezel inserts (Cerachrom Ceramic, Fluted Gold), and custom laser-engraved caseback texts. Real-time SVG masking and layered Canvas compositing update the visual preview instantaneously.",
        body
    ))
    story.append(Paragraph(
        "Complementing the customizer is the 'Inside Watchmaking: The Art of Assembly' cinema section. The player features high-definition video walkthroughs of all 9 manufacturing stages: (1) Component Arrangement, (2) Gear Train Assembly, (3) Micro-Screw Setting, (4) Escapement Regulation, (5) Dial Installation, (6) Movement Casing, (7) Bezel & Crown Fitting, (8) Final Quality Inspection, and (9) Luxury Reveal.",
        body
    ))

    # Table 6.1: 9-Stage Watchmaking Breakdown
    story.append(Paragraph("Table 6.1: Nine-Stage Mechanical Watchmaking Assembly Architecture", h3))
    cinema_data = [
        [Paragraph("<b>Stage</b>", tbl_hdr), Paragraph("<b>Manufacturing Phase</b>", tbl_hdr), Paragraph("<b>Horological Operation</b>", tbl_hdr), Paragraph("<b>Visual Cue / Animation</b>", tbl_hdr)],
        [Paragraph("Stage 1", tbl_cell), Paragraph("Arranging Components", tbl_cell), Paragraph("Sorting micro-gears, jewels, springs & baseplates on clean bench", tbl_cell), Paragraph("Magnified bench view, tweezers sorting", tbl_cell)],
        [Paragraph("Stage 2", tbl_cell), Paragraph("Movement & Gear Assembly", tbl_cell), Paragraph("Mounting center wheel, third wheel, fourth wheel and mainspring", tbl_cell), Paragraph("Gears meshing into mainplate jewels", tbl_cell)],
        [Paragraph("Stage 3", tbl_cell), Paragraph("Installing Gears & Screws", tbl_cell), Paragraph("Torque screwdriver setting blue-steel screws to bridges", tbl_cell), Paragraph("Micro-screwdriver precision turn", tbl_cell)],
        [Paragraph("Stage 4", tbl_cell), Paragraph("Balance Wheel & Escapement", tbl_cell), Paragraph("Mounting hairspring and balance wheel; oscillating heartbeat begins", tbl_cell), Paragraph("28,800 vph oscillating wheel", tbl_cell)],
        [Paragraph("Stage 5", tbl_cell), Paragraph("Attaching Dial & Hands", tbl_cell), Paragraph("Hand-fitting enamel dial and luminescent hour/minute hands", tbl_cell), Paragraph("Dial press setting hands at 10:10", tbl_cell)],
        [Paragraph("Stage 6", tbl_cell), Paragraph("Casing the Movement", tbl_cell), Paragraph("Lowering regulated movement into 316L/904L steel case", tbl_cell), Paragraph("Casing ring & rubber gasket seal", tbl_cell)],
        [Paragraph("Stage 7", tbl_cell), Paragraph("Bezel, Crown & Strap", tbl_cell), Paragraph("Pressing ceramic bezel, screw-down crown, and Oyster bracelet", tbl_cell), Paragraph("Solid end-links snapping into lugs", tbl_cell)],
        [Paragraph("Stage 8", tbl_cell), Paragraph("Polishing & Quality Check", tbl_cell), Paragraph("Pressure testing to 300m water resistance and chronometer check", tbl_cell), Paragraph("Water immersion tank & laser timing", tbl_cell)],
        [Paragraph("Stage 9", tbl_cell), Paragraph("Final Masterpiece Reveal", tbl_cell), Paragraph("Ceremonial velvet presentation box reveal of completed watch", tbl_cell), Paragraph("Cinematic 360-degree lighting spin", tbl_cell)],
    ]
    t_cinema = Table(cinema_data, colWidths=[55, 120, 195, 130])
    t_cinema.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), HEADER_BG),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT]),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
    ]))
    story.append(t_cinema)
    story.append(PageBreak())

    story.append(Paragraph("6.2 Role 2: Super Admin Operations Console", h2))
    story.append(Paragraph(
        "The Super Admin console (`/admin`) serves as the central command node for the entire ecosystem. Governance capabilities include: (1) Multi-role staff account creation and credential management, (2) Platform-wide gross merchandise value (GMV) and revenue analytics, (3) System audit logging tracking high-risk administrative events, (4) Global feature flag toggles, and (5) Application Version Management Engine (`v1.1.0`) allowing live broadcasts of release notes and prompt-based update notifications to connected clients.",
        body
    ))

    story.append(Paragraph("6.3 Role 3: Store Administrator & POS Workstation", h2))
    story.append(Paragraph(
        "Store Administrators oversee physical boutique operations and order approvals. The console (`/store-admin`) provides: (1) Comprehensive POS counter checkout with receipt generation, (2) Customer profile CRM and purchase history, (3) Catalog pricing adjustments and promotional discount rule builders, (4) Local boutique order allocation and courier handover approvals, and (5) Daily cash and card reconciliation summaries.",
        body
    ))

    # Embed Store Admin Reference Screenshot
    img_store = get_figure_image('store_admin_shopmax_ref.jpg', width=470, height=240)
    if img_store:
        story.append(KeepTogether([
            img_store,
            Paragraph("Figure 6.3: Store Administrator & POS Workstation Management Console Interface.", caption),
            Spacer(1, 6)
        ]))

    story.append(Paragraph("6.4 Role 4: Vault Inventory Manager & Reorder Automation", h2))
    story.append(Paragraph(
        "The Inventory Manager console (`/inventory`) safeguards high-value physical timepiece assets through: (1) Safe and bin location indexing (e.g. Vault A, Shelf 3, Bin 12), (2) Serialized barcode and RFID tracking, (3) Automated low-stock trigger alerts (default threshold: 2 units), (4) Automated Purchase Order (PO) generation, (5) Defective timepiece quarantine and return-to-manufactory (RTV) workflows, and (6) Periodic physical audit reconciliation ledgers.",
        body
    ))

    # Embed Inventory Flowchart
    img_inv_flow = get_figure_image('flow_inventory_management.png', width=470, height=250)
    if img_inv_flow:
        story.append(KeepTogether([
            img_inv_flow,
            Paragraph("Figure 6.4: Inventory Vault & Reorder Automation Flowchart.", caption),
            Spacer(1, 6)
        ]))

    story.append(PageBreak())

    story.append(Paragraph("6.5 Role 5: Delivery Logistics Manager & Delivery Partner App", h2))
    story.append(Paragraph(
        "The logistics module comprises two interconnected interfaces: (1) Delivery Manager Dispatch Hub (`/delivery-manager`) featuring active fleet maps, rider workload balancing, transit SLA monitoring, and geofence entry alerts; and (2) Delivery Partner Mobile PWA (`/delivery-partner`) featuring turn-by-turn navigation, shipment accept/reject toggles, confidential 6-digit OTP customer verification, and mandatory camera photo proof-of-delivery upload.",
        body
    ))

    # Embed Delivery Flowchart
    img_deliv_flow = get_figure_image('flow_delivery_management.png', width=470, height=250)
    if img_deliv_flow:
        story.append(KeepTogether([
            img_deliv_flow,
            Paragraph("Figure 6.5: Delivery Logistics & Handover Flowchart.", caption),
            Spacer(1, 6)
        ]))

    story.append(Paragraph("6.6 Role 6: Customer Support Executive CRM", h2))
    story.append(Paragraph(
        "The Customer Support module (`/support-manager`) provides a high-touch clienteling environment featuring: (1) Real-time multi-agent live chat escalation over Socket.IO, (2) Ticket classification (Pre-sales, In-transit, Return/RMA, Warranty Inspection), (3) Customer order lookup with instant tracking timeline view, (4) Return Merchandise Authorization (RMA) generator with automated reverse-pickup scheduling, and (5) Customer satisfaction (CSAT) scoring.",
        body
    ))

    # Embed App Navigation Diagram
    img_nav = get_figure_image('app_navigation.png', width=470, height=250)
    if img_nav:
        story.append(KeepTogether([
            img_nav,
            Paragraph("Figure 6.6: Application Navigation Topology across All Six Roles.", caption),
            Spacer(1, 6)
        ]))

    story.append(Paragraph(
        "Figure 6.6 details the complete navigation routing tree of WatchHub, illustrating how the client-side router directs authenticated sessions to their designated operational views based on validated JWT role claims.",
        body
    ))
    story.append(PageBreak())

    # =========================================================================
    # CHAPTER 7: THIRD-PARTY CLOUD INTEGRATIONS
    # =========================================================================
    story.append(Paragraph("Chapter 7: Third-Party Cloud Integrations", h1))
    story.append(HRFlowable(width="100%", thickness=1.5, color=GOLD, spaceAfter=14, spaceBefore=4))

    story.append(Paragraph("7.1 Multi-Factor Authentication & Resend Email OTP Verification", h2))
    story.append(Paragraph(
        "To safeguard collector accounts and prevent credential-stuffing exploits, WatchHub implements passwordless and multi-factor email verification powered by the Resend REST API (`https://api.resend.com/emails`). When a customer initiates registration, login, or password reset, the server generates a cryptographically random 6-digit integer token.",
        body
    ))

    # Embed Auth Sequence Diagram
    img_seq_auth = get_figure_image('seq_authentication.png', width=470, height=250)
    if img_seq_auth:
        story.append(KeepTogether([
            img_seq_auth,
            Paragraph("Figure 7.1: Multi-Factor Authentication & Resend OTP Sequence Diagram.", caption),
            Spacer(1, 6)
        ]))

    story.append(Paragraph("7.1.1 Cryptographic Entropy & Security Model", h3))
    story.append(Paragraph(
        "The 6-digit token is generated using Node.js `crypto.randomInt(100000, 999999)`, producing a uniform distribution with an information entropy of approximately 19.93 bits. The token is hashed with a secret salt and stored in MongoDB with a 300-second TTL index. Client verification is strictly rate-limited to 5 incorrect attempts before the token is invalidated, reducing brute-force success probability to 0.0005%.",
        body
    ))

    # Embed Flow OTP Verification
    img_flow_otp = get_figure_image('flow_otp_verification.png', width=470, height=250)
    if img_flow_otp:
        story.append(KeepTogether([
            img_flow_otp,
            Paragraph("Figure 7.2: Cryptographic Email OTP Lifecycle Flowchart.", caption),
            Spacer(1, 6)
        ]))

    story.append(Paragraph("7.2 Razorpay Payment Gateway & Server-Side HMAC Verification", h2))
    story.append(Paragraph(
        "WatchHub integrates Razorpay Standard Multi-Tier Checkout for domestic and international high-ticket payments. To eliminate client-side payload tampering and spoofing attacks, order completion is governed by strict server-side cryptographic signature verification.",
        body
    ))

    # Embed Payment Sequence Diagram
    img_seq_pay = get_figure_image('seq_payment.png', width=470, height=250)
    if img_seq_pay:
        story.append(KeepTogether([
            img_seq_pay,
            Paragraph("Figure 7.3: Razorpay Payment Gateway Sequence Diagram.", caption),
            Spacer(1, 6)
        ]))

    # Embed Razorpay Integration Flow
    img_razorpay = get_figure_image('razorpay_integration.png', width=470, height=250)
    if img_razorpay:
        story.append(KeepTogether([
            img_razorpay,
            Paragraph("Figure 7.4: Razorpay Architecture & HMAC Verification Flow.", caption),
            Spacer(1, 6)
        ]))

    story.append(Paragraph("7.2.1 Mathematical Formulation of HMAC-SHA256 Verification", h3))
    story.append(Paragraph(
        "Upon completing checkout in the Razorpay modal, the client receives `razorpay_payment_id`, `razorpay_order_id`, and `razorpay_signature`. These credentials are submitted to `POST /api/payment/verify`. The backend computes an expected hash signature using the shared secret key:",
        body
    ))
    story.append(Paragraph(
        "<b>Expected Signature = HMAC-SHA256( razorpay_order_id + '|' + razorpay_payment_id, RAZORPAY_KEY_SECRET )</b>",
        code_style
    ))
    story.append(Paragraph(
        "The computed hash is compared with the incoming signature using constant-time string comparison (`crypto.timingSafeEqual`) to prevent timing side-channel attacks. Only upon an exact mathematical match does the server transition the order status to `Paid` and release vault inventory reservation locks.",
        body
    ))

    story.append(Paragraph("7.3 Real-Time Telemetry & Google Maps Telematics", h2))
    story.append(Paragraph(
        "WatchHub leverages the Google Maps JavaScript API combined with Socket.IO to provide real-time visual tracking of high-value shipments. The delivery partner mobile terminal emits GPS coordinates at 5-second intervals. The backend validates coordinates against active shipment waypoints, computes ETA using the Haversine formula, and broadcasts coordinates over private WebSocket rooms (`order_{id}`) to the customer tracking map.",
        body
    ))

    # Embed GPS Architecture Diagram
    img_gps = get_figure_image('arch_gps_tracking.png', width=470, height=250)
    if img_gps:
        story.append(KeepTogether([
            img_gps,
            Paragraph("Figure 7.5: Real-Time GPS Tracking & Telemetry Architecture.", caption),
            Spacer(1, 6)
        ]))

    story.append(Paragraph(
        "Figure 7.5 demonstrates the real-time telemetry streaming pipeline. Geolocation data emitted by the courier terminal is filtered through Kalman smoothing algorithms on the backend to eliminate GPS multipath drift before streaming coordinates to customer map markers.",
        body
    ))
    story.append(PageBreak())

    return story
''')
    print("Part 1 written successfully.")

if __name__ == '__main__':
    build_part1()
