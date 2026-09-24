import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Portrait } from "@/components/Portrait";
import { Breadcrumbs, IntakeBand } from "@/components/Sections";

export const metadata: Metadata = {
  title: "About Darren",
  description: "About Darren Drake, attorney at law in Murfreesboro and Middle Tennessee.",
};

export default function About() {
  return (
    <>
      <section className="pb-14 pt-10 lg:pb-24 lg:pt-16">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "About Darren" }]} />
            <h1 className="h1 mt-4">About Darren Drake</h1>
            <div className="measure mt-8 flex flex-col gap-5 text-muted">
              <p>
                [CONFIRM WITH FIRM] Darren Drake is an attorney in Murfreesboro, Tennessee. His practice focuses on
                criminal defense (including first-time offenses and domestic assault), DUI/DWI and expungement for people across Middle Tennessee.
              </p>
              <h2 className="h3 mt-4 text-text">Service</h2>
              <p>[CONFIRM WITH FIRM] Darren served in the U.S. Navy. Details of his service to be supplied by the firm.</p>
              <h2 className="h3 mt-4 text-text">Community</h2>
              <p>[CONFIRM WITH FIRM] Darren is involved in the local community. Specific organizations to be supplied by the firm.</p>
              <h2 className="h3 mt-4 text-text">Education and admissions</h2>
              <p>[FIRM TO SUPPLY] Education, bar admissions and any other credentials.</p>
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
