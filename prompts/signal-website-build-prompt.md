# Build prompt: Darren Drake website, Signal direction

Give this whole file to Claude Code or Codex from the root of this repository. It stands on its own, and it locks the design to the approved **Signal** concept. It is to be used together with `Darren_Drake_AI_Brand_Guidelines.md`, which stays authoritative wherever this file does not repeat it.

---

## 0. Your task

Build a complete, working **demonstration website** for Darren Drake, a criminal defense attorney in Murfreesboro and Middle Tennessee. Use the **Signal** design direction. The site's one goal is a successfully delivered intake inquiry, with the phone as the secondary route.

- This repository contains no existing site. Create a new project in `site/`.
- Run the preview **locally only**. Do not deploy or publish anything. Do not touch ddrakelaw.com, its domain or its WordPress install, and do not post anything to Higgsfield or its community feed.
- Build a representative slice first: homepage, mobile navigation, one practice page, FAQ and the full intake page. Screenshot the slice at 390 px and 1440 px and check it against the concept. Then build the remaining pages.
- Build real HTML text, buttons, links, navigation and form controls. **Never** use a concept image as a page or section background, and never use a picture of a form as the form.

## 1. Reference files in this repo

| Path | What it is | How to use it |
|---|---|---|
| `brand-concepts/01-signal.png` | **The approved concept** (Higgsfield job `f3f33b0f-cd9c-49c3-98f5-bafb3626dacc`) | Controls the visual composition of the header, hero and practice cards |
| `brand-concepts/with-photo/01-signal-with-photo.png` | The same concept with Darren's real portrait placed in the frame | Guide for the photo crop and the glow |
| `assets/photos/darren-drake-portrait.jpg` | Darren's genuine, approved portrait (1000×1400) | The only attorney photo on the site. Never generate, retouch or substitute his likeness |
| `Darren_Drake_AI_Brand_Guidelines.md` | Full brand and intake specification | Read the shared foundation, the intake specification and section "01 Signal" before you start |

The concept is a reference, not a pixel spec. Its lettering was drawn by an image model. Where the concept and the written rules disagree, the written rules win, and so does the accessibility guidance in section 9.

## 2. Firm facts (use only these)

- **Name:** Darren Drake, shown as "DARREN DRAKE" with "Attorney at Law" beneath it. Never substitute "Quinn Rodriguez" or "Murfreesboro Legal Group".
- **Practice focus:** Criminal Defense, DUI/DWI, Expungement.
- **Area:** Murfreesboro & Middle Tennessee.
- **Phone:** **(615) 546-5551**. The link is `tel:+16155465551`, the only phone number anywhere on the site.
- **Biography anchors (from the existing public site, pending reconfirmation):** Navy service and community involvement. Write placeholder copy around these and flag it `[CONFIRM WITH FIRM]`. Don't invent any other facts.
- **Email, street address, office hours, bar admissions, the legal entity name and the intake destination are all unknown.** Show clearly marked placeholders such as `[Office address — to confirm]` and list each one in the handoff.
- **Never add:** reviews, testimonials, awards, win rates, case results, "free consultation", "24/7", response-time promises, specialty certifications, or any promise of outcomes or instant answers.

## 3. Stack and project setup

The repo has no existing framework, so use:

- **Next.js (App Router) + TypeScript + Tailwind CSS**, with **shadcn/ui** only for `Field`/`Input`/`Select`/`RadioGroup`/`Textarea` and `Accordion`. Strip shadcn's default styling and map everything to the tokens in section 4.
- **Icons:** one family with a consistent stroke weight. Use Lucide at a 1.5 px stroke.
- **Fonts:** self-host **Manrope** with `next/font`, loading only weights 400, 600, 700 and 800. Fall back to `ui-sans-serif, system-ui, "Segoe UI", Roboto, Arial, sans-serif`.
- **Motion:** write the motion in section 8 in CSS. Do not add Framer Motion, GSAP, WebGL, particles or any other animation dependency. The Aceternity Spotlight and Magic UI Border Beam from the guidelines are optional references only; build any equivalent effect in CSS.
- **Budgets:**
  - Initial mobile transfer of about 1 MB or less.
  - Initial compressed JS of about 200 KB or less.
  - The hero portrait uses `next/image`, is loaded eagerly with priority, and is served as AVIF/WebP with explicit dimensions.
  - All lower images lazy-load.
  - Measure and explain any exceptions.
- Add `site/README.md` with install, dev, build and test commands.

## 4. Design tokens (exact)

Define these as CSS variables first, then point Tailwind's theme at them. Never use raw hex values in components.

