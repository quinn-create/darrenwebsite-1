# Signal 1A: design spec for the whole Darren Drake site

**Sources checked:**
- The guidelines: the shared sections, the intake spec and section "01 Signal".
- `prompts/signal-website-build-prompt.md`.
- `site/HANDOFF.md` and the current `site/` code.
- `brand-concepts/01-signal.png` and `01-signal-b.png`.
- The screenshots `home-1440`, `home-1440-fold`, `home-390`, `home-390-fold`, `intake-1440`, `practice-1440`, `about-1440` and `contact-1440`.
- The new photo `assets/photos/darren-drake-portrait-signal.webp`. I made test crops in the scratchpad only.
- The live site ddrakelaw.com, read-only. I treated what it says as data, not as confirmed fact.

No repo files were changed.

## 0. What I found that changes the plan

1. **The new photo already has the Signal glow in it.** Its background is violet on the left of his head (about `#554DC4`) and cyan on the right (about `#0F4A85`), fading to about `#050B20` at the edges. The page background is `#090F1C`, which is very close. So the CSS glow behind the frame should now act as a soft continuation of the light in the photo, not a second light source. Stacking both at full strength would look like a neon blob.
2. **The photo sets a resolution limit.** It is 1125 px tall. A 4:5 crop (x 548–1448, 900×1125) is sharp at 2× up to a frame about 450 px wide. The About page therefore uses a wider 4:3 crop instead of a bigger 4:5 one.
3. **Tested crops (source pixels):**
   - 4:5 hero: x 548–1448, y 0–1125.
   - 4:3 feature: x 250–1750, y 0–1125. This includes the extended jacket edge, which shows no visible seams.
   - 1:1 avatar: x 600–1400, y 40–840. The tighter crop at x 700–1300 cuts off his hairline and shoulders; don't use it.
   - 1200×630 social image: x 0–2000, y 40–1090. It works, but see §4.3.
4. **The current build doesn't match 1A in four places:**
   - At 1440×900 the practice section doesn't show above the fold. In the concept the "PRACTICE AREAS / How Darren can help" heading is visible on the first screen.
   - The glow is weak.
   - The wordmark is smaller than the concept's: 26 px, where the concept's is about 30 px.
   - It still uses the old warm-brown portrait, which clashes with the navy palette.
5. **What the live site has (data only):**
   - **Pages in its sitemap:** `/`, which also holds the About content; `/areas-of-practice/` with `criminaldefense/`, `dui/`, `expungement/` and **`juvenile-defense/`**; `/testimonials/`; `/submit-a-testimonial/`; `/contact/`; and an empty `/blog/`.
   - **Old static sitemap:** `/sitemap.xml` is a 2016 file listing **41,660 junk URLs**, which looks like leftover spam. Don't migrate it, and tell whoever hosts the WordPress site.
   - **Facts it states that the firm could simply confirm:**
     - an address, "138 S. Cannon Ave, Murfreesboro, TN 37129";
     - the counties Rutherford, Davidson, Cannon, Coffee, Bedford and Wilson;
     - admission in Tennessee and in the U.S. District Court for the Middle District of Tennessee;
     - membership of TACDL and the Rutherford & Cannon County Bar Association;
     - Navy service 1996–2002 as an Electronics Technician, on USS Kitty Hawk and USS Constellation and at Diego Garcia;
     - a BS (2005) and a law degree from Southern Illinois University;
     - Assistant Chief of the Lascassas Volunteer Fire Department;
     - associations of attorneys ("Drake Drake & Frost", and later an association with John Drake, David Clarke and Ryan Freeze).

   All of this is **unverified and possibly out of date**. It goes into the "firm to confirm" lists; don't publish it until the firm confirms it. Its claim-style copy ("Top Attorney", "promptly respond to all correspondence", "Client satisfaction is my number one priority") must **not** be carried over.

## 1. Final sitemap

### 1.1 Header (primary navigation)

| Item | Route | Purpose |
|---|---|---|
| Home | `/` | Name the attorney, show the practice focus, and get people to start an intake. |
| Practice Areas | `/practice-areas` | One page that routes to the three practice pages. |
| About Darren | `/about` | Recognition and trust: the genuine portrait and a confirmed biography. |
| Contact | `/contact` | Every contact route, with intake first and phone second. |
| (utility) phone link | `tel:+16155465551` | Secondary route. It is a text link, never a button. |
| (utility) **Start your intake** | `/intake` | The one primary action. It is a cyan button. |

- **Desktop:** no dropdown at launch. "Practice Areas" goes to the overview page.
- **Mobile menu:** lists the three practice pages indented under Practice Areas. This costs little and saves a tap.

### 1.2 Practice pages (one template)

| Route | Purpose |
|---|---|
| `/practice-areas/criminal-defense` | Plain-language page for people facing criminal charges |
| `/practice-areas/dui-dwi` | The same, for DUI/DWI charges |
| `/practice-areas/expungement` | The same, for people asking whether a record may be eligible |

### 1.3 Footer navigation

- **Get started:** H2 "Start with a short inquiry.", the Start your intake button and the phone.
- **Quick links:** Home, Practice Areas, About Darren, Contact, Start your intake.
- **Practice areas:** Criminal Defense, DUI/DWI, Expungement.
- **Contact:** the phone, `[Office address — to confirm]` and `[Email — to confirm]`.
- **Legal row:** Privacy notice, Accessibility, Legal notice, then `© {year} [legal entity name — to confirm]` and "This website is for general information and is not legal advice."

