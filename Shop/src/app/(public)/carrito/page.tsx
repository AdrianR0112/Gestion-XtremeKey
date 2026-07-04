"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { useCart } from "@/hooks/useCart";

export default function CartPage() {
  const { items, hydrated, updateQuantity, removeItem } = useCart();

  return (
    <div className="page-shell grid gap-8 lg:grid-cols-[1fr_360px]">
      <section className="space-y-6">
        <PageHeader
          eyebrow="Compra"
          title="Carrito"
          description="Gestiona cantidades antes de pasar al checkout."
        />

        {!hydrated ? <p className="text-sm text-slate-500">Cargando carrito...</p> : null}

        {hydrated && items.length === 0 ? (
          <EmptyState
            icon={<ShoppingCart className="h-5 w-5" />}
            title="Tu carrito está vacío"
            description="Explora el catálogo y agrega productos para comenzar."
            action={
              <Link className="primary-button" href="/productos">
                Explorar productos
              </Link>
            }
          />
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
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <CartSummary />
      </aside>
    </div>
  );
}
