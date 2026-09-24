# Build prompt: Darren Drake website, Precision direction (concept B)

Give this whole file to Claude Code or Codex from the root of this repository. It stands on its own, and it locks the design to the approved **Precision B** concept. It is to be used together with `Darren_Drake_AI_Brand_Guidelines.md`, which stays authoritative wherever this file does not repeat it.

---

## 0. Your task

Build a complete, working **demonstration website** for Darren Drake, a criminal defense attorney in Murfreesboro and Middle Tennessee. Use the **Precision** design direction, in the approved **variation B** layout. The site's one goal is a successfully delivered intake inquiry, with the phone as the secondary route.

- This repository contains no existing site. Create a new project in `site-precision/`. If `site/` exists, it holds the Signal build: don't modify it or share code with it.
- Run the preview **locally only**. Do not deploy or publish anything. Do not touch ddrakelaw.com, its domain or its WordPress install, and do not post anything to Higgsfield or its community feed.
- Build a representative slice first: homepage, mobile navigation, one practice page, FAQ and the full intake page. Screenshot the slice at 390 px and 1440 px and check it against the concept. Then build the remaining pages.
- Build real HTML text, buttons, links, navigation and form controls. **Never** use a concept image as a page or section background, and never use a picture of a form as the form.
- The page must work **without decorative JavaScript**. Precision has no required animation, so server-render every page.

## 1. Reference files in this repo

| Path | What it is | How to use it |
|---|---|---|
| `brand-concepts/05-precision-b.png` | **The approved concept** (Higgsfield job `962a61fb-5cd3-4ee4-8ed5-261cfb7d0a6c`) | Controls the visual composition of the header, hero, next-step row and practice band |
| `brand-concepts/05-precision.png` | The original Precision concept (A) | Secondary reference only |
| `assets/photos/darren-drake-portrait.jpg` | Darren's genuine, approved portrait (1000×1400) | The only attorney photo on the site. Never generate, retouch or substitute his likeness |
| `Darren_Drake_AI_Brand_Guidelines.md` | Full brand and intake specification | Read the shared foundation, the intake specification and section "05 Precision" before you start |

The concept is a reference, not a pixel spec. Its lettering was drawn by an image model. Where the concept and the written rules disagree, the written rules win, and so does the accessibility guidance in section 11.

**Known errors in the concept image to correct:**
- **"Tennessee" is misspelled** as "Tennesse" in the eyebrow line, and the "&" is too faint. Use the correct text: "Criminal Defense · DUI/DWI · Expungement — Murfreesboro & Middle Tennessee", all in `--color-muted`.
- **The Criminal Defense card uses a scales-of-justice icon.** Replace it with Lucide `Briefcase`. Keep `CarFront` for DUI/DWI and `FileText` for Expungement, all at the same 1.5 px stroke.

## 2. Firm facts (use only these)

- **Name:** Darren Drake, with the descriptor "Attorney at Law". Never substitute "Quinn Rodriguez" or "Murfreesboro Legal Group".
- **Practice focus:** Criminal Defense, DUI/DWI, Expungement.
- **Area:** Murfreesboro & Middle Tennessee.
- **Phone:** **(615) 546-5551**. The link is `tel:+16155465551`, the only phone number anywhere on the site.
- **Biography anchors (from the existing public site, pending reconfirmation):** Navy service and community involvement. Write placeholder copy around these and flag it `[CONFIRM WITH FIRM]`. Don't invent any other facts.
- **Email, street address, office hours, bar admissions, the legal entity name and the intake destination are all unknown.** Show clearly marked placeholders such as `[Office address — to confirm]` and list each one in the handoff.
- **Never add:** reviews, testimonials, awards, win rates, case results, "free consultation", "24/7", response-time promises, specialty certifications, or any promise of outcomes or instant answers.

## 3. Stack and project setup

The repo has no existing framework, so use:

