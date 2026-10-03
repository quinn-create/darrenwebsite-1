# Plan: gentle scroll animations ("reveals")

**To run it:** open a Claude Code session on this repository (branch `claude/sleepy-clarke-wjlh48`) and say *"Run plans/scroll-reveals-plan.md."* Nothing else is needed from you. Every decision is made below, and every check is automated.

Written 25 September 2026. It can run at any time: it doesn't depend on any other open plan.

---

## 1. Goal

As a visitor scrolls, each main section **rises gently into place once** (12 px over 420 ms), the way Apple's product pages settle into view. The site should feel more finished and alive **without ever slowing down or hiding anything a visitor needs to read.**

## 2. Brand rules this must obey

These come from `Darren_Drake_AI_Brand_Guidelines.md`.

- **"Animation must never hide or delay essential text."** So the reveals move things (a `transform`) and **never fade them** (no `opacity` below 1). Text is readable in every frame.
- **Reduced motion:** "Honor reduced-motion preferences and remove … spatial entrances." With reduced motion on, nothing moves at all.
- **Timing (Signal motion spec):** "420 ms entrance with a 12 px rise and 60 ms stagger, maximum three elements." Use exactly these values. Stagger only groups of 3 or fewer.
- **"No scroll hijacking."** Scrolling speed and position are never changed, and no scroll or wheel event is listened to.
- **An approved extension:** the spec allows **one** entrance, the hero's. Scroll reveals were idea 6 in `plans/polish-ideas.md`, and Quinn asked for this plan on 25 September 2026. It's a deliberate extension that stays within the brand's own timing and adds a one-line off switch (section 4.5), so it can be turned off if Darren prefers the stricter rule.

## 3. Non-goals (don't do these)

- No fades, parallax, scaling, blur, looping or letter-by-letter effects.
- No change to the existing hero entrance or its two tests ("Reduced motion: no hero animation" and "Motion allowed: hero entrance runs once").
- No animation on the form, the header, the phone bar, the footer or the FAQ questions themselves.
- No new npm package.
- No change to wording or layout.

## 4. Design (already decided)

### 4.1 What reveals
Mark each of these with `data-reveal`:

| Page | Elements |
|---|---|
| Home | the practice section's heading block; the 3 featured practice cards (staggered 0 / 60 / 120 ms); the "All practice areas" carousel block; "Meet Darren"; the "What happens next" timeline; the FAQ section; the closing "Ready when you are" band |
| Practice pages | the Overview block; the timeline; the FAQ section |
| About | the text column, as one block |
| Practice Areas | the card grid, with the first 3 cards staggered |

**Never marked:** the hero, the header, `PageIntro` headings, the Contact page, the privacy, accessibility and legal pages, and anything inside a form.

### 4.2 How it works
1. **A tiny script,** `site/components/ScrollReveal.tsx` (a `"use client"` component, mounted once in `site/app/layout.tsx`):
   - runs only if `window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)").matches`;
   - adds the class `reveal-ready` to `<html>`;
   - gives any `[data-reveal]` element already on screen the class `is-revealed` **straight away, with transitions off for that first frame**, so nothing animates on page load;
   - watches the rest with **one** `IntersectionObserver` (threshold 0.15, rootMargin `0px 0px -10% 0px`);
   - when an element comes into view, adds `is-revealed` and stops watching it, so each reveals **once**;
   - after in-page navigation (a pathname change), re-scans for new `[data-reveal]` elements.
2. **CSS** (in `site/app/globals.css`, next to the existing `@keyframes rise`), active only when all three are true: `html.reveal-ready`, `min-width: 768px` and `prefers-reduced-motion: no-preference`.
   - `[data-reveal]:not(.is-revealed)` gets `transform: translateY(12px)`.
   - `[data-reveal]` gets `transition: transform 420ms cubic-bezier(0.2, 0.7, 0.2, 1)` and `transition-delay: var(--reveal-delay, 0ms)`.
   - Staggered children set `style={{ "--reveal-delay": "60ms" }}` or `"120ms"`.
   - **No `opacity` anywhere.**
3. **Safe by default:**
   - no JavaScript, phones under 768 px, reduced motion or older browsers → `reveal-ready` is never set → no offset, nothing moves;
   - the page is correct before, during and without the script.
4. **Layout:** `transform` doesn't move the surrounding layout, so there's no layout shift (CLS stays 0).

### 4.3 Why phones are left out
The existing hero entrance is desktop-only too. On phones, sections scroll past quickly, so reveals add little and cost battery. The rule is one media query and can be widened later.

### 4.4 Size
The script must add under 1.5 KB (gzipped) of JavaScript. Check it in 6.3.

### 4.5 Off switch
`export const SCROLL_REVEALS = true` in `site/lib/site.ts`. When it's `false`, `ScrollReveal` renders nothing and the site is exactly as before this plan.

## 5. Steps

1. **Switch:** add `SCROLL_REVEALS = true` to `site/lib/site.ts`, with a comment pointing to this plan.
2. **Script:** create `site/components/ScrollReveal.tsx` as in 4.2, and mount it once in `site/app/layout.tsx`, after `<main>`.
3. **CSS:** add the rules from 4.2 to `site/app/globals.css`. Also add `[data-reveal] { transition: none !important; transform: none !important; }` inside the existing `prefers-reduced-motion: reduce` block, as a belt-and-braces guard.
4. **Mark the elements** in 4.1 with `data-reveal` (and `--reveal-delay` for staggered cards). The files involved are `site/app/page.tsx`, `site/components/Sections.tsx`, `site/components/PracticeCarousel.tsx`, `site/app/practice-areas/[slug]/page.tsx`, `site/app/practice-areas/page.tsx` and `site/app/about/page.tsx`. Change **no** wording or layout classes.
5. **Tests:** add the checks in 6.1 to `site/tests/e2e.mjs`.
6. **Run everything:** the commands in 6.2 and the size check in 6.3.
7. **Record it:** a short screen recording is the clearest proof.
   - With Playwright's `recordVideo` at 1440 × 900, scroll the home page from top to bottom over about 6 seconds.
   - Save it as `printouts/site-preview/scroll-reveals-1440.webm`.
   - Also save 3 still frames of one section mid-rise and after it settles, as `scroll-reveals-frame-{1,2,3}.png`.
