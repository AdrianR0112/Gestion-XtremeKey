"use client";

import Link from "next/link";

import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCart } from "@/hooks/useCart";

export default function CartPage() {
  const { items, hydrated, updateQuantity, removeItem } = useCart();

  return (
    <div className="page-shell grid gap-8 lg:grid-cols-[1fr_340px]">
      <section className="space-y-6">
        <div className="space-y-2">
          <h1 className="section-title text-4xl font-semibold text-slate-950">Carrito</h1>
          <p className="text-sm text-slate-600">Gestiona cantidades antes de pasar al checkout.</p>
        </div>
        {!hydrated ? <p className="text-sm text-slate-500">Cargando carrito...</p> : null}
        {hydrated && items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-sm text-slate-600">
            Tu carrito esta vacio. <Link className="font-medium text-cyan-700" href="/productos">Explorar productos</Link>
          </div>
        ) : null}
        <div className="space-y-4">
          {items.map((item) => (
            <CartItem
              item={item}
              key={item.productId}
              onDecrease={() => updateQuantity(item.productId, item.quantity - 1)}
              onIncrease={() => updateQuantity(item.productId, item.quantity + 1)}
              onRemove={() => removeItem(item.productId)}
            />
          ))}
        </div>
      </section>
      <aside>
        <CartSummary />
      </aside>
    </div>
  );
}
