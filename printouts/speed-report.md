# Speed report

Generated 2026-09-25 03:49 UTC by `npm run speed` (plans/speed-check-plan.md). Median of 5 first visits per page, in fresh browser contexts.

## Phone (4× slower CPU, slow 4G, 412 × 823)

| Page | FCP | LCP | CLS (worst run) | TBT | Taps | JS | Total | Fonts |
|---|---|---|---|---|---|---|---|---|
| `/` | 760 ms | 760 ms | 0.0000 (0.0000) | 131 ms | faq 56, carousel 32, theme 120 | 159 KB | 281 KB | 1 × 25 KB |
| `/practice-areas/` | 600 ms | 600 ms | 0.0000 (0.0000) | 135 ms | theme 104 | 159 KB | 244 KB | 1 × 25 KB |
| `/practice-areas/dui-dwi/` | 620 ms | 620 ms | 0.0000 (0.0000) | 137 ms | faq 48, theme 96 | 159 KB | 237 KB | 1 × 25 KB |
| `/about/` | 604 ms | 604 ms | 0.0000 (0.0000) | 136 ms | theme 88 | 159 KB | 256 KB | 1 × 25 KB |
| `/contact/` | 720 ms | 720 ms | 0.0000 (0.0000) | 135 ms | theme 104 | 173 KB | 248 KB | 1 × 25 KB |

## Desktop (1440 × 900, no throttling)

| Page | FCP | LCP | CLS (worst run) | TBT | Taps | JS | Total | Fonts |
|---|---|---|---|---|---|---|---|---|
| `/` | 140 ms | 140 ms | 0.0000 (0.0000) | 0 ms | faq 32, carousel 40, theme 64 | 159 KB | 279 KB | 1 × 25 KB |
| `/practice-areas/` | 100 ms | 100 ms | 0.0000 (0.0000) | 0 ms | theme 56 | 159 KB | 260 KB | 1 × 25 KB |
| `/practice-areas/dui-dwi/` | 104 ms | 104 ms | 0.0000 (0.0000) | 0 ms | faq 32, theme 40 | 159 KB | 259 KB | 1 × 25 KB |
| `/about/` | 120 ms | 176 ms | 0.0000 (0.0000) | 0 ms | theme 40 | 159 KB | 250 KB | 1 × 25 KB |
| `/contact/` | 124 ms | 124 ms | 0.0000 (0.0000) | 0 ms | theme 48 | 173 KB | 248 KB | 1 × 25 KB |

## Longest tasks (phone, median-TBT run)

- `/`: 181 ms at 1471 ms; 74 ms at 653 ms; 71 ms at 568 ms
- `/practice-areas/`: 185 ms at 1356 ms
- `/practice-areas/dui-dwi/`: 187 ms at 1367 ms; 53 ms at 497 ms
- `/about/`: 186 ms at 1510 ms
- `/contact/`: 185 ms at 1437 ms; 153 ms at 498 ms

## Caching

- ✓ /_next/static/* is public, max-age=31536000, immutable (`public, max-age=31536000, immutable`)
- ✓ / is not no-store (back/forward cache) (`s-maxage=31536000`)
- ✓ /practice-areas/ is not no-store (back/forward cache) (`s-maxage=31536000`)
- ✓ /practice-areas/dui-dwi/ is not no-store (back/forward cache) (`s-maxage=31536000`)
- ✓ /about/ is not no-store (back/forward cache) (`s-maxage=31536000`)
- ✓ /contact/ is not no-store (back/forward cache) (`private, no-cache, max-age=0, must-revalidate`)
- ✓ /_next/image max-age ≥ 1 day (`public, max-age=315360000, immutable`)

## Budgets

- ✓ All budgets pass.

Phone TBT budget tightened from 250 ms (plan 4.4) for: `/` 152 ms. See the note at BUDGET in tests/speed.mjs.
