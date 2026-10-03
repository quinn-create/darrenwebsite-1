# Plan: custom practice-area icons (and optional page images)

**To run it:** open a Claude Code session on this repository (branch `claude/sleepy-clarke-wjlh48`) and say *"Run plans/practice-icons-plan.md, Part A."* Part B is optional and runs only if Quinn says *"Run Part B too."*

Written 3 October 2026, after Quinn asked for the practice icons (flag, car, shield…) to look more premium. It doesn't depend on any other open plan.

---

## 1. Goal

Replace the five generic practice-area icons with a **custom set drawn for this site**. Each icon sits in a small tile with one cyan detail, so the cards look finished and specific to Darren's firm. The change must stay light, sharp at every size, and work in both colour themes.

Draft shown to Quinn on 3 October 2026 (top row now, bottom row proposed).

## 2. Brand rules this must obey

From `Darren_Drake_AI_Brand_Guidelines.md` and `CLAUDE.md`:

- **"Use one icon family with consistent stroke weight; icons supplement written labels."** So the new icons are drawn on the same 24-unit grid, with the same 1.5 stroke and round line ends, as every other icon on the site (lucide). They stay decorative: each card keeps its written title, and the icons are hidden from screen readers.
- **Imagery to avoid:** handcuffs, police lights, courtroom victories, gavels, and anything suggesting court affiliation. So no badge-like shield, no gavel and no courthouse.
- **Surfaces:** "flat navy surface, a thin border… do not wrap every card in glow." So the tile uses a thin border and a faint tint, with no glow or animation.
- **Accessibility:** WCAG 2.2 AA, forced colours (high contrast), 200% zoom and reduced motion.
- **Budgets:** no new package, and no images. The icons are a few hundred bytes of inline drawing each.

## 3. Non-goals (don't do these)

- No wording, layout or button changes.
- No AI-made pictures as icons (blurry at icon size, don't follow the colour themes, and break the "one icon family" rule).
- No animation on the icons.
- No change to the other icons on the site (phone, arrows, "At a glance" facts, the process steps).

## 4. The five icons

| Practice area | Now | New symbol | Why | Cyan detail |
|---|---|---|---|---|
| First-Time Offenders | Flag | **Sunrise** over a horizon | "A fresh start"; a flag says little | The sun's arc |
| Criminal Defense | Briefcase | **Scales** | Weighing both sides; a briefcase reads as "business" | The two pans |
| DUI/DWI | Car | **Car, front view**, redrawn cleaner | Still the clearest symbol | The headlights |
| Domestic Assault | Shield | **House** | About the home; a shield can look like a police badge | The door |
| Expungement | Document | **Record with a "reset" arrow** | Clearing a record | The reset arrow |

Notes:
- The "At a glance" card and the home page already use lucide's scales for "Board member, Rutherford County DUI Court". The new scales must be **drawn differently** (pans hanging lower, a base line). If they still look alike in the screenshots, use a **balanced column with two weights** instead. Record which was used in the handoff.
- Avoid in every icon: hearts (reads as a wellness business), handshakes, people, cars in motion, alcohol, police or court symbols.

## 5. Design spec

- **Icon:** 24×24 grid, `stroke-width` 1.5, round caps and joins, `fill="none"`. Main lines `currentColor` (the text colour). One accent detail uses `var(--color-action)`: `#67e8f9` on the dark theme, `#0e7490` on the light theme (already set in `app/globals.css`).
- **Tile:** square with 14 px rounded corners. A 1 px border of `--card-hover-border`, and a background of `--tint-action` (both already exist for each theme). No shadow or glow.
- **Sizes** (icon fills about 55–60% of the tile, larger than the 3 Oct draft):

| Where | Tile | Icon |
|---|---|---|
| Home "How Darren can help" cards and the Practice Areas page cards | 56 px | 32 px |
| Home practice carousel (mobile) | 48 px | 28 px |
| "Other practice areas" links at the foot of each practice page | 40 px | 22 px |

- **Forced colours (high contrast):** the tile background disappears and gets a 1 px `CanvasText` border. Both the lines and the accent use `CanvasText`, so nothing goes missing.
- **Hover:** the card already lifts 2 px. The tile doesn't animate on its own.

## 6. Steps

1. **Draw the icons** in `site/components/PracticeIcon.tsx` as inline SVG, one small component per icon. Remove the lucide `Flag`, `Briefcase`, `Shield` and `FileText` imports there (still used elsewhere: keep them installed).
2. **Rename the icon keys** in `site/lib/site.ts` (`PRACTICES[].icon`): `flag → sunrise`, `briefcase → scales`, `car → car`, `shield → home`, `file → record`. Update the type.
3. **Add the tile:** `PracticeIcon` takes a `size` of `"lg" | "md" | "sm"` (section 5) and renders the tile around the icon. Update the three callers:
   - `components/Sections.tsx` (`lg`);
   - `components/PracticeCarousel.tsx` (`md`);
   - `app/practice-areas/[slug]/page.tsx` (`sm`).
4. **Styles** in `app/globals.css`: a `.practice-icon` class for the tile, a `.practice-icon .accent` class for the cyan detail, and the forced-colours rule. Colours come from tokens only, no raw hex (file rule).
5. **Link previews:** check `scripts/share-card.tsx`. If it doesn't use the icons (it didn't on 3 Oct 2026), leave the cards alone.