```css
:root {
  --color-bg: #090F1C;        /* page background */
  --color-surface: #131F31;   /* cards, panels, sticky nav, form fields */
  --color-text: #F4F7FC;
  --color-muted: #BCC7D8;
  --color-action: #67E8F9;    /* primary buttons, active nav underline, focus */
  --color-on-action: #07111F;
  --color-border: #718199;
  --color-focus: #67E8F9;
  --color-decoration: #8B5CF6; /* glow only, never text */
  --color-error: #FF9A9A;
  --color-success: #86EFAC;

  --radius: 12px;
  --container: 1200px;
  --transition-primary: 420ms;
  --transition-hover: 160ms;
  --space: 4px 8px 12px 16px 24px 32px 48px 64px 96px; /* spacing scale; use only these */
}
```

Contrast pairs, measured with WCAG 2.x relative luminance:

| Foreground on background | Ratio | Use |
|---|---|---|
| text `#F4F7FC` on bg `#090F1C` | 17.83:1 | body and headings |
| text on surface `#131F31` | 15.42:1 | card text |
| muted `#BCC7D8` on bg | 11.21:1 | supporting copy |
| muted on surface | 9.70:1 | card copy and labels |
| on-action `#07111F` on action `#67E8F9` | 13.06:1 | button labels |
| action/focus `#67E8F9` on bg | 13.21:1 | links and focus ring |
| border `#718199` on bg | 4.83:1 | field borders (needs 3:1 for non-text) |
| border on surface | 4.18:1 | field borders inside cards |
| error `#FF9A9A` on surface | 8.16:1 | inline errors |
| success `#86EFAC` on surface | 11.79:1 | confirmation text |

Violet `#8B5CF6` is decoration only and is never used for text or controls. Re-verify every pair in the finished build, including hover and disabled states.

## 5. Typography

All type is set in Manrope.

| Role | Desktop | Mobile | Weight | Line height | Tracking |
|---|---|---|---|---|---|
| H1 | 72 px | 40 px | 800 | 1.04 | −0.035em |
| H2 | 40 px | 30 px | 700–800 | 1.1 | −0.02em |
| H3 / card title | 24 px | 20 px | 700 | 1.2 | −0.01em |
| Body | 18 px | 17 px | 400 | 1.65 | 0 |
| Labels, buttons, nav | 15–16 px | 15–16 px | 600 | 1.3 | 0 |
| Eyebrow | 15 px | 15 px | 600 | 1.4 | 0 |

- **Hero headline:** at most three lines on desktop.
- **Paragraph width:** about 60–70 characters.
- **Minimum sizes:** form controls are at least 16 px, and body text is never below 17 px.
- **Motion:** never animate individual letters.

## 6. Layout system and components

- **Grid:**
  - Desktop is 12 columns with 24–32 px gaps and a 1200 px maximum container.
  - Tablet is 8 columns.
  - Phones use one column with 20–24 px gutters.
- **Section spacing:** 96 px on desktop and 56 px on mobile.
- **Primary button:**
  - Solid `--color-action` with `--color-on-action` text, weight 600, a 12 px radius and a minimum height of 52 px.
  - Hover gets a slight brightness change over 160 ms.
  - Focus shows a 2 px `--color-focus` outline with a 2 px offset.
  - Buttons never shimmer or loop.
- **Secondary action:** an underlined text link in `--color-muted` that turns `--color-text` on hover. The hero's "Or call (615) 546-5551" is one of these.
- **Header:**
  - Desktop header is 88–96 px tall. On the left is the wordmark "DARREN / DRAKE" in bold on two lines with "Attorney at Law" below, surrounded by a 24 px clear zone.
  - The nav in the center holds Home, Practice Areas, About Darren and Contact. The active item gets a 2 px cyan underline.
  - On the right are the text link "(615) 546-5551" and a compact "Start your intake" button.
  - When sticky, the header is solid `--color-surface`/`--color-bg`, never translucent over content.
  - No shields, scales, badges or seals appear in the identity.
- **Mobile nav:** a 64 px header with the wordmark, a phone icon-link, and a menu button with `aria-expanded`. The menu opens as a full-height sheet on `--color-bg`, lists the four links plus the phone link and the intake button, traps focus while open, and closes with Esc.
- **Practice cards:**
  - Flat `--color-surface` with a 1 px `--color-border` border and a 12 px radius.
  - Each has a 40 px line icon, an H3 title and one sentence of plain description. Use the neutral placeholder copy in section 7.3 with `[CONFIRM WITH FIRM]`, and don't write marketing taglines.
  - Each has a "Learn more →" link. The whole card is clickable through one link, not nested links.
  - Hover lifts the card 2 px over 160 ms.
- **Icons:** the concept used a shield for Criminal Defense. **Don't use a shield**, because Signal forbids badge- and shield-like marks. Use Lucide `Briefcase` for Criminal Defense, `CarFront` for DUI/DWI and `FileText` for Expungement.
- **Gradient edges:** at most one gradient edge on the page, and only on the hero portrait frame. Don't glow every card.
- **Surfaces:** FAQs and form fields are always opaque.

