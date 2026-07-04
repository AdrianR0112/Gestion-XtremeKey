"use client";

import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { formatDate } from "@/lib/formatters";
import { useWishlist } from "@/hooks/useWishlist";

export default function WishlistPage() {
  const { items, loading, error, refresh, removeById } = useWishlist();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Cuenta"
        title="Lista de deseos"
        description="Productos guardados para comprar más adelante."
        actions={
          <button className="secondary-button" onClick={() => refresh()} type="button">
            Actualizar
          </button>
        }
      />

      {error ? (
        <Card className="border-rose-200 bg-rose-50/60 text-sm text-rose-700">
          No pudimos cargar tu lista. {error}
        </Card>
      ) : null}

      {loading ? (
        <Card className="text-sm text-slate-500">Cargando...</Card>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Heart className="h-5 w-5" />}
          title="Aún no tienes productos guardados"
          description="Marca tus productos favoritos desde el catálogo para verlos aquí."
          action={
            <Link className="primary-button" href="/productos">
              Explorar catálogo
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <Card className="flex items-start justify-between gap-4" key={item.Id_Des}>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-slate-400">Producto</p>
                <Link
                  className="text-base font-medium text-slate-950 transition hover:text-blue-700"
                  href={`/productos/${item.Id_Prd}`}
                >
                  {item.Nom_Prd ?? `#${item.Id_Prd}`}
                </Link>
                {item.Fec_Crea_Des ? (
                  <p className="text-xs text-slate-500">Añadido {formatDate(item.Fec_Crea_Des)}</p>
                ) : null}
              </div>
              <Button
                aria-label="Quitar de lista de deseos"
                onClick={() => removeById(item.Id_Des)}
                type="button"
                variant="ghost"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
