export const AUTH_STORAGE_KEY = "shop-auth-session";
export const CART_STORAGE_KEY = "shop-cart-session";

export function isDashboardRoute(pathname: string) {
  return pathname.startsWith("/dashboard");
}
