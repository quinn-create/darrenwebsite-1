# SEO, local search, content and measurement plan for the Signal site

Nothing in the repo was modified and nothing on ddrakelaw.com was changed. I only made read-only GET requests to the public site. Anything marked **[CONFIRM]** needs the firm to confirm it. Anything marked **[ATTORNEY TO WRITE]** must be written or approved by Darren.

## 0. What the live site shows (read-only checks, 2026-09-24)

These findings shape the rest of the plan.

**Setup**
- The site runs WordPress 6.9.9 with the Twenty Fourteen theme, Yoast SEO and Contact Form 7, behind Cloudflare.
- The main address is `https://ddrakelaw.com/`. The `http` and `www` versions already 301 to it.
- The Yoast structured data only covers WebPage, BreadcrumbList and WebSite. There is no LegalService or Person markup.
- No Google Analytics tag was found.

**Pages Yoast lists (all return 200)**
- `/`, `/areas-of-practice/`, `/areas-of-practice/criminaldefense/`, `/areas-of-practice/dui/`, `/areas-of-practice/expungement/`
- `/areas-of-practice/juvenile-defense/`: **a practice area that is not on the confirmed list**
- `/testimonials/`: the page is broken and shows a Google Maps "REQUEST_DENIED … enable Billing" error
- `/submit-a-testimonial/`, `/contact/`
- `/blog/` returns 200 but shows "Nothing Found", and `/about/` returns 404.
- 17 image "attachment" pages are indexed, for example `/criminal-defense/darren-drake/`, whose title is the office address, and `/areas-of-practice/divorce-2/`.

**Spam-like sitemap at `/sitemap.xml`**
- It is a 9.2 MB static file with **41,660 URLs** like `/6668243_qpkgeeqfkxmexnek_…`, all dated 2016-09-05. Every sample I checked returns 404. The server says it was last modified 2025-02-13.
- Where it came from is unknown, but it looks like leftover spam injection. Check Search Console → Security issues and Manual actions, and do not carry this file over [S22].

**Contact details the live site shows (unverified, so they stay [CONFIRM])**
- 138 S. Cannon Ave, Murfreesboro, TN 37129
- Phone (615) 546-5551, which matches the new number
- Fax 615-895-0155
- Counties: Rutherford, Davidson, Cannon, Coffee, Bedford, Wilson
- Memberships (TACDL, Rutherford & Cannon County Bar), admissions (Tennessee; U.S. District Court, Middle District of Tennessee), and Navy and Lascassas Volunteer Fire Department details

**Business name varies from listing to listing (a NAP risk)**
- "Darren Drake, PLLC" on Yelp
- "Darren Drake Law, PLLC." on Facebook
- "Darren Drake – Attorney At Law" on attorneyatlaw.com
- The contact page's map link points to a Google Maps place called **"Drake Drake & Frost Attorneys at Law"**, which is the 2011 association name.
- Search snippets for Avvo/Martindale mention "Drake, Drake, Clarke, & Freeze".

**Claims not to carry over**
- The meta description says "one of the highest rated DUI and Criminal Defense Lawyers in Rutherford County."
- The footer says "Top Attorney Criminal Defense."
- Tennessee RPC 7.1 cmt. [3] treats unsubstantiated comparisons as potentially misleading [S27].
- The DUI page quotes specific penalties, and Tennessee DUI law changed in 2025 (Public Chapter 403, parts effective Jan 1, 2026) [S36]. Nothing from that page should be reused without the attorney checking it.

## 1. Keyword and topic map

**Search volumes are unknown.** I used no keyword-tool data. After launch, get real query data from Search Console → Performance. Google Keyword Planner is optional.

Local results depend on three things: **relevance, distance and prominence**. Prominence includes links and reviews, and you cannot pay for a better ranking [S19]. So:
- Local-intent searches ("DUI lawyer near me", "criminal attorney Murfreesboro") are won mostly by the Google Business Profile (GBP) plus a relevant page.
- Informational searches ("Tennessee implied consent") are won by practice-page content.

Vendor surveys suggest most people researching lawyers use Google, often alongside other platforms. Treat that as directional only [S41].

