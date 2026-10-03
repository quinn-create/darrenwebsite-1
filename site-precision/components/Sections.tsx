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
            href={`/practice-areas/${p.slug}`}
            className="card-link link-action mt-auto inline-flex min-h-11 items-center gap-2 font-semibold"
          >
            Learn more<span className="sr-only"> about {p.title}</span>
            <ArrowRight aria-hidden="true" size={18} strokeWidth={1.75} />
          </Link>
        </li>
      ))}
    </ul>
  );
}

// Compact numbered row used under the hero CTA (concept B).
export function NextStepRow() {
  return (
    <ol aria-label="What happens next" className="grid gap-4 md:grid-cols-3 md:gap-0">
      {STEPS.map((step, i) => (
        <li
          key={step}
          className={`flex items-center gap-3 md:px-5 ${i === 0 ? "md:pl-0" : "md:border-l md:border-border/60"}`}
        >
          <span
            aria-hidden="true"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-[16px] font-semibold"
          >
            {i + 1}
          </span>
          <span className="text-[16px] leading-snug">
            <span className="sr-only">Step {i + 1}: </span>
            {step}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function ContactSteps({ id = "after-you-reach-out" }: { id?: string }) {
  return (
    <section aria-labelledby={id} className="py-12 lg:py-[88px]">
      <Container>
        <p className="eyebrow">NEXT STEPS</p>
        <h2 id={id} className="h2 mt-2">
          What happens after you reach out
        </h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step} className="rounded-card border border-border bg-surface p-6 lg:p-8">
              <span
                aria-hidden="true"
                className="inline-flex size-10 items-center justify-center rounded-full bg-decoration text-[16px] font-semibold"
              >
                {i + 1}
              </span>
              <span className="mt-4 block text-[20px] font-semibold leading-snug">
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
    <section aria-labelledby={id} className="py-12 lg:py-[88px]">
      <Container>
        <h2 id={id} className="h2">
          Frequently asked questions
        </h2>
        <p className="mt-2 text-[15px] text-muted">Answers are proposed and awaiting firm review. [FIRM TO REVIEW]</p>
        <div className="faq mt-8 overflow-hidden rounded-card border border-border bg-surface">
          {items.map((item, i) => (
            <details key={item.q} className={i > 0 ? "border-t border-border/60" : ""}>
              <summary className="flex min-h-16 items-center justify-between gap-6 px-6 py-4 text-[18px] font-semibold">
                <span>{item.q}</span>
                <span aria-hidden="true" className="chev text-[26px] font-normal leading-none text-action">
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

export function IntakeCta({ id = "intake-cta" }: { id?: string }) {
  return (
    <section aria-labelledby={id} className="py-12 lg:py-[88px]">
      <Container>
        <div className="flex flex-col gap-8 rounded-card border border-border bg-surface p-6 lg:flex-row lg:items-center lg:justify-between lg:p-12">
          <div>
            <h2 id={id} className="h2">
              Start with a short inquiry.
            </h2>
            <p className="mt-3 text-muted">Tell us the type of matter and how to contact you.</p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Link href="/intake" className="btn-primary">
              {CTA_LABEL}
            </Link>
            <a href={PHONE_HREF} className="link-action inline-flex min-h-11 items-center font-semibold">
              Or call {PHONE_DISPLAY}
            </a>
          </div>
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
              <Link href={item.href} className="link-action inline-flex min-h-11 items-center">
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
    <section className="pb-6 pt-8 lg:pb-10 lg:pt-14">
      <Container>
        {crumbs && <Breadcrumbs items={crumbs} />}
        <h1 className="h1 mt-4">{title}</h1>
        {lead && <p className="measure mt-5 text-[18px] text-muted lg:text-[20px]">{lead}</p>}
      </Container>
    </section>
  );
}
