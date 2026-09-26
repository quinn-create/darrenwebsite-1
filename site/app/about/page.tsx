import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Portrait } from "@/components/Portrait";
import { AtAGlance } from "@/components/AtAGlance";
import { Breadcrumbs, IntakeBand } from "@/components/Sections";
import { DARREN } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Darren",
  description: "About Darren Drake, attorney at law serving Murfreesboro, Rutherford County and Smyrna.",
  alternates: { canonical: "/about/" },
};

export default function About() {
  return (
    <>
      <section className="overflow-hidden pb-14 pt-10 lg:pb-24 lg:pt-16">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7" data-reveal="">
            <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/about/", label: "About Darren" }]} />
            <h1 className="h1 mt-4">About Darren Drake</h1>
            <div className="measure mt-8 flex flex-col gap-5 text-muted">
              <p>
                Darren Drake is an attorney in Murfreesboro serving Rutherford County, including Smyrna. His practice
                focuses on criminal defense (including first-time offenses and domestic assault), DUI/DWI and expungement.
              </p>
              <h2 className="h3 mt-4 text-text">Navy service</h2>
              <p>{DARREN.navy.detail}</p>
              <h2 className="h3 mt-4 text-text">Community</h2>
              <ul className="flex list-disc flex-col gap-2 pl-5">
                {DARREN.community.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <h2 className="h3 mt-4 text-text">Education and admissions</h2>
              <ul className="flex list-disc flex-col gap-2 pl-5">
                {DARREN.education.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <h2 className="h3 mt-4 text-text">Memberships</h2>
              <ul className="flex list-disc flex-col gap-2 pl-5">
                {DARREN.memberships.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="lg:col-span-5">
            {/* Plan Section 5: up to 320 px tall on phones, about 420 px wide on desktop; still glow. */}
            <Portrait glow="still" sizes="(min-width: 1024px) 420px, 256px" className="mx-auto w-[256px] lg:w-full lg:max-w-[420px]" />
            <AtAGlance heading="h2" className="mx-auto mt-12 lg:max-w-[420px]" />
          </div>
        </Container>
      </section>
      <IntakeBand />
    </>
  );
}
