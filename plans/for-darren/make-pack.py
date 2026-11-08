"""Builds the review pack for Darren (facts sheet, decisions, photo approval, sign-off).
Content comes from plans/signal-website-plan.md (Sections 3, 5, 7 and 9).
Run from the repo root: python3 plans/for-darren/make-pack.py  -> review-pack.html
"""
import html

FONT = "../../site/node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2"

def box(): return '<span class="box"></span>'

FACTS = [
    ("Business name for the website and Google", "Darren Drake Law PLLC (other versions seen: \"Darren Drake, PLLC\", \"Darren Drake Law, PLLC.\", \"Darren Drake – Attorney At Law\", \"Drake Drake &amp; Frost Attorneys at Law\" on Google Maps)"),
    ("Office address", "138 S. Cannon Ave, Murfreesboro, TN 37129"),
    ("Do visitors come to the office? (if not, we show the service area instead of the street address)", ""),
    ("Office hours", "Monday–Friday, 8am–5pm (the old form offered call times 7:30–6:30)"),
    ("\"By appointment only\" wording", "By appointment only"),
    ("Public email address", "none shown on the old site"),
    ("Fax (default: don't publish)", "615-895-0155"),
    ("Is Darren the lawyer responsible for the website? Solo, or practising with others?", ""),
    ("Counties served", "Rutherford, Davidson, Cannon, Coffee, Bedford, Wilson"),
    ("U.S. Navy service", "1996–2002, Electronics Technician; USS Kitty Hawk (Yokosuka) and USS Constellation (San Diego); one-year tour on Diego Garcia; three Navy Achievement Medals; Enlisted Surface Warfare and Aviation Warfare qualified; shipboard firefighter and damage control"),
    ("Undergraduate degree", "BS in Electronics Systems, Southern Illinois University Carbondale, May 2005"),
    ("Law degree", "Southern Illinois University School of Law (year?); summer study in Ireland (EU law)"),
    ("Law-school activities (optional)", "Helped found SIU's Veterans Legal Assistance Program; student government vice president; Phi Alpha Delta chapter president; certified law clerk, Ventura County DA's Office (the old \"successfully prosecuted\" wording will not be used)"),
    ("Bar admissions (with years)", "Tennessee; U.S. District Court, Middle District of Tennessee"),
    ("Memberships (still current?)", "Tennessee Association of Criminal Defense Lawyers (exact name?); Rutherford &amp; Cannon County Bar Association"),
    ("Community", "Volunteer firefighter since 2011; Assistant Chief, Lascassas Volunteer Fire Department (still current?)"),
    ("Past associations (recommended: don't mention)", "Drake Drake &amp; Frost; association with John Drake, David Clarke and Ryan Freeze"),
    ("Criminal defense: charge types to list", "assault, domestic assault, drug possession and sale, theft, robbery, burglary, probation violation, underage consumption, implied consent, driving on a suspended license (and others on the old site)"),
    ("Juvenile defense: does the firm take these cases?", "an old page exists"),
    ("DUI/DWI: commercial or underage drivers handled?", ""),
    ("Profiles the firm controls (link only these)", "Facebook, Avvo, Martindale, Justia, Yelp listings exist"),
]

DECISIONS = [
    ("D1", "Leave WordPress: build the new site on its own platform (Next.js on a firm-owned Vercel account)", "Yes"),
    ("D2", "Approve the edited photo, and where it's used (see the photo page)", "Approve for all four uses"),
    ("D3", "About-page photo: same upright crop as Home, from the genuine part of the photo", "Yes"),
    ("D4", "Practice pages: Claude drafts plain wording with no legal specifics; Darren writes or approves every statement about Tennessee law", "Yes"),
    ("D5", "Juvenile defense: point the old page to Criminal Defense until decided", "Yes, unless he takes these cases"),
    ("D6", "No testimonials or reviews on the new site until a written, ethics-reviewed policy exists", "Yes"),
    ("D7", "Intake: which case-management system does the firm itself use? (Clio Grow only if it is the firm's own subscription; otherwise a dedicated firm inbox)", "Answer: ____________"),
    ("D8", "Who receives inquiries (at least two named people) and how long they're kept", "Names: ____________"),
    ("D9", "Visitor statistics: Plausible (cookie-free)", "Yes"),
    ("D10", "Count taps on the phone number (no personal details)", "Yes"),
    ("D11", "\"Meet Darren\" on Home: a card of confirmed facts at launch (no stock or AI photos)", "Yes"),
    ("D12", "Optional informal question to the Board's Ethics Counsel about the site", "Ask"),
    ("D13", "The firm owns and pays for every account (domain, Cloudflare, Google, Vercel, email service, GitHub); name a billing owner", "Billing owner: ____________"),
    ("D14", "After launch, edits are made by request with a private preview first", "Yes"),
    ("D15", "Keep the old WordPress server running, untouched, for 90 days after launch", "Yes"),
    ("D16", "Launch on a quiet weekday morning with staff on the phones", "Yes"),
    ("D17", "Allow private online previews on the firm's Vercel account, behind a login", "Yes"),
]

