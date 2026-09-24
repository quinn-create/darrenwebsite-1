import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageIntro } from "@/components/Sections";
import { ContactForm } from "@/components/ui/form-1";
import { isConfigured } from "@/lib/intake-delivery";
import { FIRM, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Darren Drake, attorney at law. Send a message online or call (615) 546-5551.",
};

export default function Contact() {
  return (
    <>
      <PageIntro
        title="Contact"
        lead="Send a short message and choose how and when you'd like to hear back. You can also call."
        crumbs={[{ href: "/", label: "Home" }, { label: "Contact" }]}
      />
      <section aria-label="Contact details" className="pb-14 lg:pb-24">
        <Container className="grid items-start gap-6 lg:grid-cols-[3fr_2fr]">
          <div className="rounded-card border border-border bg-surface px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
            <ContactForm configured={isConfigured()} />
          </div>
          <div className="rounded-card border border-border bg-surface p-6 lg:p-10">
            <h2 className="h3">Call the office</h2>
            <a href={PHONE_HREF} className="mt-3 inline-flex min-h-11 items-center text-[28px] font-extrabold text-action lg:text-[34px]">
              {PHONE_DISPLAY}
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
