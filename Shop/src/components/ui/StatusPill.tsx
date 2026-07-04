import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "neutral" | "info";

const TONE_STYLES: Record<Tone, string> = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-500/20",
  warning: "bg-amber-50 text-amber-700 ring-amber-500/20",
  danger: "bg-rose-50 text-rose-700 ring-rose-500/20",
  neutral: "bg-slate-100 text-slate-700 ring-slate-500/15",
  info: "bg-blue-50 text-blue-700 ring-blue-500/20",
};

type StatusPillProps = {
  label: string;
  tone?: Tone;
  className?: string;
};

export function StatusPill({ label, tone = "neutral", className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        TONE_STYLES[tone],
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", tone === "success" && "bg-emerald-500", tone === "warning" && "bg-amber-500", tone === "danger" && "bg-rose-500", tone === "info" && "bg-blue-500", tone === "neutral" && "bg-slate-400")} />
      {label}
    </span>
  );
}
