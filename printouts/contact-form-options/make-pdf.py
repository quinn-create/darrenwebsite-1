"""Builds Contact-Form-Options.pdf: the new contact form, how it differs from the intake
form, and the three places it could go. Run from the repo root, with the demo server on :3000:
  node printouts/contact-form-options/shots.cjs && python3 printouts/contact-form-options/make-pdf.py
"""
import pathlib
import subprocess

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[1]
FONT = "../../site/node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2"
BOX = '<span class="box"></span>'

FIELDS = [
    ("Your name", "Required", "Required (\"Full name\")"),
    ("Client's name, if different", "Optional: for a parent, partner or friend reaching out for someone", "Not asked"),
    ("What it's about", "Arrested in Rutherford County / Other (pick one or both)",
     "Type of matter: First-time offense, DUI/DWI, Domestic assault, Other criminal charge, Expungement, Other"),
    ("How to reach them", "Call / Text / Email (pick any)", "Phone or Email (pick one)"),
    ("Phone", "Required if they pick Call or Text", "Required if they pick Phone"),
    ("Email", "Required if they pick Email", "Required if they pick Email"),
    ("When to hear back", "As soon as possible / Sometime this week. \"As soon as possible\" shows: "
     "\"We generally return calls within a day.\" (Darren must confirm this)", "Not asked"),
    ("County or court", "Not asked (the Rutherford County button covers the most common case)", "Optional"),
    ("Next court date", "Not asked", "Optional"),
    ("Message", "Optional, up to 1,000 characters", "Optional, up to 1,000 characters"),
    ("Time to fill in (estimate)", "About 30 seconds", "About 1–2 minutes"),
]

OPTIONS = [
    ("A", "Contact page, keep the intake form", "Recommended",
     "The new form sits on the Contact page next to the phone number. The full intake form stays at /intake/, "
     "and every \"Start your intake\" button still goes there. The Contact page links to it for people who want to give more detail.",
     ["Two choices: a quick message, or a full inquiry with the court date.",
      "Nothing else on the site changes."],
     ["Two forms to keep up to date.",
      "The firm receives two kinds of inquiry (each is labelled with the form it came from)."],
     "a-contact-desktop.png", "Option A: the Contact page with the new form (left) and the office details (right)."),
    ("B", "Replace the intake form everywhere", "",
     "The new form becomes the only form. The intake page and every \"Start your intake\" button use it, "
     "and the longer intake form is retired.",
     ["One form: simplest for visitors and for the office.",
      "Shortest to fill in, so more people may finish it."],
     ["The office no longer receives the county or next court date up front, and has to ask on the callback.",
      "Only two choices for what the matter is about (no DUI/DWI or domestic assault choice)."],
     "b-intake-replaced.png", "Option B (mock-up): the intake page with the new form in place of the intake form."),
    ("C", "Contact page and the home page", "",
     "Same as A, and the form also appears near the bottom of the home page, just above the \"Ready when you are\" band. "
     "The intake form stays.",
     ["People can send a message without leaving the home page."],
     ["A much longer home page on phones (the form adds about three screens).",
      "Competes with the \"Start your intake\" button right below it."],
     "c-home.png", "Option C (mock-up): the bottom of the home page with the form added above the closing band."),
]


def rows(items):
    return "".join(f"<tr><th>{a}</th><td>{b}</td><td>{c}</td></tr>" for a, b, c in items)


def li(items):
    return "".join(f"<li>{x}</li>" for x in items)


option_pages = "".join(
    f"""<section class="page">
  <h2>Option {k}: {title} {f'<span class="tag">{tag}</span>' if tag else ''}</h2>
  <p>{what}</p>
  <div class="procon"><div><h3>Good</h3><ul>{li(pros)}</ul></div><div><h3>Trade-offs</h3><ul>{li(cons)}</ul></div></div>
  <figure><img class="shot" src="img/{img}" alt=""><figcaption>{cap}</figcaption></figure>
</section>"""
    for k, title, tag, what, pros, cons, img, cap in OPTIONS
)

summary = "".join(
    f"<tr><th>{k}{' (recommended)' if tag else ''}</th><td>{title}</td><td>{'Stays' if k != 'B' else 'Retired'}</td></tr>"
    for k, title, tag, *_ in OPTIONS
)

