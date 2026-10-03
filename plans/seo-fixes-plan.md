# Plan: SEO fixes

**To run it:** open a Claude Code session on this repository (branch `claude/sleepy-clarke-wjlh48`) and say *"Run plans/seo-fixes-plan.md."* Nothing else is needed from you. Every decision is made below, and every check is automated.

Written 25 September 2026. It doesn't depend on any other open plan.

---

## 1. Goal

When the site goes live, Google should understand exactly:
- **which address is the real one for each page** (canonical tags);
- **who the business is:** name, address, phone, hours, area served and the attorney (structured data for local search);
- **how the pages fit together** (breadcrumbs).

**Titles and descriptions** should also fit in Google's results without being cut off.

The site must stay **hidden from search engines until launch**, as it is now. Everything here is ready the moment `SITE_ENV=production` is switched on.

## 2. What the SEO check found (25 Sep 2026)

**Already fine:**
- all 12 pages return 200;
- no broken internal links;
- titles and descriptions are unique;
- one `<h1>` per page;
- every image has alt text;
- `lang="en"`;
- the sitemap lists all 12 pages;
- preview builds send `noindex` and a robots file with `Disallow: /`;
- the production build switches both to "allow" and points at the sitemap.

**To fix:**

| # | Problem | Why it matters |
|---|---|---|
| 1 | No canonical tag on any page | Without it, `ddrakelaw.com/about` and `…/about/?ref=x` can be treated as different pages, splitting their ranking |
| 2 | No structured data (JSON-LD) | Google's local results and knowledge panel use it for the firm's name, address, phone and hours. This is the most important gap for a local law firm |
| 3 | No breadcrumb structured data | The breadcrumbs people see aren't described to Google, so results can't show "ddrakelaw.com › Practice Areas › DUI/DWI" |
| 4 | The home title is 76 characters | Google shows about 60, so the end is cut off |
| 5 | The home description is 199 characters | Google shows about 155–160 |
| 6 | The sitemap has no `lastmod` dates | Minor. Dates help Google decide when to re-crawl |

## 3. Non-goals (don't do these)