| Intent cluster | Example query patterns | Target page | Volume |
|---|---|---|---|
| Brand/navigational | darren drake attorney, darren drake lawyer murfreesboro, ddrakelaw, darren drake phone | `/`, `/about`, `/contact` | unknown |
| Broad local, commercial | criminal defense attorney murfreesboro, murfreesboro criminal lawyer, rutherford county criminal defense lawyer, criminal lawyer near me | `/` (primary), `/practice-areas/criminal-defense` | unknown |
| DUI/DWI local | dui lawyer murfreesboro, dui attorney rutherford county, murfreesboro dwi lawyer, dui lawyer near me | `/practice-areas/dui-dwi` | unknown |
| DUI informational (TN) | implied consent tennessee, refused breath/blood test tennessee, first dui tennessee what happens, restricted license / ignition interlock tn | `/practice-areas/dui-dwi` sections and FAQ | unknown |
| Expungement local | expungement lawyer murfreesboro, tennessee expungement attorney, expunge record rutherford county | `/practice-areas/expungement` | unknown |
| Expungement informational (TN) | am i eligible for expungement in tennessee, expunge dismissed charge tn, diversion expungement tennessee, expungement cost tn | `/practice-areas/expungement` sections and FAQ | unknown |
| Criminal informational (local) | what happens after arrest murfreesboro, rutherford county general sessions court date, what to bring to first court date | `/practice-areas/criminal-defense` | unknown |
| Charge types [CONFIRM which the firm handles] | drug charge / domestic assault / theft / probation violation / driving on revoked lawyer murfreesboro | Sections on the criminal defense page. Separate pages only if the attorney writes substantial, distinct content. | unknown |
| Juvenile [CONFIRM still offered] | juvenile defense lawyer murfreesboro | Old URL exists; firm decides (see section 7) | unknown |
| Conversion | contact / start intake | `/contact`, `/intake` (not a ranking target) | n/a |

**Guardrails**
- Do not create one page per city or county ("DUI lawyer Smyrna", "…La Vergne"). Google classes pages "targeted at specific regions or cities that funnel users to one page" as doorway abuse, and mass-generated pages as scaled content abuse [S16].
- Name counties in the text only after the firm confirms them.

## 2. On-page spec per page

**Implementation**
- Set each title with Next.js `title.absolute`. The current template in `site/app/layout.tsx` appends " | Darren Drake, Attorney at Law" (33 characters), which pushes longer titles past 60.
- Add `metadataBase: https://ddrakelaw.com`, a self-referencing canonical on every page, and Open Graph tags.
- Make a 1200×630 JPEG share image cropped from `assets/photos/darren-drake-portrait-signal.webp`, after Darren approves the edited photo for web and directory use.

**Why the lengths are guidelines**
- Google has no hard limit and truncates to fit the device width [S10][S11].
- Google may rewrite titles, pulling from the H1, `og:title` and other sources [S10].
- Snippets come mainly from the page content, so every description must be unique [S11].

| URL | Title (characters) | Meta description (characters) | H1 |
|---|---|---|---|
| `/` | Darren Drake \| Murfreesboro Criminal Defense Attorney (53) | Darren Drake, Attorney at Law, helps people in Murfreesboro and Middle Tennessee with criminal defense, DUI/DWI and expungement. Start your intake online. (154) | Keep the approved "Your next step starts with a conversation." The name, practice areas and place are already in the eyebrow and the supporting line. Do not use hidden text. |
| `/practice-areas` | Criminal Defense, DUI/DWI & Expungement \| Darren Drake (54) | Criminal defense, DUI/DWI and expungement help from Darren Drake, Attorney at Law, in Murfreesboro and Middle Tennessee. Choose a practice area. (144) | Practice areas |
| `/practice-areas/criminal-defense` | Criminal Defense Lawyer in Murfreesboro, TN \| Darren Drake (58) | Facing a criminal charge in Murfreesboro or Middle Tennessee? Tell Darren Drake about your matter. Start your intake online or call (615) 546-5551. (147) | Criminal defense in Murfreesboro and Middle Tennessee |
| `/practice-areas/dui-dwi` | DUI/DWI Lawyer in Murfreesboro, TN \| Darren Drake (49) | Charged with DUI/DWI in Murfreesboro or Middle Tennessee? Send Darren Drake a brief inquiry online or call (615) 546-5551. (122) | DUI/DWI defense in Murfreesboro and Middle Tennessee |
| `/practice-areas/expungement` | Expungement Lawyer in Murfreesboro, TN \| Darren Drake (53) | Wondering whether a Tennessee record may be eligible for expungement? Ask Darren Drake. Start your intake online or call (615) 546-5551. (136) | Expungement help in Murfreesboro and Middle Tennessee |
| `/about` | About Darren Drake \| Attorney at Law, Murfreesboro TN (53) | Meet Darren Drake, Attorney at Law, serving Murfreesboro and Middle Tennessee in criminal defense, DUI/DWI and expungement matters. (131) | About Darren Drake |
| `/contact` | Contact Darren Drake \| Attorney at Law, Murfreesboro (52) | Contact Darren Drake, Attorney at Law. Call (615) 546-5551 or start your intake online. [ADDRESS/HOURS: CONFIRM] | Contact Darren Drake |
| `/intake` | Start Your Intake \| Darren Drake, Attorney at Law (49) | Send Darren Drake a brief inquiry about your legal matter and how to reach you. Sending it does not create an attorney-client relationship. (139) | Start your intake |
| `/privacy` | Privacy Notice \| Darren Drake, Attorney at Law (46) | How the Darren Drake, Attorney at Law website handles information you share, including intake inquiries. [FIRM TO SUPPLY] | Privacy notice |
| 404 | Page Not Found \| Darren Drake, Attorney at Law (46) | none (returns 404 status) | Page not found |

