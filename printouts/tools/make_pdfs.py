"""Builds printable PDF handouts of every Darren Drake design option.

Outputs (in OUT):
  00-Darren-Drake-Design-Options-All.pdf   everything in one booklet
  one PDF per concept, and one per built demo site
"""
import os
import sys
from io import BytesIO

from PIL import Image
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import landscape, letter
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

WORK = sys.argv[1]
OUT = sys.argv[2]
os.makedirs(OUT, exist_ok=True)

FONT_DIR = "/usr/share/fonts/truetype/liberation"
pdfmetrics.registerFont(TTFont("Sans", f"{FONT_DIR}/LiberationSans-Regular.ttf"))
pdfmetrics.registerFont(TTFont("Sans-Bold", f"{FONT_DIR}/LiberationSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Sans-Italic", f"{FONT_DIR}/LiberationSans-Italic.ttf"))

PAGE_W, PAGE_H = landscape(letter)  # 792 x 612 pt
M = 36  # 0.5 in margin
INK = HexColor("#1B2230")
MUTED = HexColor("#5A6475")
RULE = HexColor("#D6DAE2")
ACCENT = HexColor("#2C4FB8")
DATE = "September 24, 2026"
FOOT = "Darren Drake · Website design options"

# ---------- content ----------------------------------------------------------

