"use client";

import { Card } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { licensesApi } from "@/modules/licenses/licenses.api";
import { ordersApi } from "@/modules/orders/orders.api";

export default function DashboardPage() {
  const { user } = useAuth();
  const orders = ordersApi.list();
  const licenses = licensesApi.list();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="section-title text-4xl font-semibold text-slate-950">Hola, {user?.name ?? "cliente"}</h1>
        <p className="text-sm text-slate-600">Resumen rapido de tu cuenta y tus activos digitales.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-500">Pedidos</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{orders.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Licencias</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{licenses.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Por renovar</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{licensesApi.listRenewals().length}</p>
        </Card>
      </div>
    </div>
  );
}
