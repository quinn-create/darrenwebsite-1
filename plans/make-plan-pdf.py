"""Builds a printable PDF of plans/signal-website-plan.md.
Run from the repo root: python3 plans/make-plan-pdf.py
Needs: pip install markdown; the site's node_modules (playwright-core, Manrope font).
Output: plans/Darren-Drake-Website-Plan.pdf (plan.html is a temporary file next to it).
"""
import pathlib
import re
import subprocess

import markdown

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
FONT = "../site/node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2"

LIST = re.compile(r"^(\s*)([-*+]|\d+\.)\s")


def normalise(text):
    """Python-Markdown needs a blank line before a list and 4-space nesting;
    the plan uses GitHub style (no blank line, 2-space nesting)."""
    out, prev = [], ""
    for line in text.splitlines():
        m = LIST.match(line)
        if m:
            indent = len(m.group(1))
            line = " " * (indent * 2) + line.lstrip()
            if prev.strip() and not LIST.match(prev) and not prev.startswith(" "):
                out.append("")
        out.append(line)
        prev = line
    return "\n".join(out)


body = markdown.markdown(
    normalise((HERE / "signal-website-plan.md").read_text(encoding="utf-8")),
    extensions=["tables", "sane_lists", "toc", "fenced_code"],
)

CSS = f"""
@font-face {{ font-family: Manrope; src: url('{FONT}') format('woff2'); font-weight: 200 800; }}
body {{ font-family: Manrope, Arial, sans-serif; color: #111827; font-size: 10pt; line-height: 1.45; }}
h1 {{ font-size: 22pt; margin: 0 0 6pt; letter-spacing: -0.02em; }}
h2 {{ font-size: 15pt; margin: 20pt 0 6pt; border-bottom: 2px solid #0e7490; padding-bottom: 3pt; break-after: avoid; }}
h2#plan-at-a-glance, h2[id^="1-"], h2[id^="appendix"] {{ break-before: page; }}
h3 {{ font-size: 12pt; margin: 14pt 0 4pt; color: #0e7490; break-after: avoid; }}
h4 {{ font-size: 10.5pt; margin: 10pt 0 3pt; break-after: avoid; }}
p, li {{ orphans: 3; widows: 3; }}
ul, ol {{ padding-left: 18pt; margin: 4pt 0 8pt; }}
li {{ margin: 2pt 0; }}
table {{ border-collapse: collapse; width: 100%; margin: 6pt 0 10pt; font-size: 8.8pt; }}
th, td {{ border: 1px solid #cbd5e1; padding: 4pt 5pt; vertical-align: top; text-align: left; }}
th {{ background: #e0f2f7; }}
tr {{ break-inside: avoid; }}
thead {{ display: table-header-group; }}
code {{ font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 8.5pt; background: #f1f5f9; padding: 0 2pt; border-radius: 2pt; word-break: break-word; }}
pre {{ background: #f1f5f9; padding: 6pt; border-radius: 4pt; white-space: pre-wrap; font-size: 8.5pt; break-inside: avoid; }}
pre code {{ background: none; padding: 0; }}
blockquote {{ border-left: 3px solid #0e7490; margin: 6pt 0; padding: 2pt 10pt; color: #334155; }}
hr {{ border: 0; border-top: 1px solid #cbd5e1; margin: 12pt 0; }}
img {{ max-width: 100%; max-height: 6.2in; display: block; margin: 6pt auto; border: 1px solid #cbd5e1; break-inside: avoid; }}
a {{ color: #0e7490; }}
"""

html = f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>Darren Drake website plan</title><style>{CSS}</style></head><body>{body}</body></html>"""

out_html = HERE / "plan.html"
out_pdf = HERE / "Darren-Drake-Website-Plan.pdf"
out_html.write_text(html, encoding="utf-8")

JS = r"""
const { chromium } = require(process.argv[1] + "/site/node_modules/playwright-core");
(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const p = await b.newPage();
  await p.goto("file://" + process.argv[2], { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: process.argv[3], format: "Letter", printBackground: true, displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    footerTemplate: '<div style="font-size:8px;width:100%;text-align:center;color:#555">Darren Drake · Website build and launch plan · page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
    margin: { top: "0.6in", bottom: "0.7in", left: "0.6in", right: "0.6in" } });
  await b.close();
})();
"""
try:
    subprocess.run(["node", "-e", JS, str(ROOT), str(out_html), str(out_pdf)], check=True)
finally:
    out_html.unlink(missing_ok=True)
print(out_pdf)