"Murfreesboro, TN" in titles comes from the confirmed "Murfreesboro & Middle Tennessee" wording. The street address stays [CONFIRM].

**Internal links** (use descriptive anchor text, never "click here")

| Page | Links to |
|---|---|
| Home | Three practice pages (cards), `/about` ("About Darren"), `/intake` (hero, band, sticky bar), tel link, `/contact` (nav), `/privacy` (footer) |
| Practice hub | Three practice pages, `/intake` |
| Criminal Defense | DUI/DWI, Expungement, `/about`, `/intake`, tel link, visible breadcrumbs Home › Practice Areas |
| DUI/DWI | Criminal Defense, Expungement (only with attorney-approved wording about eligibility), `/about`, `/intake` |
| Expungement | Criminal Defense, `/intake`, `/about`, and official TN Courts/TBI resources if the attorney approves |
| About | Three practice pages, `/intake`, `/contact` |
| Contact | `/intake`, tel link, `/privacy`, and the GBP/map link once the profile is confirmed |
| Intake | `/privacy` (required next to the form), tel link |
| 404 | Home, `/practice-areas`, `/intake`, tel link |

**Launch switches**
- Remove `robots: { index: false }` from `site/app/layout.tsx` on production only. Keep `noindex` on preview and staging deployments.
- Add `app/sitemap.ts` and `app/robots.ts`. Google ignores `priority` and `changefreq`, and `lastmod` must reflect real changes [S15].

## 3. Structured data (JSON-LD) plan

**How to add it**
- Render a `<script type="application/ld+json">` in the page or layout, escaping `<` as `\u003c` [S26].
- Validate with the Rich Results Test and validator.schema.org [S26].
- Markup must match visible content and never include fake reviews. Violations can bring a manual action [S6].

| Entity | Where | Type and fields | Needs firm-confirmed data |
|---|---|---|---|
| WebSite | Home | `name` "Darren Drake, Attorney at Law", `url` | Final site name |
| Firm | Home, referenced from `/contact` | **`LegalService`**, not `Attorney`, which schema.org marks deprecated [S2][S3]. Fields: `@id` `https://ddrakelaw.com/#firm`, `name`, `url`, `telephone` "+1-615-546-5551" (Google asks for country and area code [S1]), `image`, `areaServed` (Murfreesboro plus confirmed counties), `knowsAbout` (the three practice areas), `founder`/`employee` pointing to the Person `@id`, `sameAs` (only profiles the firm controls) | `name` (exact entity: PLLC or not), **`address` (required by Google for LocalBusiness [S1])**, `geo` (at least 5 decimal places [S1]), `openingHoursSpecification`, `sameAs` list, county list |
| Darren | `/about`, referenced from home | `Person`: `@id` `https://ddrakelaw.com/about#darren-drake`, `name` "Darren Drake", `jobTitle` "Attorney at Law", `worksFor` pointing to the firm, `image` (approved portrait), `url` | Before adding `alumniOf`, `memberOf`, `hasCredential` (bar admissions), `award` or Navy details, confirm each one and check it against the BPR record. None of these are confirmed. |
| Breadcrumbs | Practice pages, and About/Contact where crumbs are visible | `BreadcrumbList` with `name`, `item`, `position`. Google currently documents this as shown on desktop only [S8]. | None |
| Per-practice service | Practice pages (optional) | `Service` with `serviceType`, `provider` pointing to the firm, and `areaServed`. No rich result; it only helps Google understand the page. | Service areas |
| FAQPage | **Optional / low priority** | Google **stopped showing FAQ rich results on May 7, 2026** and removed the documentation in June 2026 [S4]. If used anyway, add it only where the Q&A is visible, word for word, and only after the attorney approves the answers. There are currently `[FIRM TO SUPPLY]` placeholders. | Approved answers |
| Reviews/ratings | **Do not add** | Self-serving `LocalBusiness`/`Organization` reviews are ineligible for stars [S7]. They also raise RPC 7.1 issues. | n/a |