CONCEPTS = [
    {
        "file": "01-signal", "code": "1A", "name": "Signal", "variant": "Concept A",
        "status": "Shortlisted and built as a working demo",
        "feel": "Modern and bold. A dark, confident look with large type, a bright cyan intake button and a soft glow behind Darren's photo.",
        "colors": [("#090F1C", "Navy background"), ("#131F31", "Panels"), ("#67E8F9", "Cyan button"), ("#8B5CF6", "Violet glow")],
        "type": "Manrope (bold modern sans-serif) throughout",
        "headline": "Your next step starts with a conversation.",
        "button": "Start your intake",
        "strengths": ["Strongest visual impact of the five directions", "Stands out from typical law-firm websites", "Intake button is the brightest thing on the page"],
        "notes": ["The shield icon on the Criminal Defense card was replaced with a briefcase in the built site (the style rules avoid badge-like symbols)."],
    },
    {
        "file": "01-signal-b", "code": "1B", "name": "Signal", "variant": "Variation B: spotlight frame",
        "status": "Alternate layout",
        "feel": "The Signal look with a small \"DD\" monogram, a spotlight shining onto the photo frame, and a band that shows the three contact steps right under the hero.",
        "colors": [("#090F1C", "Navy background"), ("#131F31", "Panels"), ("#67E8F9", "Cyan accents"), ("#8B5CF6", "Violet edge")],
        "type": "Manrope (bold modern sans-serif) throughout",
        "headline": "Your next step starts with a conversation.",
        "button": "Start your intake",
        "strengths": ["Most dramatic of the Signal layouts", "Explains what happens after someone reaches out, near the top of the page"],
        "notes": [],
    },
    {
        "file": "01-signal-c", "code": "1C", "name": "Signal", "variant": "Variation C: raised panel",
        "status": "Alternate layout",
        "feel": "The Signal look with the headline and button set on their own navy panel, and practice areas shown as wide numbered rows.",
        "colors": [("#090F1C", "Navy background"), ("#131F31", "Panel"), ("#67E8F9", "Cyan button"), ("#8B5CF6", "Violet glow")],
        "type": "Manrope (bold modern sans-serif) throughout",
        "headline": "Your next step starts with a conversation.",
        "button": "Start your intake",
        "strengths": ["Most organized and easiest to scan of the Signal layouts", "Location is called out clearly at the top"],
        "notes": [],
    },
    {
        "file": "02-chambers", "code": "2", "name": "Chambers", "variant": "Concept",
        "status": "The style guide's recommended starting direction",
        "feel": "Quiet and premium. Warm ivory, a deep wine-colored button, classic serif headlines and plenty of open space.",
        "colors": [("#F7F3ED", "Ivory background"), ("#562C39", "Wine button"), ("#231F20", "Ink text"), ("#B29B75", "Brass detail")],
        "type": "Cormorant Garamond (classic serif) headings, Manrope body text",
        "headline": "A considered approach to your defense.",
        "button": "Begin your intake",
        "strengths": ["Most personal and upscale feel", "Calm, uncluttered layout suits worried visitors", "Numbered practice rows instead of boxes"],
        "notes": [],
    },
    {
        "file": "03-monument", "code": "3", "name": "Monument", "variant": "Concept",
        "status": "Alternate direction",
        "feel": "Cinematic and serious. Midnight navy with ivory high-contrast serif type, a brass button and thin brass lines. The photo runs to the edge of the page.",
        "colors": [("#101B27", "Midnight navy"), ("#1B2A39", "Panels"), ("#FAF7F0", "Ivory text"), ("#D5B47C", "Brass button")],
        "type": "Bodoni Moda (high-contrast serif) headings, Inter body text",
        "headline": "Serious attention to your defense.",
        "button": "Start your intake",
        "strengths": ["Most dramatic premium option", "Large photo makes Darren the focus", "Energy comes from scale, not effects"],
        "notes": ["The photo panel is wide, so Darren's portrait is cropped to head and shoulders here."],
    },
    {
        "file": "04-counsel", "code": "4", "name": "Counsel", "variant": "Concept",
        "status": "Alternate direction",
        "feel": "Warm and reassuring. Soft cream, forest green, friendly serif headlines and rounded white cards.",
        "colors": [("#F5F5EE", "Cream background"), ("#285A48", "Forest green button"), ("#203831", "Green-ink text"), ("#CBB398", "Warm tan detail")],
        "type": "Lora (friendly serif) headings, Source Sans 3 body text",
        "headline": "You do not have to figure out the next step alone.",
        "button": "Tell us about your matter",
        "strengths": ["Warmest and most approachable", "Speaks directly to someone who is anxious or unsure"],
        "notes": ["The short lines under each practice card (for example \"A cleaner record. A brighter future.\") were added by the image generator. They are not approved wording and would not be used."],
    },
    {
        "file": "05-precision", "code": "5A", "name": "Precision", "variant": "Concept A",
        "status": "Alternate layout",
        "feel": "Crisp and clear. Light background, navy text, a cobalt blue button and a strong grid. The photo sits in a small card with Darren's name.",
        "colors": [("#F8FAFD", "Light background"), ("#142238", "Navy text"), ("#1746C4", "Cobalt button"), ("#D8E6FF", "Pale blue tint")],
        "type": "Inter (clean modern sans-serif) throughout",
        "headline": "A clear first step for your legal matter.",
        "button": "Start your intake",
        "strengths": ["Clearest and simplest to read", "Cheapest to build and maintain"],
        "notes": [],
    },
    {
        "file": "05-precision-b", "code": "5B", "name": "Precision", "variant": "Variation B: next steps",
        "status": "Shortlisted and built as a working demo",
        "feel": "The Precision look with the three next steps right under the button, a larger photo, and practice cards on a pale blue band.",
        "colors": [("#F8FAFD", "Light background"), ("#142238", "Navy text"), ("#1746C4", "Cobalt button"), ("#D8E6FF", "Pale blue band")],
        "type": "Inter (clean modern sans-serif) throughout",
        "headline": "A clear first step for your legal matter.",
        "button": "Start your intake",
        "strengths": ["Most reassuring about what happens next", "Clean, professional and easy to scan"],
        "notes": [
            "The image spells \"Tennessee\" as \"Tennesse\". This is fixed in the built site.",
            "The scales-of-justice icon was replaced with a briefcase in the built site.",
        ],
    },
    {
        "file": "05-precision-c", "code": "5C", "name": "Precision", "variant": "Variation C: editorial grid",
        "status": "Alternate layout",
        "feel": "The Precision look with an oversized headline, the button and phone number in one row, and practice areas as clean columns without boxes.",
        "colors": [("#F8FAFD", "Light background"), ("#142238", "Navy text"), ("#1746C4", "Cobalt button"), ("#D8E6FF", "Pale blue tint")],
        "type": "Inter (clean modern sans-serif) throughout",
        "headline": "A clear first step for your legal matter.",
        "button": "Start your intake",
        "strengths": ["Cleanest and most confident layout", "Very large, easy-to-read headline"],
        "notes": [],
    },
]

