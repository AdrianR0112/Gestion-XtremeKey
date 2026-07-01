"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/formatters";
import { cartStore } from "@/store/cart.store";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <Badge label={product.categoryName} />
        <span className="text-xs text-slate-500">{product.licenseType}</span>
      </div>
      <div className="space-y-2">
        <Link className="text-lg font-semibold text-slate-950 hover:text-cyan-700" href={`/productos/${product.slug}`}>
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
          <Link className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" href={`/productos/${product.slug}`}>
            Ver
          </Link>
        </div>
      </div>
    </Card>
  );
}
