import { KeyRound } from "lucide-react";

import { EmptyState } from "@/components/ui/EmptyState";
import { LicenseCard } from "@/components/dashboard/LicenseCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { licensesApi } from "@/modules/licenses/licenses.api";

export default function LicensesPage() {
  const licenses = licensesApi.list();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Cuenta"
        title="Licencias"
        description="Claves activas y seguimiento de expiración."
      />
      {licenses.length === 0 ? (
        <EmptyState
          icon={<KeyRound className="h-5 w-5" />}
          title="No tienes licencias todavía"
          description="Cuando compres un producto, verás aquí sus claves."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {licenses.map((license) => (
            <LicenseCard key={license.id} license={license} />
          ))}
        </div>
      )}
    </div>
  );
}
