import Link from "next/link";
import { Container } from "@/components/Container";
import { CTA_LABEL } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="py-24">
      <Container>
        <h1 className="h1">Page not found</h1>
        <p className="measure mt-5 text-muted">That page doesn&apos;t exist or has moved.</p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <Link href="/intake" className="btn-primary">
            {CTA_LABEL}
          </Link>
          <Link href="/" className="link-action inline-flex min-h-11 items-center">
            Go to the homepage
          </Link>
        </div>
      </Container>
    </section>
  );
}
