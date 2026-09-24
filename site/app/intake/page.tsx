import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Breadcrumbs } from "@/components/Sections";
import { ContactForm } from "@/components/ui/form-1";
import { isConfigured } from "@/lib/intake-delivery";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Start your intake",
  description: "Send Darren Drake a short message about your legal matter and choose how and when to hear back.",
};

// Every "Start your intake" button leads here. The page is the site's one form (option B):
// the form's own heading is the page heading.
export default function IntakePage() {
  return (
    <section className="pb-14 pt-10 lg:pb-24 lg:pt-16">
      <Container>
        <div className="mx-auto max-w-[680px]">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Intake" }]} />
          <div className="mt-6 rounded-card border border-border bg-surface px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
            <ContactForm configured={isConfigured()} headingLevel="h1" />
          </div>
        </div>
      </Container>
    </section>
  );
}