**Fallback if the address is not confirmed by launch:** publish `Organization`, which has no required properties [S9], plus `Person`. Switch to `LegalService` with address, geo and hours once confirmed. Google recommends the most specific LocalBusiness subtype for local firms [S9][S1].

**Skeleton** (placeholders in caps):

```json
{"@context":"https://schema.org","@graph":[
 {"@type":"LegalService","@id":"https://ddrakelaw.com/#firm","name":"ENTITY NAME [CONFIRM]","url":"https://ddrakelaw.com/","telephone":"+1-615-546-5551","image":"https://ddrakelaw.com/og/darren-drake.jpg",
  "address":{"@type":"PostalAddress","streetAddress":"[CONFIRM]","addressLocality":"Murfreesboro","addressRegion":"TN","postalCode":"[CONFIRM]","addressCountry":"US"},
  "geo":{"@type":"GeoCoordinates","latitude":"[CONFIRM 5dp]","longitude":"[CONFIRM 5dp]"},
  "openingHoursSpecification":"[CONFIRM]","areaServed":[{"@type":"City","name":"Murfreesboro"},"[CONFIRMED COUNTIES]"],
  "knowsAbout":["Criminal defense","DUI/DWI","Expungement"],"founder":{"@id":"https://ddrakelaw.com/about#darren-drake"},"sameAs":["[FIRM-CONTROLLED PROFILES]"]},
 {"@type":"Person","@id":"https://ddrakelaw.com/about#darren-drake","name":"Darren Drake","jobTitle":"Attorney at Law","worksFor":{"@id":"https://ddrakelaw.com/#firm"},"url":"https://ddrakelaw.com/about"}]}
```

## 4. Local search

**Google Business Profile**

First, audit what exists:
- Does a profile exist, who owns it, and what name, category, phone, hours and website does it show?
- Is the legacy "Drake Drake & Frost Attorneys at Law" Maps place still live, and who controls it?

Then align it:
- **Name:** the real-world name "as used consistently on your storefront, website, stationery" [S18]. No keywords such as "Best DUI Lawyer." The firm confirms one exact string and uses it everywhere.
- **Solo practitioner:** if Darren is the only public-facing practitioner at a branded firm, Google recommends one profile named "[brand]: [practitioner name]" [S18]. Confirm how the association with other attorneys works before choosing a format.
- **Address:** use a precise address if clients visit the office. Otherwise hide the address and set a service area [S18].
- **Phone:** (615) 546-5551, a local number [S18]. Do not use call-tracking numbers; they break name/address/phone consistency.
- **Categories:** a specific primary category, for example the attorney category for criminal law (pick it in the GBP interface), plus only a few truly accurate additional ones [S20].
- **Website:** `https://ddrakelaw.com/`. A UTM tag such as `?utm_source=google&utm_medium=organic&utm_campaign=gbp` is optional.
- **Hours:** [CONFIRM].
- **Services:** only the three confirmed ones.
- **Description:** no superlatives.
- **Photos:** the approved portrait and real office photos.
- **Monitoring:** register Search Console and GBP to receive Google's removal and restriction notices. Google published guidance for Tennessee small businesses under **TN SB 2262 (2026)** [S5].

**Citations to audit and align**

All of these must carry the same name, address, phone, website, headshot and practice list. Update address and phone first, and descriptions second.

