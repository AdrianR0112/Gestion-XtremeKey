"use client";

import { useCallback, useState } from "react";

import { useAsyncResource } from "@/hooks/useAsyncResource";
import { useAuth } from "@/hooks/useAuth";
import { couponsApi } from "@/modules/coupons/coupons.api";
import type { CuponUsoInput } from "@/modules/coupons/coupons.types";

export function useCoupons() {
  const { isAuthenticated } = useAuth();
  const resource = useAsyncResource(() => couponsApi.list(), [isAuthenticated], { enabled: isAuthenticated });
  const [validating, setValidating] = useState(false);

  const findByCode = useCallback(async (codigo: string) => {
    setValidating(true);
    try {
      const list = await couponsApi.list({ codigo });
      return list.find((c) => c.codigo === codigo) ?? null;
    } finally {
      setValidating(false);
    }
  }, []);

  const registerUso = useCallback((input: CuponUsoInput) => couponsApi.createUso(input), []);

  return {
    coupons: resource.data ?? [],
    loading: resource.loading,
    error: resource.error,
    refresh: resource.refresh,
    findByCode,
    registerUso,
    validating,
  };
}