- **Next.js (App Router) + TypeScript + Tailwind CSS**, with **shadcn/ui** only for `Field`/`Input`/`RadioGroup`/`Textarea` and `Accordion`. Strip shadcn's default shadows and styling and map everything to the tokens in section 4. The layout of marketing sections may borrow structure from Tailark blocks; check each block's license first and restyle it completely.
- **Icons:** one family with a consistent stroke weight. Use Lucide at a 1.5 px stroke.
- **Fonts:** self-host **Inter** with `next/font`, loading only weights 400, 600 and 700. Fall back to `ui-sans-serif, system-ui, "Segoe UI", Roboto, Arial, sans-serif`.
- **Motion:** no animation library and no new animation dependency (section 8).
- **Budgets:**
  - Initial mobile transfer of about 1 MB or less.
  - Initial compressed JS of about 200 KB or less. Precision should come in well under this.
  - The hero portrait uses `next/image`, is loaded eagerly with priority, and is served as AVIF/WebP with explicit dimensions.
  - All lower images lazy-load.
  - Measure and explain any exceptions.
- Add `site-precision/README.md` with install, dev, build and test commands.

## 4. Design tokens (exact)

Define these as CSS variables first, then point Tailwind's theme at them. Never use raw hex values in components.

```css
:root {
  --color-bg: #F8FAFD;         /* page background */
  --color-surface: #FFFFFF;    /* header, cards, form fields, portrait card */
  --color-text: #142238;
  --color-muted: #526278;
  --color-action: #1746C4;     /* primary buttons, links, active nav underline */
  --color-on-action: #FFFFFF;
  --color-border: #74839A;
  --color-focus: #1746C4;
  --color-decoration: #D8E6FF; /* practice band tint and step-circle fill only, never text */
  --color-error: #A12732;
  --color-success: #226345;

  --radius: 8px;
  --container: 1184px;
  --grid-gap: 24px;
  --transition: 160ms;
  --space: 4px 8px 12px 16px 24px 32px 48px 64px 96px; /* spacing scale; use only these, on a 4 px rhythm */
}
```

Contrast pairs, measured with WCAG 2.x relative luminance:

| Foreground on background | Ratio | Use |
|---|---|---|
| text `#142238` on bg `#F8FAFD` | 15.27:1 | body and headings |
| text on surface `#FFFFFF` | 15.96:1 | card text |
| text on decoration band `#D8E6FF` | 12.68:1 | practice band headings |
| muted `#526278` on bg | 5.95:1 | supporting copy and eyebrow |
| muted on surface | 6.22:1 | captions and helper text |
| muted on decoration band | 4.94:1 | band eyebrow (passes, keep at 15 px or larger) |
| on-action `#FFFFFF` on action `#1746C4` | 7.75:1 | button labels |
| action `#1746C4` on bg | 7.41:1 | links and the phone link |
| action on surface | 7.75:1 | card links |
| action on decoration band | 6.16:1 | links inside the band |
| border `#74839A` on surface | 3.85:1 | field borders (needs 3:1 for non-text) |
| border on bg | 3.68:1 | dividers and field borders |
| error `#A12732` on surface | 7.36:1 | inline errors |
| success `#226345` on surface | 7.15:1 | confirmation text |

`#D8E6FF` is decoration only and is never used for text or as the only indicator of state. Re-verify every pair in the finished build, including hover and disabled states.

## 5. Typography

All type is set in Inter.

| Role | Desktop | Mobile | Weight | Line height | Tracking |
|---|---|---|---|---|---|
| H1 | 64 px | 38 px | 700 | 1.08 | −0.025em |
| H2 | 40 px | 30 px | 700 | 1.15 | −0.02em |
| H3 / card title | 24 px | 20 px | 600 | 1.25 | −0.01em |
| Body | 18 px | 17 px | 400 | 1.6 | 0 |
| Labels, buttons, nav | 15–16 px | 15–16 px | 600 | 1.3 | 0 |
| Eyebrow | 15 px | 15 px | 400 | 1.4 | 0 |

- **Above the fold:** use only two font weights, 400 and 700 (plus 600 for controls). No ultra-light headings.
- **Paragraph width:** about 60–70 characters.
- **Minimum sizes:** form controls are at least 16 px, and body text is never below 17 px.

