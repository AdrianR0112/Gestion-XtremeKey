"use client";

import { useCallback } from "react";

import { useAsyncResource } from "@/hooks/useAsyncResource";
import { cartApi } from "@/modules/cart/cart.api";
import type {
  CarritoInput,
  CarritoItemInput,
  CarritoItemUpdate,
} from "@/modules/cart/cart.types";

export function useServerCart(carritoId?: string) {
  const resource = useAsyncResource(
    async () => (carritoId ? cartApi.getById(carritoId) : null),
    [carritoId],
    { immediate: Boolean(carritoId) },
  );

  const create = useCallback((input: CarritoInput) => cartApi.create(input), []);

  const addItem = useCallback(
    async (input: CarritoItemInput) => {
      if (!carritoId) throw new Error("carritoId requerido");
      const item = await cartApi.addItem(carritoId, input);
      await resource.refresh();
      return item;
    },
    [carritoId, resource],
  );

  const updateItem = useCallback(
    async (itemId: string, input: CarritoItemUpdate) => {
      const item = await cartApi.updateItem(itemId, input);
      await resource.refresh();
      return item;
    },
    [resource],
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      await cartApi.removeItem(itemId);
      await resource.refresh();
    },
    [resource],
  );

  return {
    cart: resource.data,
    loading: resource.loading,
    error: resource.error,
    refresh: resource.refresh,
    create,
    addItem,
    updateItem,
    removeItem,
  };
}
