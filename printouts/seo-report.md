# SEO report

Generated 25 September 2026 by running `plans/seo-fixes-plan.md`. The site is still hidden from search engines (preview mode); everything below is ready for when `SITE_ENV=production` is switched on at launch.

## Titles, descriptions and canonicals (all 12 pages)

| Page | Title (chars) | Description (chars) | Canonical |
|---|---|---|---|
| `/` | Darren Drake, Attorney at Law \| Murfreesboro, TN (48) | Criminal defense attorney in Murfreesboro, TN, serving Rutherford County and Smyrna. First-time offenses, DUI/DWI and domestic assault. Call (615) 546-5551. (156) | https://ddrakelaw.com/ |
| `/practice-areas/` | Practice Areas \| Darren Drake, Attorney at Law (46) | First-time offenses, DUI/DWI, domestic assault, criminal defense and expungement help from Darren Drake in Murfreesboro, Rutherford County and Smyrna. (150) | https://ddrakelaw.com/practice-areas/ |
| `/practice-areas/first-time-offenders/` | First-Time Offenders \| Darren Drake, Attorney at Law (52) | Help for people in Rutherford County facing a criminal charge for the first time. Contact Darren Drake or call (615) 546-5551. (126) | https://ddrakelaw.com/practice-areas/first-time-offenders/ |
| `/practice-areas/criminal-defense/` | Criminal Defense \| Darren Drake, Attorney at Law (48) | Help for people facing criminal charges in Rutherford County. Contact Darren Drake or call (615) 546-5551. (106) | https://ddrakelaw.com/practice-areas/criminal-defense/ |
| `/practice-areas/dui-dwi/` | DUI/DWI \| Darren Drake, Attorney at Law (39) | Help for people charged with driving under the influence in Rutherford County. Contact Darren Drake or call (615) 546-5551. (123) | https://ddrakelaw.com/practice-areas/dui-dwi/ |
| `/practice-areas/domestic-assault/` | Domestic Assault \| Darren Drake, Attorney at Law (48) | Help for people charged with domestic assault in Rutherford County. Contact Darren Drake or call (615) 546-5551. (112) | https://ddrakelaw.com/practice-areas/domestic-assault/ |
| `/practice-areas/expungement/` | Expungement \| Darren Drake, Attorney at Law (43) | Help finding out whether a record in Rutherford County may be eligible for expungement. Contact Darren Drake or call (615) 546-5551. (132) | https://ddrakelaw.com/practice-areas/expungement/ |
| `/about/` | About Darren \| Darren Drake, Attorney at Law (44) | About Darren Drake, attorney at law serving Murfreesboro, Rutherford County and Smyrna. (87) | https://ddrakelaw.com/about/ |
| `/contact/` | Contact \| Darren Drake, Attorney at Law (39) | Contact Darren Drake, attorney at law. Send a message online or call (615) 546-5551. (84) | https://ddrakelaw.com/contact/ |
| `/privacy/` | Privacy \| Darren Drake, Attorney at Law (39) | Privacy notice for the Darren Drake Law PLLC website. (53) | https://ddrakelaw.com/privacy/ |
| `/accessibility/` | Accessibility \| Darren Drake, Attorney at Law (45) | How the Darren Drake, Attorney at Law website approaches accessibility, and how to report a problem. (100) | https://ddrakelaw.com/accessibility/ |
| `/legal-notice/` | Legal Notice \| Darren Drake, Attorney at Law (44) | Legal notice for the Darren Drake, Attorney at Law website. (59) | https://ddrakelaw.com/legal-notice/ |

## Structured data (JSON-LD)

