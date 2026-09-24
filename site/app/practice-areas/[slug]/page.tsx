import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { PracticeIcon } from "@/components/PracticeIcon";
import { ContactSteps, Faq, IntakeBand, PageIntro } from "@/components/Sections";
import { PRACTICES } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return PRACTICES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const practice = PRACTICES.find((p) => p.slug === slug);
  if (!practice) return {};
  return {
    title: practice.title,
    description: `${practice.summary} Start your intake with Darren Drake or call (615) 546-5551.`,
  };
}

export default async function PracticePage({ params }: Props) {
  const { slug } = await params;
  const practice = PRACTICES.find((p) => p.slug === slug);
  if (!practice) notFound();

  return (
    <>
      <PageIntro
        title={practice.title}
        lead={`${practice.summary} [CONFIRM WITH FIRM]`}
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/practice-areas", label: "Practice Areas" },
          { label: practice.title },
        ]}
      />
      <section aria-labelledby="overview-title" className="pb-6">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <h2 id="overview-title" className="h2">
              Overview
            </h2>
            <div className="measure mt-6 flex flex-col gap-4 text-muted">
              <p>[FIRM TO SUPPLY] A plain-language overview of how the firm helps with {practice.title.toLowerCase()} matters.</p>
              <p>[FIRM TO SUPPLY] What a person in this situation can expect when they reach out to the office.</p>
            </div>
          </div>
          <div className="hidden lg:col-span-4 lg:flex lg:justify-end">
            <div className="flex size-40 items-center justify-center rounded-card border border-border bg-surface">
              <PracticeIcon name={practice.icon} size={64} />
            </div>
          </div>
        </Container>
      </section>
      <ContactSteps />
      <Faq items={practice.faq} />
      <IntakeBand />
    </>
  );
}