| Priority | Listing | Status found |
|---|---|---|
| 1 | **Tennessee BPR attorney registration.** This is the official record. Attorneys must report office-address changes within 30 days (Tenn. Sup. Ct. R. 9 §10.1) [S28]. | Check in the Attorney Portal |
| 1 | Google Business Profile, Apple Business Connect, Bing Places | GBP unknown; others to check |
| 2 | Avvo (profile 4098784) | Exists. URLs show both 37129 and 37130 ZIPs; verify |
| 2 | Martindale.com and Lawyers.com ("Darren Lee Drake", ID 157590899) | Exist |
| 2 | Justia / Cornell LII lawyer directory (lawyers.law.cornell.edu/lawyer/darren-drake-1558372) | Exists |
| 2 | FindLaw | Check |
| 2 | criminallaw.com, attorneyatlaw.com | Exist |
| 3 | Facebook (/lawofficeofdarrendrake) | Exists. Name varies; align or confirm |
| 3 | Yelp ("DARREN DRAKE, PLLC") | Exists |
| 3 | TN Bar Association, Rutherford-Cannon County Bar, TACDL directories | Only if the firm confirms current membership |
| n/a | attorneymurfreesboro.com | Relationship unknown [CONFIRM] |

- Do not buy "Top/Best" badges. Tennessee allows advertising a characterization only if the conferring organization "has made inquiry into the lawyer's fitness" and does not confer it "indiscriminately or for a price" (RPC 7.1 cmt. [8]) [S27].
- Tennessee's advertising rules as amended effective Sept 1, 2021 fold advertising into RPC 7.1. RPC 7.2, 7.4 and 7.5 are "Deleted and Reserved" [S27]. So:
  - Every advertisement, including the site and profiles, must include "the name and contact information of at least one lawyer or law firm responsible for its content" (RPC 7.1(b)).
  - A copy of each advertisement must be **kept for two years** after it was last used, with a record of when and where it appeared (RPC 7.1(c)). Archive a dated snapshot of every site release and every profile version.

**Review policy (proposed; the firm and its ethics counsel approve)**

Asking:
- Ask every client the same way after the matter concludes, with neutral wording and a direct link.
- No gating: never ask only happy clients or discourage negative reviews [S21].
- Nothing of value in exchange for a review: no discounts, gifts or entries [S21]. Tennessee also forbids giving anything of value "for the purpose of recommending" the lawyer (RPC 7.3(f)), and a review that vouches for the lawyer is a recommendation (cmt. [10]) [S27].
- No reviews by staff, family or the firm, and no reviews drafted for clients.
- Remind clients that a review is public and they should leave out case details. Many criminal-defense clients will reasonably decline.

Responding:
- Never reveal client information. ABA Formal Opinion 496 says a negative online review does not permit disclosing confidential information. Best practice is often no response, or a short statement that professional obligations prevent a reply [S29].

On the site:
- Do not migrate the testimonials pages or the "submit a testimonial" form without ethics review.
- If testimonials are ever shown, avoid creating unjustified expectations of results; qualifying language can help (RPC 7.1 cmt. [3]) [S27].
- No review or rating markup [S7].

## 5. Content plan for practice pages

Everything in this section is an **outline only**. Darren must write or approve every answer.

On every practice page:
- A byline such as "Reviewed by Darren Drake, Attorney at Law, on [date]." Google's "Who/How/Why" guidance values clear authorship, and legal topics fall under "Your Money or Your Life," where trust counts even more [S17].
- A "general information, not legal advice; does not create an attorney-client relationship" notice.
- No penalty figures, timelines or eligibility statements unless the attorney has checked them against current law.

Two Tennessee laws changed recently:
- **DUI:** Public Chapter 403 (HB1204/SB1400) revised DUI, implied-consent and license-revocation provisions. It took effect May 5, 2025 and January 1, 2026 [S36].
- **Expungement:** Public Chapter 268 (2025) reorganized the expungement statutes, for example into §§ 40-32-106 and -107 [S38]. TN Courts shows "Updated Expungement Information Coming Soon to Reflect Changes to T.C.A. §40-32-101" [S37].

