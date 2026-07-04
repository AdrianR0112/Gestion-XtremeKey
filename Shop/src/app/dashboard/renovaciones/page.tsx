import { RefreshCw } from "lucide-react";

import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { RenewalCard } from "@/components/dashboard/RenewalCard";
import { licensesApi } from "@/modules/licenses/licenses.api";

export default function RenewalsPage() {
  const renewals = licensesApi.listRenewals();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Cuenta"
        title="Renovaciones"
        description="Licencias cercanas a vencerse para retención y upsell."
      />
      {renewals.length === 0 ? (
        <EmptyState
          icon={<RefreshCw className="h-5 w-5" />}
          title="Todo al día"
          description="Ninguna licencia está próxima a expirar."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {renewals.map((license) => (
            <RenewalCard key={license.id} license={license} />
          ))}
        </div>
      )}
    </div>
  );
}
