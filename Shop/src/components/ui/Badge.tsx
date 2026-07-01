type BadgeProps = {
  label: string;
};

export function Badge({ label }: BadgeProps) {
  return <span className="inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">{label}</span>;
}