SITES = [
    {
        "dir": "site", "file": "Signal-Demo-Website", "name": "Signal", "concept": "01-signal",
        "summary": "A working demo of the Signal design (concept 1A), with every page and a full intake form.",
        "extra_notes": [],
    },
    {
        "dir": "site-precision", "file": "Precision-Demo-Website", "name": "Precision", "concept": "05-precision-b",
        "summary": "A working demo of the Precision design (variation 5B), with every page and a full intake form.",
        "extra_notes": ["Decision needed: keep or remove the blue \"DD\" square beside Darren's name in the header. The style guide reserves that mark for the small browser-tab icon."],
    },
]

STILL_NEEDED = [
    "Where the intake form should send inquiries (email, case-management system, etc.)",
    "Office address, office hours and email address",
    "The firm's legal business name for the footer",
    "Confirmed biography details: Navy service, community involvement, education and bar admissions",
    "Wording for the practice-area pages and answers to the FAQ questions",
    "Which counties the firm serves",
    "A privacy notice (required before launch)",
    "Final approval of headlines, button wording and the phone number (615) 546-5551",
]

# ---------- helpers ----------------------------------------------------------

_img_cache = {}


def img_reader(path, max_w=None, crop=None):
    """Loads an image as a JPEG-compressed ImageReader to keep PDFs small."""
    key = (path, max_w, crop)
    if key in _img_cache:
        return _img_cache[key]
    im = Image.open(path).convert("RGB")
    if crop:
        im = im.crop(crop)
    if max_w and im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    buf = BytesIO()
    im.save(buf, "JPEG", quality=86, optimize=True)
    buf.seek(0)
    r = (ImageReader(buf), im.width, im.height)
    _img_cache[key] = r
    return r


def draw_image(c, reader, x, y, box_w, box_h, border=True, align="center"):
    """Fits an image inside a box (bottom-left x, y) and returns its drawn rect."""
    r, w, h = reader
    s = min(box_w / w, box_h / h)
    dw, dh = w * s, h * s
    dx = x + (box_w - dw) / 2 if align == "center" else x
    dy = y + (box_h - dh)  # top-aligned
    c.drawImage(r, dx, dy, dw, dh)
    if border:
        c.setStrokeColor(RULE)
        c.setLineWidth(0.75)
        c.rect(dx, dy, dw, dh, stroke=1, fill=0)
    return dx, dy, dw, dh


def wrap(text, font, size, width):
    words, lines, line = text.split(), [], ""
    for w in words:
        trial = (line + " " + w).strip()
        if pdfmetrics.stringWidth(trial, font, size) <= width:
            line = trial
        else:
            lines.append(line)
            line = w
    if line:
        lines.append(line)
    return lines


def text_block(c, text, x, y, width, font="Sans", size=11, leading=None, color=INK):
    leading = leading or size * 1.4
    c.setFont(font, size)
    c.setFillColor(color)
    for ln in wrap(text, font, size, width):
        c.drawString(x, y, ln)
        y -= leading
    return y


def bullets(c, items, x, y, width, size=11, color=INK):
    for it in items:
        lines = wrap(it, "Sans", size, width - 14)
        c.setFillColor(ACCENT)
        c.circle(x + 3, y + size * 0.32, 1.8, stroke=0, fill=1)
        c.setFillColor(color)
        c.setFont("Sans", size)
        for ln in lines:
            c.drawString(x + 14, y, ln)
            y -= size * 1.4
        y -= 3
    return y


