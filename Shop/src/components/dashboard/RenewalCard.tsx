import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/formatters";
import type { License } from "@/types/license";

type RenewalCardProps = {
  license: License;
};

export function RenewalCard({ license }: RenewalCardProps) {
  return (
    <Card className="space-y-2">
      <h3 className="font-semibold text-slate-950">{license.productName}</h3>
      <p className="text-sm text-slate-600">Renovacion sugerida antes del {formatDate(license.expiresAt)}.</p>
    </Card>
  );
}