**Criminal Defense** (`/practice-areas/criminal-defense`)
- **H2 Who this page is for** (short, plain language) [ATTORNEY TO WRITE]
- **H2 What usually happens after an arrest or citation in Rutherford County:** citation vs. arrest, bond, General Sessions, preliminary hearing, grand jury, Circuit Court. Court names need verifying; the 16th Judicial District covers Rutherford and Cannon counties [S40]. [ATTORNEY TO WRITE]
- **H2 Matters Darren handles** [CONFIRM LIST]
- **H2 Before your first court date:** keep your paperwork and note the date. [ATTORNEY TO WRITE]; general steps only
- **H2 What to have ready when you reach out** (citation, bond papers, court date)
- **H2 How the inquiry works** (three steps; no automatic acceptance)
- **H2 Courts and counties served** [CONFIRM]
- **FAQ:** Do I need a lawyer for a misdemeanor? What is diversion? What if my court date is soon? [ATTORNEY TO WRITE]

**DUI/DWI** (`/practice-areas/dui-dwi`)
- **H2 DUI vs. DWI in Tennessee:** terminology [ATTORNEY TO WRITE]
- **H2 After a DUI arrest:** the criminal case and the separate license consequences
- **H2 Implied consent and test refusal** (T.C.A. § 55-10-406 as amended by PC 403): **must reflect the 2026 changes** [ATTORNEY TO WRITE]
- **H2 Driver's license, restricted license and ignition interlock** [ATTORNEY TO WRITE]
- **H2 First offense vs. prior offenses:** no figures until verified
- **H2 Commercial or underage drivers** [CONFIRM the firm handles these]
- **H2 What to have ready** (citation, bond papers, implied-consent paperwork, court date)
- **FAQ:** What happens after a DUI arrest? Should I contact the office before my first court date? Can I drive after a refusal? [ATTORNEY TO WRITE]

**Expungement** (`/practice-areas/expungement`)
- **H2 What expungement means in Tennessee, and what it does not do** [ATTORNEY TO WRITE]
- **H2 Records that may be eligible:** non-conviction outcomes, diversion, certain convictions, under the reorganized statutes [ATTORNEY TO WRITE AND VERIFY]
- **H2 Waiting periods and costs:** no "free" or price promises unless the firm supplies them
- **H2 The process** (petition, prosecutor response, order, TBI) [ATTORNEY TO WRITE]
- **H2 Documents that help** (case numbers, dispositions)
- **H2 If a record isn't eligible:** other options, at the attorney's discretion
- **FAQ:** How do I know if my record may be eligible? What documents should I have on hand? [ATTORNEY TO WRITE]

**About** (`/about`)
- Sections: Service (Navy), Education, Bar admissions (check against BPR), Memberships, Community (Lascassas VFD), and his approach in his own words.
- Everything is [CONFIRM], and only confirmed items go into the Person markup.

**Phase 2 (optional)**
- Attorney-written, dated guides, for example "What changed in Tennessee implied consent in 2026" or "What to expect at Rutherford County General Sessions."
- No AI-mass-produced articles or city pages [S16]. `llms.txt` is not needed for Google [S4].

## 6. Measurement

| Option | Cookies and personal data | Fit |
|---|---|---|
| **Plausible** (recommended) | "We do not use cookies"; raw IP and user agent are never stored (daily salted hash); EU-hosted; vendor says no cookie banner is needed [S30] | Small script; fits the 200 KB JavaScript budget |
| Fathom | "no tracking cookies"; the vendor notes consent needs depend on the law [S31] | Similar |
| Cloudflare Web Analytics | "does not collect or use your visitors' personal data" [S32] | Free if DNS stays on Cloudflare; basic, with real-user performance data |
| GA4 with Consent Mode | Four consent types, which can default to denied [S33]; Google forbids sending personal data, including in URLs, titles and event parameters [S34] | Only if Google Ads integration is needed; heavier |

- Tennessee's privacy law (TIPA, in effect July 1, 2025) applies only above $25M revenue plus large consumer-data thresholds [S35]. It is likely not applicable here, but the firm confirms.
- Session replay stays off, at least on `/intake` as the guidelines require.

**Events**

Wire these through the existing stub in `site/lib/analytics.ts`. `call_click` would be a new event type added in a later build task. Never send names, contact details, message text, matter type or county.

| Event | Fires when | Allowed properties |
|---|---|---|
| `intake_start` | First interaction with a form field | `entry`: hero, header, sticky, band, practice, direct |
| `intake_step_completed` | Two-step variant only | `step`: 1 or 2 |
| `intake_submit_success` | **Only after the server confirms acceptance** | none |
| `intake_submit_error` | Validation, network or server failure | `kind`: validation, network, server, not_configured, rate_limited |
| `call_click` | A `tel:` link is tapped | `placement`: header, hero, contact, footer, sticky, intake_error. It measures taps, not completed calls. |
| `not_found` (optional) | The 404 page loads | Path without query string |

