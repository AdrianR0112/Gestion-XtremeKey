"use client";

import { useEffect, useSyncExternalStore } from "react";

import { authStore } from "@/modules/auth/auth.store";
import { authApi } from "@/modules/auth/auth.api";

export function useAuth() {
  const state = useSyncExternalStore(
    authStore.subscribe,
    authStore.getSnapshot,
    authStore.getSnapshot,
  );

  useEffect(() => {
    void authStore.hydrate();
  }, []);

  return {
    user: state.user,
    isAuthenticated: Boolean(state.user),
    isHydrated: state.hydrated,
    login: authStore.login,
    logout: async () => {
      try {
        await authApi.logout();
      } finally {
        authStore.logout();
      }
    },
  };
}
