import type { AuthUser } from "@/modules/auth/auth.types";
import { authApi } from "@/modules/auth/auth.api";
import { AUTH_STORAGE_KEY } from "@/lib/auth";

export type AuthState = {
  user: AuthUser | null;
  hydrated: boolean;
};

let state: AuthState = {
  user: null,
  hydrated: false,
};
let hydratingPromise: Promise<void> | null = null;

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function persist() {
  if (typeof window === "undefined") {
    return;
  }

  if (state.user) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state.user));
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export const authStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);

    return () => listeners.delete(listener);
  },
  getSnapshot() {
    return state;
  },
  async hydrate() {
    if (typeof window === "undefined") {
      return;
    }

    if (state.hydrated) {
      return;
    }

    if (hydratingPromise) {
      return hydratingPromise;
    }

    hydratingPromise = (async () => {
      const storedValue = window.localStorage.getItem(AUTH_STORAGE_KEY);

      state = {
        user: storedValue ? (JSON.parse(storedValue) as AuthUser) : null,
        hydrated: true,
      };

      emit();

      try {
        const user = await authApi.getSession();
        state = { user, hydrated: true };
        persist();
        emit();
      } catch {
        state = { user: null, hydrated: true };
        persist();
        emit();
      } finally {
        hydratingPromise = null;
      }
    })();

    return hydratingPromise;
  },
  login(user: AuthUser) {
    state = { user, hydrated: true };
    persist();
    emit();
  },
  logout() {
    state = { user: null, hydrated: true };
    persist();
    emit();
  },
};
