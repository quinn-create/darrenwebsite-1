// The client chose concept B, which shows a small cobalt "DD" square beside the name.
// The guidelines reserve the monogram for the favicon, so it can be switched off here
// pending final approval (see HANDOFF.md). The full name always stays visible.
export const SHOW_DD_MARK = process.env.NEXT_PUBLIC_SHOW_DD_MARK !== "false";

export function Wordmark({ size = "md" }: { size?: "md" | "sm" }) {
  const box = size === "md" ? "size-14 text-[22px]" : "size-10 text-[16px]";
  const name = size === "md" ? "text-[24px]" : "text-[19px]";
  return (
    <span className="inline-flex items-center gap-3">
      {SHOW_DD_MARK && (
        <span aria-hidden="true" className={`${box} inline-flex shrink-0 items-center justify-center rounded-card bg-action font-bold text-on-action`}>
          DD
        </span>
      )}
      <span className="inline-flex flex-col leading-tight">
        <span className={`${name} font-semibold tracking-[-0.01em]`}>Darren Drake</span>
        <span className="text-[14px] text-muted">Attorney at Law</span>
      </span>
    </span>
  );
}