8. **Handoff notes:** append a section to `site/HANDOFF.md` (what's marked, the off switch, the brand-rule note from section 2), and mark idea 6 as built in `plans/polish-ideas.md`.
9. **Preview and push:**
   - Rebuild the clickable preview (`node printouts/site-browser/build.cjs`) and republish the existing link (https://claude.ai/artifact/HRkufSWZ8TydyinEMhLHNF) from `printouts/site-browser/artifact.html`. The preview has no scripts, so it stays still, which is expected.
   - Commit, with the usual co-author and session lines, and push to `claude/sleepy-clarke-wjlh48`.

## 6. Checks

### 6.1 New automated tests (add to `site/tests/e2e.mjs`)
1. **Reduced motion:** at 1440 px with `reducedMotion: "reduce"`, scroll the whole home page. No `[data-reveal]` element ever has a computed transform other than `none`, and `<html>` never gets `reveal-ready`.
2. **No JavaScript:** at 1440 px with scripts off, every `[data-reveal]` element has computed transform `none`.
3. **Phones stay still:** at 390 px with motion allowed, `<html>` has no `reveal-ready` and no `[data-reveal]` element is offset.
4. **Below the fold starts lowered, then settles:** at 1440 × 900 with motion allowed, the "What happens next" section starts with a 12 px vertical offset. After it's scrolled into view and 600 ms pass, its transform is `none`.
5. **Once only:** scroll that section out of view and back. It never regains the 12 px offset, and `document.getAnimations()` for it is empty.
6. **Nothing animates on load:** sections already on screen at page load (the practice heading at 1440 × 900) have transform `none` on the first measured frame, with no running transition.
7. **Text never hidden:** during test 4, sample the section's computed `opacity` every 50 ms for 600 ms. It is always `1`.
8. **Stagger:** the 3 featured cards have transition delays of `0s`, `0.06s` and `0.12s`, and no other element has a delay over `0.12s`.
9. **No layout shift:** a `PerformanceObserver` for `layout-shift` entries, across a full top-to-bottom scroll at 1440 px, records a total of **0**.
10. **Off switch:** unit-level. Rendering `ScrollReveal` with `SCROLL_REVEALS` false outputs nothing. Check it by importing the constant in a small test, or with a build-time grep that the component returns `null` when the switch is off.
11. **Accessibility:** axe (WCAG 2.2 AA) finds 0 violations on the home page and one practice page at 1440 px, measured after scrolling to the bottom.

### 6.2 Commands (all must pass)
Run from `site/`.

1. `npx tsc --noEmit`: no errors.
2. `npm run lint`: no errors.
3. `npm run build`: succeeds.
4. `node scripts/check-placeholders.mjs`: the count is unchanged from before this plan. Record the starting number first; on 25 September 2026 it was 3.
5. **Main test suite:**
   - Start both servers from that build:
     - `npx next start -p 3000`;
     - `INTAKE_DESTINATION=local-test npx next start -p 3001`.
   - Run `node tests/e2e.mjs`: every existing check passes, **including both hero-motion checks**, plus all the new ones.
6. `node tests/delivery.mjs`: 4/4.

### 6.3 Size check
Compare the total gzipped size of `.next/static/chunks/*.js` before and after this plan. Record the "before" number at the start of step 1. The increase must be under 1.5 KB.

### 6.4 Visual check
Watch the recording and look at the frames. Confirm all of these:
- each section rises smoothly and only once;
- nothing flickers, jumps or overlaps;
- text is readable in every frame;
- the hero behaves exactly as before.

If anything is off, fix it and record once more.

## 7. Finished when

- [ ] `data-reveal` is on exactly the elements in 4.1, and on nothing in the "never marked" list.
- [ ] Reveals run only at 768 px and wider, with motion allowed and JavaScript on. Otherwise nothing moves, with no offset and no hidden text.
- [ ] Every section reveals once, nothing animates on page load, and text opacity stays 1 throughout.
- [ ] Every new check in 6.1 and every command in 6.2 passes, and the hero-motion tests are unchanged and passing.
- [ ] JavaScript grows by less than 1.5 KB gzipped (6.3).
- [ ] The recording and frames are saved and pass 6.4.
- [ ] The off switch works, and `HANDOFF.md` and `polish-ideas.md` are updated, including the brand-rule note.
- [ ] The preview link is republished, and the commit is pushed to `claude/sleepy-clarke-wjlh48`.
- [ ] The final message to Quinn gives:
  - what changed;
  - the test counts;
  - the recording;
  - one sentence on the off switch and the brand-rule note.

## 8. If something goes wrong

- **Any flicker or jump on load that can't be fixed:** set `SCROLL_REVEALS = false`, push that, and report it with the recording. The site is then exactly as before.
- **A check fails and can't be fixed in a reasonable time:** leave the code as it was before this plan (`git checkout -- site/`). Report the failing check by name, and don't push.
- **The CLS check reports any shift:** it's almost certainly an element whose size changes. Find it with the `layout-shift` entry's `sources` and fix it. Never widen the tolerance above 0.
