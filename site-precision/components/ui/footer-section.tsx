"use client"

import * as React from "react"
import Link from "next/link"
import { FileText, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { CTA_LABEL, NAV, PHONE_DISPLAY, PHONE_HREF, PRACTICES } from "@/lib/site"

// Adapted from the 21st.dev "footer-section" component. Demo content (newsletter
// signup, placeholder address, social links, dark-mode switch) is replaced with
// confirmed firm details; unconfirmed items stay as visible [placeholders].
function FooterSection({ className }: { className?: string }) {
  const year = new Date().getFullYear()
  const linkClass =
    "inline-flex min-h-11 items-center text-[16px] transition-colors hover:text-primary"

  return (
    <footer className={cn("relative border-t border-border/50 bg-background text-foreground", className)}>
      <div className="mx-auto w-full max-w-site px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight">Start with a short inquiry.</h2>
            <p className="mb-6 text-muted-foreground">
              Tell Darren Drake about your legal matter and how to reach you.
            </p>
            <Button asChild className="h-[52px] px-6 text-base font-semibold">
              <Link href="/intake">{CTA_LABEL}</Link>
            </Button>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick links</h3>
            <nav aria-label="Footer" className="flex flex-col">
              {[...NAV, { href: "/intake", label: "Intake" }].map((item) => (
                <Link key={item.href} href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Practice areas</h3>
            <nav aria-label="Practice areas" className="flex flex-col">
              {PRACTICES.map((p) => (
                <Link key={p.slug} href={`/practice-areas/${p.slug}`} className={linkClass}>
                  {p.title}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact</h3>
            <address className="space-y-2 not-italic">
              <p>
                <a href={PHONE_HREF} className="inline-flex min-h-11 items-center font-semibold transition-colors hover:text-primary">
                  {PHONE_DISPLAY}
                </a>
              </p>
              <p className="text-muted-foreground">[Office address — to confirm]</p>
              <p className="text-muted-foreground">[Email — to confirm]</p>
            </address>
            <TooltipProvider>
              <div className="mt-6 flex gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild variant="outline" size="icon" className="h-11 w-11 rounded-full">
                      <a href={PHONE_HREF}>
                        <Phone className="h-5 w-5" aria-hidden="true" />
                        <span className="sr-only">Call {PHONE_DISPLAY}</span>
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Call the office</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild variant="outline" size="icon" className="h-11 w-11 rounded-full">
                      <Link href="/intake">
                        <FileText className="h-5 w-5" aria-hidden="true" />
                        <span className="sr-only">{CTA_LABEL}</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Send a brief inquiry</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border/50 pt-8 md:flex-row md:items-center">
          <div className="space-y-1 text-[15px] text-muted-foreground">
            <p>© {year} Darren Drake [confirm legal entity name]</p>
            <p>This website is for general information and is not legal advice.</p>
          </div>
          <nav aria-label="Legal" className="flex gap-4">
            <Link href="/privacy" className={linkClass}>
              Privacy notice
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

// Kept for compatibility with the original component's export name.
const Footerdemo = FooterSection

export { FooterSection, Footerdemo }
