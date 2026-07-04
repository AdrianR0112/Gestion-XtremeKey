"use client";

import Link from "next/link";
import { Repeat } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { formatDate } from "@/lib/formatters";
import { subscriptionStatusTone } from "@/lib/status";
import { useSubscriptions } from "@/hooks/useSubscriptions";

export default function SubscriptionsPage() {
  const { activeSubscriptions, subscriptions, loading, error, refresh } = useSubscriptions();

  const inactive = subscriptions.filter((s) => s.Est_Sus !== "activa");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Cuenta"
        title="Suscripciones"
        description="Servicios recurrentes activos y su historial."
        actions={
          <button className="secondary-button" onClick={() => refresh()} type="button">
            Actualizar
          </button>
        }
      />

      {error ? (
        <Card className="border-rose-200 bg-rose-50/60 text-sm text-rose-700">
          No pudimos cargar tus suscripciones. {error}
        </Card>
      ) : null}

      {loading ? (
        <Card className="text-sm text-slate-500">Cargando...</Card>
      ) : subscriptions.length === 0 ? (
        <EmptyState
          icon={<Repeat className="h-5 w-5" />}
          title="No tienes suscripciones"
          description="Cuando actives un plan recurrente, aparecerá aquí para gestionarlo."
        />
      ) : (
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-base font-semibold uppercase tracking-[0.14em] text-slate-500">
              Activas ({activeSubscriptions.length})
            </h2>
            {activeSubscriptions.length === 0 ? (
              <Card className="text-sm text-slate-500">Sin suscripciones activas.</Card>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {activeSubscriptions.map((s) => (
                  <SubscriptionCard key={s.Id_Sus} suscripcion={s} />
                ))}
              </div>
            )}
          </section>

          {inactive.length > 0 ? (
            <section className="space-y-4">
              <h2 className="text-base font-semibold uppercase tracking-[0.14em] text-slate-500">
                Historial ({inactive.length})
              </h2>
              <div className="grid gap-4 lg:grid-cols-2">
                {inactive.map((s) => (
                  <SubscriptionCard key={s.Id_Sus} suscripcion={s} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}

function SubscriptionCard({ suscripcion: s }: { suscripcion: import("@/modules/subscriptions/subscriptions.types").Suscripcion }) {
  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wider text-slate-400">Producto</p>
          <Link
            className="block truncate text-lg font-semibold text-slate-950 transition hover:text-blue-700"
            href={`/productos/${s.Id_Prd}`}
          >
            {s.Nom_Prd ?? `#${s.Id_Prd}`}
          </Link>
          {s.Nom_Var ? <p className="mt-0.5 text-sm text-slate-500">Variante: {s.Nom_Var}</p> : null}
        </div>
        <StatusPill label={s.Est_Sus} tone={subscriptionStatusTone(s.Est_Sus)} />
      </div>
      <dl className="grid grid-cols-2 gap-3 text-sm text-slate-600">
        <div>
          <dt className="text-xs uppercase tracking-wider text-slate-400">Inicio</dt>
          <dd className="mt-0.5 text-slate-800">{formatDate(s.Fec_Ini_Sus)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-slate-400">Fin</dt>
          <dd className="mt-0.5 text-slate-800">{s.Fec_Fin_Sus ? formatDate(s.Fec_Fin_Sus) : "—"}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-slate-400">Renovación</dt>
          <dd className="mt-0.5 text-slate-800">{s.Ren_Auto ? "Automática" : "Manual"}</dd>
        </div>
        {s.Tip_Prd ? (
          <div>
            <dt className="text-xs uppercase tracking-wider text-slate-400">Tipo</dt>
            <dd className="mt-0.5 capitalize text-slate-800">{s.Tip_Prd}</dd>
          </div>
        ) : null}
      </dl>
      {s.Not_Sus ? <p className="text-sm text-slate-600">{s.Not_Sus}</p> : null}
    </Card>
  );
}
