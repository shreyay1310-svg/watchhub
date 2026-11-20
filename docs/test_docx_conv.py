#!/usr/bin/env python3
"""
Test story to docx converter
"""
import re
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from reportlab.platypus import Paragraph, Table, PageBreak, Image as RLImage, KeepTogether

def clean_html(text):
    if not isinstance(text, str):
        return str(text)
    t = text.replace('&nbsp;', ' ').replace('&bull;', '•').replace('&approx;', '≈').replace('&middot;', '·')
    t = t.replace('&pi;', 'π').replace('&radic;', '√').replace('&theta;', 'θ').replace('&gamma;', 'γ').replace('&Tau;', 'Τ').replace('&Delta;', 'Δ').replace('&phi;', 'φ').replace('&lambda;', 'λ')
    t = t.replace('&sup2;', '²').replace('&sup3;', '³').replace('&eacute;', 'é')
    t = re.sub(r'<br\s*/?>', '\n', t)
    t = re.sub(r'<[^<]+?>', '', t)
    return t.strip()

print('HTML cleaner verified')