**KPIs** (any expected conversion benefit stays a hypothesis)
- Conversion: successes ÷ starts
- Mobile abandonment
- Error rate: errors ÷ (successes + errors)
- Call taps by placement

**Search Console and Bing**
- Verify a **Domain property** in Search Console (DNS).
- Submit the new sitemap.
- Check Manual actions and Security issues. This matters given the spam-like sitemap [S22].
- Separate brand and non-brand queries in the Performance report.
- Import the property into Bing Webmaster Tools.

**Core Web Vitals**
- Targets: LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 at the 75th percentile of real visits [S24].
- A small site will probably show "No data available" in the Core Web Vitals report, which comes from CrUX [S23]. So also:
  - Collect real-user data with the `web-vitals` library [S24], or with the host's or Cloudflare's real-user monitoring.
  - Run `site/tests/perf.mjs` or Lighthouse on each release as a lab check.

**Monthly one-page report**
1. Visitors and top landing pages
2. Search Console clicks, impressions, CTR and position, brand vs. non-brand, top queries
3. GBP calls, website clicks and direction requests
4. Intake starts and successes, conversion, errors, split by mobile and desktop
5. Call taps by placement
6. Core Web Vitals at the 75th percentile (real users and lab)
7. 404s, redirect and indexing errors
8. New review count only (no content), and directory changes
9. Content published or approved; next month's actions

## 7. Migration SEO

**Principles**
- Use one-to-one, relevant server-side permanent redirects (301/308), kept for at least a year [S12][S13].
- Next.js `permanent: true` sends 308 [S25], which Google treats as permanent [S12].
- Each new page gets a self-referencing canonical [S12].
- Redirects that don't match the topic invite soft-404 treatment. For removed content, a 404 or 410 is fine; Google handles all 4xx codes (except 429) the same way [S14].
- No Change of Address tool is needed, because the domain stays the same [S12].

| Old URL | New target |
|---|---|
| `/` | `/` |
| `/areas-of-practice/` | `/practice-areas` |
| `/areas-of-practice/criminaldefense/` | `/practice-areas/criminal-defense` |
| `/areas-of-practice/dui/` | `/practice-areas/dui-dwi` |
| `/areas-of-practice/expungement/` | `/practice-areas/expungement` |
| `/areas-of-practice/juvenile-defense/` | **Firm decision.** A new juvenile page if still offered; otherwise Criminal Defense only if it covers juvenile matters; else 410 |
| `/contact/`, `/?page_id=2` | `/contact` |
| `/testimonials/` | `/about`, or 410 |
| `/submit-a-testimonial/`, `/feed/` | 410 |
| `/blog/` (empty) | `/` or 410 |
| 17 attachment pages (for example `/areas-of-practice/dui/dui-2/`, `/criminal-defense/darren-drake/`) | The parent page's new URL; portrait attachments go to `/about` |
| `/wp-content/uploads/2024/07/DRAKE-Darren-WEB_0090A_pp*.jpg` | New portrait file (optional, for hotlinks) |
| `/sitemap_index.xml`, `/page-sitemap.xml`, `/attachment-sitemap.xml` | `/sitemap.xml` |
| `/sitemap.xml` (the 41,660 spam-like URLs) | Replaced by the generated sitemap. **Never redirect the `/6668243_…` URLs**; leave them 404/410. |

**Before launch**
- Export the full inventory: both Yoast sitemaps, Search Console → Pages and Links, and Cloudflare logs if available.
- Back up WordPress completely. Keep the old site off public hosts after cutover.
- Decide on trailing slashes: all old URLs end in "/". Test that each old URL reaches its target in **one hop**. If Next's trailing-slash handling adds a hop, set `trailingSlash: true` or do the redirects at the CDN.

**Launch day**
- Remove `noindex` on production.
- Deploy the redirects.
- Run a scripted check with curl across every old URL: expect 301/308, then 200, in a single hop.
- Submit the new `/sitemap.xml`. Optionally submit a temporary sitemap of the old legitimate URLs so Google recrawls the redirects [S12]. Remove any stale sitemap submissions.
- Use URL Inspection on the key pages.

