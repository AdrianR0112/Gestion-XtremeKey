"use client";

import { Star } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { formatDate } from "@/lib/formatters";
import { useReviews } from "@/hooks/useReviews";

function Rating({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-3.5 w-3.5 ${n <= value ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
        />
      ))}
    </span>
  );
}

export default function ReviewsPage() {
  const { reviews, loading, error, remove } = useReviews();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Cuenta"
        title="Mis reseñas"
        description="Opiniones que has publicado sobre productos y servicios."
      />

      {error ? (
        <Card className="border-rose-200 bg-rose-50/60 text-sm text-rose-700">
          No pudimos cargar tus reseñas. {error}
        </Card>
      ) : null}

      {loading ? (
        <Card className="text-sm text-slate-500">Cargando...</Card>
      ) : reviews.length === 0 ? (
        <EmptyState
          icon={<Star className="h-5 w-5" />}
          title="Aún no has escrito reseñas"
          description="Comparte tu experiencia después de una compra para ayudar a otros clientes."
        />
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <Card key={r.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Rating value={r.calificacion} />
                  <p className="text-sm font-medium text-slate-950">{r.productoId}</p>
                </div>
                <span className="text-xs text-slate-500">{formatDate(r.createdAt)}</span>
              </div>
              {r.comentario ? <p className="text-sm text-slate-600">{r.comentario}</p> : null}
              <div className="pt-2">
                <Button onClick={() => remove(r.id)} type="button" variant="ghost">
                  Eliminar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