### 1.4 Utility and system routes

`/intake`, `/privacy`, `/accessibility`, `/legal-notice`, 404, 500 (`error.tsx` and `global-error.tsx`), `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, the social-share (OG) image and the icons.

### 1.5 Optional pages: launch or later

| Page | Decision | Why |
|---|---|---|
| **Accessibility statement** `/accessibility` | **Launch** | Cheap, builds trust, and gives people a way to report a barrier. Say "we aim for WCAG 2.2 AA", never "fully compliant". The firm approves the wording and the contact route. |
| **Legal notice / disclaimer** `/legal-notice` | **Launch, if the firm supplies wording**; otherwise the footer line and intake helper copy cover the minimum | Says the site is not legal advice and that no attorney-client relationship forms through the site or form. Any advertising disclosures come from the firm's own ethics review. No Terms of Use page: the site has no accounts or transactions. |
| **500 / error page** | **Launch** | If something fails, the phone number has to still be there. |
| **404** | **Launch** (restyle the existing one) | Together with the 301 redirect map, keeps old links from dead-ending. |
| **Thank-you page** `/intake/received` | **Don't build** | A URL anyone can open would show "received" without a real submission, which breaks the truthful-confirmation rule. Keep the in-page success state, which appears only after the server accepts. If analytics later needs a page, gate it with a one-time server token and show neutral text when it is opened directly. |
| **FAQ hub** `/faq` | **Later** | Only four answers are ready, and they are on Home already. Launch the hub once the firm has approved eight or more answers. It then gathers the Home and practice-page FAQs under anchored category sections. |
| **"What to expect / How it works"** | **Later**. At launch the content lives in the Contact page, the Intake sidebar and the three steps on Home | Anything beyond the three approved steps needs process facts from the firm (first meeting, what to bring). None of those exist yet. |
| Blog or resources | Not at launch | The live `/blog/` is empty. |
| Testimonials | **Excluded** | Hard rule. The live `/testimonials/` and `/submit-a-testimonial/` pages get redirected. |
| Juvenile Defense | **Only if the firm confirms it** | It is on the live site but not on the confirmed list. If confirmed, it uses the practice template and the card grid becomes 2×2 (see §2.3). |

### 1.6 Redirects from old URLs (301)

The old WordPress sitemap files (`/wp-sitemap.xml`, `/sitemap_index.xml`) are replaced by the new site's own sitemap.

| Old URL | New URL |
|---|---|
| `/areas-of-practice/` | `/practice-areas` |
| `/areas-of-practice/criminaldefense/` | `/practice-areas/criminal-defense` |
| `/areas-of-practice/dui/` | `/practice-areas/dui-dwi` |
| `/areas-of-practice/expungement/` | `/practice-areas/expungement` |
| `/areas-of-practice/juvenile-defense/` | `/practice-areas`, unless the firm confirms Juvenile Defense |
| `/contact/` | `/contact` |
| `/testimonials/`, `/submit-a-testimonial/` | `/about`, or a 410 (firm's choice) |
| `/blog/`, `/feed/` | `/` |

The 41,660 junk URLs should return 404 or 410. Don't redirect them.

## 2. Page by page

### Conventions for every page

- **Grid:** a 1200 px container at 1440, with 120 px side margins, 12 columns and 32 px gaps. That makes a column about 70.7 px wide, so 7 columns ≈ 687, 5 ≈ 481, 8 ≈ 789 and 4 ≈ 379.
- **Phones:** one column with 20 px gutters.
- **Section spacing:** 96 px between sections on desktop and 56 px on mobile.
- **Headings:** one H1 per page, with no skipped levels.
- **Hero CTA flag:** every hero CTA carries `data-hero-cta`, so the mobile sticky bar hides while it is on screen.
- **Placeholders:** marked text renders through a single `<Pending>` component (see §3) so the production build can refuse to ship it.
- **CTA rule:** at most **one cyan button per viewport**. Every other action is a text link.
- **Labels:** the primary CTA always reads **"Start your intake"**, and the form's submit button reads **"Send inquiry"**.
- **Tablet (768):** 8 columns. Split heroes stack unless a 5/3 split keeps the H1 at three lines or fewer with the CTA on the first screen.

### Global parts (every page)

**Header, desktop.**
- 96 px tall, solid `--color-bg`, with a hairline `border-bottom` (border token at 40%). It stays solid when sticky and is never translucent.
- **Wordmark:** DARREN / DRAKE at **30 px**, weight 800, `-0.01em` tracking, with "Attorney at Law" in 14 px, weight 600, muted. It has a 24 px clear zone and matches the concept.
- **Nav:** 16 px, weight 600, in muted. It turns text-colored on hover, and the current page gets a 2 px cyan underline.
- **Right side:** the phone as a text link, then the compact "Start your intake" button (44 px tall inside the header).

**Header, mobile.**
- 64 px tall, with the wordmark (20 px), a phone icon link (44 px, with an accessible name) and the menu button (`aria-expanded`).
- The menu sheet is full height on `--color-bg`. It lists Home, Practice Areas with its three pages indented, About Darren and Contact, then a divider, the phone link and a full-width CTA.
- It traps focus, closes with Esc and returns focus to the menu button (already built).

**Short screens.** When the viewport is under 560 px tall (a phone in landscape, or 200% zoom), the header stops being sticky. This keeps it from covering the focused element (WCAG 2.4.11).

**Mobile sticky CTA.**
- An opaque bottom bar with a full-width button that respects the safe area. The page reserves bottom padding for it.
- It hides on `/intake`, while the page's hero CTA is visible, while any form field has focus, and when the viewport is under 500 px tall.

**Footer.**
- Keep the shadcn `footer-section`, re-laid out as four columns on desktop, two on tablet and one on mobile, as listed in §1.3.
- **Remove the tooltip icon buttons.** They repeat visible links and hide their meaning behind hover. Replace them with labeled links, and drop the unused Switch primitive.

### 2.1 Home `/`

| # | Section | Desktop 1440 | Mobile 390 | Components |
|---|---|---|---|---|
| 1 | **Hero** | 7/5 split with the columns vertically centered. Padding is **56 px top and 48 px bottom**, so the next section's heading shows at 1440×900 as in the concept. **Left (7 columns):** eyebrow "Criminal Defense · DUI/DWI · Expungement — Murfreesboro & Middle Tennessee" (15/600, muted); H1 "Your next step starts with a conversation." (72/800, line height 1.04, `-0.035em`, `max-width` 12ch, three lines); supporting line (20 px, muted); CTA row with the primary button (56 px tall, 32 px side padding) and the text link "Or call (615) 546-5551". **Right (5 columns):** hero portrait frame **420×525**, right-aligned, 4:5, 12 px radius, 1 px border, with the halo behind it (§5). | Order: eyebrow (wraps to two lines), H1 at 40 px (three lines), supporting line at 17–18 px, full-width CTA (56 px), phone link (44 px target), then the portrait **256×320**, centered, with a static halo spreading no more than 110% and clipped by the section's `overflow: hidden`. The CTA is at about y 430 px, well above the photo. | PortraitFrame (hero), Button, SecondaryLink, the entrance animation |
| 2 | **Practice areas** | Top padding 48 px, so hero plus section add up to 96. Eyebrow "PRACTICE AREAS"; H2 "How Darren can help" (40 px); three cards, 4 columns each, 32 px padding; 40 px Lucide icon (1.5 stroke) → H3 at 24 px → one sentence → "Learn more →". The whole card is one link. | Cards stacked with 16 px gaps and 24 px padding. | SectionHeader, PracticeCard |
| 3 | **Meet Darren** | 7/5. **Left:** eyebrow "ABOUT", H2 "Meet Darren Drake", two short paragraphs (Navy service, community), the link "About Darren →". **Right:** a **QuickFacts** card until a licensed architecture photo arrives. It lists Practice focus (confirmed), Serving (Murfreesboro & Middle Tennessee, confirmed), Phone (confirmed) and Office `[to confirm]`. When the photo arrives, a 4:3 image (lazy-loaded, with a caption) replaces the card and the card moves under the text. **Don't** show the dashed placeholder box in production. | Text, then the QuickFacts card. | SectionHeader, QuickFacts, (later) ArchitecturePhoto |
| 4 | **How contact works** | Eyebrow "NEXT STEPS", H2, then three step cards (4 columns each) with 44 px cyan numerals 01–03. Below them: "Sending an inquiry does not by itself create an attorney-client relationship." | Cards stacked. The steps are always visible, never in an accordion. | ContactSteps |
| 5 | **FAQ** | H2 plus an opaque accordion in **8 columns**, which keeps answers near 66 characters wide. **Right (4 columns):** a quiet card, "Prefer to talk? Call (615) 546-5551", with a text link, not a button. | Full width, then the call card. | FAQ, AsideCard |
| 6 | **Intake band** | Full-bleed `--color-surface` band. Left: H2 "Ready when you are.", then "Start with a short inquiry. It takes a few minutes." Right: the button and the phone link. | Stacked, with a full-width button. | IntakeBand |
| 7 | Footer | §1.3 | Single column | FooterSection |

- **Content (✱ = the firm must supply or confirm):**
  - Approval of the proposed H1 and supporting line.
  - ✱ Card sentences.
  - ✱ Meet Darren paragraphs.
  - ✱ Counties, for the FAQ.
  - ✱ Office address, for QuickFacts.
  - ✱ An optional licensed local architecture photo.
- **CTAs:**
  - **Primary:** the hero button, then the intake band button. The header button and sticky bar are always available.
  - **Secondary:** "Or call" in the hero and the intake band, and the call card beside the FAQ.
- **Photo:** the 4:5 hero crop only. Not repeated lower on the page.

### 2.2 Practice Areas overview `/practice-areas`

| # | Section | Desktop | Mobile | Components |
|---|---|---|---|---|
| 1 | Page intro | Breadcrumb; eyebrow "PRACTICE AREAS"; H1 "Practice areas" (72 px); lead "Darren Drake's practice focuses on three areas across Murfreesboro and Middle Tennessee." (proposed copy); CTA row with the button (`data-hero-cta`) and the phone link. Top padding 64, bottom 48. | H1 at 40 px, then the lead, a full-width button and the phone link. | PageIntro (with a CTA slot) |
| 2 | Cards | Three cards at 4 columns each. The titles are **H2s** here (headingLevel="h2"). A slightly taller card (min-height 280) with the same anatomy as on Home. | Stacked. | PracticeCard |
| 3 | "Not sure which applies?" | A single-row Callout in 8 columns: "You don't need to know the legal category. Choose 'Other or not sure' on the intake form." with the link "Start your intake →". This is a text link, because the button already appeared above. | Full width. | Callout |
| 4 | How contact works | As on Home | As on Home | ContactSteps |
| 5 | Intake band | As on Home | As on Home | IntakeBand |

- **Content:** approval of the lead line. ✱ Confirm the card sentences.
- **Photo:** none.

### 2.3 Practice page template (Criminal Defense, DUI/DWI, Expungement)

| # | Section | Desktop | Mobile | Components |
|---|---|---|---|---|
| 1 | **Hero** | Breadcrumb (Home / Practice Areas / name). **8 columns:** eyebrow "PRACTICE AREA"; H1 (the practice name, 72 px); lead (the card sentence ✱); CTA row with "Start your intake" (`data-hero-cta`, links to `/intake?matter=<slug>`, see note) and the phone link. **4 columns:** an **On this page** card (surface, border, 12 px radius) listing 3–5 anchor links to the H2s. The 160 px icon tile goes. | H1 at 40 px, lead, full-width button, phone link, then On this page as a plain list of anchor links (not collapsed), with 44 px rows. | PageIntro, OnThisPage |
| 2 | **Body** | **Prose in 7 columns** plus a **sticky aside in 4 columns** (offset 1, `top: 120px`). Prose sections, each an H2 with 2–4 short paragraphs: "Overview" ✱, "What this can involve" ✱, "What to have ready when you reach out" ✱ (a list, which must not contradict the intake's "don't send sensitive documents" rule), "Where Darren works" (✱ counties/courts). **Aside:** the "Your attorney" card: 96 px avatar, "Darren Drake, Attorney at Law", "About Darren →", the compact CTA button and the phone link. | Prose at full width. After the Overview section comes an **InlineCta** row (a text link "Start your intake →" and the phone link). The attorney card appears inline after the last prose section. | Prose, AttorneyCard, InlineCta |
| 3 | How contact works | As on Home | As on Home | ContactSteps |
| 4 | FAQ | 8-column accordion of questions specific to this practice. **Only items with approved answers render in production**, and the section is hidden if none are approved. | Full width | FAQ |
| 5 | Related areas | H2 "Other practice areas" with the other two cards (6 columns each, compact: no sentence) | Stacked | PracticeCard (compact) |
| 6 | Intake band | As on Home | As on Home | IntakeBand |

- **Preselecting the matter type:** the hero CTA can preselect the matter type on the form. The visitor can still change it.
  - It must not leak matter details into analytics. Either strip query strings from `/intake` page views, or pass the value in client state instead of the URL.
  - If neither is possible, drop the preselect.
- **Differences between the three pages:** only the icon, the copy, the FAQ items and the `matter` value. The layout is the same.
  - **Icons:** Criminal Defense uses `Briefcase`, DUI/DWI `CarFront` and Expungement `FileText`. No shields or scales.
- **If Juvenile Defense is confirmed:** it uses the same template, and the card grids become 2×2 on desktop.
- **Content ✱:** all the prose, the FAQ answers and the counties or courts served. No invented legal specifics: no penalties, timelines, eligibility rules or outcomes.
- **CTAs:** the hero button is primary, the aside card is persistent on desktop, then the inline link and the intake band. The phone appears in the hero, the aside and the band.
- **Photo:** the 1:1 avatar in the attorney card (lazy-loaded, `alt=""` because his name is the text right beside it).

### 2.4 About Darren `/about`

| # | Section | Desktop | Mobile | Components |
|---|---|---|---|---|
| 1 | **Hero** | Breadcrumb. **5 columns:** eyebrow "ABOUT DARREN"; H1 "About Darren Drake"; a lead sentence built from confirmed facts only ("Darren Drake is an attorney serving Murfreesboro and Middle Tennessee, focused on criminal defense, DUI/DWI and expungement."); CTA row (`data-hero-cta`). **7 columns:** the **feature portrait frame, 4:3, about 640×480**, with the halo. This is the second and last place the glow appears on the site. Load it eagerly with priority, because it is this page's largest element. | H1, lead, button and phone link, then the portrait full width (350×262). | PortraitFrame (feature) |
| 2 | **At a glance** | A four-item FactStrip on a surface band: Practice focus ✔, Serving ✔, Phone ✔, Admissions ✱ `[FIRM TO SUPPLY]`. An item only shows once it is confirmed. | A 2×2 grid, then a single column below 360 px. | FactStrip |
| 3 | **Biography** | **Prose in 7 columns** plus a **sticky aside in 4 columns** (the "Talk with the office" card: CTA and phone). H2s: "Service" ✱ (Navy), "Education" ✱, "Practice" ✱, "Community" ✱. Once dates are confirmed, "Service → Education → Practice" becomes a **Timeline**: cyan year numerals like the step numbers, a 1 px border rail, text in the text color. | Prose, then the inline talk card. | Prose, Timeline (optional), AsideCard |
| 4 | Local architecture photo (optional) | If a licensed photo is supplied, a 21:9 lazy image at 12 columns with a neutral caption (for example "Downtown Murfreesboro"). | Rendered at 16:9. | ArchitecturePhoto |
| 5 | Intake band | As on Home | As on Home | IntakeBand |

- **Content ✱:** the biography, education, bar admissions, memberships and community roles. The live-site candidates in §0.5 are the list to put in front of the firm for confirmation. Also ✱ Darren's recorded sign-off on the edited portrait (§4.1).
- **No credentials, awards or medals** appear unless the firm confirms them.
- **Photo:** the 4:3 feature crop, with alt text "Darren Drake, attorney at law".

### 2.5 Contact `/contact`

| # | Section | Desktop | Mobile | Components |
|---|---|---|---|---|
| 1 | Page intro | Breadcrumb; H1 "Contact"; lead "The quickest way to reach the office is a short intake inquiry. You can also call." | Same, at 40 px | PageIntro |
| 2 | **Two routes** | Two 6-column cards. **Intake card (first, primary):** a 64 px avatar next to the H2 "Start your intake", the sentence "Tell Darren Drake about your legal matter and how to reach you.", the button (`data-hero-cta`) and a small line "Takes a few minutes. Sending it does not create an attorney-client relationship." **Call card:** H2 "Call the office"; the phone as a 40 px, weight-800 cyan link; then a definition list with Office ✱, Hours ✱ and Email ✱. | Intake card first, then the call card. | ContactCard ×2, Avatar |
| 3 | Location | **Only once the address is confirmed.** The address, a "Get directions" link to an external map service (it says it opens a new site), and ✱ parking or access notes. **No embedded map**, for speed and privacy. | Same | LocationBlock |
| 4 | How contact works | As on Home | As on Home | ContactSteps |

- There is no intake band here, because the intake card already covers it.
- **Content ✱:** address, hours, email, parking and access.
- **Photo:** the small avatar in the intake card, with `alt=""`.

### 2.6 Intake `/intake`

| # | Section | Desktop | Mobile | Components |
|---|---|---|---|---|
| 1 | Header block | In a 7-column form column (at most 640 px): the **demo banner** (until real delivery is verified), H1 "Start your intake", and the lead "Tell Darren Drake about your legal matter and how to reach you." | Same order. Drop the breadcrumb to save space. | DemoBanner, PageIntro (compact) |
| 2 | **Helper box** | Directly above the fields, in the form column: the required helper copy, a link to the privacy notice and "Prefer to call?" with the phone link. | Same place, so it sits next to the form on both sizes. | Callout (info) |
| 3 | **Form** | The fields as specified. Labels above inputs; the matter-type radio cards in a 2×2 grid; contact method as two side-by-side cards; the character counter; the submit button "Send inquiry" (56 px) with "Or call" beside it. | One column. The radio cards become one column below 400 px. Full-width submit button. **The sticky bar is off.** | Field, TextInput, RadioCardGroup, DateInput, Textarea+Counter, ErrorSummary, StatusRegion, Honeypot, Button |
| 4 | **Sidebar** (desktop only) | 4 columns, offset 1, sticky at `top: 120px`: a 96 px avatar with "Darren Drake, Attorney at Law"; "What happens next" (the three steps, compact, with numerals); the phone link. No glow and no animated background. | Not rendered as a sidebar. The three steps appear **after** the form in compact form, and the avatar is not loaded. | AsideCard, ContactSteps (compact), Avatar |

- **States, all already built, restyled with these tokens:**
  - **Default and focus.**
  - **Populated:** the border shifts to the text color.
  - **Error:** a summary box with a 2 px error-color border takes focus; inline errors carry an "Error:" prefix and a 2 px field border.
  - **Submitting:** "Sending…", with the button disabled and the label still at full contrast.
  - **Success:** it replaces the form. H2 "Inquiry received", the approved sentence, the phone number and "Return to the homepage", with focus moved to it and announced politely. No timeline promise.
  - **Retry or failed:** values kept, plus "Try again" and the phone number.
  - **Not configured.**
  - **Rate limited.**
- **Content ✱:** the intake destination; approval of the helper copy, success copy and demo-banner copy.
- **Photo:** the avatar in the desktop sidebar only, lazy-loaded and not rendered on mobile.

### 2.7 Prose pages: Privacy `/privacy`, Accessibility `/accessibility`, Legal notice `/legal-notice`

| Section | Desktop | Mobile |
|---|---|---|
| Intro | Breadcrumb; H1 at 72 px ("Privacy notice", "Accessibility", "Legal notice"); a "Last updated `[date]`" line in muted | H1 at 40 px |
| Body | Prose in 8 columns at 66ch: H2 at 30 px and H3 at 24 px, 1.65 line height, 12 px paragraph spacing, lists with a 24 px indent. An optional contents list in 4 columns on desktop. | Prose; the contents list becomes plain links at the top |
| Close | A small call card ("Questions? Call (615) 546-5551"). No intake band, to keep legal pages calm. | Same |

- **Content ✱ (required before launch):**
  - **Privacy notice:** what the form collects, the real destination and retention, the minimal analytics events and how to contact the firm.
  - **Accessibility:** the target standard, known limits, how to report a problem and the review date.
  - **Legal notice:** the firm's approved disclaimer wording.
- **Photo:** none.

### 2.8 404 and 500

- **404:**
  - Hero-style layout in 8 columns: H1 "Page not found" (72/40 px); "That page doesn't exist or has moved."; the primary button; links to Practice Areas, About Darren and Contact; the phone link.
  - A **static** halo (no fade), placed off to the right on desktop and omitted on mobile.
  - No photo.
- **500 (`error.tsx`, plus a `global-error.tsx` with inline styles):**
  - H1 "Something went wrong on our side."
  - The phone number shown **prominently**, since it is the reliable route.
  - A "Try again" button that calls `reset()`, and a link home.
  - It must not depend on any data fetch, and has no animation.

## 3. Component inventory

### 3.1 Tokens

The eleven Signal colors stay exactly as they are. The additions below are all derived from them; none is a new color.

```
--color-border-subtle: rgb(113 129 153 / .40)   dividers only, never the only boundary of a control
--glow-violet: rgb(139 92 246 / .45)   --glow-cyan: rgb(103 232 249 / .40)   halo only
--header-h: 96px (lg) / 64px     --radius: 12px (cards, buttons, frames, fields: align fields from 8 to 12)
--space-*: 4 8 12 16 24 32 48 64 96    --section: 96px / 56px
--dur-enter: 420ms  --dur-glow: 900ms  --dur-hover: 160ms  --stagger: 60ms
body weight 450 (variable Manrope, no extra bytes); headings 700–800; controls 600
```

Global state rules:
- **Focus:** a 2 px `--color-focus` outline with a 2 px offset on every interactive element. It measures 13.2:1 on bg and about 11.5:1 on surface.
- **Hover:** transitions last 160 ms.
- **Disabled:** never drops label contrast below 4.5:1.
- **Errors:** never shown by color alone. They always carry text and a thicker border.
- **Forced colors:** buttons get a 1 px `ButtonText` border and focus uses `Highlight`.
- **Violet** is never used for text or controls.

### 3.2 Existing components (keep and restyle)

| Component | File | States and token notes | Change |
|---|---|---|---|
| Header (desktop) and NavLink | `Header.tsx` | Link: muted, turning text on hover; current page: text plus a 2 px action underline; focus ring | Wordmark to 30 px; not sticky on short viewports |
| Mobile header and MenuSheet | `Header.tsx` | Open and closed (`aria-expanded`), focus trap, Esc; sheet on bg | Add the three practice pages indented |
| Wordmark (md/sm) | `Wordmark.tsx` | Static; text color and muted subtitle | Sizes 30/20 px, subtitle 14/13 px |
| Button (primary and compact) | `.btn-primary`, `ui/button.tsx` | Default: action/on-action, 13:1. Hover: brightness 1.08. Active: 0.95. Focus ring. Disabled/submitting: `cursor: progress`, label stays at 13:1, `aria-disabled` | Heights 52/56 px (44 compact); radius 12 |
| Secondary link, action link | `.link-secondary`, `.link-action` | Muted turning text; action; underline offset 4 px; 44 px targets | None |
| PracticeCard | `Sections.tsx` | Surface plus 1 px border; hover and focus-within lift 2 px (none under reduced motion); one stretched link | Add a compact variant and a `headingLevel` prop |
| PracticeIcon | `PracticeIcon.tsx` | Muted, stroke 1.5 | None |
| Portrait | `Portrait.tsx` | Frame with border, `bg-surface` while loading, blur placeholder | Becomes **PortraitFrame** with variants (see new) |
| ContactSteps | `Sections.tsx` | Surface cards with 44 px action numerals; screen-reader "Step n" | Add a `compact` variant for the intake sidebar |
| FAQ (native `details`) | `Sections.tsx` | Closed and open; the chevron rotates in 160 ms; summary rows ≥ 64 px; focus ring on the summary; opaque surface | 8-column width; render only approved items |
| IntakeBand | `Sections.tsx` | Surface band | None |
| Breadcrumbs, PageIntro | `Sections.tsx` | Current page uses text plus `aria-current` | PageIntro gets eyebrow and CTA slots |
| IntakeForm and its parts | `IntakeForm.tsx` | Default, focus, populated, error, submitting, success, retry, not configured, rate limited (all built and tested) | Two-column desktop layout; field radius 12; 2 px error border |
| DemoBanner | intake page | Surface with an action border | Remove only once delivery is verified |
| StickyCta | `StickyCta.tsx` | Hidden by route, field focus and hero-CTA visibility | Also hide when the viewport is under 500 px tall |
| FooterSection | `ui/footer-section.tsx` | Link hover in the primary color | Remove the tooltips and icon buttons; add the legal row links |
| Container, skip link | — | Skip link: action/on-action, visible on focus | None |
| shadcn Switch, Tooltip | `ui/` | — | Remove if unused, to save bytes |

### 3.3 New components

| Component | Purpose | States and tokens |
|---|---|---|
| **PortraitFrame** `hero \| feature \| avatar` | One component for all photo crops. Each variant points at a **pre-cropped file**, not `object-position` on the master. | hero: 4:5, border, halo, eager with priority. feature: 4:3, halo, eager on About. avatar: 1:1, border, no halo, lazy. No hover or motion on the photo. |
| **Halo** (inside PortraitFrame) | The glow behind the frame | Multi-stop `radial-gradient`s using `--glow-violet` and `--glow-cyan`, **no `filter: blur()`**. Fades in once on desktop, static otherwise. |
| **SectionHeader** | Eyebrow, H2 and an optional lead | Eyebrow 15/600 muted, uppercase with `0.08em` tracking |
| **QuickFacts** and **FactStrip** | Confirmed facts only | Surface plus border; `dt` muted 15/600, `dd` in text color; unconfirmed items render through Pending |
| **OnThisPage** | Anchor list on practice pages | Links 44 px tall; `aria-current` on the section in view is optional; no scroll-spy animation |
| **AttorneyCard** and **AsideCard** | Persistent CTA in a desktop sidebar | Surface card with `position: sticky`; becomes an inline card on mobile |
| **InlineCta** | A slim link row in the middle of long prose | Text links only, no button |
| **Callout** `info \| demo \| notice` | Helper copy, the "not sure" note, the demo banner | Surface with a border; demo uses an action-colored border. Never violet. |
| **Timeline** (optional) | Biography sequence | 1 px border rail with action-colored years. Static, no reveal on scroll. |
| **ContactCard** and **LocationBlock** | Contact page | The phone as a 40/800 action link; external link labeled "(opens [service])" |
| **Prose** | Legal and bio text | 66ch, rhythm from H2 30 / H3 24; links use the action style |
| **Pending** `<Pending kind="FIRM TO SUPPLY">` | Every placeholder | Preview: dashed underline in muted. **In the production build it throws an error** (CI also greps the output for `[FIRM TO`, `[CONFIRM`, `[Office`). |
| **ErrorPage** (500) | `error.tsx` and `global-error.tsx` | Static; phone prominent |
| **OG image** `opengraph-image.tsx` | Social card | See §4.3 |

## 4. Imagery

### 4.1 Attorney photo

| Where | Crop (source px) | Rendered size | Loading | Alt text |
|---|---|---|---|---|
| Home hero | 4:5, x 548–1448, y 0–1125 | 420×525 desktop, 256×320 mobile | eager, `priority` | "Darren Drake, attorney at law" |
| About hero | 4:3, x 250–1750, y 0–1125 | about 640×480 desktop, 350×262 mobile | eager, `priority` | "Darren Drake, attorney at law" |
| Practice attorney card, intake sidebar | 1:1, x 600–1400, y 40–840 | 96×96 | lazy (intake: desktop only) | `""` (the name is adjacent text) |
| Contact intake card | 1:1 | 64×64 | eager, no priority | `""` |
| OG image | see §4.3 | 1200×630 | — | `og:image:alt` "Darren Drake, Attorney at Law" |
| Never | — | Page or section backgrounds, anything behind text, practice overview, legal pages, 404/500, footer | — | — |

- **Files to create:**
  - Pre-cropped masters `darren-drake-signal-4x5.webp`, `-4x3.webp` and `-1x1.webp`, cut from the new photo.
  - `next/image` then serves AVIF and WebP at 1× and 2×. The hero uses `sizes="(min-width:1024px) 420px, 256px"`.
- **Image quality:** set 75–80 for this asset. The smooth violet-to-cyan background **bands** at low quality, so check it on a real phone.
- **Old photo:** keep `darren-drake-portrait.jpg` as the untouched master, but stop using it on the site.

### 4.2 Supporting images and Higgsfield

- **Recommendation: generate no images with Higgsfield for launch.**
  1. The glow and every abstract light effect are cheaper and sharper as CSS gradients, which cost 0 KB.
  2. The guidelines ask for one restrained **local** architectural image. A generated "Murfreesboro" scene would show a place that doesn't exist, which is the kind of fabricated context the rules forbid. The build prompt also forbids generating a courthouse.
- **Architecture photo:**
  - Use a **genuine, licensed or commissioned** photo, for example the downtown Murfreesboro square or a streetscape, with no people, seals, flags or identifiable court signage.
  - Give it a neutral caption. If a courthouse is visible, the caption must not imply any affiliation.
  - If none is supplied, launch with the QuickFacts card instead of the image.
- **Allowed later, if the team insists on Higgsfield:** one **abstract, non-representational** texture, such as soft light or grain in the Signal palette. It must contain no buildings, no people and no text, and must not look like a real place.
  - It is decorative (`alt=""`), lazy-loaded, AVIF at 60 KB or less, and never behind text or form controls.
  - Log its generation ID in the asset register.
- **Concept images** (`brand-concepts/*.png`) are design references only and never production assets.

### 4.3 Social (OG) image, favicon and app icons

- **OG image:** 1200×630 built with `next/og`, laid out as a small version of the hero.
  - The `#090F1C` background.
  - On the left, typeset "DARREN / DRAKE" (Manrope 800, about 72 px), "Attorney at Law", "Criminal Defense · DUI/DWI · Expungement" and "Murfreesboro & Middle Tennessee".
  - On the right, the 4:5 crop at about 380×475 with a CSS halo.
  - Satori, the renderer behind `next/og`, **can't read woff2**, so bundle a Manrope `.ttf` or `.woff` for it.
  - One image for the whole site at launch. Per-page variants with the page title can come later from the same template.
  - Use `twitter:card=summary_large_image`.
- **Favicon:**
  - Keep the open-corner-frame "DD" concept (no scales or shields), but convert the letters to **outlines**. The current `icon.svg` uses `<text>` with Arial, which renders differently everywhere.
  - Deliver `icon.svg`, a `favicon.ico` with 16/32/48 sizes (the 16 px size is a simplified "DD" with no frame), a 180×180 `apple-icon.png` on an opaque `#090F1C` background, and 192 and 512 icons plus a 512 maskable icon with an 80% safe zone.
  - `manifest.webmanifest`: name "Darren Drake, Attorney at Law", short name "Darren Drake", theme and background `#090F1C`.

### 4.4 Asset register labels

Each row records: ID, file, **type**, origin or job ID, size, crop or focal point, where it is used, mobile treatment, alt text or decorative status, and license or approval.

| ID | Type label | Notes |
|---|---|---|
| A1 `darren-drake-portrait.jpg` | **Genuine photograph (original)** | 1000×1400. Master only. |
| A2 `darren-drake-portrait-signal.webp` | **Genuine photograph, digitally edited** (background replaced, color adjusted, left jacket edge extended by an editing tool; face unaltered, 0.94 face match to A1) | 2000×1125. Supplied by the client (commit `4150c10`). **Needs Darren's recorded approval of this edited version.** It is not a generated likeness, and shouldn't be described as one. |
| A2-a/b/c | Derivatives of A2 (4:5, 4:3, 1:1) | Crop coordinates as in §4.1 |
| A3 OG image | **Composite:** A2 plus typeset text | Built by code, not by an image model |
| A4 icons | **Vector, made in-house** | — |
| A5 architecture photo | **Genuine photograph, licensed** (TBD) | Record the photographer, license, location and caption |
| A6 (optional) abstract texture | **Generated (Higgsfield), decorative** | Job ID, `alt=""`, never presented as a real place |
| R1–R9 concepts | **Generated design reference, not for production** | The job IDs in `brand-concepts/README.md` |

## 5. Motion (Signal limits)

| What | Rule |
|---|---|
| **Entrance** | **Home hero only**, desktop (≥1024 px) only. At most **three elements** (eyebrow plus H1, supporting line, CTA row), each **rising 12 px and fading from 0.01 opacity in 420 ms, with a 60 ms stagger**. Pure CSS, runs once, the H1 never waits on JavaScript. No entrance on any other page. |
| **Glow / halo** | Static gradients, no `filter: blur`. On desktop it **fades in once within 900 ms** (Home and About heroes). **Mobile: always static.** No pointer tracking, no pulsing, no drifting. Opacity stays within the spec's 35–45% and is tuned so it continues the photo's own glow: violet on the left, cyan on the right. |
| **Border beam** | **Optional; recommend leaving it out at launch.** If added: Home hero frame only, one pass under 4 s (about 2.4 s), starting after the entrance finishes, desktop only, never repeating. |
| **Hover** | 160 ms. Button brightness 1.08; card lift 2 px; link color change; FAQ chevron rotation. |
| **Menu sheet, accordion** | Open instantly or with an opacity fade of at most 160 ms. No slide-ins and no height animation. |
| **Forms** | No animated backgrounds. "Sending…" is a text change; an optional spinner stops under reduced motion. No confetti or check-mark animation on success. |
| **Forbidden** | Reveals on scroll, parallax, scroll hijacking, page transitions, rotating or typewriter headlines, letter-by-letter animation, cursor followers, particles, globes, autoplay video, looping CTA shimmer, chat bubbles, page-load intros. |
| **`prefers-reduced-motion: reduce`** | No entrance, no glow fade, no beam, no hover lift. Everything renders in its final state (already enforced globally). |
| **Acceptance** | With every effect off, the page is still clearly Signal: dark navy, bold Manrope, cyan action, portrait on one side. |

## 6. Design risks and mitigations

1. **The dark theme is harder to read for older or low-vision readers** (light text on dark looks thinner and can glow at the edges).
   - Body weight 450 on the variable font, at no extra cost; 18 px body on desktop and 17 px on mobile.
   - Muted color only for secondary text; no text ever on the glow; 66ch lines; underlined links.
   - Support forced colors, and test on a dimmed phone outdoors.
   - The single palette stays; there is no light mode.
2. **The glow can make the site feel like a tech startup or nightclub rather than a law office.**
   - Glow appears only on the Home and About portrait frames. No glowing cards, buttons or bands, and no loops.
   - The copy stays plain.
3. **The photo's built-in glow plus the CSS halo can merge into a neon blob.**
   - Keep the halo opacity at 45% or below, with the colors on the same sides as in the photo.
   - Compare 1440 and 390 screenshots side by side with the concept before approval.
4. **Photo quality and authenticity.**
   - The 1125 px height sets size limits (§4.1), and the gradient background can band when compressed.
   - The edited portrait needs Darren's recorded approval.
   - If he wants a bigger About image later, commission a higher-resolution photo shot against a plain backdrop.
5. **Long practice pages on mobile** once the firm's copy arrives.
   - "On this page" links, short sections under H2s, and paragraphs of four sentences at most.
   - A link to the intake after the Overview, plus the sticky bar.
   - FAQ answers are collapsed but the steps are always visible.
   - Review each page at 390 px once it passes about six screens.
6. **Placeholders or unapproved copy could reach the live site.**
   - The `<Pending>` component fails the production build, and CI greps the output for placeholder text.
   - FAQ items without approved answers don't render.
   - The demo banner is removed only after a verified test delivery.
7. **The sticky header and bottom bar can hide content or focus** at 200% zoom or with a phone in landscape (WCAG 2.4.11).
   - The header stops being sticky below 560 px of height and the bar hides below 500 px.
   - `scroll-padding` goes at both the top and bottom.
8. **Too many cyan buttons.** With the CTA on every page, people may stop noticing it.
   - One cyan button per viewport; every other action is a text link.
   - Cyan is used only for actions, links, focus and step numerals.
9. **Performance on low-end phones.**
   - Remove the blur filters.
   - The hero image at about 60–90 KB AVIF.
   - One variable font file (25 KB).
   - Budget: first load about 1 MB or less and JavaScript about 200 KB or less. The current lab result is 218 KB total, and it has to be re-measured after the photo change.
10. **Losing search ranking and old links during the move.**
    - Apply the 301 map in §1.6 and don't migrate the junk sitemap.
    - The firm decides about Juvenile Defense and Testimonials before launch.
11. **The bold style could read as hype.**
    - No claims, reviews, results, "free consultation" or 24/7 language.
    - The firm reviews all copy for its advertising rules before launch.

The files this spec relies on are in `/home/user/darrenwebsite-1/`:
- `Darren_Drake_AI_Brand_Guidelines.md`
- `prompts/signal-website-build-prompt.md`
- `brand-concepts/01-signal.png`
- `assets/photos/darren-drake-portrait-signal.webp`
- `site/HANDOFF.md`
- `site/app/globals.css`
- `site/components/Sections.tsx`
- `site/components/Portrait.tsx`
- `site/components/ui/footer-section.tsx`
- `site/lib/site.ts`