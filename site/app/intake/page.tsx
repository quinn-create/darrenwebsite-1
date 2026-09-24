import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { IntakeForm } from "@/components/IntakeForm";
import { Breadcrumbs } from "@/components/Sections";
import { isConfigured } from "@/lib/intake-delivery";
import { INTAKE_HELPER, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Start your intake",
  description: "Send Darren Drake a brief inquiry about your legal matter and how to reach you.",
};

export default function IntakePage() {
  const configured = isConfigured();
  return (
    <section className="pb-14 pt-10 lg:pb-24 lg:pt-16">
      <Container>
        <div className="mx-auto max-w-[640px]">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Intake" }]} />
          {!configured && (
            <div role="note" className="mt-6 rounded-card border-2 border-action bg-surface p-5">
              <p className="font-bold">Demo form, not connected</p>
              <p className="mt-1 text-[16px] text-muted">
                This preview isn&apos;t connected to the firm yet, so nothing you enter will be sent. To reach the office,
                call <a href={PHONE_HREF} className="link-action font-semibold">{PHONE_DISPLAY}</a>.
              </p>
            </div>
          )}
          <h1 className="h1 mt-6">Start your intake</h1>
          <p className="mt-5 text-[18px] text-muted">Tell Darren Drake about your legal matter and how to reach you.</p>
          <div className="mt-6 rounded-card border border-border/60 bg-surface p-5 text-[16px] leading-relaxed text-muted">
            <p>{INTAKE_HELPER}</p>
            <p className="mt-2">
              <Link href="/privacy" className="link-action">
                Read the privacy notice
              </Link>
              <span className="mx-2" aria-hidden="true">·</span>
              Prefer to call?{" "}
              <a href={PHONE_HREF} className="link-action font-semibold">
                {PHONE_DISPLAY}
              </a>
            </p>
          </div>
          <IntakeForm configured={configured} />
        </div>
      </Container>
    </section>
  );
}
