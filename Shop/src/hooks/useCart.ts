"use client";

import { useEffect, useSyncExternalStore } from "react";

import { getCartItemsCount, getCartTotal } from "@/modules/cart/cart.utils";
import { cartStore } from "@/store/cart.store";

export function useCart() {
  const state = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getSnapshot,
  );

  useEffect(() => {
    cartStore.hydrate();
  }, []);

  return {
    ...state,
    itemCount: getCartItemsCount(state.items),
    subtotal: getCartTotal(state.items),
    addItem: cartStore.addItem,
    removeItem: cartStore.removeItem,
    updateQuantity: cartStore.updateQuantity,
    clear: cartStore.clear,
  };
}
