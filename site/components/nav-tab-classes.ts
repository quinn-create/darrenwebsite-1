// Class names for components/NavTabs.tsx, built from the tab styles. Called from server code
// only (components/Header.tsx), so cn/tailwind-merge and the variants stay off the browser.
import { tabsListVariants, tabsTriggerVariants } from "@/components/ui/tabs-variants";
import { cn } from "@/lib/utils";

export function navTabClasses(compact: boolean) {
  return {
    list: cn(
      tabsListVariants({ variant: "default", shape: "pill", size: compact ? "sm" : "lg" }),
      "border border-border/60 bg-surface",
      compact && "grid w-full grid-cols-4",
    ),
    trigger: cn(
      tabsTriggerVariants({ variant: "default", size: compact ? "sm" : "lg" }),
      "min-h-11 rounded-full font-semibold text-muted data-[state=active]:bg-bg data-[state=active]:text-text data-[state=active]:ring-1 data-[state=active]:ring-action/70",
      compact ? "w-full px-2 text-[15px]" : "px-5 text-[16px]",
    ),
  };
}
