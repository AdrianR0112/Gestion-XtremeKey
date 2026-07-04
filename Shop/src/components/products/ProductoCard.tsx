"use client";

import Link from "next/link";
import { Heart, Package } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/formatters";
import { resolveMediaUrl } from "@/lib/media";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";
import { cartStore } from "@/store/cart.store";
import type { Producto } from "@/modules/products/products.backend.types";
import type { Variante } from "@/modules/variants/variants.types";

type ProductoCardProps = {
  producto: Producto;
  variantes?: Variante[];
};

export function ProductoCard({ producto, variantes = [] }: ProductoCardProps) {
  const { isAuthenticated } = useAuth();
  const { add: addToWishlist } = useWishlist();

  const minVariante = variantes
    .filter((v) => v.Est_Var !== "inactivo")
    .reduce<Variante | null>((acc, v) => (acc === null || Number(v.Pre_Ven_Var) < Number(acc.Pre_Ven_Var) ? v : acc), null);

  const imageUrl = resolveMediaUrl(producto.Ima_Prd);
  const price = minVariante ? Number(minVariante.Pre_Ven_Var) : null;
  const listPrice = minVariante ? Number(minVariante.Pre_Cos_Var) : null;
  const discount = price !== null && listPrice !== null && listPrice > price
    ? Math.round(((listPrice - price) / listPrice) * 100)
    : 0;

  return (
    <Card className="group flex h-full flex-col gap-4 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative overflow-hidden rounded-2xl bg-slate-100">
        <div className="aspect-video w-full">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={producto.Nom_Prd}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
              src={imageUrl}
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-slate-400">
              <Package className="h-10 w-10" />
            </div>
          )}
        </div>
        {producto.Est_Prd === "agotado" ? (
          <span className="absolute left-3 top-3 rounded-full bg-rose-500/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
            Agotado
          </span>
        ) : null}
        {discount > 0 ? (
          <span className="absolute right-3 top-3 rounded-full bg-emerald-500/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
            -{discount}%
          </span>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-3">
        {producto.Tip_Prd ? <Badge label={producto.Tip_Prd} /> : <span />}
        {isAuthenticated ? (
          <button
            aria-label="Agregar a lista de deseos"
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
            onClick={() => addToWishlist(producto.Id_Prd)}
            type="button"
          >
            <Heart className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className="space-y-1">
        <Link className="text-lg font-semibold text-slate-950 transition hover:text-blue-700" href={`/productos/${producto.Id_Prd}`}>
          {producto.Nom_Prd}
        </Link>
        {producto.Des_Cor_Prd ? <p className="text-sm text-slate-600">{producto.Des_Cor_Prd}</p> : null}
      </div>

      <div className="mt-auto space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            {price !== null ? (
              <>
                <p className="text-xl font-semibold text-slate-950">{formatCurrency(price)}</p>
                {listPrice !== null && listPrice > price ? (
                  <p className="text-sm text-slate-400 line-through">{formatCurrency(listPrice)}</p>
                ) : null}
              </>
            ) : (
              <p className="text-sm text-slate-500">Consultar precio</p>
            )}
          </div>
          {variantes.length > 1 ? (
            <span className="text-xs text-slate-500">{variantes.length} variantes</span>
          ) : null}
        </div>
        <div className="flex gap-2">
          <Button
            className="flex-1"
            disabled={producto.Est_Prd === "agotado" || price === null}
            onClick={() =>
              price !== null &&
              cartStore.addItem({
                id: producto.Id_Prd,
                slug: producto.Id_Prd,
                name: producto.Nom_Prd,
                price,
              })
            }
            type="button"
          >
            Agregar
          </Button>
          <Link
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            href={`/productos/${producto.Id_Prd}`}
          >
            Ver
          </Link>
        </div>
      </div>
    </Card>
  );
}
