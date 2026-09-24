import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageIntro } from "@/components/Sections";
import { FIRM, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy notice for the Darren Drake Law PLLC website.",
};

// Draft written from how the site actually works (24 Sep 2026). Darren to approve or edit;
// the bracketed markers keep the production build blocked until he does.
export default function Privacy() {
  return (
    <>
      <PageIntro
        title="Privacy notice"
        lead="This notice explains what happens to the information you send through this website. [DRAFT — DARREN TO APPROVE]"
        crumbs={[{ href: "/", label: "Home" }, { label: "Privacy" }]}
      />
      <section className="pb-14 lg:pb-24">
        <Container>
          <div className="measure flex flex-col gap-4 text-muted">
            <h2 className="h3 mt-4 text-text">What we collect</h2>
            <p>
              When you send the website form, we receive your name, the client&apos;s name if it&apos;s someone else, what
              your inquiry is about, how and when you&apos;d like to hear back, the phone number and email address you
              give, and your message if you write one. We also record the date and time it was sent.
            </p>
            <h2 className="h3 mt-4 text-text">How we use it</h2>
            <p>
              We use it only to review your inquiry, contact you the way you asked, and decide whether the firm can
              assist. We don&apos;t sell it or share it for advertising.
            </p>
            <h2 className="h3 mt-4 text-text">Who handles it</h2>
            <p>
              Your inquiry is sent to the firm&apos;s office staff by email, with a copy delivered by Telegram. The
              services that run the website and deliver inquiries (hosting, email delivery and messaging) handle it
              only to provide those services.
            </p>
            <h2 className="h3 mt-4 text-text">How long we keep it</h2>
            <p>[DARREN TO CONFIRM: how long inquiries are kept, and how to ask for one to be deleted.]</p>
            <h2 className="h3 mt-4 text-text">Cookies and statistics</h2>
            <p>
              This website doesn&apos;t use advertising or tracking cookies. It may count visits and form use without
              recording who you are or what you wrote.
            </p>
            <h2 className="h3 mt-4 text-text">Please keep your first message brief</h2>
            <p>
              Email and messaging aren&apos;t completely secure. Please don&apos;t include sensitive documents or detailed
              confidential information in the form. Sending it does not create an attorney-client relationship.
            </p>
            <h2 className="h3 mt-4 text-text">Questions</h2>
            <p>
              Call{" "}
              <a href={PHONE_HREF} className="link-action font-semibold">
                {PHONE_DISPLAY}
              </a>{" "}
              or write to {FIRM.legalName}, {FIRM.address}.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