class Doc:
    """Wraps a reportlab canvas with page chrome and numbering."""

    def __init__(self, path, title):
        self.c = canvas.Canvas(path, pagesize=(PAGE_W, PAGE_H))
        self.c.setTitle(title)
        self.c.setAuthor("Prepared for Darren Drake")
        self.c.setSubject("Website design options (concepts and demo, not the live website)")
        self.page = 0

    def new_page(self, eyebrow, title, subtitle=None):
        c = self.c
        if self.page:
            c.showPage()
        self.page += 1
        c.setFillColor(HexColor("#FFFFFF"))
        c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
        top = PAGE_H - M
        c.setFillColor(ACCENT)
        c.setFont("Sans-Bold", 9)
        c.drawString(M, top - 9, eyebrow.upper())
        c.setFillColor(INK)
        c.setFont("Sans-Bold", 20)
        c.drawString(M, top - 32, title)
        y = top - 32
        if subtitle:
            c.setFont("Sans", 11)
            c.setFillColor(MUTED)
            c.drawString(M, y - 17, subtitle)
            y -= 17
        # footer
        c.setStrokeColor(RULE)
        c.setLineWidth(0.75)
        c.line(M, M - 4, PAGE_W - M, M - 4)
        c.setFont("Sans", 8.5)
        c.setFillColor(MUTED)
        c.drawString(M, M - 16, f"{FOOT} · Concepts and demo only, not the live website · Prepared {DATE}")
        c.drawRightString(PAGE_W - M, M - 16, f"Page {self.page}")
        return y - 14  # first usable y below the header

    def save(self):
        self.c.save()


# ---------- page builders ----------------------------------------------------


def cover(doc, heading, lines):
    c = doc.c
    if doc.page:
        c.showPage()
    doc.page += 1
    c.setFillColor(HexColor("#F3F5F9"))
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    c.setFillColor(ACCENT)
    c.rect(M, PAGE_H - 150, 48, 4, stroke=0, fill=1)
    c.setFillColor(ACCENT)
    c.setFont("Sans-Bold", 11)
    c.drawString(M, PAGE_H - 175, "DARREN DRAKE · ATTORNEY AT LAW")
    c.setFillColor(INK)
    y = PAGE_H - 215
    for ln in wrap(heading, "Sans-Bold", 34, PAGE_W - 2 * M):
        c.setFont("Sans-Bold", 34)
        c.drawString(M, y, ln)
        y -= 42
    y -= 6
    for ln in lines:
        y = text_block(c, ln, M, y, 560, size=13, color=MUTED) - 6
    c.setFont("Sans", 9.5)
    c.setFillColor(MUTED)
    c.drawString(M, M + 10, f"Prepared {DATE}. Concept images and demo screenshots only. The live website ddrakelaw.com has not been changed.")


def concept_pages(doc, s):
    c = doc.c
    title = f"{s['name']} · {s['variant']}"
    y = doc.new_page(f"Design option {s['code']}", title, s["status"])
    reader = img_reader(f"{WORK}/concepts/{s['file']}.png", max_w=2000)
    box_h = y - (M + 4) - 26
    dx, dy, dw, dh = draw_image(c, reader, M, M + 26, PAGE_W - 2 * M, box_h)
    c.setFont("Sans-Italic", 8.5)
    c.setFillColor(MUTED)
    c.drawString(dx, dy - 12, "Homepage concept, desktop. Darren's supplied portrait has been placed into the photo frame. Lettering was drawn by an image generator; the real site uses real text and fonts.")

    # details page
    y = doc.new_page(f"Design option {s['code']}", f"About {s['name']}" + ("" if s["variant"] in ("Concept",) else f" ({s['variant'].split(':')[0]})"))
    col_w = (PAGE_W - 2 * M - 36) / 2
    lx, rx = M, M + col_w + 36
    ly = y - 8
    c.setFont("Sans-Bold", 11); c.setFillColor(INK); c.drawString(lx, ly, "Look and feel"); ly -= 18
    ly = text_block(c, s["feel"], lx, ly, col_w, size=11) - 12
    c.setFont("Sans-Bold", 11); c.setFillColor(INK); c.drawString(lx, ly, "Main colors"); ly -= 20
    for hexv, label in s["colors"]:
        c.setFillColor(HexColor(hexv)); c.setStrokeColor(RULE); c.setLineWidth(0.75)
        c.roundRect(lx, ly - 6, 26, 18, 3, stroke=1, fill=1)
        c.setFillColor(INK); c.setFont("Sans", 10.5); c.drawString(lx + 36, ly + 4, label)
        c.setFillColor(MUTED); c.setFont("Sans", 9); c.drawString(lx + 36, ly - 7, hexv)
        ly -= 28
    ly -= 8
    c.setFont("Sans-Bold", 11); c.setFillColor(INK); c.drawString(lx, ly, "Type"); ly -= 18
    ly = text_block(c, s["type"], lx, ly, col_w, size=11)

    ry = y - 8
    c.setFont("Sans-Bold", 11); c.setFillColor(INK); c.drawString(rx, ry, "Headline"); ry -= 18
    ry = text_block(c, f"“{s['headline']}”", rx, ry, col_w, font="Sans-Italic", size=12) - 10
    c.setFont("Sans-Bold", 11); c.setFillColor(INK); c.drawString(rx, ry, "Main button"); ry -= 18
    ry = text_block(c, s["button"], rx, ry, col_w, size=11) - 10
    c.setFont("Sans-Bold", 11); c.setFillColor(INK); c.drawString(rx, ry, "Strengths"); ry -= 18
    ry = bullets(c, s["strengths"], rx, ry, col_w) - 8
    if s["notes"]:
        c.setFont("Sans-Bold", 11); c.setFillColor(INK); c.drawString(rx, ry, "Notes"); ry -= 18
        ry = bullets(c, s["notes"], rx, ry, col_w, size=10.5, color=MUTED)
    c.setFont("Sans", 10); c.setFillColor(MUTED)
    c.drawString(lx, M + 12, "Every option uses the same firm details, menu and intake form, so they can be compared fairly.")