- **Only facts Darren confirmed** (`plans/for-darren/answers-2026-09-24.md`) go into structured data. No ratings or reviews (`aggregateRating`), no `priceRange`, no social-profile links (`sameAs`; the old profiles aren't confirmed), no map coordinates, no founding date, no awards.
- **No FAQ structured data.** Since 2023 Google shows FAQ rich results only for government and health sites, so it would add weight for no benefit.
- **Don't change page wording**, except the home title and description (4.4). Those are search listings, not page text, and they use only confirmed facts.
- **Don't switch indexing on.** `SITE_ENV` stays unchanged, and the site stays hidden until launch.
- **No new npm package.**

## 4. Design (already decided)

### 4.1 Canonical tags
- **Where:** every page gets `<link rel="canonical">` with its full address, ending in `/` (the site's style), for example `https://ddrakelaw.com/practice-areas/dui-dwi/`.
- **How:**
  - set `alternates: { canonical: "/" }` on the home page;
  - on every other page, add `alternates.canonical` with its path in that page's `metadata` or `generateMetadata`;
  - `metadataBase` (already `SITE_URL`) turns these into full addresses.
- **Not found page:** no canonical.

### 4.2 Business structured data (every page)
Add one JSON-LD `@graph` to `site/app/layout.tsx`, built by a new `site/lib/structured-data.ts` from `FIRM`, `PHONE_DISPLAY`/`PHONE_HREF`, `PRACTICES` and `SITE_URL`, with no copied-in text.

**Node 1: the law firm**
- `@type` = `["LegalService", "LocalBusiness"]`
- `@id` = `https://ddrakelaw.com/#firm`
- `name` = `FIRM.legalName` (Darren Drake Law PLLC)
- `url` = `SITE_URL`
- `telephone` = `+1-615-546-5551`
- `address`:
  - `PostalAddress`;
  - `streetAddress` = "138 S. Cannon Ave";
  - `addressLocality` = "Murfreesboro";
  - `addressRegion` = "TN";
  - `postalCode` = "37129";
  - `addressCountry` = "US".

  These parts come from `FIRM`. Add structured parts to `FIRM` (`street`, `city`, `region`, `postalCode`) and derive the existing `address` string from them, so the visible address can never disagree with the structured one.
- `openingHoursSpecification`: Monday–Friday, 08:00–17:00.
- `areaServed`:
  - `City` Murfreesboro, TN;
  - `City` Smyrna, TN;
  - `AdministrativeArea` Rutherford County, TN.
- `image`: the approved 4:5 portrait, full address.
- `knowsAbout`: the five practice-area titles, taken from `PRACTICES`.
- `employee`: a reference to `#darren`.

**Node 2: Darren**
- `@type` = `Person`
- `@id` = `https://ddrakelaw.com/#darren`
- `name` = "Darren Drake"
- `jobTitle` = "Attorney at Law"
- `worksFor` = a reference to `#firm`
- `alumniOf`:
  - Southern Illinois University School of Law;
  - Southern Illinois University Carbondale.
- `memberOf`:
  - Tennessee Association of Criminal Defense Lawyers;
  - Rutherford & Cannon County Bar Association.
- `image` = the portrait
- `url` = `SITE_URL` + "/about/"

**Node 3: the website**
- `@type` = `WebSite`
- `@id` = `#website`
- `name` = "Darren Drake Law PLLC"
- `url` = `SITE_URL`
- `publisher` = a reference to `#firm`

**Rendering:** a `<script type="application/ld+json">` tag in the layout, with the JSON escaped so it can't break out of the tag (replace `<` with `<`).

### 4.3 Breadcrumb structured data (every page except home)
- **Source:** reuse each page's existing breadcrumb list, the `crumbs` prop of `PageIntro` and the About page's `Breadcrumbs`.
- **Component:** add a `BreadcrumbJsonLd` component in `site/components/Sections.tsx`. It turns that same list into a `BreadcrumbList`, with `position` starting at 1 and each `item` a full address. The last crumb is the current page, so it gets that page's canonical address.
- **Placement:** render it inside `Breadcrumbs`, so the visible and structured breadcrumbs can never disagree.

### 4.4 Home title and description

| | Now | New |
|---|---|---|
| Title | "Darren Drake, Attorney at Law \| Murfreesboro, Rutherford County & Smyrna" (76) | **"Darren Drake, Attorney at Law \| Murfreesboro, TN"** (48) |
| Description | the 199-character text | **"Criminal defense attorney in Murfreesboro, TN, serving Rutherford County and Smyrna. First-time offenses, DUI/DWI and domestic assault. Call (615) 546-5551."** (156) |

Change `SITE_DESCRIPTION` in `lib/site.ts`, which the layout and link previews already share, and the layout's `title.default`.

**Other pages:** every other title already fits under 60 characters. Descriptions under 70 characters (Privacy, Legal notice) stay as they are; they're low-value pages.

### 4.5 Sitemap dates
- **What:** add `lastModified` to each sitemap entry.
- **Where the date comes from:** use each page's last git commit date. Read it at build time with `git log -1 --format=%cI -- <file>`.
- **Fallback:** if git isn't available at build time, use the build date.
- **Where it lives:** in a small helper inside `site/app/sitemap.ts`.

## 5. Steps

1. **Record the starting point:**
   - the placeholder count (`node scripts/check-placeholders.mjs`, 3 on 25 Sep 2026);
   - the current e2e test count.
2. **Address parts:** add the structured address to `FIRM` in `site/lib/site.ts` (4.2) and derive `FIRM.address` from it. Confirm the visible address text is unchanged.
3. **Structured data:** create `site/lib/structured-data.ts` (firm, Darren, website, breadcrumbs), and render the business graph in `site/app/layout.tsx`.
4. **Breadcrumbs:** add `BreadcrumbJsonLd` and render it from `Breadcrumbs` (4.3).
5. **Canonicals:** add `alternates.canonical` on all 12 pages (4.1).
6. **Home title and description:** make the change in 4.4.
7. **Sitemap dates:** make the change in 4.5.
8. **Tests:** add the checks in 6.1 to `site/tests/e2e.mjs`.
9. **Production-mode check:** run 6.3 against a test-only production build.
10. **Run everything:** the commands in 6.2.
11. **Save a report:** write `printouts/seo-report.md` with:
    - each page's title (with its length), description (with its length) and canonical;
    - the full JSON-LD from the home page and one practice page;
    - the robots file and sitemap in preview mode and in production mode.
12. **Handoff notes:**
    - Append a section to `site/HANDOFF.md`.
    - Add a "Search" block to the launch-day section of `plans/for-darren/go-live-setup.md`: the items in section 8.
13. **Commit and push:** commit, with the usual co-author and session lines, and push to `claude/sleepy-clarke-wjlh48`. The preview link doesn't need republishing, because search tags aren't visible.

## 6. Checks

### 6.1 New automated tests (add to `site/tests/e2e.mjs`)
1. **Canonicals:** each of the 12 pages has exactly one `<link rel="canonical">`, equal to `https://ddrakelaw.com` plus that page's path with a trailing `/`. A page opened with `?utm_source=test` still gives the clean canonical.
2. **Business data is valid JSON and correct:** on the home page the JSON-LD parses, and the `#firm` node has:
   - the name "Darren Drake Law PLLC";
   - telephone `+1-615-546-5551`;
   - postal code `37129`;
   - locality "Murfreesboro";
   - Monday–Friday 08:00–17:00;
   - areaServed including Murfreesboro, Smyrna and Rutherford County;
   - `knowsAbout` equal to the five practice titles.
3. **Matches the visible page:**
   - the structured street, city and postal code together equal the address shown on the Contact page;
   - the structured phone digits equal `PHONE_DISPLAY`'s digits;
   - the hours match the Contact page.
4. **No unconfirmed fields:** the JSON-LD contains none of these keys anywhere: `aggregateRating`, `review`, `priceRange`, `sameAs`, `geo`, `foundingDate`, `award`.
5. **Darren node:** `#darren` has the name "Darren Drake", the job title "Attorney at Law", `worksFor` pointing at `#firm`, and both schools and both memberships.
6. **Breadcrumbs:**
   - `/practice-areas/dui-dwi/` has a `BreadcrumbList` of Home → Practice Areas → DUI/DWI, positions 1–3, with full addresses;
   - its names equal the visible breadcrumb text;
   - the home page has no `BreadcrumbList`.
7. **Home title and description:** the title is 60 characters or fewer and the description is 160 or fewer. Every other page's title is also 60 or fewer.
8. **Sitemap:** 12 `<url>` entries, each with a `<loc>` equal to a canonical from test 1 and a valid ISO `<lastmod>` date.
9. **Still hidden in preview:** in this (non-production) build, every page has `noindex`, and `/robots.txt` contains `Disallow: /`.
10. **Script safety:** the JSON-LD tag's text contains no raw `</script` or `<` characters; they're escaped.

### 6.2 Commands (all must pass)
Run from `site/`.

1. `npx tsc --noEmit`: no errors.
2. `npm run lint`: no errors.
3. `npm run build`: succeeds.
4. `node scripts/check-placeholders.mjs`: the count is unchanged from step 1.
5. **Main test suite:**
   - Start both servers from that build:
     - `npx next start -p 3000`;
     - `INTAKE_DESTINATION=local-test npx next start -p 3001`.
   - Run `node tests/e2e.mjs`: every existing check passes, plus all the new ones.
6. `node tests/delivery.mjs`: 4/4.

### 6.3 Production-mode check (test-only build, never deployed)
The normal production build refuses to run while placeholders remain, which is correct. To check what Google will see at launch:

1. Run `SITE_ENV=production npx next build`, calling `next build` directly so the placeholder guard in `npm run build` is skipped. **Only for this check.**
2. Start it on port 3005 and confirm:
   - pages have **no** `noindex`;
   - `/robots.txt` has `Allow: /`, `Disallow: /api/` and `Sitemap: https://ddrakelaw.com/sitemap.xml`;
   - canonicals and JSON-LD are identical to the preview build's.
3. Stop that server, then **rebuild normally** (`npm run build`), so the working build is the standard preview build again.
4. Confirm with `grep -r "noindex" .next/server/app/index.html` (or by fetching `/`) that `noindex` is back.

Record the results in `printouts/seo-report.md`.

### 6.4 Structured-data validation
Google's Rich Results Test needs a public address, so it runs on launch day (section 8). Before that:
- validate the JSON-LD against schema.org types by checking every `@type` used against a small allow-list in the test (`LegalService`, `LocalBusiness`, `Person`, `WebSite`, `BreadcrumbList`, `ListItem`, `PostalAddress`, `OpeningHoursSpecification`, `City`, `AdministrativeArea`, `Organization`, `EducationalOrganization`);
- confirm every `@id` reference points at a node that exists.

## 7. Finished when

- [ ] All 12 pages have a correct canonical, including when the address has extra query text.
- [ ] Every page carries the business structured data (firm, Darren, website). Every value comes from `lib/site.ts`, matches the visible page, and has no unconfirmed fields.
- [ ] Every page except home has breadcrumb structured data that matches its visible breadcrumbs.
- [ ] The home title is 60 characters or fewer and the description 160 or fewer, using only confirmed facts.
- [ ] The sitemap has 12 entries with `lastmod` dates.
- [ ] The preview build is still hidden from search engines, and the test-only production build shows the right robots file and no `noindex` (6.3). The normal preview build has been restored afterwards.
- [ ] Every check in 6.1, 6.2 and 6.4 passes, with the placeholder count unchanged.
- [ ] `printouts/seo-report.md`, `HANDOFF.md` and the launch-day search block in `go-live-setup.md` are written.
- [ ] The commit is pushed to `claude/sleepy-clarke-wjlh48`.
- [ ] The final message to Quinn gives:
  - what changed;
  - the test counts;
  - the new home title and description;
  - the list of launch-day search tasks.

## 8. Launch day (recorded here, not part of "finished")

These need the live site or Darren's Google accounts. Add them to the launch checklist in step 12.

1. **Google Search Console:** verify ddrakelaw.com (a DNS record in Cloudflare), submit `https://ddrakelaw.com/sitemap.xml`, and use URL Inspection → **Request indexing** on the home page and the five practice pages.
2. **Rich Results Test** (search.google.com/test/rich-results): run the home page and one practice page, and confirm "LocalBusiness" or "LegalService" and "Breadcrumbs" are detected with no errors.
3. **Google Business Profile:** make sure the name, address, phone and hours match the site exactly: Darren Drake Law PLLC, 138 S. Cannon Ave, Murfreesboro, TN 37129, (615) 546-5551, Mon–Fri 8am–5pm. Set the website field to `https://ddrakelaw.com/`.
4. **Old addresses:** in Search Console, watch **Pages → Not found (404)** for 2–4 weeks. Any old WordPress address that shows up gets a redirect added to `next.config.ts`.
5. **Bing Webmaster Tools:** import the site from Search Console with one click.

## 9. If something goes wrong

- **A check fails and can't be fixed in a reasonable time:** leave the code as it was before this plan (`git checkout -- site/`). Report the failing check by name, and don't push.
- **The test-only production build can't be restored to the normal preview build:** delete `.next` and run `npm run build`. Never leave a production-mode build as the working build.
- **Git dates aren't available at build time (step 7):** use the build date for every `lastmod`, note it in `HANDOFF.md`, and carry on.