NOT_CARRIED = [
    "\"free consultation\" (three practice pages)",
    "\"one of the highest rated\" (search description)",
    "Avvo \"Top Attorney\", NAOPIA (personal injury) and \"National Trial Lawyers Top 100\" badges",
    "\"successfully prosecuted…\" (biography)",
    "\"restored on the first attempt\" (expungement page)",
    "\"promptly respond / return calls\"; \"Client satisfaction is my number one priority\"",
    "\"big firms don't offer\"; \"a full line of legal services\"; \"whether criminal or civil\"",
    "\"Darren is a skilled Murfreesboro Attorney\" and its link to attorneymurfreesboro.com",
    "The old DUI (2016) and expungement (2012) legal details, which are out of date",
    "The \"Submit a Review\" link and the family photo",
]

def rows_facts():
    out = []
    for item, old in FACTS:
        out.append(f"<tr><td><strong>{item}</strong></td><td>{old or '&nbsp;'}</td>"
                   f"<td class='c'>{box()}</td><td class='write'>&nbsp;</td><td class='c'>{box()}</td></tr>")
    return "\n".join(out)

def rows_decisions():
    return "\n".join(f"<tr><td class='id'>{i}</td><td>{d}</td><td>{r}</td><td class='c'>{box()}</td><td class='write'>&nbsp;</td></tr>"
                     for i, d, r in DECISIONS)