def site_pages(doc, s):
    c = doc.c
    d = f"{WORK}/{s['dir']}"
    usable_w = PAGE_W - 2 * M

    # 1. homepage full length on a computer, in equal slices
    full = Image.open(f"{d}/desktop-home-full.jpg")
    fw, fh = full.size
    box_h_guess = PAGE_H - 2 * M - 70
    max_slice = int(fw * box_h_guess / usable_w)
    n = -(-fh // max_slice)
    slice_h = -(-fh // n)
    for i in range(n):
        top = i * slice_h
        bottom = min(fh, top + slice_h)
        sub = s["summary"] if i == 0 else "Scrolling down the homepage on a computer"
        y = doc.new_page(f"{s['name']} demo website", f"Homepage on a computer (part {i + 1} of {n})", sub)
        draw_image(c, img_reader(f"{d}/desktop-home-full.jpg", max_w=2000, crop=(0, top, fw, bottom)), M, M + 10, usable_w, y - M - 10)

    # 2. other desktop pages
    for key, label in [("practice", "A practice-area page (DUI/DWI)"), ("about", "About Darren"), ("contact", "Contact"), ("intake", "Intake form")]:
        y = doc.new_page(f"{s['name']} demo website", label, "First screen on a computer")
        draw_image(c, img_reader(f"{d}/desktop-{key}.jpg", max_w=2000), M, M + 10, usable_w, y - M - 10)

    # 3. phones
    def phones(title, subtitle, items):
        y = doc.new_page(f"{s['name']} demo website", title, subtitle)
        gap = 28
        box_h = y - M - 40
        r0 = img_reader(f"{d}/phone-{items[0][0]}.jpg", max_w=780)
        w = box_h * r0[1] / r0[2]
        total = len(items) * w + (len(items) - 1) * gap
        x = (PAGE_W - total) / 2
        for key, cap in items:
            dx, dy, dw, dh = draw_image(c, img_reader(f"{d}/phone-{key}.jpg", max_w=780), x, M + 34, w, box_h)
            c.setFont("Sans-Bold", 10); c.setFillColor(INK)
            c.drawCentredString(dx + dw / 2, dy - 14, cap)
            x += w + gap

    phones("On a phone", "The main button appears before the photo, and the menu opens full screen",
           [("home", "Homepage"), ("menu", "Menu open"), ("intake", "Intake form")])
    phones("How the intake form responds", "Test data only. The form is in demo mode until it is connected to the firm",
           [("intake-errors", "Missing answers are listed"), ("intake-demo-not-sent", "Demo mode: nothing is sent"), ("intake-received", "Confirmation (test setup)")])

    # 4. notes
    y = doc.new_page(f"{s['name']} demo website", "What this demo is, and what's still needed")
    col_w = (usable_w - 36) / 2
    lx, rx = M, M + col_w + 36
    ly = y - 8
    c.setFont("Sans-Bold", 11); c.setFillColor(INK); c.drawString(lx, ly, "About this demo"); ly -= 18
    ly = bullets(c, [
        "Runs as a private preview only. It is not published, and ddrakelaw.com has not been changed.",
        "Uses only confirmed firm details. Anything not yet confirmed is shown as a bracketed placeholder, such as [CONFIRM WITH FIRM].",
        "The intake form shows \"Demo form, not connected\" and never says an inquiry was received unless it truly was.",
        "Checked for accessibility (WCAG 2.2 AA), phone screens, keyboard use and speed.",
    ] + s["extra_notes"], lx, ly, col_w, size=10.5)
    ry = y - 8
    c.setFont("Sans-Bold", 11); c.setFillColor(INK); c.drawString(rx, ry, "Needed from the firm before launch"); ry -= 18
    for item in STILL_NEEDED:
        c.setStrokeColor(MUTED); c.setLineWidth(0.9)
        c.rect(rx, ry - 2, 9, 9, stroke=1, fill=0)
        lines = wrap(item, "Sans", 10.5, col_w - 18)
        c.setFont("Sans", 10.5); c.setFillColor(INK)
        for ln in lines:
            c.drawString(rx + 18, ry, ln); ry -= 14.5
        ry -= 5


def overview_page(doc):
    c = doc.c
    y = doc.new_page("Overview", "All design options at a glance", "Two options (1A Signal and 5B Precision) have been built as working demos")
    cols, rows = 3, 3
    gap = 14
    label_h = 22
    avail_h = (y - 4) - (M + 8)
    img_h = min((avail_h - rows * label_h - (rows - 1) * 6) / rows, ((PAGE_W - 2 * M - (cols - 1) * gap) / cols) * 1520 / 2688)
    cell_w = img_h * 2688 / 1520
    cell_h = img_h + label_h
    x0 = (PAGE_W - (cols * cell_w + (cols - 1) * gap)) / 2
    ytop = y - 4
    for i, s in enumerate(CONCEPTS):
        cx = x0 + (i % cols) * (cell_w + gap)
        cy = ytop - (i // cols) * (cell_h + 6) - img_h
        draw_image(c, img_reader(f"{WORK}/concepts/{s['file']}.png", max_w=900), cx, cy, cell_w, img_h)
        c.setFont("Sans-Bold", 9.5); c.setFillColor(INK)
        label = f"{s['code']} · {s['name']}" + ("" if s["variant"] == "Concept" else f" {s['variant'].split(':')[0].replace('Concept ', '').replace('Variation ', '')}")
        c.drawString(cx, cy - 12, label)
        if "built" in s["status"]:
            c.setFont("Sans-Bold", 8.5); c.setFillColor(ACCENT)
            c.drawRightString(cx + cell_w, cy - 12, "BUILT AS DEMO")


# ---------- build ------------------------------------------------------------

built = []

# combined booklet
all_path = f"{OUT}/00-Darren-Drake-Design-Options-All.pdf"
doc = Doc(all_path, "Darren Drake: website design options")
cover(doc, "Website design options", [
    "Nine homepage concepts across five design directions, and two working demo websites.",
    "Each concept uses the same firm details and the same intake form, so they can be compared side by side.",
])
overview_page(doc)
for s in CONCEPTS:
    concept_pages(doc, s)
for s in SITES:
    site_pages(doc, s)
doc.save()
built.append(all_path)

# one per concept
for s in CONCEPTS:
    slug = f"{s['code']}-{s['name']}" + ("" if s["variant"] == "Concept" else "-" + s["variant"].split(":")[0].replace(" ", "-"))
    path = f"{OUT}/{slug}.pdf"
    doc = Doc(path, f"Darren Drake: design option {s['code']} ({s['name']})")
    concept_pages(doc, s)
    doc.save()
    built.append(path)

# one per demo site
for s in SITES:
    path = f"{OUT}/{s['file']}.pdf"
    doc = Doc(path, f"Darren Drake: {s['name']} demo website")
    cover(doc, f"{s['name']} demo website", [s["summary"], "Screenshots of a private preview. Not published."])
    site_pages(doc, s)
    doc.save()
    built.append(path)

for p in built:
    print(f"{os.path.getsize(p) / 1e6:5.1f} MB  {os.path.basename(p)}")
