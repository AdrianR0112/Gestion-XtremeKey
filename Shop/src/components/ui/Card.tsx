import { cn } from "@/lib/utils";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return <article className={cn("rounded-3xl border border-slate-200 bg-white p-6 shadow-sm", className)}>{children}</article>;
}
