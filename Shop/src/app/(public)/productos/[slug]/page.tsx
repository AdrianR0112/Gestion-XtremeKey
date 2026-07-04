"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Package, Star } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section, SectionHeader } from "@/components/ui/Section";
import { StatusPill } from "@/components/ui/StatusPill";
import { formatCurrency } from "@/lib/formatters";
import { resolveMediaUrl } from "@/lib/media";
import { useAuth } from "@/hooks/useAuth";
import { useReviews } from "@/hooks/useReviews";
import { useWishlist } from "@/hooks/useWishlist";
import { productosApi } from "@/modules/products/products.backend.api";
import { variantesApi } from "@/modules/variants/variants.api";
import type { Producto } from "@/modules/products/products.backend.types";
import type { Variante } from "@/modules/variants/variants.types";
import { cartStore } from "@/store/cart.store";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";
  const [producto, setProducto] = useState<Producto | null>(null);
  const [variantes, setVariantes] = useState<Variante[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  const { user, isAuthenticated } = useAuth();
  const { add: addWishlist } = useWishlist();
  const { reviews } = useReviews();
  const productoReviews = useMemo(
    () => reviews.filter((r) => r.productoId === slug),
    [reviews, slug],
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([productosApi.getById(slug), variantesApi.listByProducto(slug)])
      .then(([p, vs]) => {
        if (cancelled) return;
        setProducto(p);
        setVariantes(vs);
        setSelectedVariantId(vs[0]?.Id_Var ?? null);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "No pudimos cargar el producto");
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const selectedVariant = useMemo(
    () => variantes.find((v) => v.Id_Var === selectedVariantId) ?? null,
    [variantes, selectedVariantId],
  );

  const imageUrl = producto ? resolveMediaUrl(producto.Ima_Prd) : null;
  const price = selectedVariant ? Number(selectedVariant.Pre_Ven_Var) : null;
  const listPrice = selectedVariant ? Number(selectedVariant.Pre_Cos_Var) : null;

  const avgRating = productoReviews.length
    ? Math.round((productoReviews.reduce((acc, r) => acc + Number(r.calificacion), 0) / productoReviews.length) * 10) / 10
    : 0;

  if (loading) {
    return (
      <div className="page-shell">
        <div className="h-96 animate-pulse rounded-3xl bg-slate-100" />
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="page-shell">
        <Card className="border-rose-200 bg-rose-50/60 text-rose-700">
          {error ?? "Producto no encontrado."}{" "}
          <Link className="font-semibold underline" href="/productos">
            Volver al catálogo
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-shell grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <PageHeader
          eyebrow={producto.Tip_Prd ?? "Producto"}
          title={producto.Nom_Prd}
          description={producto.Des_Cor_Prd ?? undefined}
        />

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/70">
          <div className="aspect-video w-full bg-slate-100">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={producto.Nom_Prd}
                className="h-full w-full object-cover"
                onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
                src={imageUrl}
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-slate-400">
                <Package className="h-16 w-16" />
              </div>
            )}
          </div>
        </div>

        {producto.Des_Prd ? (
          <Card>
            <h2 className="mb-2 text-xl font-semibold text-slate-950">Descripción</h2>
            <p className="whitespace-pre-line text-base text-slate-600">{producto.Des_Prd}</p>
          </Card>
        ) : null}

        <ReviewsBlock
          avgRating={avgRating}
          canReview={isAuthenticated}
          reviews={productoReviews}
        />
      </div>

      <Card className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
        <div className="flex items-center gap-2">
          {producto.Est_Prd ? <StatusPill label={producto.Est_Prd} tone={producto.Est_Prd === "activo" ? "success" : producto.Est_Prd === "agotado" ? "danger" : "neutral"} /> : null}
          {avgRating > 0 ? (
            <span className="inline-flex items-center gap-1 text-sm text-amber-600">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {avgRating} ({productoReviews.length})
            </span>
          ) : null}
        </div>

        {variantes.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">Variantes</p>
            <div className="flex flex-wrap gap-2">
              {variantes.map((v) => (
                <button
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    selectedVariantId === v.Id_Var
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                  key={v.Id_Var}
                  onClick={() => setSelectedVariantId(v.Id_Var)}
                  type="button"
                >
                  {v.Nom_Var}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {price !== null ? (
          <div>
            <p className="text-3xl font-semibold text-slate-950">{formatCurrency(price)}</p>
            {listPrice !== null && listPrice > price ? (
              <p className="text-base text-slate-400 line-through">{formatCurrency(listPrice)}</p>
            ) : null}
          </div>
        ) : (
          <p className="text-base text-slate-500">Consultar precio</p>
        )}

        {selectedVariant?.Dur_Tip_Var && selectedVariant.Dur_Val_Var ? (
          <p className="text-sm text-slate-600">
            Duración: {selectedVariant.Dur_Val_Var} {selectedVariant.Dur_Tip_Var}
          </p>
        ) : null}

        <div className="flex flex-col gap-2">
          <Button
            className="w-full"
            disabled={producto.Est_Prd === "agotado" || price === null}
            onClick={() =>
              price !== null &&
              cartStore.addItem({
                id: producto.Id_Prd,
                slug: producto.Id_Prd,
                name: `${producto.Nom_Prd}${selectedVariant ? ` — ${selectedVariant.Nom_Var}` : ""}`,
                price,
              })
            }
            type="button"
          >
            Agregar al carrito
          </Button>
          {isAuthenticated && user ? (
            <Button
              className="w-full"
              onClick={() => addWishlist(producto.Id_Prd)}
              type="button"
              variant="ghost"
            >
              Guardar en deseos
            </Button>
          ) : null}
        </div>

        {producto.Cod_Prd ? <Badge label={`Cod ${producto.Cod_Prd}`} /> : null}
      </Card>
    </div>
  );
}

type ReviewsBlockProps = {
  reviews: Array<{ id: string; calificacion: number; comentario?: string | null; createdAt: string }>;
  avgRating: number;
  canReview: boolean;
};

function ReviewsBlock({ reviews, canReview }: ReviewsBlockProps) {
  return (
    <Section>
      <SectionHeader title="Reseñas" description={`${reviews.length} opiniones publicadas`} />
      {!canReview ? (
        <p className="mb-4 text-sm text-slate-500">
          <Link className="font-medium text-blue-700" href="/login">
            Inicia sesión
          </Link>{" "}
          para dejar una reseña desde tu panel.
        </p>
      ) : null}
      {reviews.length === 0 ? (
        <p className="text-sm text-slate-500">Aún no hay reseñas para este producto.</p>
      ) : (
        <ul className="space-y-3">
          {reviews.map((r) => (
            <li className="rounded-2xl border border-slate-200/70 bg-white/60 p-3" key={r.id}>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    className={`h-3.5 w-3.5 ${n <= Number(r.calificacion) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                    key={n}
                  />
                ))}
              </div>
              {r.comentario ? <p className="mt-1 text-sm text-slate-700">{r.comentario}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
