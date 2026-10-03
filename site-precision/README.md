# Darren Drake: Precision website (local demo)

This is a working demonstration of the **Precision** design direction (concept B), built from `../prompts/precision-website-build-prompt.md`. It is a separate project from the Signal site in `../site/`. It's for local preview only: it isn't deployed, and ddrakelaw.com is untouched.

## Run it

```bash
cd site-precision
npm install
npm run dev          # http://localhost:3000, form in demo mode ("not connected")
```

To try a real submission against a local test destination (test data only, never live inquiries):

```bash
npm run build
INTAKE_DESTINATION=local-test npm start   # submissions are appended to site-precision/.data/intake-test.jsonl
```

## Checks

| Command | What it does |
|---|---|
| `npm run lint` | ESLint (Next.js config) |
| `npm run typecheck` | TypeScript, no emit |
| `npm run build` | Production build |
| `./tests/run-e2e.sh` | Builds, starts a demo server (:3000) and a test-destination server (:3001), then runs `tests/e2e.mjs`: form states, keyboard, mobile, reflow, no-JavaScript rendering, reduced motion and an axe WCAG 2.2 AA scan |
| `node tests/screenshots.mjs` | Page screenshots at 390, 768 and 1440 px (needs :3000 running) |
| `node tests/form-states.mjs` | Intake state screenshots (needs :3000 and :3001) |
| `node tests/perf.mjs` | Lab performance proxy on throttled mobile (needs :3000) |

The Playwright scripts use the preinstalled Chromium at `/opt/pw-browsers/chromium`. Set `CHROMIUM_PATH` to point them at another browser.

## Intake delivery

`INTAKE_DESTINATION` controls where the form sends inquiries:

| Value | Behavior |
|---|---|
| unset | **Demo mode.** The page shows "Demo form, not connected", the API returns `not_configured`, and nothing is ever reported as received |
| `local-test` | Appends to `.data/intake-test.jsonl` and flushes to disk before confirming. For testing only |
| `https://…` | POSTs JSON to a webhook (email service, CRM, etc.), with an optional `INTAKE_WEBHOOK_SECRET` bearer token. Success is shown only on a 2xx reply |

Rate limiting (5 per IP per 10 minutes) and duplicate suppression (2 minutes) are held in memory for each server instance. Move them to a shared store before production.

## Structure

- `app/`: pages (`/`, `/practice-areas`, `/practice-areas/[slug]`, `/about`, `/contact`, `/intake`, `/privacy`, 404) and `api/intake`
- `components/`: header and mobile menu, footer, portrait, section blocks (including the hero next-step row), intake form
- `lib/site.ts`: firm facts and shared copy (placeholders are marked `[CONFIRM…]` / `[FIRM TO…]`)
- `lib/intake-rules.ts`: validation shared by the form and the server
- `lib/intake-delivery.ts`: destination adapters
- `app/globals.css`: the Precision tokens (the only place hex values appear)

## Header "DD" mark

Concept B shows a cobalt "DD" square beside the name, but the guidelines reserve the monogram for the favicon. It's on by default. To build without it:

```bash
NEXT_PUBLIC_SHOW_DD_MARK=false npm run build
```

See `HANDOFF.md` for test results, deviations and what's still needed before launch.
