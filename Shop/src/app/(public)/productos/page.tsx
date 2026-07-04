"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Package, Search } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProductoCard } from "@/components/products/ProductoCard";
import { useProductos } from "@/hooks/useProductos";
import { useVariantes } from "@/hooks/useVariantes";
import type { Variante } from "@/modules/variants/variants.types";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [tipo, setTipo] = useState<string>("todos");

  const { productos, loading, error, refresh } = useProductos();
  const { variantes } = useVariantes();

  const variantesByProducto = useMemo(() => {
    const map = new Map<string, Variante[]>();
    for (const v of variantes) {
      const list = map.get(v.Id_Prd) ?? [];
      list.push(v);
      map.set(v.Id_Prd, list);
    }
    return map;
  }, [variantes]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return productos.filter((p) => {
      if (tipo !== "todos" && p.Tip_Prd !== tipo) return false;
      if (q) {
        const haystack = `${p.Nom_Prd} ${p.Des_Cor_Prd ?? ""} ${p.Des_Prd ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [productos, query, tipo]);

  const tipos: Array<{ id: string; label: string }> = [
    { id: "todos", label: "Todos" },
    { id: "producto", label: "Productos" },
    { id: "servicio", label: "Servicios" },
    { id: "suscripcion", label: "Suscripciones" },
  ];

  return (
    <div className="page-shell space-y-8">
      <PageHeader
        eyebrow="Catálogo"
        title="Productos"
        description="Explora el catálogo conectado al backend con variantes y precios en tiempo real."
        actions={
          <button className="secondary-button" onClick={() => refresh()} type="button">
            Actualizar
          </button>
        }
      />

      <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-10"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o descripción"
            value={query}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {tipos.map((t) => (
            <button
              className={`rounded-full px-4 py-2 text-sm transition ${
                tipo === t.id ? "bg-slate-950 text-white shadow-sm" : "bg-white/70 text-slate-600 hover:bg-white"
              }`}
              key={t.id}
              onClick={() => setTipo(t.id)}
              type="button"
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <Card className="border-rose-200 bg-rose-50/60 text-sm text-rose-700">
          No pudimos cargar los productos. {error}
        </Card>
      ) : null}

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-72 animate-pulse rounded-3xl border border-slate-200 bg-slate-100/70" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Package className="h-5 w-5" />}
          title="Sin resultados"
          description="Ajusta la búsqueda o los filtros para encontrar productos."
        />
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((producto) => (
            <ProductoCard
              key={producto.Id_Prd}
              producto={producto}
              variantes={variantesByProducto.get(producto.Id_Prd) ?? []}
            />
          ))}
        </section>
      )}
    </div>
  );
}
