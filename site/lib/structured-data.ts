// Search-engine structured data (JSON-LD), built only from lib/site.ts so it always matches
// the visible pages. Confirmed facts only: no ratings, reviews, prices, social links, map
// coordinates, founding date or awards. plans/seo-fixes-plan.md, section 4.2.
import { SITE_URL } from "./env";
import { PORTRAIT_4X5 } from "./portrait";
import { FIRM, PHONE_HREF, PRACTICES } from "./site";

const FIRM_ID = `${SITE_URL}/#firm`;
const DARREN_ID = `${SITE_URL}/#darren`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const PORTRAIT = `${SITE_URL}${PORTRAIT_4X5.src}`;

// tel:+16155465551 → +1-615-546-5551
function schemaPhone(href: string) {
  const d = href.replace(/\D/g, "");
  return `+${d.slice(0, 1)}-${d.slice(1, 4)}-${d.slice(4, 7)}-${d.slice(7)}`;
}

const TN = { "@type": "AdministrativeArea", name: "Tennessee" };

export function businessGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LegalService", "LocalBusiness"],
        "@id": FIRM_ID,
        name: FIRM.legalName,
        url: `${SITE_URL}/`,
        telephone: schemaPhone(PHONE_HREF),
        address: {
          "@type": "PostalAddress",
          streetAddress: FIRM.street,
          addressLocality: FIRM.city,
          addressRegion: FIRM.region,
          postalCode: FIRM.postalCode,
          addressCountry: "US",
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "08:00",
            closes: "17:00",
          },
        ],
        areaServed: [
          { "@type": "City", name: "Murfreesboro", containedInPlace: TN },
          { "@type": "City", name: "Smyrna", containedInPlace: TN },
          { "@type": "AdministrativeArea", name: "Rutherford County", containedInPlace: TN },
        ],
        image: PORTRAIT,
        knowsAbout: PRACTICES.map((p) => p.title),
        employee: { "@id": DARREN_ID },
      },
      {
        "@type": "Person",
        "@id": DARREN_ID,
        name: FIRM.name,
        jobTitle: FIRM.descriptor,
        worksFor: { "@id": FIRM_ID },
        alumniOf: [
          { "@type": "EducationalOrganization", name: "Southern Illinois University School of Law" },
          { "@type": "EducationalOrganization", name: "Southern Illinois University Carbondale" },
        ],
        memberOf: [
          { "@type": "Organization", name: "Tennessee Association of Criminal Defense Lawyers" },
          { "@type": "Organization", name: "Rutherford & Cannon County Bar Association" },
        ],
        image: PORTRAIT,
        url: `${SITE_URL}/about/`,
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: FIRM.legalName,
        url: `${SITE_URL}/`,
        publisher: { "@id": FIRM_ID },
      },
    ],
  };
}

export type Crumb = { href: string; label: string };

export function breadcrumbList(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: `${SITE_URL}${c.href}`,
    })),
  };
}

// Safe inside <script>: "<" can't start "</script>" or "<!--".
export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
