#!/usr/bin/env python3
"""
Comprehensive docx builder from Platypus story
"""
import re
import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn
from reportlab.platypus import Paragraph, Table, PageBreak, Image as RLImage, KeepTogether, HRFlowable

def clean_html(text):
    if not isinstance(text, str):
        return str(text)
    t = text.replace('&nbsp;', ' ').replace('&bull;', '•').replace('&approx;', '≈').replace('&middot;', '·')
    t = t.replace('&pi;', 'π').replace('&radic;', '√').replace('&theta;', 'θ').replace('&gamma;', 'γ').replace('&Tau;', 'Τ').replace('&Delta;', 'Δ').replace('&phi;', 'φ').replace('&lambda;', 'λ')
    t = t.replace('&sup2;', '²').replace('&sup3;', '³').replace('&eacute;', 'é')
    t = re.sub(r'<br\s*/?>', '\n', t)
    t = re.sub(r'<[^<]+?>', '', t)
    return t.strip()

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    tcPr.append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>'))

def build_docx_from_story(story, output_docx_path):
    print(f"[Compiler] Building Master Editable Word Document at: {output_docx_path}")
    doc = docx.Document()

    for s in doc.sections:
        s.top_margin = Inches(0.75)
        s.bottom_margin = Inches(0.75)
        s.left_margin = Inches(0.75)
        s.right_margin = Inches(0.75)

    NAVY_RGB = RGBColor(9, 20, 38)
    GOLD_RGB = RGBColor(184, 134, 11)
    CHARCOAL_RGB = RGBColor(30, 41, 59)
    MUTED_RGB = RGBColor(100, 116, 139)

    for item in story:
        if isinstance(item, PageBreak):
            doc.add_page_break()

        elif isinstance(item, Paragraph):
            style_name = getattr(item.style, 'name', 'ReportBody')
            raw_text = item.text
            clean_txt = clean_html(raw_text)
            if not clean_txt:
                continue

            p = doc.add_paragraph()
            
            if style_name == 'CoverTitle':
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                run = p.add_run(clean_txt)
                run.font.name = 'Times New Roman'
                run.font.size = Pt(24)
                run.font.bold = True
                run.font.color.rgb = NAVY_RGB
                p.paragraph_format.space_after = Pt(6)

            elif style_name == 'CoverSubtitle':
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                run = p.add_run(clean_txt)
                run.font.name = 'Times New Roman'
                run.font.size = Pt(13)
                run.font.bold = True
                run.font.color.rgb = GOLD_RGB
                p.paragraph_format.space_after = Pt(16)

            elif style_name == 'ChapterH1':
                run = p.add_run(clean_txt)
                run.font.name = 'Times New Roman'
                run.font.size = Pt(16)
                run.font.bold = True
                run.font.color.rgb = NAVY_RGB
                p.paragraph_format.space_before = Pt(14)
                p.paragraph_format.space_after = Pt(6)

            elif style_name == 'SectionH2':
                run = p.add_run(clean_txt)
                run.font.name = 'Times New Roman'
                run.font.size = Pt(13)
                run.font.bold = True
                run.font.color.rgb = CHARCOAL_RGB
                p.paragraph_format.space_before = Pt(10)
                p.paragraph_format.space_after = Pt(4)

            elif style_name == 'SubsectionH3':
                run = p.add_run(clean_txt)
                run.font.name = 'Times New Roman'
                run.font.size = Pt(11)
                run.font.bold = True
                run.font.color.rgb = CHARCOAL_RGB
                p.paragraph_format.space_before = Pt(8)
                p.paragraph_format.space_after = Pt(2)

            elif style_name == 'CaptionStyle':
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                run = p.add_run(clean_txt)
                run.font.name = 'Times New Roman'
                run.font.size = Pt(9.5)
                run.font.italic = True
                run.font.color.rgb = MUTED_RGB
                p.paragraph_format.space_after = Pt(8)

            elif style_name == 'CodeSnippet':
                run = p.add_run(clean_txt)
                run.font.name = 'Courier New'
                run.font.size = Pt(8.5)
                run.font.color.rgb = RGBColor(15, 23, 42)
                p.paragraph_format.left_indent = Inches(0.25)
                p.paragraph_format.space_after = Pt(6)

            elif style_name == 'ReportBullet':
                p.style = 'List Bullet'
                run = p.add_run(clean_txt)
                run.font.name = 'Times New Roman'
                run.font.size = Pt(10.5)
                run.font.color.rgb = CHARCOAL_RGB
                p.paragraph_format.line_spacing = 1.3
                p.paragraph_format.space_after = Pt(3)

            else:
                p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
                run = p.add_run(clean_txt)
                run.font.name = 'Times New Roman'
                run.font.size = Pt(11)
                run.font.color.rgb = CHARCOAL_RGB
                p.paragraph_format.line_spacing = 1.4
                p.paragraph_format.space_after = Pt(6)

        elif isinstance(item, Table):
            raw_data = item._cellvalues
            if not raw_data:
                continue
            num_rows = len(raw_data)
            num_cols = len(raw_data[0])
            t = doc.add_table(rows=num_rows, cols=num_cols)
            t.alignment = WD_TABLE_ALIGNMENT.CENTER

            for r_idx, row in enumerate(raw_data):
                for c_idx, cell_val in enumerate(row):
                    cell = t.cell(r_idx, c_idx)
                    # Extract text from cell
                    if isinstance(cell_val, Paragraph):
                        cell_txt = clean_html(cell_val.text)
                    elif isinstance(cell_val, list):
                        cell_txt = "\n".join([clean_html(x.text) if hasattr(x, 'text') else str(x) for x in cell_val])
                    else:
                        cell_txt = clean_html(str(cell_val))

                    cell.text = cell_txt
                    # Style cell paragraph
                    p = cell.paragraphs[0]
                    p.paragraph_format.space_before = Pt(2)
                    p.paragraph_format.space_after = Pt(2)
                    for r in p.runs:
                        r.font.name = 'Times New Roman'
                        r.font.size = Pt(8.5)
                        if r_idx == 0:
                            r.font.bold = True
                            r.font.color.rgb = RGBColor(255, 255, 255)
                        else:
                            r.font.color.rgb = CHARCOAL_RGB

                    if r_idx == 0:
                        set_cell_background(cell, "0F172A")
                    elif r_idx % 2 == 1:
                        set_cell_background(cell, "F8FAFC")
                    else:
                        set_cell_background(cell, "FFFFFF")

            doc.add_paragraph().paragraph_format.space_after = Pt(6)

        elif isinstance(item, KeepTogether):
            for sub_flowable in getattr(item, '_flowables', []):
                if isinstance(sub_flowable, Paragraph):
                    p = doc.add_paragraph()
                    style_name = getattr(sub_flowable.style, 'name', 'ReportBody')
                    clean_txt = clean_html(sub_flowable.text)
                    if style_name == 'CaptionStyle':
                        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                        run = p.add_run(clean_txt)
                        run.font.name = 'Times New Roman'
                        run.font.size = Pt(9.5)
                        run.font.italic = True
                        run.font.color.rgb = MUTED_RGB
                        p.paragraph_format.space_after = Pt(6)
                    else:
                        run = p.add_run(clean_txt)
                        run.font.name = 'Times New Roman'
                        run.font.size = Pt(11)
                        run.font.color.rgb = CHARCOAL_RGB

    doc.save(output_docx_path)
    print(f"[Compiler] DOCX generated: {output_docx_path} ({os.path.getsize(output_docx_path)} bytes)")

print("DOCX builder ready")
