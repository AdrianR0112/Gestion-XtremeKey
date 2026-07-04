"use client";

import { useCallback } from "react";

import { useAsyncResource } from "@/hooks/useAsyncResource";
import { useAuth } from "@/hooks/useAuth";
import { wishlistApi } from "@/modules/wishlist/wishlist.api";

export function useWishlist() {
  const { isAuthenticated } = useAuth();
  const resource = useAsyncResource(() => wishlistApi.listMine(), [isAuthenticated], { enabled: isAuthenticated });

  const add = useCallback(
    async (productoId: number | string) => {
      const idPrd = Number(productoId);
      if (!Number.isFinite(idPrd) || idPrd <= 0) {
        throw new Error("productoId inválido");
      }
      await wishlistApi.addMine({ Id_Prd: idPrd });
      await resource.refresh();
    },
    [resource],
  );

  const removeByProducto = useCallback(
    async (productoId: number | string) => {
      const idPrd = Number(productoId);
      await wishlistApi.removeMineByProducto(idPrd);
      await resource.refresh();
    },
    [resource],
  );

  const removeById = useCallback(
    async (id: number) => {
      await wishlistApi.removeById(id);
      await resource.refresh();
    },
    [resource],
  );

  return {
    items: resource.data ?? [],
    loading: resource.loading,
    error: resource.error,
    refresh: resource.refresh,
    add,
    removeByProducto,
    removeById,
  };
}
