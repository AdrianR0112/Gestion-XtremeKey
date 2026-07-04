"use client";

import { useCallback } from "react";

import { useAsyncResource } from "@/hooks/useAsyncResource";
import { useAuth } from "@/hooks/useAuth";
import { paymentsApi } from "@/modules/payments/payments.api";
import type { PagoInput } from "@/modules/payments/payments.types";

export function usePayments() {
  const { isAuthenticated } = useAuth();
  const resource = useAsyncResource(() => paymentsApi.listMine(), [isAuthenticated], { enabled: isAuthenticated });

  const create = useCallback(
    async (input: PagoInput) => {
      const pago = await paymentsApi.createMine(input);
      await resource.refresh();
      return pago;
    },
    [resource],
  );

  return {
    payments: resource.data ?? [],
    loading: resource.loading,
    error: resource.error,
    refresh: resource.refresh,
    create,
  };
}