## 7. Checks (all must pass before pushing)

- **New e2e test**, "Practice icons are the custom set". On the home page, the Practice Areas page and one practice page:
  - each practice card has exactly one icon tile;
  - its `svg` has `aria-hidden="true"` and a `data-icon` matching the practice (`sunrise`, `scales`, `car`, `home`, `record`);
  - the tile is at least 40 px;
  - no lucide `lucide-flag`, `lucide-shield` or `lucide-briefcase` class remains in those cards.
- **New e2e test**, "Practice icons keep their accent in both themes". The accent's computed stroke equals `--color-action` on the dark theme and again after switching to the light theme.
- **All existing checks:** `npm test`, `check:claims`, `check:buttons`, `check:links`, `check:placeholders`, `check:lighthouse`, `test:consent`, lint and typecheck. Also run the Cloudflare size check (`node scripts/check-cloudflare.mjs`): the worker must stay under 3 MB.
- **Screenshots** at 320, 390, 768 and 1440 px in **both themes**:
  - the home "How Darren can help" section;
  - the Practice Areas page;
  - the foot of one practice page;
  - one forced-colours shot (Chromium `forcedColors: "active"`) of the Practice Areas page.
  - Save them as `printouts/Practice-Icons-Screenshots.pdf` and send them to Quinn.

## 8. Records

- `site/HANDOFF.md`: replace the icon notes with the new set, the symbol meanings and how to add an icon for a future practice area.
- `docs/DECISIONS.md` → "Other answers": "Practice icons: custom set (sunrise, scales, car, house, record), Quinn's request 3 Oct 2026". Mark it **waiting on Darren's look** until Quinn says Darren has seen the screenshots. (It changes the Phase 1 design Darren approved.)

## 9. Part B (optional): one image per practice page, made with Higgsfield

Only if Quinn asks. It costs Higgsfield credits.

- **What:** one calm, wide image per practice page, under the opening section (never the first thing on a phone, never behind text). Five images in one consistent style. **Example subjects**, each a real-looking Murfreesboro or Middle Tennessee place, with **no people, no faces, no police, no courtroom, no courthouse**:

| Practice page | Example subject |
|---|---|
| First-Time Offenders | An early-morning tree-lined street |
| Criminal Defense | Law books and a legal pad on a wooden desk |
| DUI/DWI | A quiet two-lane road at dusk |
| Domestic Assault | A front porch light at evening |
| Expungement | A clean desk with one closed folder |

- **Brand rules:** "Architectural images are supporting context, not proof of court affiliation". So no recognizable courthouse, and no image that could be taken for a real client's situation.
- **Steps:**
  1. Check the Higgsfield workspace, the models and the **credit estimate**, and tell Quinn the cost before submitting.
  2. Make one test image. Quinn approves the style.
  3. Make the other four, then crop to 16:9.
  4. Save as AVIF/WebP, 60 KB or less each, with width and height set, lazy-loaded.
  5. Write plain alt text that describes the scene and makes no claims.
  6. Record each image's job ID and prompt in `assets/photos/PROVENANCE.md`, marked "AI-generated, illustrative".
- **Checks:** everything in section 7, plus Lighthouse on two practice pages: LCP 2.5 s or less and CLS 0.1 or less on a throttled phone. The first page load must stay around 1 MB or less.
- **Needs Darren's OK** before launch: the images are part of the firm's advertising.

## 10. Waiting on

- **Part A:** nothing; Quinn asked for it. Darren sees the screenshots afterwards.
- **Part B:** Quinn's go-ahead and the credit cost; then Darren's OK on the images.
