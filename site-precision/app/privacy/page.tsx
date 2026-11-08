import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageIntro } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy notice for the Darren Drake, Attorney at Law website.",
};

export default function Privacy() {
  return (
    <>
      <PageIntro
        title="Privacy notice"
        lead="[FIRM TO SUPPLY — REQUIRED BEFORE LAUNCH] This placeholder outlines the sections the final notice needs."
        crumbs={[{ href: "/", label: "Home" }, { label: "Privacy" }]}
      />
      <section className="pb-12 lg:pb-[88px]">
        <Container>
          <div className="measure flex flex-col gap-4 text-muted">
            <h2 className="h3 mt-4 text-text">What we collect</h2>
            <p>[FIRM TO SUPPLY] The intake form collects your name, matter type, preferred contact method and contact details, and optionally county or court, next court date and a brief message.</p>
            <h2 className="h3 mt-4 text-text">How it is used</h2>
            <p>[FIRM TO SUPPLY]</p>
            <h2 className="h3 mt-4 text-text">Analytics</h2>
            <p>[FIRM TO SUPPLY] The site records only whether the intake form was started, submitted or failed. It does not record names, contact details, messages or matter details.</p>
            <h2 className="h3 mt-4 text-text">Contacting the firm</h2>
            <p>[FIRM TO SUPPLY]</p>
          </div>
        </Container>
      </section>
    </>
  );
}
