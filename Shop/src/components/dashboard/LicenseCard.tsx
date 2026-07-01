import { Card } from "@/components/ui/Card";
import { formatDate, maskLicenseKey } from "@/lib/formatters";
import type { License } from "@/types/license";

type LicenseCardProps = {
  license: License;
};

export function LicenseCard({ license }: LicenseCardProps) {
  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-slate-950">{license.productName}</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{license.status}</span>
      </div>
      <p className="text-sm text-slate-600">Clave: {maskLicenseKey(license.key)}</p>
      <p className="text-sm text-slate-600">Expira: {formatDate(license.expiresAt)}</p>
    </Card>
  );
}
