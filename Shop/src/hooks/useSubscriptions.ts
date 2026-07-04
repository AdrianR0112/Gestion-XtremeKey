"use client";

import { useAsyncResource } from "@/hooks/useAsyncResource";
import { useAuth } from "@/hooks/useAuth";
import { subscriptionsApi } from "@/modules/subscriptions/subscriptions.api";

export function useSubscriptions() {
  const { isAuthenticated } = useAuth();
  const resource = useAsyncResource(
    () => subscriptionsApi.listMine(),
    [isAuthenticated],
    { enabled: isAuthenticated },
  );

  const activas = (resource.data ?? []).filter((s) => s.Est_Sus === "activa");

  return {
    subscriptions: resource.data ?? [],
    activeSubscriptions: activas,
    loading: resource.loading,
    error: resource.error,
    refresh: resource.refresh,
  };
}
