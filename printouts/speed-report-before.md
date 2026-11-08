# Speed report (before)

Generated 2026-09-25 03:07 UTC by `npm run speed` (plans/speed-check-plan.md). Median of 5 first visits per page, in fresh browser contexts.

## Phone (4× slower CPU, slow 4G, 412 × 823)

| Page | FCP | LCP | CLS (worst run) | TBT | Taps | JS | Total | Fonts |
|---|---|---|---|---|---|---|---|---|
| `/` | 768 ms | 768 ms | 0.0079 (0.0079) | 172 ms | faq 56, carousel 40, theme 128 | 181 KB | 299 KB | 1 × 25 KB |
| `/practice-areas/` | 640 ms | 640 ms | 0.0111 (0.0111) | 129 ms | theme 104 | 181 KB | 263 KB | 1 × 25 KB |
| `/practice-areas/dui-dwi/` | 672 ms | 672 ms | 0.0482 (0.0482) | 133 ms | faq 56, theme 96 | 181 KB | 254 KB | 1 × 25 KB |
| `/about/` | 640 ms | 640 ms | 0.0800 (0.0800) | 136 ms | theme 80 | 181 KB | 275 KB | 1 × 25 KB |
| `/contact/` | 716 ms | 716 ms | 0.0977 (0.0977) | 148 ms | theme 104 | 187 KB | 261 KB | 1 × 25 KB |

## Desktop (1440 × 900, no throttling)

| Page | FCP | LCP | CLS (worst run) | TBT | Taps | JS | Total | Fonts |
|---|---|---|---|---|---|---|---|---|
| `/` | 208 ms | 208 ms | 0.0043 (0.0043) | 0 ms | faq 24, carousel 24, theme 72 | 181 KB | 297 KB | 1 × 25 KB |
| `/practice-areas/` | 124 ms | 124 ms | 0.0034 (0.0034) | 0 ms | theme 56 | 181 KB | 278 KB | 1 × 25 KB |
| `/practice-areas/dui-dwi/` | 128 ms | 128 ms | 0.0111 (0.0111) | 0 ms | faq 32, theme 40 | 181 KB | 278 KB | 1 × 25 KB |
| `/about/` | 156 ms | 220 ms | 0.0210 (0.0210) | 0 ms | theme 40 | 181 KB | 269 KB | 1 × 25 KB |
| `/contact/` | 144 ms | 144 ms | 0.0095 (0.0095) | 0 ms | theme 48 | 187 KB | 259 KB | 1 × 25 KB |

## Longest tasks (phone, median-TBT run)

- `/`: 191 ms at 501 ms; 188 ms at 1637 ms; 81 ms at 706 ms; 73 ms at 1422 ms; 61 ms at 1874 ms
- `/practice-areas/`: 181 ms at 448 ms; 179 ms at 1492 ms
- `/practice-areas/dui-dwi/`: 215 ms at 452 ms; 183 ms at 1499 ms; 50 ms at 1731 ms
- `/about/`: 193 ms at 442 ms; 186 ms at 1639 ms; 50 ms at 1881 ms
- `/contact/`: 220 ms at 442 ms; 197 ms at 1516 ms; 51 ms at 1769 ms

## Caching

- ✓ /_next/static/* is public, max-age=31536000, immutable (`public, max-age=31536000, immutable`)
- ✓ / is not no-store (back/forward cache) (`s-maxage=31536000`)
- ✓ /practice-areas/ is not no-store (back/forward cache) (`s-maxage=31536000`)
- ✓ /practice-areas/dui-dwi/ is not no-store (back/forward cache) (`s-maxage=31536000`)
- ✓ /about/ is not no-store (back/forward cache) (`s-maxage=31536000`)
- ✗ /contact/ is not no-store (back/forward cache) (`private, no-cache, no-store, max-age=0, must-revalidate`)
- ✓ /_next/image max-age ≥ 1 day (`public, max-age=315360000, immutable`)

## Budgets

- ✗ phone /: JS 180.9 KB > 175
- ✗ phone /practice-areas/: CLS 0.0111 > 0.01
- ✗ phone /practice-areas/: JS 180.9 KB > 175
- ✗ phone /practice-areas/dui-dwi/: CLS 0.0482 > 0.01
- ✗ phone /practice-areas/dui-dwi/: JS 180.9 KB > 175
- ✗ phone /about/: CLS 0.0800 > 0.01
- ✗ phone /about/: JS 180.9 KB > 175
- ✗ phone /contact/: CLS 0.0977 > 0.01
- ✗ phone /contact/: JS 187.0 KB > 175
- ✗ desktop /practice-areas/dui-dwi/: CLS 0.0111 > 0.01
- ✗ desktop /about/: CLS 0.0210 > 0.01
- ✗ caching: /contact/ is not no-store (back/forward cache) (got "private, no-cache, no-store, max-age=0, must-revalidate")
