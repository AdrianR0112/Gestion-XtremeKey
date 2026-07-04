"use client";

import { useCallback } from "react";

import { useAsyncResource } from "@/hooks/useAsyncResource";
import { reviewsApi } from "@/modules/reviews/reviews.api";
import type { ReseniaInput, ReseniaUpdate } from "@/modules/reviews/reviews.types";

export function useReviews(productoId?: string) {
  const resource = useAsyncResource(
    () => reviewsApi.list(productoId ? { productoId } : undefined),
    [productoId],
  );

  const create = useCallback(
    async (input: ReseniaInput) => {
      const created = await reviewsApi.create(input);
      await resource.refresh();
      return created;
    },
    [resource],
  );

  const update = useCallback(
    async (id: string, input: ReseniaUpdate) => {
      const updated = await reviewsApi.update(id, input);
      await resource.refresh();
      return updated;
    },
    [resource],
  );

  const remove = useCallback(
    async (id: string) => {
      await reviewsApi.remove(id);
      await resource.refresh();
    },
    [resource],
  );

  return {
    reviews: resource.data ?? [],
    loading: resource.loading,
    error: resource.error,
    refresh: resource.refresh,
    create,
    update,
    remove,
  };
}
