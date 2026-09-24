import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CTA_LABEL, PHONE_DISPLAY, PHONE_HREF, PRACTICES, STEPS } from "@/lib/site";
import { Container } from "./Container";
import { PracticeIcon } from "./PracticeIcon";

export function PracticeCards({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <ul className="grid gap-6 md:grid-cols-3">
      {PRACTICES.map((p) => (
        <li key={p.slug} className="card flex flex-col gap-4 p-6 lg:p-8">
          <PracticeIcon name={p.icon} />
          <Heading className="h3">{p.title}</Heading>
          <p className="text-muted">
            {p.summary} <span className="text-[15px]">[CONFIRM WITH FIRM]</span>
          </p>
          <Link
            href={`/practice-areas/${p.slug}/`}
            className="card-link link-secondary mt-auto inline-flex min-h-11 items-center gap-2 font-semibold"
          >
            Learn more<span className="sr-only"> about {p.title}</span>
            <ArrowRight aria-hidden="true" size={18} strokeWidth={1.5} />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ContactSteps({ id = "how-contact-works" }: { id?: string }) {
  return (
    <section aria-labelledby={id} className="py-14 lg:py-24">
      <Container>
        <p className="eyebrow uppercase tracking-[0.08em]">Next steps</p>
        <h2 id={id} className="h2 mt-2">
          How contact works
        </h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step} className="rounded-card border border-border bg-surface p-6 lg:p-8">
              <span aria-hidden="true" className="block text-[44px] font-extrabold leading-none text-action">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mt-4 block text-[20px] font-bold leading-snug lg:text-[22px]">
                <span className="sr-only">Step {i + 1}: </span>
                {step}
              </span>
            </li>
          ))}
        </ol>
        <p className="measure mt-6 text-muted">
          Sending an inquiry does not by itself create an attorney-client relationship.
        </p>
      </Container>
    </section>
  );
}

export function Faq({ items, id = "faq" }: { items: { q: string; a: string }[]; id?: string }) {
  return (
    <section aria-labelledby={id} className="py-14 lg:py-24">
      <Container>
        <h2 id={id} className="h2">
          Frequently asked questions
        </h2>
        <p className="mt-2 text-[15px] text-muted">Answers are proposed and awaiting firm review. [FIRM TO REVIEW]</p>
        <div className="faq mt-8 overflow-hidden rounded-card border border-border bg-surface">
          {items.map((item, i) => (
            <details key={item.q} className={i > 0 ? "border-t border-border/60" : ""}>
              <summary className="flex min-h-16 items-center justify-between gap-6 px-6 py-4 text-[18px] font-bold">
                <span>{item.q}</span>
                <span aria-hidden="true" className="chev text-[28px] font-normal leading-none text-action">
                  +
                </span>
              </summary>
              <p className="measure px-6 pb-6 text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function IntakeBand({ id = "intake-band" }: { id?: string }) {
  return (
    <section aria-labelledby={id} className="border-y border-border/40 bg-surface py-14 lg:py-24">
      <Container className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 id={id} className="h2">
            Ready when you are.
          </h2>
          <p className="mt-3 text-muted">Start with a short inquiry. It takes a few minutes.</p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <Link href="/intake/" className="btn-primary">
            {CTA_LABEL}
          </Link>
          <a href={PHONE_HREF} className="link-secondary inline-flex min-h-11 items-center">
            Or call {PHONE_DISPLAY}
          </a>
        </div>
      </Container>
    </section>
  );
}

export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[15px] text-muted">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {item.href ? (
              <Link href={item.href} className="link-secondary inline-flex min-h-11 items-center">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-text">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageIntro({
  title,
  lead,
  crumbs,
}: {
  title: string;
  lead?: string;
  crumbs?: { href?: string; label: string }[];
}) {
  return (
    <section className="pb-6 pt-10 lg:pb-10 lg:pt-16">
      <Container>
        {crumbs && <Breadcrumbs items={crumbs} />}
        <h1 className="h1 mt-4">{title}</h1>
        {lead && <p className="measure mt-5 text-[18px] text-muted lg:text-[20px]">{lead}</p>}
      </Container>
    </section>
  );
}
