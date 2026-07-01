import { RenewalCard } from "@/components/dashboard/RenewalCard";
import { licensesApi } from "@/modules/licenses/licenses.api";

export default function RenewalsPage() {
  const renewals = licensesApi.listRenewals();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="section-title text-4xl font-semibold text-slate-950">Renovaciones</h1>
        <p className="text-sm text-slate-600">Licencias cercanas a vencerse para retencion y upsell.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {renewals.map((license) => (
          <RenewalCard key={license.id} license={license} />
        ))}
      </div>
    </div>
  );
}
