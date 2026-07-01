import { LicenseCard } from "@/components/dashboard/LicenseCard";
import { licensesApi } from "@/modules/licenses/licenses.api";

export default function LicensesPage() {
  const licenses = licensesApi.list();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="section-title text-4xl font-semibold text-slate-950">Licencias</h1>
        <p className="text-sm text-slate-600">Claves activas y seguimiento de expiracion.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {licenses.map((license) => (
          <LicenseCard key={license.id} license={license} />
        ))}
      </div>
    </div>
  );
}
