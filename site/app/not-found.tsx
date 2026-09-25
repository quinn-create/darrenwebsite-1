import Link from "next/link";
import { Container } from "@/components/Container";
import { PhoneLink } from "@/components/PhoneLink";
import { CTA_HREF, CTA_LABEL, PRACTICES } from "@/lib/site";

// Old addresses from the previous website that aren't redirected land here, so offer the
// likely destinations instead of a dead end.
export default function NotFound() {
  return (
    <section className="py-24">
      <Container>
        <h1 className="h1">Page not found</h1>
        <p className="measure mt-5 text-muted">That page doesn&apos;t exist or has moved.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Link href={CTA_HREF} className="btn-primary">
            {CTA_LABEL}
          </Link>
          <PhoneLink />
        </div>
        <h2 className="h3 mt-12">Practice areas</h2>
        <ul className="mt-3 flex flex-col">
          {PRACTICES.map((p) => (
            <li key={p.slug}>
              <Link href={`/practice-areas/${p.slug}/`} className="link-secondary inline-flex min-h-11 items-center">
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6">
          <Link href="/" className="link-secondary inline-flex min-h-11 items-center">
            Go to the homepage
          </Link>
        </p>
      </Container>
    </section>
  );
}
