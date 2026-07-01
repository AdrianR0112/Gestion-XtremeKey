"use client";

import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/formatters";
import type { CartLine } from "@/modules/cart/cart.types";

type CartItemProps = {
  item: CartLine;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
};

export function CartItem({ item, onDecrease, onIncrease, onRemove }: CartItemProps) {
  return (
    <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Link className="text-base font-semibold text-slate-950 hover:text-cyan-700" href={`/productos/${item.slug}`}>
          {item.name}
        </Link>
        <p className="text-sm text-slate-500">{formatCurrency(item.price)} por unidad</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-slate-200 px-2 py-1">
          <button className="h-8 w-8 rounded-full text-slate-700 hover:bg-slate-100" onClick={onDecrease} type="button">
            -
          </button>
          <span className="min-w-8 text-center text-sm font-medium">{item.quantity}</span>
          <button className="h-8 w-8 rounded-full text-slate-700 hover:bg-slate-100" onClick={onIncrease} type="button">
            +
          </button>
        </div>
        <p className="min-w-24 text-right text-sm font-semibold text-slate-950">{formatCurrency(item.price * item.quantity)}</p>
        <Button onClick={onRemove} type="button" variant="ghost">
          Quitar
        </Button>
      </div>
    </Card>
  );
}
