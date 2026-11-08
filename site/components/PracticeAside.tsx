import Link from "next/link";
import { PortraitAvatar } from "@/components/Portrait";
import { FIRM } from "@/lib/site";

// Practice-page side cards (plan Section 4 and Phase 2): "On this page" links and "Your attorney".

export function OnThisPage({ items, className = "" }: { items: { href: string; label: string }[]; className?: string }) {
  return (
    <nav aria-labelledby="on-this-page" className={`panel p-6 ${className}`}>
      <h2 id="on-this-page" className="text-[14px] font-bold uppercase tracking-[0.1em] text-muted">
        On this page
      </h2>
      <ul className="mt-3 flex flex-col">
        {items.map((item) => (
          <li key={item.href}>
            <a href={item.href} className="link-action inline-flex min-h-11 items-center font-semibold">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// His name sits beside the photo, so the photo itself is skipped by screen readers (alt="").
export function AttorneyCard({ className = "" }: { className?: string }) {
  return (
    <section aria-labelledby="your-attorney" className={`panel p-6 ${className}`}>
      <h2 id="your-attorney" className="text-[14px] font-bold uppercase tracking-[0.1em] text-muted">
        Your attorney
      </h2>
      <div className="mt-4 flex items-center gap-4">
        <PortraitAvatar size={96} />
        <div>
          <p className="text-[20px] font-bold leading-tight text-text">{FIRM.name}</p>
          <p className="text-[16px] text-muted">{FIRM.descriptor}</p>
        </div>
      </div>
      <p className="mt-4 text-[16px] text-muted">Office in Murfreesboro, serving {FIRM.serviceArea.replace("Murfreesboro, ", "")}.</p>
      <Link href="/about/" className="link-action mt-2 inline-flex min-h-11 items-center font-semibold">
        About Darren →
      </Link>
    </section>
  );
}