### Home page

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": [
        "LegalService",
        "LocalBusiness"
      ],
      "@id": "https://ddrakelaw.com/#firm",
      "name": "Darren Drake Law PLLC",
      "url": "https://ddrakelaw.com/",
      "telephone": "+1-615-546-5551",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "138 S. Cannon Ave",
        "addressLocality": "Murfreesboro",
        "addressRegion": "TN",
        "postalCode": "37129",
        "addressCountry": "US"
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday"
          ],
          "opens": "08:00",
          "closes": "17:00"
        }
      ],
      "areaServed": [
        {
          "@type": "City",
          "name": "Murfreesboro",
          "containedInPlace": {
            "@type": "AdministrativeArea",
            "name": "Tennessee"
          }
        },
        {
          "@type": "City",
          "name": "Smyrna",
          "containedInPlace": {
            "@type": "AdministrativeArea",
            "name": "Tennessee"
          }
        },
        {
          "@type": "AdministrativeArea",
          "name": "Rutherford County",
          "containedInPlace": {
            "@type": "AdministrativeArea",
            "name": "Tennessee"
          }
        }
      ],
      "image": "https://ddrakelaw.com/images/darren-drake-signal-4x5.jpg",
      "knowsAbout": [
        "First-Time Offenders",
        "Criminal Defense",
        "DUI/DWI",
        "Domestic Assault",
        "Expungement"
      ],
      "employee": {
        "@id": "https://ddrakelaw.com/#darren"
      }
    },
    {
      "@type": "Person",
      "@id": "https://ddrakelaw.com/#darren",
      "name": "Darren Drake",
      "jobTitle": "Attorney at Law",
      "worksFor": {
        "@id": "https://ddrakelaw.com/#firm"
      },
      "alumniOf": [
        {
          "@type": "EducationalOrganization",
          "name": "Southern Illinois University School of Law"
        },
        {
          "@type": "EducationalOrganization",
          "name": "Southern Illinois University Carbondale"
        }
      ],
      "memberOf": [
        {
          "@type": "Organization",
          "name": "Tennessee Association of Criminal Defense Lawyers"
        },
        {
          "@type": "Organization",
          "name": "Rutherford & Cannon County Bar Association"
        }
      ],
      "image": "https://ddrakelaw.com/images/darren-drake-signal-4x5.jpg",
      "url": "https://ddrakelaw.com/about/"
    },
    {
      "@type": "WebSite",
      "@id": "https://ddrakelaw.com/#website",
      "name": "Darren Drake Law PLLC",
      "url": "https://ddrakelaw.com/",
      "publisher": {
        "@id": "https://ddrakelaw.com/#firm"
      }
    }
  ]
}
```

### A practice page (`/practice-areas/dui-dwi/`)

The same business data as the home page, plus:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://ddrakelaw.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Practice Areas",
      "item": "https://ddrakelaw.com/practice-areas/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "DUI/DWI",
      "item": "https://ddrakelaw.com/practice-areas/dui-dwi/"
    }
  ]
}
```

## Robots file and sitemap

### Preview mode (now)

Every page sends `<meta name="robots" content="noindex, nofollow">`.

```
User-Agent: *
Disallow: /
```

### Production mode (test-only build on port 3005, never deployed)

Every page sends `<meta name="robots" content="index, follow">` (12/12, no `noindex`). Canonicals and JSON-LD were byte-for-byte identical to the preview build's on all 12 pages. Afterwards the normal preview build was restored (`npm run build`), and `noindex` and `Disallow: /` are back.

```
User-Agent: *
Allow: /
Disallow: /api/

Sitemap: https://ddrakelaw.com/sitemap.xml
```

### Sitemap (identical in both modes)

Dates are each page's last git commit date, read at build time.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
<loc>https://ddrakelaw.com/</loc>
<lastmod>2026-09-25T02:04:24.000Z</lastmod>
</url>
<url>
<loc>https://ddrakelaw.com/practice-areas/</loc>
<lastmod>2026-09-25T02:04:24.000Z</lastmod>
</url>
<url>
<loc>https://ddrakelaw.com/practice-areas/first-time-offenders/</loc>
<lastmod>2026-09-25T02:04:24.000Z</lastmod>
</url>
<url>
<loc>https://ddrakelaw.com/practice-areas/criminal-defense/</loc>
<lastmod>2026-09-25T02:04:24.000Z</lastmod>
</url>
<url>
<loc>https://ddrakelaw.com/practice-areas/dui-dwi/</loc>
<lastmod>2026-09-25T02:04:24.000Z</lastmod>
</url>
<url>
<loc>https://ddrakelaw.com/practice-areas/domestic-assault/</loc>
<lastmod>2026-09-25T02:04:24.000Z</lastmod>
</url>
<url>
<loc>https://ddrakelaw.com/practice-areas/expungement/</loc>
<lastmod>2026-09-25T02:04:24.000Z</lastmod>
</url>
<url>
<loc>https://ddrakelaw.com/about/</loc>
<lastmod>2026-09-25T02:04:24.000Z</lastmod>
</url>
<url>
<loc>https://ddrakelaw.com/contact/</loc>
<lastmod>2026-09-24T23:44:01.000Z</lastmod>
</url>
<url>
<loc>https://ddrakelaw.com/privacy/</loc>
<lastmod>2026-09-24T20:24:47.000Z</lastmod>
</url>
<url>
<loc>https://ddrakelaw.com/accessibility/</loc>
<lastmod>2026-09-24T20:24:47.000Z</lastmod>
</url>
<url>
<loc>https://ddrakelaw.com/legal-notice/</loc>
<lastmod>2026-09-24T20:09:49.000Z</lastmod>
</url>
</urlset>
```

## Checks

- `npx tsc --noEmit`, `npm run lint`, `npm run build`: pass.
- `node tests/e2e.mjs`: 62/62 (52 before, plus SEO 1–10).
- `node tests/delivery.mjs`: 4/4.
- `node scripts/check-placeholders.mjs`: 3, unchanged.
- Google's Rich Results Test needs the live site; it's on the launch-day list in `plans/for-darren/go-live-setup.md`.
