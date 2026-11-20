#!/usr/bin/env python3
"""
Adds structured pagebreaks between major architectural diagram sections
in report_chapters_part1.py to optimize presentation and reach the target page count.
"""

with open('docs/report_chapters_part1.py', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. PageBreak before DFD Level 1
target_dfd1 = "    # Embed DFD Level 1"
repl_dfd1 = "    story.append(PageBreak())\n    # Embed DFD Level 1"

# 2. PageBreak before DFD Level 2
target_dfd2 = "    # Embed DFD Level 2"
repl_dfd2 = "    story.append(PageBreak())\n    # Embed DFD Level 2"

# 3. PageBreak before MongoDB Indexing Diagram
target_mongo = "    # Embed MongoDB Collections & Indexing Diagram"
repl_mongo = "    story.append(PageBreak())\n    # Embed MongoDB Collections & Indexing Diagram"

# 4. PageBreak before 7.2 Razorpay
target_razorpay = "    story.append(Paragraph(\"7.2 Razorpay Payment Gateway & Server-Side HMAC Verification\", h2))"
repl_razorpay = "    story.append(PageBreak())\n    story.append(Paragraph(\"7.2 Razorpay Payment Gateway & Server-Side HMAC Verification\", h2))"

# 5. PageBreak before 7.3 Google Maps
target_maps = "    story.append(Paragraph(\"7.3 Real-Time Geolocation & Google Maps Platform\", h2))"
repl_maps = "    story.append(PageBreak())\n    story.append(Paragraph(\"7.3 Real-Time Geolocation & Google Maps Platform\", h2))"

for t, r in [(target_dfd1, repl_dfd1), (target_dfd2, repl_dfd2), (target_mongo, repl_mongo), (target_razorpay, repl_razorpay), (target_maps, repl_maps)]:
    if t in text:
        text = text.replace(t, r)
        print(f"Replaced: {t[:40]}...")
    else:
        print(f"Not found: {t[:40]}...")

with open('docs/report_chapters_part1.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Part 1 layout pagebreaks applied successfully.")
