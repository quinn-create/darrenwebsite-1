import Link from "next/link";
import { Container } from "@/components/Container";
import { Portrait } from "@/components/Portrait";
import { ContactSteps, Faq, IntakeCta, NextStepRow, PracticeCards } from "@/components/Sections";
import { CTA_LABEL, HOME_FAQ, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";

export default function Home() {
  return (
    <>
      {/* Hero: 7/5 split (concept B). On phones the CTA comes before the portrait. */}
      <section aria-labelledby="hero-title" className="pb-12 pt-8 lg:pb-[88px] lg:pt-14">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7 lg:pr-6">
            <p className="eyebrow">Criminal Defense · DUI/DWI · Expungement — Murfreesboro &amp; Middle Tennessee</p>
            <h1 id="hero-title" className="h1 mt-4 max-w-[15ch]">
              A clear first step for your legal matter.
            </h1>
            <p className="measure mt-5 text-[18px] text-muted lg:text-[20px]">
              Tell us the type of matter and how to contact you.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
              <Link href="/intake" className="btn-primary w-full px-8 text-[17px] sm:w-auto">
                {CTA_LABEL}
              </Link>
              <a href={PHONE_HREF} className="link-action inline-flex min-h-11 items-center text-[17px] font-semibold">
                Or call {PHONE_DISPLAY}
              </a>
            </div>
            <div className="mt-10 border-t border-border/60 pt-6">
              <NextStepRow />
            </div>
          </div>
          <div className="lg:col-span-5">
            <Portrait priority sizes="(min-width: 1024px) 420px, 280px" className="mx-auto w-[280px] lg:ml-auto lg:mr-0 lg:w-full lg:max-w-[420px]" />
          </div>
        </Container>
      </section>

      <section aria-labelledby="practice-title" className="bg-decoration py-12 lg:py-[88px]">
        <Container>
          <p className="eyebrow">PRACTICE AREAS</p>
          <h2 id="practice-title" className="h2 mt-2">
            How Darren can help
          </h2>
          <div className="mt-10">
            <PracticeCards />
          </div>
        </Container>
      </section>

      <section aria-labelledby="meet-title" className="py-12 lg:py-[88px]">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-4">
            <Portrait caption={false} sizes="(min-width: 1024px) 280px, 200px" className="w-[200px] lg:w-full lg:max-w-[280px]" />
          </div>
          <div className="lg:col-span-8">
            <p className="eyebrow">ABOUT</p>
            <h2 id="meet-title" className="h2 mt-2">
              Meet Darren Drake
            </h2>
            <div className="measure mt-6 flex flex-col gap-4 text-muted">
              <p>
                [CONFIRM WITH FIRM] Darren Drake is an attorney serving Murfreesboro and Middle Tennessee, with a practice
                focused on criminal defense, DUI/DWI and expungement.
              </p>
              <p>
                [CONFIRM WITH FIRM] Before practicing law, Darren served in the U.S. Navy. He stays involved in the local
                community.
              </p>
            </div>
            <Link href="/about" className="link-action mt-6 inline-flex min-h-11 items-center font-semibold">
              About Darren →
            </Link>
          </div>
        </Container>
      </section>

      <div className="border-t border-border/40 bg-surface">
        <ContactSteps />
      </div>
      <Faq items={HOME_FAQ} />
      <IntakeCta />
    </>
  );
}