## 6. Layout system and components

- **Grid:**
  - Desktop is 12 columns with a consistent 24 px gap and a 1184 px maximum container.
  - Tablet is 8 columns.
  - Phones use one column with 20 px gutters.
- **Section spacing:** 88 px on desktop and 48 px on mobile.
- **Primary button:**
  - Solid `--color-action` with white text, weight 600, an 8 px radius and a minimum height of 52 px.
  - Hover darkens it slightly over 160 ms.
  - Focus shows a 2 px `--color-focus` outline with a 2 px offset.
  - No shadows and no gradients.
- **Secondary action:** a text link in `--color-action` with an underline on hover and focus. The hero's "Or call (615) 546-5551" is one of these.
- **Header:**
  - White `--color-surface` header with a 1 px bottom border, 96 px tall on desktop.
  - **Left:** as in the concept, a small solid cobalt 56 px square with an 8 px radius and white "DD" (weight 700). Beside it sit "Darren Drake" (Inter 600, 24 px) and "Attorney at Law" in muted text below, with 24 px clear space around the lockup.
    - **Guideline note:** the guidelines reserve the DD monogram for the favicon and ask for an understated wordmark with no tech-product glyph. The client picked this concept, so keep the square. It must stay small and flat, and the full name must always stay visible. Also build a variant with the square hidden behind a single boolean in the header component, and flag the choice in the handoff for final approval. Use the same DD mark as the favicon either way.
  - **Center:** the nav, with Home, Practice Areas, About Darren and Contact. The active item is `--color-text` weight 600 with a 3 px cobalt underline at the bottom edge of the header.
  - **Right:** a cobalt text link "(615) 546-5551" and a compact "Start your intake" button.
  - **Sticky:** the header is sticky on desktop only, and always opaque.
- **Mobile nav:**
  - A compact 64 px header with the DD mark and the name, a phone icon-link, and a menu button with `aria-expanded`.
  - The menu opens as a familiar full-width sheet on white. It lists the four links, the **phone link** and the intake button, traps focus while open, and closes with Esc.
  - The header is not sticky on mobile.
- **Practice cards:**
  - White `--color-surface` with a 1 px `--color-border` border, an 8 px radius and **no shadow**.
  - Each has a 40 px line icon in `--color-text`, an H3 title and one sentence of plain description (section 7.3). They're marked `[CONFIRM WITH FIRM]`, and there are no marketing taglines.
  - Each has a single inline cobalt link "Learn more →". The whole card is clickable through that one link, with no nested links.
  - Hover and focus change the border to `--color-action` over 160 ms. There's no lift.
- **Next-step row:**
  - Three items separated by thin vertical dividers.
  - Each item is a 40 px outlined circle (1 px `--color-border`) with the numeral in `--color-text`, followed by a short label in body text.
  - Mark it up as an ordered list.
- **Forbidden:** pricing tables, dashboard illustrations, fake activity feeds, decorative badges, chips everywhere, gray-on-gray text, gratuitous tabs, and a homepage that is only a form.

## 7. Pages and content

Every page gets a unique `<title>`, a meta description, a single H1, and a logical heading order. Put a "Skip to content" link first in the tab order.

### 7.1 Home (`/`)

This follows the approved concept B in order:

1. **Header** (section 6).
2. **Hero:** a 7/5 split with a 24 px gap on the `--color-bg` background.
   - **Left 7 columns:**
     - Eyebrow: "Criminal Defense · DUI/DWI · Expungement — Murfreesboro & Middle Tennessee"
     - H1 on two lines: **"A clear first step for your legal matter."**
     - Supporting line: "Tell us the type of matter and how to contact you."
     - Primary button **"Start your intake"**, which goes to `/intake`
     - Cobalt text link "Or call (615) 546-5551"
     - Then a 1 px divider and the **next-step row**: "1 Send a brief inquiry", "2 The office reviews it", "3 Discuss next steps if the firm can assist". Use this full wording, not the concept's shortened "Discuss next steps", so the row never implies the matter will automatically be accepted.
   - **Right 5 columns:**
     - Darren's portrait in a 4:5 frame with an 8 px radius and a 1 px `--color-border` border, cropped from the chest up with his face in the upper third.
     - Below it, the caption "Darren Drake — Attorney at Law" in muted text.
     - Alt text: "Darren Drake, attorney at law".
     - No glow, shadow or effects.
