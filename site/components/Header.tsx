import Link from "next/link";
import { Phone } from "lucide-react";
import { CTA_LABEL, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";
import { NavTabs } from "./NavTabs";
import { Wordmark } from "./Wordmark";

// Navigation is a tab bar (components/NavTabs.tsx) at every size: in the header row on
// desktop, and as a full-width row under the logo on phones, so no menu has to be opened.
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-bg">
      <a
        href="#main"
        className="sr-only-focusable absolute left-4 top-3 z-50 rounded-md bg-action px-4 py-2 font-semibold text-on-action"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 w-full max-w-site items-center justify-between gap-6 px-5 sm:px-6 lg:h-24 lg:px-8">
        <Link href="/" className="rounded-sm py-2" aria-label="Darren Drake, Attorney at Law — home">
          <span className="hidden lg:inline-flex">
            <Wordmark />
          </span>
          <span className="lg:hidden">
            <Wordmark size="sm" />
          </span>
        </Link>

        <NavTabs className="hidden lg:block" />

        <div className="hidden items-center gap-6 lg:flex">
          <a href={PHONE_HREF} className="inline-flex min-h-11 items-center text-[16px] font-semibold text-muted hover:text-text">
            {PHONE_DISPLAY}
          </a>
          <Link href="/intake/" className="btn-primary btn-compact">
            {CTA_LABEL}
          </Link>
        </div>

        <a
          href={PHONE_HREF}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border/60 px-4 text-[15px] font-semibold text-text lg:hidden"
          aria-label={`Call ${PHONE_DISPLAY}`}
        >
          <Phone aria-hidden="true" size={18} strokeWidth={1.75} />
          Call
        </a>
      </div>
      <div className="mx-auto w-full max-w-site px-5 pb-3 sm:px-6 lg:hidden">
        <NavTabs compact />
      </div>
    </header>
  );
}
