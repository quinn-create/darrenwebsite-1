export function Wordmark({ size = "md" }: { size?: "md" | "sm" }) {
  const name = size === "md" ? "text-[26px]" : "text-[20px]";
  return (
    <span className="inline-flex flex-col leading-none">
      <span className={`${name} font-extrabold uppercase tracking-[-0.01em] leading-[0.95]`}>
        Darren
        <br />
        Drake
      </span>
      <span className="mt-1 text-[13px] font-semibold text-muted">Attorney at Law</span>
    </span>
  );
}