3. **Practice areas band:** a full-width `--color-decoration` (#D8E6FF) band.
   - Eyebrow "PRACTICE AREAS" and H2 "How Darren can help".
   - Three white cards: Criminal Defense, DUI/DWI and Expungement. Each links to its page.
4. **Attorney section:**
   - H2 "Meet Darren Drake", with a smaller copy of the portrait or no image.
   - Two short paragraphs of placeholder copy built around his Navy service and community involvement, `[CONFIRM WITH FIRM]`.
   - Link "About Darren →".
   - One additional genuine office image only if it's supplied. Otherwise leave it out, because the guidelines say quality matters more than quantity.
5. **What happens after you reach out:** three numbered white cards, always visible and never inside an accordion.
   1. "Send a brief inquiry"
   2. "The office reviews it"
   3. "Discuss next steps if the firm can assist"

   Under the cards, one sentence: "Sending an inquiry does not by itself create an attorney-client relationship." Don't mention any response time.
6. **FAQ:** use the shadcn Accordion on a white surface with 1 px dividers. Suggested questions, with answers marked `[FIRM TO REVIEW]`:
   - "Does submitting the form mean you represent me?" Answer: "No. Sending an inquiry does not create an attorney-client relationship. The office will review it and discuss next steps if the firm can assist."
   - "What should I include in my inquiry?" Answer: "The type of matter, a brief overview, and how to reach you. Please don't include sensitive documents or detailed confidential information."
   - "What areas do you serve?" Answer: "Murfreesboro and Middle Tennessee. `[CONFIRM COUNTIES]`"
   - "Can I call instead?" Answer: "Yes — (615) 546-5551."
   - No questions about fees, free consultations or timelines unless the firm supplies them.
7. **Intake CTA:** a white card section with H2 "Start with a short inquiry." `[PROPOSED COPY]`.
   - The line "Tell us the type of matter and how to contact you."
   - The button "Start your intake" and the phone link.
8. **Footer:**
   - On `--color-surface` with a top border: the name lockup, the nav links, and Privacy.
   - Phone.
   - `[Office address — to confirm]`.
   - © year Darren Drake `[confirm legal entity name]`.
   - The line "This website is for general information and is not legal advice."

### 7.2 Practice Areas (`/practice-areas`)

An overview with the same three cards and a one-paragraph intro.

### 7.3 Criminal Defense, DUI/DWI, Expungement

Routes are `/practice-areas/criminal-defense`, `/practice-areas/dui-dwi` and `/practice-areas/expungement`, all built from one template.

- **H1:** the practice name. Add a breadcrumb.
- **Overview:** two or three placeholder paragraphs marked `[FIRM TO SUPPLY]`, with no invented legal specifics.
- **Contact steps:** the "What happens after you reach out" steps.
- **FAQ:** two or three questions specific to the matter, answers `[FIRM TO SUPPLY]`.
- **Closing:** the intake CTA.
- **Neutral card descriptions:**
  - Criminal Defense: "Help for people facing criminal charges in Middle Tennessee."
  - DUI/DWI: "Help for people charged with driving under the influence."
  - Expungement: "Help understanding whether a record may be eligible for expungement."

  Mark all three `[CONFIRM WITH FIRM]`.

### 7.4 About Darren (`/about`)

- **Portrait:** the portrait at a larger size, with the name caption.
- **Heading:** H1 "About Darren Drake".
- **Biography:** placeholder copy structured around his Navy service and community involvement, `[CONFIRM WITH FIRM]`. No credentials unless they're supplied.
- **Closing:** the intake CTA.

### 7.5 Contact (`/contact`)

- **Heading:** H1 "Contact".
- **Contact details:**
  - A large phone link.
  - `[Office address — to confirm]`.
  - `[Office hours — to confirm]`.
  - `[Email — to confirm]`.
- **Intake:** a prominent "Start your intake" button pointing to `/intake`. Don't duplicate the form here.
- **Map:** no map embed unless an address is confirmed.

### 7.6 Intake (`/intake`)

A full page, never a modal. Build it per section 10. **Put the phone link right beside the form** as the secondary route, with the text "Prefer to call? (615) 546-5551". On desktop it goes in a slim column to the right of the 640 px form; on mobile it goes above the submit area.

### 7.7 Privacy (`/privacy`)

Placeholder privacy notice marked `[FIRM TO SUPPLY — REQUIRED BEFORE LAUNCH]`, with headings for what is collected, how it's used, and how to contact the firm.

### 7.8 Not found

A 404 page with the header, a short message, and links home and to the intake page.

## 8. Motion (minimal)

- **Transitions:** only 160 ms color, border and opacity transitions on links, buttons, cards and fields.
- **Entrance:** no entrance animation. If you add any reveal, limit it to non-essential imagery, never to text or controls.
- **Forbidden:** WebGL, parallax, animated gradients, carousels, auto-advancing content and any animation dependency.
- **`prefers-reduced-motion: reduce`:** remove every transition, so state changes happen immediately.

## 9. Mobile (390 px) and responsive rules

- **Header:** a compact 64 px header with 20 px gutters.
- **Hero order:**
  1. Eyebrow.
  2. H1 at 38 px.
  3. The supporting line.
  4. A full-width "Start your intake" button.
  5. The phone link.
  6. The next-step row, stacked vertically with circles on the left.
  7. The portrait with its caption.

  **The primary CTA must appear before the portrait.**
- **Practice band:** the cards stack in one column.
- **Sticky elements:** **no sticky elements while the keyboard is open.** Don't use a sticky bottom bar at all on `/intake`. On other pages a bottom CTA bar is optional; if you add one, it must respect `env(safe-area-inset-bottom)`, reserve page padding so it never covers content, and hide whenever a form control has focus.
- **Tablet (768 px):** stack the hero with the copy first, or use a 5/3 split, whichever keeps the H1 at three lines or fewer and the CTA in the first screen.
- **Reflow:** no horizontal scroll at 320 px, and it must work at 200% zoom.

## 10. Intake form (same fields for every direction)

A single-page form in one column, at most 640 px wide. If a two-step version is ever enabled, step 1 is the matter type and step 2 is the contact details, with a visible named progress indicator ("Step 1 of 2: Your matter"), a Back button, and values kept when moving back. **The default is the single page.**

**Fields:**

| Field | Required | Notes |
|---|---|---|
| Full name | yes | `autocomplete="name"` |
| Matter type | yes | radio group: Criminal defense · DUI/DWI · Expungement · Other or not sure |
| Preferred contact method | yes | radio: Phone · Email |
| Phone | required only if Phone chosen | `type="tel"`, `autocomplete="tel"`; optional otherwise |
| Email | required only if Email chosen | `type="email"`, `autocomplete="email"`; optional otherwise |
| County / court | no | allow "Not sure" |
| Next court date | no | date input; allow blank |
| Brief message | no | `maxlength` 1000 with a live remaining-character count |

Never collect Social Security numbers, birth dates, uploads, or a detailed account of the alleged conduct.

**Field styling:**
- White fields with a 1 px `--color-border` border, an 8 px radius, and a minimum height of 48 px.
- Explicit labels always sit above the fields, with help text below each label, not inside the input.
- Focus shows a 2 px cobalt ring.

**Helper copy:** visible next to the form, not in the footer.

> Please share a brief overview and your contact details. Do not include sensitive documents or detailed confidential information in this initial inquiry. Sending this form does not create an attorney-client relationship.

Link to `/privacy`. Add no marketing or SMS consent.

**States:**
- **Default, focus and populated:** labels always sit above the inputs, never as placeholder-only labels.
- **Error:** text-based inline errors in `--color-error`, tied to fields with `aria-describedby`, plus an error summary at the top that receives focus and links to each field. Preserve every value.
- **Submitting:** the button label becomes "Sending…" and the button is disabled, so a double click can't send twice.
- **Success:** shown **only** after the server confirms durable acceptance. Show "Your inquiry was received. Submitting it does not establish representation." and announce it in an `aria-live="polite"` region, then move focus to it.
- **Retry:** on network or server failure, keep every value and offer "Try again" plus the phone link.
- **Timing:** never show success on a timer or just because the button was clicked.

**Server side:** a `POST /api/intake` route handler that:
- validates everything on the server with the same rules, using Zod;
- applies basic rate limiting per IP;
- uses an accessible honeypot field for spam, with no CAPTCHA unless requested;
- dedupes identical submissions within a short window;
- keeps any secrets in server-side environment variables only.

**Delivery:** **no destination is configured.** Use an `INTAKE_DESTINATION` env var. When it's unset, the route must return an explicit "not configured" response and **the UI must show a clear "Demo form, not connected" banner on the intake page**. It must never claim an inquiry was received. Write the adapter so that email, a CRM or a webhook can be plugged in later.

**Analytics:** only the events `intake_start`, `intake_step_completed`, `intake_submit_success` and `intake_submit_error`, with no names, contact details, message text or matter details. No session replay on `/intake`. Stub the events in the demo; don't add a third-party script.

## 11. Accessibility (WCAG 2.2 AA target)

- **Contrast:** every pair in section 4 checked. The focus ring must be visible on white, `#F8FAFD` and `#D8E6FF`.
- **Targets and keyboard:** interaction targets at least 44×44 px, including the "Learn more" links and the step circles if they're interactive (they shouldn't be). Keyboard-only completion of navigation, the menu, the accordion and the whole intake form.
- **Page structure:** landmarks (`header`, `nav`, `main`, `footer`), a skip link, and a sensible heading order. The next-step rows are ordered lists.
- **Images:** a meaningful `alt` on the portrait, and decorative icons marked `aria-hidden`.
- **Motion and zoom:** reduced motion honored, 200% zoom works, and the layout reflows at 320 px.

