"use client";

import { PurchaseTable } from "@/components/dashboard/PurchaseTable";
import { useOrders } from "@/hooks/useOrders";

export default function PurchasesPage() {
  const { orders } = useOrders();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="section-title text-4xl font-semibold text-slate-950">Compras</h1>
        <p className="text-sm text-slate-600">Historial de pedidos del cliente.</p>
      </div>
      <PurchaseTable orders={orders} />
    </div>
  );
}
