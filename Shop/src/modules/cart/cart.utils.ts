import type { CartLine } from "@/modules/cart/cart.types";

export function getCartTotal(items: CartLine[]) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function getCartItemsCount(items: CartLine[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}
