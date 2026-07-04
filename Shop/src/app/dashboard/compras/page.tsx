"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { PurchaseTable } from "@/components/dashboard/PurchaseTable";
import { usePurchases } from "@/hooks/usePurchases";

export default function PurchasesPage() {
  const { orders, loading, error, refresh } = usePurchases();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Historial"
        title="Compras"
        description="Órdenes de la tienda y ventas manuales por WhatsApp con estados, montos y detalle."
        actions={
          <button className="secondary-button" onClick={() => refresh()} type="button">
            Actualizar
          </button>
        }
      />

      {error ? (
        <Card className="border-rose-200 bg-rose-50/60 text-sm text-rose-700">
          No pudimos cargar tus compras. {error}
        </Card>
      ) : null}

      {loading ? (
        <Card className="text-sm text-slate-500">Cargando...</Card>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="h-5 w-5" />}
          title="Aún no has realizado compras"
          description="Explora el catálogo y realiza tu primera orden."
          action={
            <Link className="primary-button" href="/productos">
              Ir al catálogo
            </Link>
          }
        />
      ) : (
        <PurchaseTable orders={orders} />
      )}
    </div>
  );
}
