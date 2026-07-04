"use client";

import { useCallback } from "react";

import { useAsyncResource } from "@/hooks/useAsyncResource";
import { useAuth } from "@/hooks/useAuth";
import { notificationsApi } from "@/modules/notifications/notifications.api";
import type { NotificacionUpdate } from "@/modules/notifications/notifications.types";

export function useNotifications() {
  const { isAuthenticated } = useAuth();
  const resource = useAsyncResource(() => notificationsApi.list(), [isAuthenticated], { enabled: isAuthenticated });

  const markAsRead = useCallback(
    async (id: string, update: NotificacionUpdate = { leida: true }) => {
      await notificationsApi.update(id, update);
      await resource.refresh();
    },
    [resource],
  );

  const remove = useCallback(
    async (id: string) => {
      await notificationsApi.remove(id);
      await resource.refresh();
    },
    [resource],
  );

  return {
    notifications: resource.data ?? [],
    unreadCount: (resource.data ?? []).filter((n) => !n.leida).length,
    loading: resource.loading,
    error: resource.error,
    refresh: resource.refresh,
    markAsRead,
    remove,
  };
}
