import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageIntro } from "@/components/Sections";
import { CookieSettingsButton } from "@/components/consent/CookieLinks";
import { FIRM, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";
import { HAS_ANALYTICS, HAS_MARKETING, TRACKERS, TRACKING_ON } from "@/lib/tracking";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy notice for the Darren Drake Law PLLC website.",
  alternates: { canonical: "/privacy/" },
};

// Draft written from how the site actually works (24 Sep 2026). Darren to approve or edit;
// the bracketed markers keep the production build blocked until he does.
export default function Privacy() {
  return (
    <>
      <PageIntro
        title="Privacy notice"
        lead="This notice explains what happens to the information you send through this website. [DRAFT — DARREN TO APPROVE]"
        crumbs={[{ href: "/", label: "Home" }, { href: "/privacy/", label: "Privacy" }]}
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
            {TRACKING_ON ? (
              <CookiesSection />
            ) : (
              <>
                <h2 id="cookies" className="h3 mt-4 text-text">
                  Cookies and statistics
                </h2>
                <p>
                  This website doesn&apos;t use advertising or tracking cookies. It may count visits and form use without
                  recording who you are or what you wrote.
                </p>
              </>
            )}
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

// Shown only when a tracker ID is set (lib/tracking.ts), and lists only the tags that are.
// Draft wording for Darren to approve, like the rest of this page (plans/cookie-consent-plan.md).
function CookiesSection() {
  const rows = [
    { category: "Necessary", purpose: "Remembers your cookie choices", provider: FIRM.legalName, cookies: "dd_consent", kept: "6 months" },
    ...(HAS_ANALYTICS
      ? [{ category: "Statistics (optional)", purpose: "Counts visits and shows which pages are useful", provider: "Google Analytics", cookies: "_ga, _ga_*", kept: "Up to 2 years" }]
      : []),
    ...(TRACKERS.ads
      ? [{ category: "Advertising (optional)", purpose: "Measures whether our Google ads led to a call or a message", provider: "Google Ads", cookies: "_gcl_*", kept: "Up to 90 days" }]
      : []),
    ...(TRACKERS.meta
      ? [{ category: "Advertising (optional)", purpose: "Measures whether our Facebook and Instagram ads led to a call or a message", provider: "Meta Platforms", cookies: "_fbp, _fbc", kept: "Up to 90 days" }]
      : []),
  ];
  return (
    <>
      <h2 id="cookies" className="h3 mt-4 scroll-mt-32 text-text">
        Cookies and advertising measurement
      </h2>
      <p>A cookie is a small file your browser stores. This website uses:</p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-[15px]">
          <thead>
            <tr className="border-b border-border/60 text-text">
              <th scope="col" className="py-2 pr-4 font-semibold">Type</th>
              <th scope="col" className="py-2 pr-4 font-semibold">Why</th>
              <th scope="col" className="py-2 pr-4 font-semibold">Provider</th>
              <th scope="col" className="py-2 pr-4 font-semibold">Cookies</th>
              <th scope="col" className="py-2 font-semibold">Kept for</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.provider} className="border-b border-border/40 align-top">
                <td className="py-2 pr-4">{r.category}</td>
                <td className="py-2 pr-4">{r.purpose}</td>
                <td className="py-2 pr-4">{r.provider}</td>
                <td className="py-2 pr-4">{r.cookies}</td>
                <td className="py-2">{r.kept}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        {HAS_ANALYTICS && HAS_MARKETING ? "Statistics and advertising cookies are" : HAS_ANALYTICS ? "Statistics cookies are" : "Advertising cookies are"}{" "}
        off until you turn them on in the cookie banner, and you can change your choice at any time with the button below or
        &ldquo;Cookie settings&rdquo; at the bottom of every page.
      </p>
      <p>
        <strong className="text-text">What is never shared.</strong> What you type in the contact form (your name, phone
        number, email, what your inquiry is about and your message) is never sent to Google or Meta. When you send the form
        or tap the phone number, they&apos;re told only that it happened. They do see which pages you view (for example, the
        DUI/DWI page), but page addresses are sent without any details of your inquiry
        {TRACKERS.ads ? ", and Google is told not to use your visit to personalise ads" : ""}.
      </p>
      {HAS_MARKETING && (
        <p>
          <strong className="text-text">Do Not Sell or Share My Personal Information.</strong> We don&apos;t sell your
          personal information. Some state laws treat advertising cookies as &ldquo;sharing&rdquo;; you can opt out by
          leaving them off, turning them off in cookie settings, or using the &ldquo;Do Not Sell or Share&rdquo; link at the
          bottom of every page.
        </p>
      )}
      <p>
        <strong className="text-text">Global Privacy Control.</strong> If your browser sends a Global Privacy Control signal,
        we treat it as a choice to keep {HAS_MARKETING ? "advertising cookies off, and we don't show the banner" : "optional cookies off, and we don't show the banner"}.
      </p>
      <p>You can also block or delete cookies in your browser&apos;s settings.</p>
      <CookieSettingsButton />
    </>
  );
}