**Monitoring on days 1, 7, 30 and 90**
- Search Console Page indexing: Not found, Soft 404, Redirect error
- Crawl stats
- The `not_found` event
- The move from old to new indexed URLs [S12]
- Security issues and Manual actions [S22]

## Sources
- [S1] https://developers.google.com/search/docs/appearance/structured-data/local-business
- [S2] https://schema.org/Attorney
- [S3] https://schema.org/LegalService
- [S4] https://developers.google.com/search/updates (FAQ rich result deprecation May 2026, removal June 2026; llms.txt; Tennessee article)
- [S5] https://developers.google.com/search/help/small-business-notifications
- [S6] https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- [S7] https://developers.google.com/search/docs/appearance/structured-data/review-snippet
- [S8] https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
- [S9] https://developers.google.com/search/docs/appearance/structured-data/organization
- [S10] https://developers.google.com/search/docs/appearance/title-link
- [S11] https://developers.google.com/search/docs/appearance/snippet
- [S12] https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
- [S13] https://developers.google.com/search/docs/crawling-indexing/301-redirects
- [S14] https://developers.google.com/search/docs/crawling-indexing/http-network-errors
- [S15] https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- [S16] https://developers.google.com/search/docs/essentials/spam-policies
- [S17] https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- [S18] https://support.google.com/business/answer/3038177
- [S19] https://support.google.com/business/answer/7091
- [S20] https://support.google.com/business/answer/7249669
- [S21] https://support.google.com/contributionpolicy/answer/7400114
- [S22] https://support.google.com/webmasters/answer/9044101
- [S23] https://support.google.com/webmasters/answer/9205520
- [S24] https://web.dev/articles/vitals
- [S25] https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects
- [S26] https://nextjs.org/docs/app/guides/json-ld
- [S27] Tennessee RPC 7 as amended effective 9/1/2021 (TBPR): https://docs.tbpr.org/pub/current-tn-rpc7-justice-kirby-presentation-material.pdf
- [S28] https://www.tbpr.org/for-legal-professionals/attorney-license-information
- [S29] https://www.americanbar.org/content/dam/aba/administrative/professional_responsibility/ethics-opinions/aba-formal-opinion-496.pdf
- [S30] https://plausible.io/data-policy
- [S31] https://usefathom.com/legal/compliance
- [S32] https://developers.cloudflare.com/web-analytics/about/
- [S33] https://developers.google.com/tag-platform/security/guides/consent
- [S34] https://support.google.com/analytics/answer/6366371
- [S35] https://www.tn.gov/attorneygeneral/news/2025/4/30/pr25-25.html
- [S36] https://wapp.capitol.tn.gov/apps/BillInfo/default.aspx?BillNumber=HB1204&GA=114
- [S37] https://tncourts.gov/programs/self-help-center/expungements
- [S38] https://ccresourcecenter.org/state-restoration-profiles/tennessee-restoration-of-rights-pardon-expungement-sealing/
- [S40] https://tennesseeda.gov/district-16/ and https://rutherfordcountytn.gov/general-sessions
- [S41] Vendor survey, directional only: https://www.ilawyermarketing.com/what-online-sources-do-people-use-in-2025-to-research-attorneys/
- Live-site evidence (read-only GET requests): https://ddrakelaw.com/page-sitemap.xml, /attachment-sitemap.xml, /sitemap.xml, /contact/
- Directory listings found by search: avvo.com/attorneys/37129-tn-darren-drake-4098784.html, martindale.com/attorney/darren-drake-157590899/, lawyers.com/murfreesboro/tennessee/darren-drake-157590899-a/, lawyers.law.cornell.edu/lawyer/darren-drake-1558372, yelp.com/biz/darren-drake-pllc-murfreesboro, facebook.com/lawofficeofdarrendrake/

Repo files referenced (not modified):
- /home/user/darrenwebsite-1/site/app/layout.tsx
- /home/user/darrenwebsite-1/site/lib/site.ts
- /home/user/darrenwebsite-1/site/lib/analytics.ts
- /home/user/darrenwebsite-1/site/next.config.ts
- /home/user/darrenwebsite-1/site/app/practice-areas/[slug]/page.tsx
- /home/user/darrenwebsite-1/Darren_Drake_AI_Brand_Guidelines.md