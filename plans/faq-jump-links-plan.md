# Plan: FAQ quick-jump buttons

**To run it:** open a Claude Code session on this repository (branch `claude/sleepy-clarke-wjlh48`) and say *"Run plans/faq-jump-links-plan.md."* Nothing else is needed from you. Every decision is made below, and every check is automated.

Written 25 September 2026.

---

## 1. Goal

On any page with enough FAQs, show a row of **"Jump to" buttons** above the FAQ list, one per topic. Tapping a button takes the visitor straight to that group of questions and opens the first one. Microsoft's support pages work this way.

**Visitors should:**
- find the right question without reading the whole list;
- not see the buttons when there are too few questions for them to help.

## 2. Non-goals (don't do these)

- **Don't change the wording of any question or answer.** Darren approved all of it on 24 September 2026 (see `plans/for-darren/answers-2026-09-24.md`).
- **Don't add new questions.**
- Don't add a search box.
- Don't add any new npm package.
- Don't make the buttons depend on JavaScript. Without scripts they must still scroll to the right group.
- Don't publish or deploy anything beyond updating the existing private preview link (step 9).

## 3. Starting point (verified 25 Sep 2026)

| Page | FAQs | Source |
|---|---|---|
| Home (`/`) | 4 | `HOME_FAQ` in `site/lib/site.ts` |
| Each of the 5 practice pages | 2 | `PRACTICES[n].faq` in `site/lib/site.ts` |

- **Component:** `Faq({ items, id })` in `site/components/Sections.tsx`. It renders one bordered list of native `<details>` elements.
- **Where it's used:** `site/app/page.tsx` (home) and `site/app/practice-areas/[slug]/page.tsx`.

## 4. Design decisions (already made)

### 4.1 Topics
There are three fixed topics, which are plain navigation labels rather than legal statements:

| Topic id | Button label |
|---|---|
| `getting-started` | Getting started |
| `your-case` | Your case |
| `working-with-us` | Working with the office |

Assign every existing FAQ exactly once:

| FAQ question (unchanged) | Topic |
|---|---|
| Does submitting the form mean you represent me? (home) | `working-with-us` |
| What should I include in my inquiry? (home) | `getting-started` |
| What areas do you serve? (home) | `working-with-us` |
| Can I call instead? (home) | `getting-started` |
| I've never been charged before. What should I do first? | `your-case` |
| What information should I have ready when I reach out? (both pages it appears on) | `getting-started` |
| What should I do first if I have been charged? | `your-case` |
| What happens after a DUI/DWI arrest? | `your-case` |
| Should I contact the office before my first court date? | `getting-started` |
| What happens after a domestic assault arrest? | `your-case` |
| What should I avoid doing while my case is open? | `your-case` |
| How do I know whether my record may be eligible? | `your-case` |
| What documents are useful to have on hand? | `getting-started` |

### 4.2 When the buttons appear
They show only when a page has **at least 4 FAQs across at least 2 topics.** Put this rule in one constant, `FAQ_JUMP_MIN = 4`.

- **Today:** the home page gets buttons (4 questions, 2 topics). Practice pages don't (2 questions each).
- **Later:** when Darren adds questions to a practice page, its buttons appear by themselves.

### 4.3 Layout and behaviour
- **Grouping:** when buttons show, the FAQ list is grouped by topic, in the order of the table in 4.1. Each group gets a small heading (`h3`, the topic label) inside the FAQ section. When buttons don't show, the list looks exactly as it does today, with no group headings.
- **The buttons:**
  - a `<nav aria-label="Jump to a FAQ topic">` holding plain links, `<a href="#faq-<pageId>-<topicId>">`;
  - styled with the site's existing `.chip` class plus hover and focus states;
  - at least 44 px tall;
  - wrapping onto more lines on phones, never scrolling sideways.
- **Group ids:** unique on the page, for example `faq-faq-getting-started`, built from the `Faq` component's `id` prop.
- **Scrolling:** the sticky header must not cover the target. The existing `scroll-padding-top` covers this; check it in 6.2.
- **Small script, added on top:** on click, open the group's first `<details>` and move keyboard focus to its `<summary>`. If scripts are off, the plain link still scrolls to the group.
- **Motion:** smooth scrolling only when the visitor hasn't asked for reduced motion.

## 5. Steps

1. **Data (`site/lib/site.ts`):**
   - Add `export const FAQ_TOPICS = [{ id, label }, …]` in the order of 4.1, and `export const FAQ_JUMP_MIN = 4`.
   - Add `topic: "<topic id>"` to every FAQ item in `HOME_FAQ` and every `PRACTICES[n].faq`, exactly as in 4.1.
   - Widen the FAQ item type to `{ q: string; a: string; topic: FaqTopicId }`, where `FaqTopicId` is the union of the topic ids, so a missing or misspelled topic fails the type check.
