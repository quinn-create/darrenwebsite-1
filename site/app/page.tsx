import type { Metadata } from "next";
import Link from "next/link";
import { Anchor, MapPin, Scale } from "lucide-react";
import { Container } from "@/components/Container";
import { Portrait } from "@/components/Portrait";
import { PhoneLink } from "@/components/PhoneLink";
import { PracticeCarousel } from "@/components/PracticeCarousel";
import { ContactSteps, Faq, IntakeBand, PracticeCards } from "@/components/Sections";
import { CTA_HREF, CTA_LABEL, HOME_FAQ, OPEN_GRAPH_BASE } from "@/lib/site";

// The home page's own address for link previews (og:url); everything else comes from the layout.
export const metadata: Metadata = {
  openGraph: { ...OPEN_GRAPH_BASE, url: "/" },
};

// Confirmed facts only (plans/for-darren/answers-2026-09-24.md), shown as a quiet strip under the hero.
const CREDENTIALS = [
  { icon: Anchor, text: "U.S. Navy veteran" },
  { icon: Scale, text: "Board member, Rutherford County DUI Court" },
  { icon: MapPin, text: "Office in Murfreesboro" },
];

export default function Home() {
  return (
    <>
      {/* Hero: 7/5 split. On phones the headline and CTA come before the portrait. */}
      <section aria-labelledby="hero-title" className="overflow-hidden pb-14 pt-10 lg:pb-10 lg:pt-12">
        <Container className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <div className="hero-rise">
              <p className="chip">
                <span aria-hidden="true" className="size-2 rounded-full bg-action" />
                Criminal defense · Murfreesboro, TN
              </p>
              <h1 id="hero-title" className="h1 mt-5 max-w-[12ch]">
                Your next step starts with a conversation.
              </h1>
            </div>
            <p className="hero-rise hero-rise-2 measure mt-6 text-[18px] text-muted lg:text-[20px]">
              Tell Darren Drake about your legal matter and how to reach you.
            </p>
            <div className="hero-rise hero-rise-3 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link href={CTA_HREF} data-hero-cta className="btn-primary px-8 text-[17px]">
                {CTA_LABEL}
              </Link>
              <PhoneLink className="text-[17px]" />
            </div>
            <ul className="mt-10 flex flex-col gap-3 border-t border-border/40 pt-6 text-[16px] text-muted sm:flex-row sm:flex-wrap sm:gap-x-8">
              {CREDENTIALS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2.5 leading-snug">
                  <Icon aria-hidden="true" size={18} strokeWidth={1.75} className="shrink-0 text-action" />
                  {text}
                </li>
              ))}
            </ul>
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
          <div data-reveal="">
            <p className="eyebrow uppercase">Practice areas</p>
            <h2 id="practice-title" className="h2 mt-2">
              How Darren can help
            </h2>
          </div>
          <div className="mt-10">
            <PracticeCards featuredOnly />
          </div>
          <PracticeCarousel />
        </Container>
      </section>

      <section aria-labelledby="meet-title" className="py-14 lg:py-24">
        <Container reveal className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <p className="eyebrow uppercase">About</p>
            <h2 id="meet-title" className="h2 mt-2">
              Meet Darren Drake
            </h2>
            <div className="measure mt-6 flex flex-col gap-4 text-muted">
              <p>
                Darren Drake is an attorney in Murfreesboro serving Rutherford County, including Smyrna. His practice
                focuses on criminal defense (including first-time offenses and domestic assault), DUI/DWI and expungement.
              </p>
              <p>
                Before law school, Darren served six years in the U.S. Navy. He is a former Assistant Chief of the
                Lascassas Volunteer Fire Department and serves on the board of the Rutherford County DUI Court.
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
