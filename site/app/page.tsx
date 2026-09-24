import Link from "next/link";
import { Container } from "@/components/Container";
import { Portrait } from "@/components/Portrait";
import { ContactSteps, Faq, IntakeBand, PracticeCards } from "@/components/Sections";
import { CTA_LABEL, HOME_FAQ, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";

export default function Home() {
  return (
    <>
      {/* Hero: 7/5 split. On phones the headline and CTA come before the portrait. */}
      <section aria-labelledby="hero-title" className="overflow-hidden pb-14 pt-10 lg:pb-10 lg:pt-12">
        <Container className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <div className="hero-rise">
              <p className="eyebrow">First-Time Offenders · DUI/DWI · Domestic Assault — Murfreesboro &amp; Middle Tennessee</p>
              <h1 id="hero-title" className="h1 mt-4 max-w-[12ch]">
                Your next step starts with a conversation.
              </h1>
            </div>
            <p className="hero-rise hero-rise-2 measure mt-6 text-[18px] text-muted lg:text-[20px]">
              Tell Darren Drake about your legal matter and how to reach you.
            </p>
            <div className="hero-rise hero-rise-3 mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
              <Link href="/intake/" data-hero-cta className="btn-primary px-8 text-[17px]">
                {CTA_LABEL}
              </Link>
              <a href={PHONE_HREF} className="link-secondary inline-flex min-h-11 items-center text-[17px]">
                Or call {PHONE_DISPLAY}
              </a>
            </div>
          </div>
          <div className="lg:col-span-5">
            <Portrait
              priority
              glow
              sizes="(min-width: 1024px) 392px, 256px"
              className="mx-auto w-[256px] lg:w-full lg:max-w-[392px]"
            />
          </div>
        </Container>
      </section>

      <section aria-labelledby="practice-title" className="pb-14 pt-6 lg:pb-24 lg:pt-6">
        <Container>
          <p className="eyebrow uppercase tracking-[0.08em]">Practice areas</p>
          <h2 id="practice-title" className="h2 mt-2">
            How Darren can help
          </h2>
          <div className="mt-10">
            <PracticeCards featuredOnly />
          </div>
        </Container>
      </section>

      <section aria-labelledby="meet-title" className="py-14 lg:py-24">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <p className="eyebrow uppercase tracking-[0.08em]">About</p>
            <h2 id="meet-title" className="h2 mt-2">
              Meet Darren Drake
            </h2>
            <div className="measure mt-6 flex flex-col gap-4 text-muted">
              <p>
                [CONFIRM WITH FIRM] Darren Drake is an attorney serving Murfreesboro and Middle Tennessee, with a practice
                focused on criminal defense (including first-time offenses and domestic assault), DUI/DWI and expungement.
              </p>
              <p>
                [CONFIRM WITH FIRM] Before practicing law, Darren served in the U.S. Navy. He stays involved in the local
                community.
              </p>
            </div>
            <Link href="/about/" className="link-action mt-6 inline-flex min-h-11 items-center font-semibold">
              About Darren →
            </Link>
          </div>
          <div className="lg:col-span-5">
            <div
              role="img"
              aria-label="Placeholder for a licensed local architectural photograph, to be supplied"
              className="flex aspect-[4/3] items-center justify-center rounded-card border border-dashed border-border bg-surface p-6 text-center text-[15px] font-semibold uppercase tracking-[0.08em] text-muted"
            >
              Local architecture photo
              <br />
              [TO BE SUPPLIED — licensed image]
            </div>
          </div>
        </Container>
      </section>

      <ContactSteps />
      <Faq items={HOME_FAQ} />
      <IntakeBand />
    </>
  );
}
