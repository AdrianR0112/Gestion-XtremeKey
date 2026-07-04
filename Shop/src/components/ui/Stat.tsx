import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type StatProps = {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  loading?: boolean;
  className?: string;
};

export function Stat({ label, value, hint, icon, loading, className }: StatProps) {
  return (
    <article
      className={cn(
        "surface-panel rounded-[28px] p-5 transition duration-300 hover:-translate-y-0.5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">{label}</p>
        {icon ? <span className="rounded-full bg-slate-950/5 p-2 text-slate-700">{icon}</span> : null}
      </div>
      <p className="mt-3 text-3xl font-semibold text-slate-950">{loading ? "—" : value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </article>
  );
}
