import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Portrait } from "@/components/Portrait";
import { Breadcrumbs, IntakeBand } from "@/components/Sections";

export const metadata: Metadata = {
  title: "About Darren",
  description: "About Darren Drake, attorney at law serving Murfreesboro, Rutherford County and Smyrna.",
};

export default function About() {
  return (
    <>
      <section className="pb-14 pt-10 lg:pb-24 lg:pt-16">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7" data-reveal="">
            <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "About Darren" }]} />
            <h1 className="h1 mt-4">About Darren Drake</h1>
            <div className="measure mt-8 flex flex-col gap-5 text-muted">
              <p>
                Darren Drake is an attorney in Murfreesboro serving Rutherford County, including Smyrna. His practice
                focuses on criminal defense (including first-time offenses and domestic assault), DUI/DWI and expungement.
              </p>
              <h2 className="h3 mt-4 text-text">Navy service</h2>
              <p>
                Darren served in the U.S. Navy from 1996 to 2002 as an Electronics Technician. He served aboard the USS
                Kitty Hawk and the USS Constellation, and completed a tour on Diego Garcia.
              </p>
              <h2 className="h3 mt-4 text-text">Community</h2>
              <ul className="flex list-disc flex-col gap-2 pl-5">
                <li>Board member, Rutherford County DUI Court</li>
                <li>Former Assistant Chief, Lascassas Volunteer Fire Department</li>
                <li>Helped found the Veterans Legal Assistance Program at Southern Illinois University School of Law</li>
              </ul>
              <h2 className="h3 mt-4 text-text">Education and admissions</h2>
              <ul className="flex list-disc flex-col gap-2 pl-5">
                <li>Law degree, Southern Illinois University School of Law</li>
                <li>B.S. in Electronics Systems, Southern Illinois University Carbondale (2005)</li>
                <li>Admitted in Tennessee and the U.S. District Court for the Middle District of Tennessee</li>
              </ul>
              <h2 className="h3 mt-4 text-text">Memberships</h2>
              <ul className="flex list-disc flex-col gap-2 pl-5">
                <li>Tennessee Association of Criminal Defense Lawyers</li>
                <li>Rutherford &amp; Cannon County Bar Association</li>
              </ul>
            </div>
          </div>
          <div className="lg:col-span-5">
            <Portrait sizes="(min-width: 1024px) 440px, 90vw" className="mx-auto w-full max-w-[440px]" />
          </div>
        </Container>
      </section>
      <IntakeBand />
    </>
  );
}
