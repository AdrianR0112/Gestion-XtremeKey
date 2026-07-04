"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type AsyncResourceState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export function useAsyncResource<T>(
  loader: () => Promise<T>,
  deps: unknown[] = [],
  options: { immediate?: boolean; enabled?: boolean } = {},
) {
  const immediate = options.immediate ?? true;
  const enabled = options.enabled ?? true;

  const [state, setState] = useState<AsyncResourceState<T>>({
    data: null,
    loading: Boolean(immediate && enabled),
    error: null,
  });
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    if (!enabled) return null as unknown as T;
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await loader();
      if (mounted.current) setState({ data, loading: false, error: null });
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error";
      if (mounted.current) setState({ data: null, loading: false, error: message });
      throw err;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  useEffect(() => {
    if (!immediate || !enabled) return;
    refresh().catch(() => {
      /* handled via error state */
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  return { ...state, refresh, setData: (data: T | null) => setState((s) => ({ ...s, data })) };
}
