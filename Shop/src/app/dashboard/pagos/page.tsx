"use client";

import { CreditCard } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { paymentStatusTone } from "@/lib/status";
import { usePayments } from "@/hooks/usePayments";

export default function PaymentsPage() {
  const { payments, loading, error, refresh } = usePayments();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Cuenta"
        title="Pagos"
        description="Historial de pagos realizados sobre tus órdenes."
        actions={
          <button className="secondary-button" onClick={() => refresh()} type="button">
            Actualizar
          </button>
        }
      />

      {error ? (
        <Card className="border-rose-200 bg-rose-50/60 text-sm text-rose-700">
          No pudimos cargar tus pagos. {error}
        </Card>
      ) : null}

      {loading ? (
        <Card className="text-sm text-slate-500">Cargando...</Card>
      ) : payments.length === 0 ? (
        <EmptyState
          icon={<CreditCard className="h-5 w-5" />}
          title="Sin pagos registrados"
          description="Los pagos aparecerán aquí una vez que confirmes una orden."
        />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 shadow-sm backdrop-blur">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50/80 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Orden</th>
                <th className="px-4 py-3 font-medium">Método</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Referencia</th>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 text-right font-medium">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p) => (
                <tr className="transition hover:bg-slate-50/60" key={p.Id_Pag}>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {p.Numero_Ord ?? `#${p.Id_Ord}`}
                  </td>
                  <td className="px-4 py-3 text-slate-600 capitalize">{p.Metodo_Pago}</td>
                  <td className="px-4 py-3">
                    <StatusPill label={p.Estado_Pago_Prov} tone={paymentStatusTone(p.Estado_Pago_Prov)} />
                  </td>
                  <td className="px-4 py-3 text-slate-500">{p.Id_Transaccion ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {p.Fec_Crea_Pag ? formatDate(p.Fec_Crea_Pag) : "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-900">
                    {formatCurrency(Number(p.Monto))} {p.Moneda}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
