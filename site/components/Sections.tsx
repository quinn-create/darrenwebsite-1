import Link from "next/link";
import { ArrowRight, ClipboardCheck, MessagesSquare, PhoneCall, Send } from "lucide-react";
import { CTA_HREF, CTA_LABEL, FAQ_JUMP_MIN, FAQ_TOPICS, PRACTICES, STEPS, type FaqItem } from "@/lib/site";
import { FaqJumpLinks } from "./FaqJumpLinks";
import { PhoneLink } from "./PhoneLink";
import { Container } from "./Container";
import { PracticeIcon } from "./PracticeIcon";

export function PracticeCards({
  headingLevel = "h3",
  featuredOnly = false,
}: {
  headingLevel?: "h2" | "h3";
  featuredOnly?: boolean;
}) {
  const Heading = headingLevel;
  const practices = featuredOnly ? PRACTICES.filter((p) => p.featured) : PRACTICES;
  return (
    <ul className="grid gap-6 md:grid-cols-3">
      {practices.map((p) => (
        <li key={p.slug} className="card flex flex-col gap-4 p-6 lg:p-8">
          <PracticeIcon name={p.icon} />
          <Heading className="h3">{p.title}</Heading>
          <p className="text-muted">{p.summary}</p>
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

const STEP_ICONS = { send: Send, review: ClipboardCheck, reply: PhoneCall, next: MessagesSquare } as const;

// "What happens next": a connected timeline. Down the page on phones, across it on desktop.
export function ContactSteps({ id = "how-contact-works" }: { id?: string }) {
  return (
    <section aria-labelledby={id} className="py-14 lg:py-24">
      <Container>
        <p className="eyebrow uppercase">How it works</p>
        <h2 id={id} className="h2 mt-2">
          What happens next
        </h2>
        <ol className="relative mt-10 grid gap-0 lg:mt-14 lg:grid-cols-4 lg:gap-8">
          {STEPS.map((step, i) => {
            const Icon = STEP_ICONS[step.icon];
            const last = i === STEPS.length - 1;
            return (
              <li key={step.title} className="relative flex gap-5 pb-10 last:pb-0 lg:flex-col lg:gap-6 lg:pb-0">
                {/* Connector: vertical between steps on phones, horizontal on desktop. */}
                {!last && (
                  <>
                    <span
                      aria-hidden="true"
                      className="absolute left-7 top-14 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-action/70 to-border/40 lg:hidden"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute left-14 right-[-2rem] top-7 hidden h-px bg-gradient-to-r from-action/70 to-border/40 lg:block"
                    />
                  </>
                )}
                <span className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full border border-action/60 bg-surface text-action shadow-[0_0_0_6px_var(--color-bg)]">
                  <Icon aria-hidden="true" size={24} strokeWidth={1.75} />
                </span>
                <div className="pt-1 lg:pt-0">
                  <p className="text-[14px] font-bold uppercase tracking-[0.1em] text-muted">
                    Step {i + 1}
                  </p>
                  <h3 className="mt-1 text-[20px] font-bold leading-snug lg:text-[22px]">{step.title}</h3>
                  <p className="mt-2 text-[16px] text-muted lg:text-[17px]">{step.detail}</p>
                </div>
              </li>
            );
          })}
        </ol>
        <p className="measure mt-10 text-[16px] text-muted">
          Sending a message does not by itself create an attorney-client relationship.
        </p>
      </Container>
    </section>
  );
}

function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="faq overflow-hidden rounded-card border border-border bg-surface">
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
  );
}

// With enough questions (FAQ_JUMP_MIN, over 2+ topics) the list is grouped by topic and gets
// "Jump to" buttons; otherwise it renders exactly as a single list.
export function Faq({ items, id = "faq" }: { items: FaqItem[]; id?: string }) {
  const topics = FAQ_TOPICS.filter((t) => items.some((item) => item.topic === t.id));
  const grouped = items.length >= FAQ_JUMP_MIN && topics.length >= 2;
  const groupId = (topic: string) => `faq-${id}-${topic}`;
  return (
    <section aria-labelledby={id} className="py-14 lg:py-24">
      <Container>
        <h2 id={id} className="h2">
          Frequently asked questions
        </h2>
        {grouped ? (
          <>
            <FaqJumpLinks groups={topics.map((t) => ({ id: groupId(t.id), label: t.label }))} />
            <div className="mt-10 flex flex-col gap-10">
              {topics.map((t) => (
                <div key={t.id} id={groupId(t.id)} className="faq-group">
                  <h3 className="mb-4 text-[14px] font-bold uppercase tracking-[0.1em] text-muted">{t.label}</h3>
                  <FaqList items={items.filter((item) => item.topic === t.id)} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="mt-8">
            <FaqList items={items} />
          </div>
        )}
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
          <p className="mt-3 text-muted">Send a short message, or call the office.</p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <Link href={CTA_HREF} className="btn-primary">
            {CTA_LABEL}
          </Link>
          <PhoneLink />
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
