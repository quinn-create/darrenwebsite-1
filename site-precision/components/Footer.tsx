import Link from "next/link";
import { NAV, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";
import { Container } from "./Container";
import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-surface py-12 lg:py-16">
      <Container className="flex flex-col gap-10 lg:flex-row lg:justify-between">
        <div className="flex flex-col gap-4">
          <Wordmark />
          <a href={PHONE_HREF} className="link-action inline-flex min-h-11 items-center font-semibold">
            {PHONE_DISPLAY}
          </a>
          <p className="text-[15px] text-muted">[Office address — to confirm]</p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-1 sm:flex sm:gap-6">
            {[...NAV, { href: "/intake", label: "Intake" }, { href: "/privacy", label: "Privacy" }].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-action inline-flex min-h-11 items-center text-[16px]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
      <Container className="mt-10 flex flex-col gap-2 border-t border-border/50 pt-6 text-[15px] text-muted">
        <p>© {new Date().getFullYear()} Darren Drake [confirm legal entity name]</p>
        <p>This website is for general information and is not legal advice.</p>
      </Container>
    </footer>
  );
}