2. **Component (`site/components/Sections.tsx`):**
   - Extend `Faq` to group items by topic when the rule in 4.2 is met, render the button row and the group headings, and give each group its id.
   - Keep today's markup exactly when the rule isn't met.
3. **Small script:**
   - Add a client component, for example `site/components/FaqJumpLinks.tsx` with `"use client"`, that renders the button links and adds the click behaviour from 4.3.
   - `Faq` itself stays a server component.
4. **Styles:** reuse `.chip` and add at most a small `.chip-link` rule in `site/app/globals.css` (hover border in the cyan action colour, visible focus ring, `min-height: 44px`). Add no new colours.
5. **Tests (`site/tests/e2e.mjs`):** add the checks in 6.1.
6. **Run everything:** the commands in 6.2.
7. **Screenshots:**
   - Save the home FAQ section at 1440, 768 and 390 px to `printouts/site-preview/faq-jump-{1440,768,390}.png`.
   - Save one practice page's FAQ at 390 px, showing it has no buttons, to `faq-jump-none-390.png`.
8. **Handoff notes:** append a short section to `site/HANDOFF.md`, and mark idea 5 as built in `plans/polish-ideas.md`.
9. **Preview and push:**
   - Rebuild the clickable preview with `node printouts/site-browser/build.cjs`, then republish the existing private link (https://claude.ai/artifact/HRkufSWZ8TydyinEMhLHNF) from `printouts/site-browser/artifact.html`.
   - Commit, with the usual co-author and session lines, and push to `claude/sleepy-clarke-wjlh48`.

## 6. Checks

### 6.1 New automated tests (add to `site/tests/e2e.mjs`)
1. **The home page shows the buttons:** `nav[aria-label="Jump to a FAQ topic"]` is visible and has exactly 2 links, "Getting started" and "Working with the office", in that order.
2. **Practice pages don't:** none of the 5 practice pages has that nav, and each shows its 2 FAQs exactly as before.
3. **A button jumps and opens the right group:** with scripts on, clicking "Working with the office" puts the group heading in view below the sticky header (its top is at or below the header's bottom edge). The first `<details>` in that group is open, and keyboard focus is on its `<summary>`.
4. **Works without JavaScript:** in a browser context with scripts off, clicking a button changes the address to `#faq-faq-working-with-us` and scrolls that group into view.
5. **Keyboard:** Tab reaches every button in order, each shows a visible focus ring, and Enter works like a click.
6. **Tap size:** every button is at least 44 px tall at 390 px wide.
7. **No sideways scroll:** at 320 px wide, the page's `scrollWidth` is at most its `clientWidth`.
8. **Wording unchanged:** the text of every question and answer on the home page and all 5 practice pages matches the strings in `site/lib/site.ts`.
9. **Accessibility:** axe (WCAG 2.2 AA) finds 0 violations on the home page at 1440 and 390 px, with a FAQ group opened.

### 6.2 Commands (all must pass)
Run from `site/`.

1. `npx tsc --noEmit`: no errors.
2. `npm run lint`: no errors.
3. `npm run build`: succeeds.
4. `node scripts/check-placeholders.mjs`: exactly **3** placeholders, the same as before. It must not rise.
5. **Main test suite:**
   - Start both servers from that build:
     - `npx next start -p 3000`;
     - `INTAKE_DESTINATION=local-test npx next start -p 3001`.
   - Run `node tests/e2e.mjs`: every check passes. That's today's 27 plus the new ones.
6. `node tests/delivery.mjs`: 4/4.

### 6.3 Visual check
Open the four screenshots from step 7 and confirm all of these:
- the buttons sit between the "Frequently asked questions" heading and the list;
- they wrap neatly at 390 px;
- the group headings line up with the questions;
- nothing overlaps or is cut off.

If anything is wrong, fix it and re-screenshot once.

## 7. Finished when

- [ ] Every FAQ has a topic, and the type check enforces it.
- [ ] The home page shows 2 jump buttons that take you to, and open, the right group, with or without JavaScript.
- [ ] Practice pages look exactly as before, and gain buttons automatically once they have at least 4 FAQs in at least 2 topics.
- [ ] No question or answer wording changed; test 6.1.8 passes.
- [ ] All the commands in 6.2 pass, with the placeholder count still 3.
- [ ] The screenshots are saved and pass 6.3.
- [ ] `HANDOFF.md` and `polish-ideas.md` are updated.
- [ ] The preview link is republished, and the commit is pushed to `claude/sleepy-clarke-wjlh48`.
- [ ] The final message to Quinn gives:
  - what changed;
  - the test counts;
  - the screenshots;
  - one sentence on when practice pages will start showing buttons.

## 8. If something goes wrong

- **A check fails and can't be fixed in a reasonable time:** leave the code as it was before this plan (`git checkout -- site/`). Report the failing check by name, and don't push.
- **The rule in 4.2 looks wrong once built** (for example, two buttons on the home page look sparse): keep the rule as written. Report it with a screenshot and let Quinn decide. Don't change the threshold without asking.
