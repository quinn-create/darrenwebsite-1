import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageIntro } from "@/components/Sections";
import { FIRM, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "Legal Notice",
  description: "Legal notice for the Darren Drake, Attorney at Law website.",
  alternates: { canonical: "/legal-notice/" },
};

// Draft built from the brand guidelines' approved wording, for the firm to approve.
export default function LegalNotice() {
  return (
    <>
      <PageIntro
        title="Legal notice"
        crumbs={[{ href: "/", label: "Home" }, { href: "/legal-notice/", label: "Legal notice" }]}
      />
      <section className="pb-14 lg:pb-24">
        <Container>
          <div className="measure flex flex-col gap-4 text-muted">
            <h2 className="h3 mt-4 text-text">General information only</h2>
            <p>
              This website is for general information and is not legal advice. Every situation is different. Please
              don&apos;t act, or decide not to act, on anything here without talking to a lawyer about your own matter.
            </p>
            <h2 className="h3 mt-4 text-text">No attorney-client relationship</h2>
            <p>
              Sending an inquiry through this website, or calling the office, does not by itself create an
              attorney-client relationship. The office reviews each inquiry and discusses next steps if the firm can
              assist. Please don&apos;t send sensitive documents or detailed confidential information in your first
              inquiry.
            </p>
            <h2 className="h3 mt-4 text-text">Office</h2>
            <p>
              {FIRM.legalName}
              <br />
              {FIRM.address}
              <br />
              <a href={PHONE_HREF} className="link-action">
                {PHONE_DISPLAY}
              </a>
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
