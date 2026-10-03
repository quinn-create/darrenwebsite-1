# Speed report

Generated 2026-09-25 04:27 UTC by `npm run speed` (plans/speed-check-plan.md). Median of 5 first visits per page, in fresh browser contexts.

## Phone (4× slower CPU, slow 4G, 412 × 823)

| Page | FCP | LCP | CLS (worst run) | TBT | Taps | JS | Total | Fonts |
|---|---|---|---|---|---|---|---|---|
| `/` | 748 ms | 748 ms | 0.0000 (0.0000) | 128 ms | faq 48, carousel 32, theme 128 | 159 KB | 282 KB | 1 × 25 KB |
| `/practice-areas/` | 604 ms | 604 ms | 0.0000 (0.0000) | 131 ms | theme 88 | 159 KB | 245 KB | 1 × 25 KB |
| `/practice-areas/dui-dwi/` | 620 ms | 620 ms | 0.0000 (0.0000) | 139 ms | faq 48, theme 88 | 159 KB | 238 KB | 1 × 25 KB |
| `/about/` | 596 ms | 596 ms | 0.0000 (0.0000) | 132 ms | theme 80 | 159 KB | 256 KB | 1 × 25 KB |
| `/contact/` | 712 ms | 712 ms | 0.0000 (0.0000) | 132 ms | theme 96 | 173 KB | 249 KB | 1 × 25 KB |

## Desktop (1440 × 900, no throttling)

| Page | FCP | LCP | CLS (worst run) | TBT | Taps | JS | Total | Fonts |
|---|---|---|---|---|---|---|---|---|
| `/` | 136 ms | 136 ms | 0.0000 (0.0000) | 0 ms | faq 32, carousel 32, theme 64 | 159 KB | 280 KB | 1 × 25 KB |
| `/practice-areas/` | 104 ms | 104 ms | 0.0000 (0.0000) | 0 ms | theme 56 | 159 KB | 261 KB | 1 × 25 KB |
| `/practice-areas/dui-dwi/` | 96 ms | 96 ms | 0.0000 (0.0000) | 0 ms | faq 24, theme 40 | 159 KB | 260 KB | 1 × 25 KB |
| `/about/` | 136 ms | 200 ms | 0.0000 (0.0000) | 0 ms | theme 40 | 159 KB | 251 KB | 1 × 25 KB |
| `/contact/` | 116 ms | 116 ms | 0.0000 (0.0000) | 0 ms | theme 48 | 173 KB | 249 KB | 1 × 25 KB |

## Longest tasks (phone, median-TBT run)

- `/`: 178 ms at 1479 ms; 69 ms at 570 ms; 69 ms at 651 ms
- `/practice-areas/`: 181 ms at 1372 ms
- `/practice-areas/dui-dwi/`: 189 ms at 1372 ms
- `/about/`: 182 ms at 1499 ms; 58 ms at 550 ms
- `/contact/`: 182 ms at 1453 ms; 137 ms at 514 ms; 56 ms at 663 ms

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
