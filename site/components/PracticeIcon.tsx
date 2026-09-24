import { Briefcase, CarFront, FileText } from "lucide-react";

const ICONS = { briefcase: Briefcase, car: CarFront, file: FileText } as const;

export function PracticeIcon({ name, size = 40 }: { name: keyof typeof ICONS; size?: number }) {
  const Icon = ICONS[name];
  return <Icon aria-hidden="true" size={size} strokeWidth={1.5} className="text-muted" />;
}
