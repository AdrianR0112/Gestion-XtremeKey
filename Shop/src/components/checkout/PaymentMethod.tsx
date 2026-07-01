import { cn } from "@/lib/utils";

type PaymentMethodProps = {
  id: string;
  label: string;
  checked: boolean;
  onChange: (value: string) => void;
};

export function PaymentMethod({ id, label, checked, onChange }: PaymentMethodProps) {
  return (
    <label className={cn("flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 text-sm transition", checked ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-700")}>
      <span>{label}</span>
      <input checked={checked} className="sr-only" name="paymentMethod" onChange={() => onChange(id)} type="radio" value={id} />
    </label>
  );
}
