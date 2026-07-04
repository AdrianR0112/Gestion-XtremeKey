"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/formatters";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";
import { cartStore } from "@/store/cart.store";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { user, isAuthenticated } = useAuth();
  const { add: addToWishlist } = useWishlist();

  const discount = Math.max(0, Math.round(((product.listPrice - product.price) / product.listPrice) * 100));

  return (
    <Card className="group flex h-full flex-col gap-4 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <Badge label={product.categoryName} />
        <div className="flex items-center gap-2">
          {discount > 0 ? <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">-{discount}%</span> : null}
          {isAuthenticated && user ? (
            <button
              aria-label="Agregar a lista de deseos"
              className="rounded-full p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
              onClick={() => addToWishlist(product.id)}
              type="button"
            >
              <Heart className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>
      <div className="space-y-2">
        <Link className="text-lg font-semibold text-slate-950 transition hover:text-blue-700" href={`/productos/${product.slug}`}>
          {product.name}
        </Link>
        <p className="text-sm text-slate-600">{product.shortDescription}</p>
      </div>
      <div className="mt-auto space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xl font-semibold text-slate-950">{formatCurrency(product.price)}</p>
            <p className="text-sm text-slate-400 line-through">{formatCurrency(product.listPrice)}</p>
          </div>
          <span className="text-xs text-slate-500">{product.delivery}</span>
        </div>
        <div className="flex gap-2">
          <Button className="flex-1" onClick={() => cartStore.addItem(product)} type="button">
            Agregar
          </Button>
          <Link
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            href={`/productos/${product.slug}`}
          >
            Ver
          </Link>
        </div>
      </div>
    </Card>
  );
}