## 12. Verification before you hand off

Run and report each of these. Use test data only, never live inquiries.

1. **Build and lint:** `lint`, `typecheck` and `build` pass.
2. **Screenshots:** at **390, 768 and 1440 px** for Home, a practice page, About, Contact, and Intake in its default, error, submitting, success (using a local test destination stub) and "not configured" states. Also capture the menu open on mobile, and the header with and without the DD square.
3. **Automated checks:** axe or Lighthouse accessibility on each page, and Lighthouse performance on mobile for Home. Report LCP, CLS and total transfer as lab proxies, not field results.
4. **Manual tests:**
   - keyboard-only intake completion;
   - required and optional field rules, including the phone/email switch;
   - invalid email and phone;
   - a double-click submit;
   - a simulated network failure that keeps values and offers retry;
   - back navigation;
   - reduced motion;
   - 320 px reflow;
   - the page working with JavaScript disabled (everything except form submission).
5. **Comparison to the concept:** place a 1440 px screenshot of the homepage hero and practice band side by side with `brand-concepts/05-precision-b.png` and list any intentional differences, such as the fixed spelling and the icon swap.

## 13. Handoff

Return:
- the changed-file list;
- how to run the site;
- the screenshots;
- the contrast table as measured in the build;
- the test results;
- dependency and license notes;
- the **DD header mark decision** (section 6) for client approval;
- a **"Still needed before launch"** list covering at least:
  - the intake delivery destination;
  - the office address, hours and email;
  - the legal entity name;
  - confirmed biography text and credentials;
  - the practice-page and FAQ copy;
  - the privacy notice;
  - the counties served;
  - an optional genuine office photo;
  - final approval of all proposed headlines and helper copy.

**Do not deploy or publish.** Stop after the local preview and the handoff.
