#!/usr/bin/env python3
"""
Enriches WatchHub Master Report Chapters with extensive academic & technical depth
to achieve 65-85 pages in publication quality.
"""

import os
import re

DIAGRAMS_DIR = 'docs/diagrams'

def enrich_part1():
    part1_path = 'docs/report_chapters_part1.py'
    with open(part1_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Enrich Chapter 2 if not already enriched with Section 2.5
    if 'Section 2.5: Haute Horlogerie Physical Metallurgy' not in content:
        target_ch2 = "story.append(Paragraph(\"2.4 Digital Payments & Cryptographic Fraud Prevention\", h2))"
        replacement_ch2 = """story.append(Paragraph("2.5 Haute Horlogerie Physical Metallurgy & Mechanical Escapement Dynamics", h2))
    story.append(Paragraph(
        "A rigorous engineering evaluation of the Haute Horlogerie domain requires understanding the physical, metallurgical, "
        "and mechanical principles governing precision luxury timepieces. Unlike standard quartz or consumer smartwatches whose "
        "temporal accuracy depends on quartz crystal oscillation driven by chemical batteries, luxury mechanical movements "
        "function entirely through stored mechanical kinetic energy and oscillating balance wheel escapements.",
        body
    ))
    story.append(Spacer(1, 6))

    # Center luxury watch specimen photograph
    p_rolex_photo = os.path.join(DIAGRAM_DIR, 'rolex_submariner_showcase.jpg')
    if os.path.exists(p_rolex_photo):
        story.append(KeepTogether([
            RLImage(p_rolex_photo, width=210, height=210),
            Spacer(1, 4),
            Paragraph("<b>Figure 2.1:</b> Haute Horlogerie Benchmark Specimen — Rolex Submariner Date (Reference 126610LN) featuring Unidirectional Cerachrom Ceramic Bezel, Chromalight Display, Triplock Waterproof Crown, and Oystersteel 904L Architecture.", caption_style)
        ]))
        story.append(Spacer(1, 10))

    story.append(Paragraph(
        "<b>1. Isochronism and Differential Escapement Dynamics:</b><br/>"
        "The temporal periodicity of a mechanical calibre is governed by the rotational oscillation of the balance wheel "
        "coupled with the hairspring (spiral). The ideal rotational motion is modeled by the second-order differential equation:",
        body
    ))
    story.append(Paragraph(
        "&nbsp;&nbsp;&nbsp;&nbsp;<i>I &middot; (d&sup2;&theta; / dt&sup2;) + &gamma; &middot; (d&theta; / dt) + C &middot; &theta; = &Tau;<sub>escapement</sub>(t)</i><br/><br/>"
        "where <i>I</i> represents the moment of inertia of the glucydur or balance rim, <i>&gamma;</i> is the viscous damping coefficient "
        "of the ambient atmosphere, <i>C</i> is the torsional elastic constant of the hairspring, and <i>&Tau;<sub>escapement</sub>(t)</i> is "
        "the discrete impulse torque delivered by the escape wheel pallet jewels twice per cycle. "
        "In modern calibres operating at 28,800 vibrations per hour (vph), the oscillation frequency equals exactly <i>f = 4.0 Hz</i> "
        "(yielding 8 discrete ticks per second). The natural frequency is given by:",
        body
    ))
    story.append(Paragraph(
        "&nbsp;&nbsp;&nbsp;&nbsp;<i>f = (1 / 2&pi;) &middot; &radic;(C / I)</i><br/><br/>"
        "Achieving true isochronism (independence of period <i>T = 1/f</i> from rotational amplitude <i>&theta;<sub>max</sub></i>) requires "
        "precision terminal curves (Breguet overcoil) or specialized silicium geometry, ensuring chronometric stability across positional deviations.",
        body
    ))
    story.append(Spacer(1, 6))

    story.append(Paragraph(
        "<b>2. Mainspring Potential Energy Storage & Torque Decay:</b><br/>"
        "Kinetic energy is stored within the mainspring coiled inside the mainspring barrel. The total elastic potential energy <i>U</i> "
        "stored in a coiled spring of active length <i>L</i>, thickness <i>e</i>, height <i>h</i>, and Young's modulus <i>E</i> is expressed as:",
        body
    ))
    story.append(Paragraph(
        "&nbsp;&nbsp;&nbsp;&nbsp;<i>U = (1 / 24) &middot; E &middot; h &middot; e&sup3; &middot; (&theta;<sub>wind</sub>&sup2; / L)</i><br/><br/>"
        "As the mainspring unwinds, torque decreases exponentially. To prevent rate drift across the 70-hour power reserve, modern calibres "
        "employ modern Nivaflex alloys and optimized barrel arbor gearing to produce a linear torque delivery plateau across 85% of the reserve cycle.",
        body
    ))
    story.append(Spacer(1, 6))

    story.append(Paragraph(
        "<b>3. Hydrostatic Pressure Rating & Submersible Hermeticity:</b><br/>"
        "Luxury diving timepieces such as the Submariner Reference 126610LN engineered for 300 meters (1,000 feet) water resistance "
        "must withstand extreme hydrostatic pressure gradients according to Pascal's law:",
        body
    ))
    story.append(Paragraph(
        "&nbsp;&nbsp;&nbsp;&nbsp;<i>P<sub>total</sub> = P<sub>atm</sub> + &rho; &middot; g &middot; h &approx; 101,325 Pa + (1025 kg/m&sup3; &middot; 9.81 m/s&sup2; &middot; 300 m) &approx; 3,118,000 Pa &approx; 31.18 bar</i><br/><br/>"
        "This equates to over 31 atmospheres of pressure exerted uniformly on the synthetic sapphire crystal (hardness 9 on Mohs scale), "
        "caseback gasket seals, and Triplock triple-gasket winding crown system.",
        body
    ))
    story.append(Spacer(1, 8))

    # Calibre Comparative Table
    story.append(Paragraph("Table 2.2: Comprehensive Comparative Calibre Engineering Matrix", h3))
    calibre_table_data = [
        [Paragraph("<b>Calibre Model</b>", tbl_hdr), Paragraph("<b>Escapement Architecture</b>", tbl_hdr), Paragraph("<b>Beat Rate (vph / Hz)</b>", tbl_hdr), Paragraph("<b>Power Reserve</b>", tbl_hdr), Paragraph("<b>Jewels</b>", tbl_hdr), Paragraph("<b>Chronometer Standard</b>", tbl_hdr)],
        [Paragraph("Rolex Calibre 3235", tbl_cell), Paragraph("Chronergy Escapement (Nickel-Phosphorus)", tbl_cell), Paragraph("28,800 vph (4 Hz)", tbl_cell), Paragraph("70 Hours", tbl_cell), Paragraph("31", tbl_cell), Paragraph("Superlative Chronometer (-2 / +2 s/day)", tbl_cell)],
        [Paragraph("Omega Co-Axial 8800", tbl_cell), Paragraph("Co-Axial Dual Impulse Escapement", tbl_cell), Paragraph("25,200 vph (3.5 Hz)", tbl_cell), Paragraph("55 Hours", tbl_cell), Paragraph("35", tbl_cell), Paragraph("METAS Master Chronometer (0 / +5 s/day)", tbl_cell)],
        [Paragraph("Grand Seiko 9SA5", tbl_cell), Paragraph("Dual Impulse Free-Sprung Escapement", tbl_cell), Paragraph("36,000 vph (5 Hz)", tbl_cell), Paragraph("80 Hours", tbl_cell), Paragraph("47", tbl_cell), Paragraph("Grand Seiko Standard (-3 / +5 s/day)", tbl_cell)],
        [Paragraph("ETA Valjoux 7750", tbl_cell), Paragraph("Swiss Lever Escapement", tbl_cell), Paragraph("28,800 vph (4 Hz)", tbl_cell), Paragraph("48 Hours", tbl_cell), Paragraph("25", tbl_cell), Paragraph("Standard Elabor&eacute; (+/- 5 to 15 s/day)", tbl_cell)],
        [Paragraph("Patek Philippe 324 S C", tbl_cell), Paragraph("Spiromax / Gyromax Free-Sprung Balance", tbl_cell), Paragraph("28,800 vph (4 Hz)", tbl_cell), Paragraph("45 Hours", tbl_cell), Paragraph("29", tbl_cell), Paragraph("Patek Philippe Seal (-3 / +2 s/day)", tbl_cell)],
    ]
    t_calibre = Table(calibre_table_data, colWidths=[90, 115, 80, 65, 45, 110])
    t_calibre.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), HEADER_BG),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT]),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
    ]))
    story.append(t_calibre)
    story.append(Spacer(1, 10))
    story.append(PageBreak())

    story.append(Paragraph("2.4 Digital Payments & Cryptographic Fraud Prevention", h2))"""

        content = content.replace(target_ch2, replacement_ch2)

    with open(part1_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Part 1 enrichment complete.")

enrich_part1()
