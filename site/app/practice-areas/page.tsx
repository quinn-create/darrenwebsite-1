import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { IntakeBand, PageIntro, PracticeCards } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Practice Areas",
  description: "First-time offenses, DUI/DWI, domestic assault, criminal defense and expungement help from Darren Drake in Murfreesboro and Middle Tennessee.",
};

export default function PracticeAreas() {
  return (
    <>
      <PageIntro
        title="Practice areas"
        lead="Darren Drake helps people in Murfreesboro and Middle Tennessee with the matters below. [CONFIRM WITH FIRM]"
        crumbs={[{ href: "/", label: "Home" }, { label: "Practice Areas" }]}
      />
      <section aria-label="Practice area list" className="pb-14 lg:pb-24">
        <Container>
          <PracticeCards headingLevel="h2" />
        </Container>
      </section>
      <IntakeBand />
    </>
  );
}
