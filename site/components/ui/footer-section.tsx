import Link from "next/link"

import { Wordmark } from "@/components/Wordmark"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CookieLinks } from "@/components/consent/CookieLinks"
import { TRACKING_ON } from "@/lib/tracking"
import { CTA_HREF, CTA_LABEL, FIRM, NAV, PHONE_DISPLAY, PHONE_HREF, PRACTICES } from "@/lib/site"

// Adapted from the 21st.dev "footer-section" component (license check pending, see
// plans/signal-website-plan.md). Demo content (newsletter, placeholder address, social
// links, dark-mode switch) is replaced with firm details. It is a server component: the
// tooltips were removed because they added ~31 KB of JavaScript to every page.
const LEGAL_LINKS = [
  { href: "/privacy/", label: "Privacy notice" },
  { href: "/accessibility/", label: "Accessibility" },
  { href: "/legal-notice/", label: "Legal notice" },
]

function FooterSection({ className }: { className?: string }) {
  const year = new Date().getFullYear() // rendered on the server at build time
  const linkClass =
    "inline-flex min-h-11 items-center text-[16px] transition-colors hover:text-primary"

  return (
    <footer className={cn("relative border-t border-border/50 bg-background text-foreground", className)}>
      <div className="mx-auto w-full max-w-site px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Wordmark />
            <p className="mb-6 mt-6 text-muted-foreground">
              Tell Darren Drake about your legal matter and how to reach you.
            </p>
            <Button asChild className="h-[52px] px-6 text-base font-semibold">
              <Link href={CTA_HREF}>{CTA_LABEL}</Link>
            </Button>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold">Quick links</h2>
            <nav aria-label="Footer" className="flex flex-col">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold">Practice areas</h2>
            <nav aria-label="Practice areas" className="flex flex-col">
              {PRACTICES.map((p) => (
                <Link key={p.slug} href={`/practice-areas/${p.slug}/`} className={linkClass}>
                  {p.title}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold">Contact</h2>
            <address className="space-y-2 not-italic">
              <p>
                <a href={PHONE_HREF} className="inline-flex min-h-11 items-center text-[18px] font-semibold transition-colors hover:text-primary">
                  <span className="phone-num">{PHONE_DISPLAY}</span>
                </a>
              </p>
              <p className="text-muted-foreground">{FIRM.address}</p>
              <p className="text-muted-foreground">{FIRM.hours}</p>
            </address>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border/50 pt-8 md:flex-row md:items-center">
          <div className="space-y-1 text-[15px] text-muted-foreground">
            <p>
              © {year} {FIRM.legalName}
            </p>
            <p>This website is for general information and is not legal advice.</p>
          </div>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6">
            {LEGAL_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={linkClass}>
                {l.label}
              </Link>
            ))}
            {TRACKING_ON && <CookieLinks className={cn(linkClass, "cursor-pointer text-left")} />}
          </nav>
        </div>
      </div>
    </footer>
  )
}

export { FooterSection }
