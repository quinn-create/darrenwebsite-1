import Link from "next/link";
import { CookieLinks } from "@/components/consent/CookieLinks";
import { Wordmark } from "@/components/Wordmark";
import { CTA_HREF, CTA_LABEL, FIRM, NAV, PHONE_DISPLAY, PHONE_HREF, PRACTICES } from "@/lib/site";
import { TRACKING_ON } from "@/lib/tracking";

// Site footer, written for this site (Phase 2). It replaced an adapted 21st.dev component whose
// license couldn't be confirmed, so no third-party code remains here. Server component: no
// JavaScript. Four columns on desktop, then a legal row.
const LEGAL_LINKS = [
  { href: "/privacy/", label: "Privacy notice" },
  { href: "/accessibility/", label: "Accessibility" },
  { href: "/legal-notice/", label: "Legal notice" },
];
const LINK = "link-secondary inline-flex min-h-11 min-w-11 items-center text-[16px] hover:text-text";

export function Footer() {
  const year = new Date().getFullYear(); // worked out on the server when the page is built
  return (
    <footer className="border-t border-border/50 bg-bg text-text">
      <div className="mx-auto w-full max-w-site px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Wordmark />
            <p className="mb-6 mt-6 text-muted">Tell Darren Drake about your legal matter and how to reach you.</p>
            <Link href={CTA_HREF} className="btn-primary btn-compact">
              {CTA_LABEL}
            </Link>
          </div>

          <nav aria-labelledby="footer-quick-links">
            <h2 id="footer-quick-links" className="mb-3 text-[18px] font-semibold">
              Quick links
            </h2>
            <ul className="flex flex-col">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={LINK}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-practice-areas">
            <h2 id="footer-practice-areas" className="mb-3 text-[18px] font-semibold">
              Practice areas
            </h2>
            <ul className="flex flex-col">
              {PRACTICES.map((p) => (
                <li key={p.slug}>
                  <Link href={`/practice-areas/${p.slug}/`} className={LINK}>
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="mb-3 text-[18px] font-semibold">Contact</h2>
            <address className="flex flex-col gap-2 not-italic">
              <a href={PHONE_HREF} className="link-secondary inline-flex min-h-11 items-center text-[18px] font-semibold text-text">
                <span className="phone-num">{PHONE_DISPLAY}</span>
              </a>
              <p className="text-muted">{FIRM.address}</p>
              <p className="text-muted">{FIRM.hours}</p>
            </address>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border/50 pt-8 md:flex-row md:items-center">
          <div className="flex flex-col gap-1 text-[15px] text-muted">
            <p>
              © {year} {FIRM.legalName}
            </p>
            <p>This website is for general information and is not legal advice.</p>
          </div>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap gap-x-6">
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={LINK}>
                    {l.label}
                  </Link>
                </li>
              ))}
              {TRACKING_ON && (
                <li className="flex flex-wrap gap-x-6">
                  <CookieLinks className={`${LINK} cursor-pointer text-left`} />
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
