import type { Metadata } from "next";
import Link from "next/link";
import { Phone } from "lucide-react";
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
    <section className="pb-12 pt-8 lg:pb-[88px] lg:pt-14">
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-6">
        <div className="max-w-[640px] lg:col-span-8">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Intake" }]} />
          {!configured && (
            <div role="note" className="mt-6 rounded-card border-2 border-action bg-surface p-5">
              <p className="font-semibold">Demo form, not connected</p>
              <p className="mt-1 text-[16px] text-muted">
                This preview isn&apos;t connected to the firm yet, so nothing you enter will be sent. To reach the office,
                call{" "}
                <a href={PHONE_HREF} className="link-underlined font-semibold">
                  {PHONE_DISPLAY}
                </a>
                .
              </p>
            </div>
          )}
          <h1 className="h1 mt-6">Start your intake</h1>
          <p className="mt-5 text-[18px] text-muted">Tell us the type of matter and how to contact you.</p>
          <div className="mt-6 rounded-card border border-border/60 bg-surface p-5 text-[16px] leading-relaxed text-muted">
            <p>{INTAKE_HELPER}</p>
            <p className="mt-2">
              <Link href="/privacy" className="link-underlined">
                Read the privacy notice
              </Link>
            </p>
          </div>
          <IntakeForm configured={configured} />
        </div>

        {/* Phone as the secondary route, right beside the form on desktop. */}
        <aside aria-label="Call instead" className="hidden lg:col-span-4 lg:block lg:pt-[60px]">
          <div className="rounded-card border border-border bg-surface p-5 lg:sticky lg:top-32 lg:p-6">
            <p className="flex items-center gap-2 font-semibold">
              <Phone aria-hidden="true" size={20} strokeWidth={1.75} className="text-action" />
              Prefer to call?
            </p>
            <a href={PHONE_HREF} className="link-action mt-1 inline-flex min-h-11 items-center text-[22px] font-bold">
              {PHONE_DISPLAY}
            </a>
          </div>
        </aside>
      </Container>
    </section>
  );
}
