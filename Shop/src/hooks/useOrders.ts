"use client";

import { useCallback } from "react";

import { useAsyncResource } from "@/hooks/useAsyncResource";
import { useAuth } from "@/hooks/useAuth";
import { ordersApi } from "@/modules/orders/orders.api";
import type { Orden, OrdenInput } from "@/modules/orders/orders.types";
import type { Order, OrderStatus } from "@/types/order";

function mapEstado(estado?: string): OrderStatus {
  const map: Record<string, OrderStatus> = {
    pagada: "pagado",
    entregada: "pagado",
    completada: "pagado",
    pendiente: "pendiente",
    procesando: "procesando",
    cancelada: "pendiente",
  };
  return map[estado ?? ""] ?? "procesando";
}

export function mapOrden(o: Orden): Order {
  return {
    id: `orden-${o.Id_Ord}`,
    number: o.Numero_Ord ?? `ORD-${o.Id_Ord}`,
    createdAt: o.Fec_Crea_Ord ?? "",
    total: Number(o.Total ?? 0),
    status: mapEstado(o.Estado_Ord),
    source: "orden",
    sourceLabel: "Tienda",
    items: (o.items ?? []).map((it) => ({
      productName: it.Nombre_Prd ?? it.Nom_Prd_Actual ?? String(it.Id_Prd),
      quantity: Number(it.Cantidad ?? 0),
    })),
  };
}

export function useOrders() {
  const { isAuthenticated } = useAuth();
  const resource = useAsyncResource(() => ordersApi.listMine(), [isAuthenticated], { enabled: isAuthenticated });

  const create = useCallback(
    async (input: OrdenInput) => {
      const orden = await ordersApi.createMine(input);
      await resource.refresh();
      return orden;
    },
    [resource],
  );

  const orders: Order[] = (resource.data ?? []).map(mapOrden);

  return {
    orders,
    rawOrders: resource.data ?? [],
    loading: resource.loading,
    error: resource.error,
    refresh: resource.refresh,
    create,
  };
}
