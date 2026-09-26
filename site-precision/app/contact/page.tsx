import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { PageIntro } from "@/components/Sections";
import { CTA_LABEL, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Darren Drake, attorney at law. Start your intake online or call (615) 546-5551.",
};

export default function Contact() {
  return (
    <>
      <PageIntro
        title="Contact"
        lead="The quickest way to reach the office is a short intake inquiry. You can also call."
        crumbs={[{ href: "/", label: "Home" }, { label: "Contact" }]}
      />
      <section aria-label="Contact details" className="pb-12 lg:pb-[88px]">
        <Container className="grid gap-6 md:grid-cols-2">
          <div className="rounded-card border border-border bg-surface p-6 lg:p-10">
            <h2 className="h3">Start your intake</h2>
            <p className="mt-3 text-muted">Tell Darren Drake about your legal matter and how to reach you.</p>
            <Link href="/intake" className="btn-primary mt-8">
              {CTA_LABEL}
            </Link>
          </div>
          <div className="rounded-card border border-border bg-surface p-6 lg:p-10">
            <h2 className="h3">Call the office</h2>
            <a href={PHONE_HREF} className="mt-3 inline-flex min-h-11 items-center text-[28px] font-bold text-action lg:text-[34px]">
              {PHONE_DISPLAY}
            </a>
            <dl className="mt-6 grid gap-4 text-muted">
              <div>
                <dt className="label text-text">Office</dt>
                <dd>[Office address — to confirm]</dd>
              </div>
              <div>
                <dt className="label text-text">Hours</dt>
                <dd>[Office hours — to confirm]</dd>
              </div>
              <div>
                <dt className="label text-text">Email</dt>
                <dd>[Email — to confirm]</dd>
              </div>
            </dl>
          </div>
        </Container>
      </section>
    </>
  );
}
