import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageIntro } from "@/components/Sections";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "How the Darren Drake, Attorney at Law website approaches accessibility, and how to report a problem.",
};

// Draft for the firm to approve. It states the standard we aim for; it never claims "ADA compliant".
export default function Accessibility() {
  return (
    <>
      <PageIntro
        title="Accessibility"
        lead="We want everyone to be able to use this website, including people who use a screen reader, keyboard or zoom."
        crumbs={[{ href: "/", label: "Home" }, { label: "Accessibility" }]}
      />
      <section className="pb-14 lg:pb-24">
        <Container>
          <div className="measure flex flex-col gap-4 text-muted">
            <h2 className="h3 mt-4 text-text">The standard we aim for</h2>
            <p>
              This website is designed and tested to meet the Web Content Accessibility Guidelines (WCAG) 2.2, level AA.
              We check it with automated tools and by hand, including keyboard-only use, screen readers, 200% zoom and
              small phone screens.
            </p>
            <h2 className="h3 mt-4 text-text">If something doesn&apos;t work for you</h2>
            <p>
              Please tell us what page you were on and what happened, and we&apos;ll work to fix it. You can call{" "}
              <a href={PHONE_HREF} className="link-action font-semibold">
                {PHONE_DISPLAY}
              </a>{" "}
              or contact [accessibility contact — to confirm].
            </p>
            <h2 className="h3 mt-4 text-text">Last reviewed</h2>
            <p>[Review date — to confirm]</p>
          </div>
        </Container>
      </section>
    </>
  );
}
