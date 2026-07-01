"use client";

import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/formatters";

export function CartSummary() {
  const { itemCount, subtotal } = useCart();

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>Productos</span>
        <span>{itemCount}</span>
      </div>
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>Entrega</span>
        <span>Digital</span>
      </div>
      <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-base font-semibold text-slate-950">
        <span>Total</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
      <Link
        aria-disabled={itemCount === 0}
        className={`inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition ${
          itemCount === 0 ? "pointer-events-none bg-slate-200 text-slate-500" : "bg-slate-950 text-white hover:bg-slate-800"
        }`}
        href="/checkout"
      >
        Ir al checkout
      </Link>
    </Card>
  );
}
