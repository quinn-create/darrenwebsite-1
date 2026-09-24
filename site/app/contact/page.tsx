import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageIntro } from "@/components/Sections";
import { ContactForm } from "@/components/ui/form-1";
import { isConfigured } from "@/lib/intake-delivery";
import { FIRM, PHONE_DISPLAY, PHONE_HREF, practiceBySlug } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Darren Drake, attorney at law. Send a message online or call (615) 546-5551.",
};

// ?topic=<practice slug> comes from the "Ask about …" phone bar on practice pages.
export default async function Contact({ searchParams }: { searchParams: Promise<{ topic?: string | string[] }> }) {
  const { topic } = await searchParams;
  const practice = practiceBySlug(typeof topic === "string" ? topic : undefined);
  return (
    <>
      <PageIntro
        title="Contact us"
        lead="Send a short message, or call the office."
        crumbs={[{ href: "/", label: "Home" }, { label: "Contact" }]}
      />
      <section aria-label="Contact details" className="pb-14 lg:pb-24">
        <Container className="grid items-start gap-6 lg:grid-cols-[3fr_2fr]">
          <div className="panel px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
            <h2 className="h3">Send a message</h2>
            <p className="mb-8 mt-2 text-muted">Choose how and when you&apos;d like to hear back.</p>
            <ContactForm
              configured={isConfigured()}
              showIntro={false}
              initialTopic={practice ? { slug: practice.slug, title: practice.title } : null}
            />
          </div>
          <div className="panel p-6 lg:p-10">
            <h2 className="h3">Call the office</h2>
            <a href={PHONE_HREF} className="mt-3 inline-flex min-h-11 items-center text-[28px] font-extrabold text-action lg:text-[34px]">
              <span className="phone-num">{PHONE_DISPLAY}</span>
            </a>
            <dl className="mt-6 grid gap-4 text-muted">
              <div>
                <dt className="label text-text">Office</dt>
                <dd>{FIRM.address}</dd>
              </div>
              <div>
                <dt className="label text-text">Hours</dt>
                <dd>{FIRM.hours}</dd>
              </div>
            </dl>
          </div>
        </Container>
      </section>
    </>
  );
}