page = f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Website review pack for Darren Drake</title>
<style>
@font-face {{ font-family: Manrope; src: url('{FONT}') format('woff2'); font-weight: 200 800; }}
@page {{ size: Letter; margin: 0.6in 0.6in 0.7in; }}
body {{ font-family: Manrope, Arial, sans-serif; color: #111827; font-size: 10.5pt; line-height: 1.45; }}
h1 {{ font-size: 22pt; margin: 0 0 4pt; letter-spacing: -0.02em; }}
h2 {{ font-size: 14pt; margin: 18pt 0 6pt; border-bottom: 2px solid #0e7490; padding-bottom: 3pt; break-after: avoid; }}
.lede {{ color: #374151; margin: 0 0 10pt; }}
.eyebrow {{ color: #0e7490; font-weight: 700; font-size: 9pt; letter-spacing: .08em; text-transform: uppercase; }}
table {{ width: 100%; border-collapse: collapse; margin: 6pt 0; }}
th, td {{ border: 1px solid #9ca3af; padding: 5pt 6pt; vertical-align: top; text-align: left; }}
th {{ background: #e5f6f9; font-size: 9pt; }}
tr {{ break-inside: avoid; }}
td.c {{ text-align: center; width: 0.55in; }}
td.id {{ width: 0.4in; font-weight: 700; }}
td.write {{ width: 1.7in; }}
.box {{ display: inline-block; width: 11pt; height: 11pt; border: 1.5px solid #111827; border-radius: 2px; }}
.note {{ background: #f3f4f6; border-left: 4px solid #0e7490; padding: 8pt 10pt; margin: 8pt 0; }}
.sig {{ margin-top: 14pt; display: grid; grid-template-columns: 1fr 1fr; gap: 18pt; }}
.line {{ border-bottom: 1px solid #111827; height: 22pt; }}
.pb {{ break-before: page; }}
ul {{ margin: 4pt 0; padding-left: 16pt; }}
.small {{ font-size: 9pt; color: #4b5563; }}
.photo {{ display: flex; gap: 14pt; align-items: flex-start; }}
.photo img {{ width: 1.9in; border: 1px solid #9ca3af; }}
</style></head><body>

<div class="eyebrow">Darren Drake · Website redesign (Signal 1A)</div>
<h1>Review pack for Darren</h1>
<p class="lede">Prepared 24 September 2026. Nothing goes on the new website until you've confirmed it here. Please tick, correct or strike each item, sign the last page, and return it. Most items take a few seconds.</p>
<div class="note"><strong>How to fill this in.</strong> "Old site says" is what ddrakelaw.com shows today; it is <em>not</em> confirmed. For each row tick <strong>Correct</strong>, or write the right wording under <strong>Change to</strong>, or tick <strong>Don't publish</strong>.</div>

<h2>1. Facts sheet</h2>
<table><thead><tr><th>Item</th><th>Old site says (unconfirmed)</th><th>Correct</th><th>Change to</th><th>Don't publish</th></tr></thead>
<tbody>
<tr><td><strong>Phone number</strong></td><td>(615) 546-5551 (the only number on the new site)</td><td class='c'>{box()}</td><td class='write'>&nbsp;</td><td class='c'>—</td></tr>
{rows_facts()}
</tbody></table>

<h2 class="pb">2. Decisions</h2>
<p class="lede">Each row shows our recommendation. Tick <strong>Agree</strong>, or write your choice.</p>
<table><thead><tr><th>#</th><th>Decision</th><th>Recommended</th><th>Agree</th><th>Your choice</th></tr></thead>
<tbody>{rows_decisions()}</tbody></table>

<h2 class="pb">3. Photo approval</h2>
<div class="photo"><img src="../images/crop-hero-4x5.jpg" alt="The edited portrait as it would appear on the website">
<div>
<p>The website uses an edited version of your current portrait. The face and features were not reshaped or replaced, but please compare it with the original before signing.</p>
<div class="note">I approve publication of the edited portrait of me (file darren-drake-portrait-signal.webp). I understand it was made from my current portrait by replacing the background (including around my head and shoulders), adjusting the colors of the whole image, and adding about 130 pixels of jacket sleeve and shoulder on the left and a small strip at the lower right with an editing tool. My face and features were not reshaped or replaced.</div>
<p>I approve its use on: {box()} ddrakelaw.com &nbsp; {box()} the link-preview image &nbsp; {box()} the Google Business Profile &nbsp; {box()} directory listings</p>
<p>The firm {box()} has &nbsp; {box()} does not yet have the photographer's permission to use edited versions. Photographer: ______________________</p>
<p>Year the original portrait was taken: ________ (we believe 2024)</p>
<p>{box()} I prefer to use the original, unedited portrait instead.</p>
</div></div>

<h2>4. Old-site wording that will not be carried over</h2>
<p class="lede">These phrases or items conflict with Tennessee's lawyer-advertising rules or are out of date, as we read them. Tick any you want to discuss.</p>
<ul>{''.join(f'<li>{box()} &nbsp;{x}</li>' for x in NOT_CARRIED)}</ul>

<h2>5. Wording to approve</h2>
<table><thead><tr><th>Where</th><th>Proposed wording</th><th>Approve</th><th>Change to</th></tr></thead><tbody>
<tr><td>Home headline</td><td>Your next step starts with a conversation.</td><td class='c'>{box()}</td><td class='write'>&nbsp;</td></tr>
<tr><td>Home supporting line</td><td>Tell Darren Drake about your legal matter and how to reach you.</td><td class='c'>{box()}</td><td class='write'>&nbsp;</td></tr>
<tr><td>Main button</td><td>Start your intake</td><td class='c'>{box()}</td><td class='write'>&nbsp;</td></tr>
<tr><td>Next to the form</td><td>Please share a brief overview and your contact details. Do not include sensitive documents or detailed confidential information in this initial inquiry. Sending this form does not create an attorney-client relationship.</td><td class='c'>{box()}</td><td class='write'>&nbsp;</td></tr>
<tr><td>After sending</td><td>Your inquiry was received. Submitting it does not establish representation.</td><td class='c'>{box()}</td><td class='write'>&nbsp;</td></tr>
</tbody></table>

<h2>6. Sign-off</h2>
<p>I have reviewed this pack. The items ticked "Correct" or corrected above may be published on the new website once it has been reviewed again in private preview.</p>
<div class="sig"><div><div class="line"></div><div class="small">Darren Drake, signature</div></div><div><div class="line"></div><div class="small">Date</div></div></div>
<p class="small" style="margin-top:18pt">Questions? The full plan is in plans/signal-website-plan.md. This pack does not publish anything, and it is not legal advice.</p>
</body></html>"""
open("plans/for-darren/review-pack.html", "w").write(page)
print("written")
