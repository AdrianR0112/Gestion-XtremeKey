"use client";

import { ordersApi } from "@/modules/orders/orders.api";

export function useOrders() {
  return {
    orders: ordersApi.list(),
  };
}
