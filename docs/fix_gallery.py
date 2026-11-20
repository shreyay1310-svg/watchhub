#!/usr/bin/env python3
import os

with open('docs/report_chapters_part2.py', 'r', encoding='utf-8') as f:
    text = f.read()

target = """    gallery_cells = []
    if os.path.exists(p_rolex) and os.path.exists(p_tourbillon):
        gallery_cells.append([
            KeepTogether([
                RLImage(p_rolex, width=190, height=190),
                Spacer(1, 4),
                Paragraph("<b>Figure G.1:</b> Rolex Submariner Date (Oystersteel 904L, Cerachrom Ceramic Bezel)", caption)
            ]),
            KeepTogether([
                RLImage(p_tourbillon, width=190, height=190),
                Spacer(1, 4),
                Paragraph("<b>Figure G.2:</b> Haute Horlogerie Flying Tourbillon Openworked Skeleton Specimen", caption)
            ])
        ])
    if os.path.exists(p_chrono) and os.path.exists(p_limited):
        gallery_cells.append([
            KeepTogether([
                RLImage(p_chrono, width=190, height=190),
                Spacer(1, 4),
                Paragraph("<b>Figure G.3:</b> Automatic Chronograph Calibre (Flyback Functionality)", caption)
            ]),
            KeepTogether([
                RLImage(p_limited, width=190, height=190),
                Spacer(1, 4),
                Paragraph("<b>Figure G.4:</b> Limited Edition Heritage Chronometer Specimen", caption)
            ])
        ])

    if gallery_cells:
        t_gallery = Table(gallery_cells, colWidths=[235, 235])
        t_gallery.setStyle(TableStyle([
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ]))
        story.append(t_gallery)"""

replacement = """    if os.path.exists(p_rolex) and os.path.exists(p_tourbillon):
        row1 = [[
            [RLImage(p_rolex, width=190, height=190), Spacer(1, 4), Paragraph("<b>Figure G.1:</b> Rolex Submariner Date (Oystersteel 904L, Cerachrom Bezel)", caption)],
            [RLImage(p_tourbillon, width=190, height=190), Spacer(1, 4), Paragraph("<b>Figure G.2:</b> Flying Tourbillon Skeleton Specimen", caption)]
        ]]
        t1 = Table(row1, colWidths=[235, 235])
        t1.setStyle(TableStyle([('ALIGN', (0,0), (-1,-1), 'CENTER'), ('VALIGN', (0,0), (-1,-1), 'TOP'), ('BOTTOMPADDING', (0,0), (-1,-1), 8)]))
        story.append(t1)
        story.append(Spacer(1, 12))

    if os.path.exists(p_chrono) and os.path.exists(p_limited):
        row2 = [[
            [RLImage(p_chrono, width=190, height=190), Spacer(1, 4), Paragraph("<b>Figure G.3:</b> Automatic Chronograph Calibre (Flyback Complication)", caption)],
            [RLImage(p_limited, width=190, height=190), Spacer(1, 4), Paragraph("<b>Figure G.4:</b> Limited Edition Heritage Chronometer Specimen", caption)]
        ]]
        t2 = Table(row2, colWidths=[235, 235])
        t2.setStyle(TableStyle([('ALIGN', (0,0), (-1,-1), 'CENTER'), ('VALIGN', (0,0), (-1,-1), 'TOP'), ('BOTTOMPADDING', (0,0), (-1,-1), 8)]))
        story.append(t2)"""

if target in text:
    text = text.replace(target, replacement)
    with open('docs/report_chapters_part2.py', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Gallery replacement succeeded!")
else:
    print("Target not found.")