## 7. Pages and content

Every page gets a unique `<title>`, a meta description, a single H1, and a logical heading order. Put a "Skip to content" link first in the tab order.

### 7.1 Home (`/`)

This follows the approved concept in order:

1. **Header** (section 6).
2. **Hero:** a 7/5 split.
   - **Left 7 columns:**
     - Eyebrow: "Criminal Defense · DUI/DWI · Expungement — Murfreesboro & Middle Tennessee"
     - H1: **"Your next step starts with a conversation."**
     - Supporting line: "Tell Darren Drake about your legal matter and how to reach you."
     - Primary button **"Start your intake"**, which goes to `/intake`
     - Text link "Or call (615) 546-5551"
   - **Right 5 columns:**
     - Darren's portrait in a 4:5 frame with a 12 px radius and a 1 px `--color-border` border.
     - Crop from chest or waist height with his face in the upper third, leaving room toward the headline.
     - Alt text: "Darren Drake, attorney at law".
     - Behind the frame only, place a **static violet-to-cyan radial glow**: `#8B5CF6` on the left fading to `#67E8F9` on the right at about 35–45% opacity, blurred, sized about 120% of the frame. It must never sit behind text or controls.
3. **Practice areas:**
   - Eyebrow "PRACTICE AREAS" and H2 "How Darren can help".
   - Three cards: Criminal Defense, DUI/DWI and Expungement. Each links to its page.
4. **Attorney introduction:**
   - H2 "Meet Darren Drake".
   - Two or three short paragraphs of placeholder copy built around his Navy service and community involvement, marked `[CONFIRM WITH FIRM]`.
   - Link "About Darren →".
   - Optionally, one restrained local architectural image. If there's no licensed image, use a clearly labeled placeholder and never generate a courthouse.
5. **How contact works:** three numbered steps, always visible and never inside an accordion.
   1. "Send a brief inquiry"
   2. "The office reviews it"
   3. "Discuss next steps if the firm can assist"

   Add one line under the steps: "Sending an inquiry does not by itself create an attorney-client relationship."
6. **FAQ:** use the shadcn Accordion, opaque. Suggested questions, with answers marked `[FIRM TO REVIEW]`:
   - "Does submitting the form mean you represent me?" Answer: "No. Sending an inquiry does not create an attorney-client relationship. The office will review it and discuss next steps if the firm can assist."
   - "What should I include in my inquiry?" Answer: "A brief overview, the type of matter, and how to reach you. Please don't include sensitive documents or detailed confidential information."
   - "What areas do you serve?" Answer: "Murfreesboro and Middle Tennessee. `[CONFIRM COUNTIES]`"
   - "Can I call instead?" Answer: "Yes — (615) 546-5551."
   - Do not add questions whose answers require unverified facts, such as fees, free consultations or timelines.
7. **Intake band:**
   - Full-width `--color-surface` band with H2 "Ready when you are." `[PROPOSED COPY]`.
   - The line "Start with a short inquiry. It takes a few minutes."
   - Button "Start your intake" and the phone link.
8. **Footer:**
   - Wordmark, the nav links, and Privacy.
   - Phone.
   - `[Office address — to confirm]`.
   - © year Darren Drake `[confirm legal entity name]`.
   - The line "This website is for general information and is not legal advice."

### 7.2 Practice Areas (`/practice-areas`)

An overview with the same three cards and a short intro.

### 7.3 Criminal Defense, DUI/DWI, Expungement

Routes are `/practice-areas/criminal-defense`, `/practice-areas/dui-dwi` and `/practice-areas/expungement`, all built from one template.

- **H1:** the practice name. Add a breadcrumb.
- **Plain-language overview:** two or three placeholder paragraphs marked `[FIRM TO SUPPLY]`, with no invented legal specifics.
- **Contact steps:** the "How contact works" steps.
- **FAQ:** two or three questions specific to the matter, answers `[FIRM TO SUPPLY]`.
- **Closing:** the intake band.
- **Neutral card descriptions:**
  - Criminal Defense: "Help for people facing criminal charges in Middle Tennessee."
  - DUI/DWI: "Help for people charged with driving under the influence."
  - Expungement: "Help understanding whether a record may be eligible for expungement."

  Mark all three `[CONFIRM WITH FIRM]`.

### 7.4 About Darren (`/about`)

- **Portrait:** the same portrait, larger.
- **Heading:** H1 "About Darren Drake".
- **Biography:** placeholder copy structured around his Navy service and community involvement, `[CONFIRM WITH FIRM]`. No credentials unless they're supplied.
- **Closing:** the intake band.

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

A full page, never a modal. Build it per section 10.

### 7.7 Privacy (`/privacy`)