html = f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Contact form options</title>
<style>
@font-face {{ font-family: Manrope; src: url('{FONT}') format('woff2'); font-weight: 200 800; }}
body {{ font-family: Manrope, Arial, sans-serif; color: #111827; font-size: 10.5pt; line-height: 1.45; margin: 0; }}
h1 {{ font-size: 22pt; margin: 0 0 4pt; letter-spacing: -0.02em; }}
h2 {{ font-size: 15pt; margin: 0 0 8pt; border-bottom: 2px solid #0e7490; padding-bottom: 3pt; }}
h3 {{ font-size: 11pt; margin: 0 0 4pt; color: #0e7490; }}
.sub {{ color: #475569; margin: 0 0 14pt; }}
.page {{ break-before: page; }}
.tag {{ font-size: 9pt; background: #cffafe; color: #0e7490; border-radius: 99px; padding: 2pt 8pt; vertical-align: middle; }}
table {{ border-collapse: collapse; width: 100%; margin: 6pt 0 12pt; font-size: 9.5pt; }}
th, td {{ border: 1px solid #cbd5e1; padding: 5pt 6pt; vertical-align: top; text-align: left; }}
thead th {{ background: #e0f2f7; }}
tbody th {{ width: 24%; background: #f8fafc; }}
tr {{ break-inside: avoid; }}
.procon {{ display: grid; grid-template-columns: 1fr 1fr; gap: 12pt; margin: 8pt 0; }}
.procon > div {{ border: 1px solid #cbd5e1; border-radius: 6pt; padding: 8pt 10pt; }}
.procon ul {{ margin: 0; padding-left: 14pt; }}
figure {{ margin: 8pt 0 0; text-align: center; }}
img.shot {{ max-width: 100%; max-height: 6.6in; border: 1px solid #94a3b8; border-radius: 4pt; }}
figcaption {{ font-size: 9pt; color: #475569; margin-top: 4pt; }}
.pair {{ display: grid; grid-template-columns: 1fr 1fr; gap: 14pt; align-items: start; }}
.pair img {{ width: 100%; border: 1px solid #94a3b8; border-radius: 4pt; }}
.pair img.tall {{ max-height: 7.2in; width: auto; max-width: 100%; }}
.note {{ background: #fef9c3; border: 1px solid #eab308; border-radius: 6pt; padding: 8pt 10pt; margin: 10pt 0; }}
.box {{ display: inline-block; width: 11pt; height: 11pt; border: 1.5px solid #111827; border-radius: 2pt; vertical-align: -2pt; margin-right: 6pt; }}
.choice {{ font-size: 12pt; margin: 8pt 0; }}
.line {{ border-bottom: 1px solid #94a3b8; height: 22pt; }}
</style></head><body>

<h1>New contact form: where should it go?</h1>
<p class="sub">Darren Drake website · Signal 1A · prepared 24 September 2026 · the screenshots are from the private preview; nothing is live</p>

<p>The new contact form is built in the Signal 1A style, from the component you chose, with the fields you asked for.
It is shorter than the existing <b>intake form</b>. The only decision left is <b>where it goes</b>. The three options:</p>
<table><thead><tr><th>Option</th><th>Where the new form appears</th><th>Full intake form</th></tr></thead><tbody>{summary}</tbody></table>

<h3>How the new form differs from the intake form</h3>
<table><thead><tr><th>Question</th><th>New contact form</th><th>Intake form (current)</th></tr></thead><tbody>{rows(FIELDS)}</tbody></table>
<p>Both forms send to the same firm inbox. Each inquiry is labelled with the form it came from, and both show success only once the firm's system has received it.</p>

<section class="page">
  <h2>The two forms side by side</h2>
  <div class="pair">
    <figure><img class="tall" src="img/form-filled.png" alt=""><figcaption>New contact form, filled in as an example. "As soon as possible" shows the callback note.</figcaption></figure>
    <figure><img class="tall" src="img/intake-form.png" alt=""><figcaption>Current intake form (at /intake/).</figcaption></figure>
  </div>
</section>

{option_pages}

<section class="page">
  <h2>Decision</h2>
  <p class="choice">{BOX}<b>A</b>: Contact page, keep the intake form (recommended)</p>
  <p class="choice">{BOX}<b>B</b>: Replace the intake form everywhere</p>
  <p class="choice">{BOX}<b>C</b>: Contact page and the home page</p>
  <div class="note"><b>Darren must confirm before launch:</b> the line "We generally return calls within a day." It is a promise to the public,
  so the site won't publish it until he approves it (or changes it).</div>
  <p><b>Other changes in this round</b> (already made in the preview):</p>
  <ul>
    <li>The home page now shows three practice areas: <b>First-Time Offenders, DUI/DWI and Domestic Assault</b>.</li>
    <li>Criminal Defense and Expungement stay on the Practice Areas page (five areas in all).</li>
    <li>The new practice pages have placeholder wording that Darren still needs to write or approve.</li>
  </ul>
  <p style="margin-top:18pt">Notes</p>
  <div class="line"></div><div class="line"></div><div class="line"></div>
  <p style="margin-top:18pt">Signed ____________________________ &nbsp;&nbsp; Date ______________</p>
</section>
</body></html>"""

out_html = HERE / "options.html"
out_pdf = ROOT / "printouts" / "Contact-Form-Options.pdf"
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
    footerTemplate: '<div style="font-size:8px;width:100%;text-align:center;color:#555">Darren Drake · Contact form options · page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
    margin: { top: "0.6in", bottom: "0.7in", left: "0.6in", right: "0.6in" } });
  await b.close();
})();
"""
try:
    subprocess.run(["node", "-e", JS, str(ROOT), str(out_html), str(out_pdf)], check=True)
finally:
    out_html.unlink(missing_ok=True)
print(out_pdf)
