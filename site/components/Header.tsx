import Link from "next/link";
import { Phone } from "lucide-react";
import { CTA_HREF, CTA_LABEL, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";
import { PhoneLink } from "./PhoneLink";
import { NavTabs } from "./NavTabs";
import { navTabClasses } from "./nav-tab-classes";
import { ThemeToggle } from "./ThemeToggle";
import { Wordmark } from "./Wordmark";

// Navigation is a tab bar (components/NavTabs.tsx) at every size: in the header row on
// desktop, and as a full-width row under the logo on phones, so no menu has to be opened.
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-bg/85 backdrop-blur-xl backdrop-saturate-150">
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

        <NavTabs className="hidden lg:block" classes={navTabClasses(false)} />

        <div className="hidden items-center gap-6 lg:flex">
          <PhoneLink variant="inline" className="text-[16px]" />
          <ThemeToggle />
          <Link href={CTA_HREF} className="btn-primary btn-compact">
            {CTA_LABEL}
          </Link>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle />
          <a
            href={PHONE_HREF}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border/60 px-4 text-[15px] font-semibold text-text"
            aria-label={`Call ${PHONE_DISPLAY}`}
          >
            <Phone aria-hidden="true" size={18} strokeWidth={1.75} />
            Call
          </a>
        </div>
      </div>
      <div className="mx-auto w-full max-w-site px-5 pb-3 sm:px-6 lg:hidden">
        <NavTabs compact classes={navTabClasses(true)} />
      </div>
    </header>
  );
}
