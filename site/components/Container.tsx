import type { ReactNode } from "react";

// `reveal` marks the block for the gentle scroll reveal (components/ScrollReveal.tsx).
export function Container({
  children,
  className = "",
  reveal = false,
}: {
  children: ReactNode;
  className?: string;
  reveal?: boolean;
}) {
  return (
    <div className={`mx-auto w-full max-w-site px-5 sm:px-6 lg:px-8 ${className}`} data-reveal={reveal ? "" : undefined}>
      {children}
    </div>
  );
}
