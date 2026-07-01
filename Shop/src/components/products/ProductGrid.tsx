import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/types/product";

type ProductGridProps = {
  products: Product[];
};

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return <p className="rounded-3xl border border-dashed border-slate-300 p-8 text-sm text-slate-500">No encontramos productos para este filtro.</p>;
  }

  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
}