Placeholder privacy notice marked `[FIRM TO SUPPLY — REQUIRED BEFORE LAUNCH]`, with headings for what is collected, how it's used, and how to contact the firm.

### 7.8 Not found

A 404 page with the header, a short message, and links home and to the intake page.

## 8. Motion (strict)

- **Hero entrance:** one entrance only, covering at most three elements: the eyebrow with the H1, the supporting line, and the CTA row. Each rises 12 px and fades in over 420 ms, with a 60 ms stagger. The text must be readable immediately, so animate from about 0.01 opacity and never block LCP. The H1 must not wait on JavaScript.
- **Spotlight glow:** may fade in once within 900 ms, then stays static.
- **Border beam:** optional. At most one pass around the portrait frame, under 4 s, then it stops.
- **Hover transitions:** 160 ms.
- **`prefers-reduced-motion: reduce`:** no entrance, no glow fade, no beam and no hover lift. Everything renders static immediately.
- **Mobile:** a static gradient only, with no pointer tracking.
- **Forbidden:** 3D globes, particle fields, rotating or typewriter headlines, cursor followers, autoplay video, a looping CTA shimmer, floating chat bubbles, page-load intros, parallax and scroll hijacking.

## 9. Mobile (390 px) and responsive rules

- **Hero order:** eyebrow, H1 (40 px), supporting line, "Start your intake", phone link, and then the portrait, capped at 320 px tall. **The headline and CTA must appear before the portrait.** Remove ornamental lines.
- **Sticky CTA:** an opaque bottom "Start your intake" bar that:
  - respects `env(safe-area-inset-bottom)`;
  - never covers content, because the page gets bottom padding;
  - hides on `/intake`;
  - hides whenever a form control has focus, so it stays out of the keyboard's way.
- **Tablet (768 px):** a 7/5 split may become stacked or a 5/3 split. Pick whichever keeps the H1 at three lines or fewer and the CTA in the first screen.
- **Reflow:** no horizontal scroll at 320 px, and it must work at 200% zoom.

## 10. Intake form (same fields for every direction)

A single-page form in one column, at most 640 px wide.

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

**Helper copy:** visible next to the form, not in the footer.

> Please share a brief overview and your contact details. Do not include sensitive documents or detailed confidential information in this initial inquiry. Sending this form does not create an attorney-client relationship.

Link to `/privacy`. Add no marketing or SMS consent.

**States:**
- **Default, focus and populated:** labels always sit above the inputs, never as placeholder-only labels.
- **Error:** text-based inline errors tied to fields with `aria-describedby`, plus an error summary at the top that receives focus and links to each field. Preserve every value.
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

- **Contrast:** every pair in section 4 checked. The focus ring must be visible on every surface.
- **Targets and keyboard:** interaction targets at least 44×44 px. Keyboard-only completion of navigation, the menu, the accordion and the whole intake form.
- **Page structure:** landmarks (`header`, `nav`, `main`, `footer`), a skip link, and a sensible heading order.
- **Images:** a meaningful `alt` on the portrait, and an empty `alt` on the decorative glow.
- **Motion and zoom:** reduced motion honored, 200% zoom works, and the layout reflows at 320 px.

## 12. Verification before you hand off

Run and report each of these. Use test data only, never live inquiries.

1. **Build and lint:** `lint`, `typecheck` and `build` pass.
2. **Screenshots:** at **390, 768 and 1440 px** for Home, a practice page, About, Contact, and Intake in its default, error, submitting, success (using a local test destination stub) and "not configured" states. Also capture the menu open on mobile.
3. **Automated checks:** axe or Lighthouse accessibility on each page, and Lighthouse performance on mobile for Home. Report LCP, CLS and total transfer as lab proxies, not field results.
4. **Manual tests:**
   - keyboard-only intake completion;
   - required and optional field rules, including the phone/email switch;
   - invalid email and phone;
   - a double-click submit;
   - a simulated network failure that keeps values and offers retry;
   - back navigation;
   - reduced motion;
   - 320 px reflow.
5. **Comparison to the concept:** place a 1440 px screenshot of the homepage hero side by side with `brand-concepts/01-signal.png` and list any intentional differences, such as the icon swap.

## 13. Handoff

Return:
- the changed-file list;
- how to run the site;
- the screenshots;
- the contrast table as measured in the build;
- the test results;
- dependency and license notes;
- a **"Still needed before launch"** list covering at least:
  - the intake delivery destination;
  - the office address, hours and email;
  - the legal entity name;
  - confirmed biography text and credentials;
  - the practice-page and FAQ copy;
  - the privacy notice;
  - the counties served;
  - a licensed local architectural image (optional);
  - final approval of all proposed headlines and helper copy.

**Do not deploy or publish.** Stop after the local preview and the handoff.
