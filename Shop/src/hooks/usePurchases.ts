"use client";

import { useCallback } from "react";

import { useAsyncResource } from "@/hooks/useAsyncResource";
import { useAuth } from "@/hooks/useAuth";
import { ordersApi } from "@/modules/orders/orders.api";
import type { Orden } from "@/modules/orders/orders.types";
import { salesApi } from "@/modules/sales/sales.api";
import type { Venta } from "@/modules/sales/sales.types";
import type { Order, OrderStatus } from "@/types/order";

function mapEstado(estado?: string): OrderStatus {
  const map: Record<string, OrderStatus> = {
    pagada: "pagado",
    entregada: "pagado",
    completada: "pagado",
    pendiente: "pendiente",
    procesando: "procesando",
    cancelada: "pendiente",
    reembolsada: "pendiente",
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

export function mapVenta(venta: Venta): Order {
  return {
    id: `venta-${venta.Id_Ven}`,
    number: `VEN-${venta.Id_Ven}`,
    createdAt: venta.Fec_Ven ?? "",
    total: Number(venta.Tot_Ven ?? 0),
    status: mapEstado(venta.Est_Ven),
    source: "venta_whatsapp",
    sourceLabel: "WhatsApp",
    items: (venta.detalles ?? []).map((detalle) => ({
      productName:
        detalle.Nom_Prd ??
        detalle.Nom_Var ??
        detalle.Nom_Cue ??
        detalle.Des_Key ??
        `Item ${detalle.Id_Dve}`,
      quantity: Number(detalle.Cant_Dve ?? 0),
    })),
  };
}

export function usePurchases() {
  const { isAuthenticated } = useAuth();
  const resource = useAsyncResource(
    async () => {
      const [ordenes, ventas] = await Promise.all([ordersApi.listMine(), salesApi.listMine()]);

      return [
        ...ordenes.map(mapOrden),
        ...ventas
          .filter((venta) => (venta.Origen_Ven ?? "").toLowerCase() === "whatsapp")
          .map(mapVenta),
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    [isAuthenticated],
    { enabled: isAuthenticated },
  );

  const refresh = useCallback(async () => {
    await resource.refresh();
  }, [resource]);

  return {
    orders: resource.data ?? [],
    loading: resource.loading,
    error: resource.error,
    refresh,
  };
}
