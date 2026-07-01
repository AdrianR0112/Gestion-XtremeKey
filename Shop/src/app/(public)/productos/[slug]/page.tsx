import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductGallery } from "@/components/products/ProductGallery";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/formatters";
import { productsApi } from "@/modules/products/products.api";

type ProductDetailPageProps = {
  params: {
    slug: string;
  };
};

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = productsApi.getBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="page-shell grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-medium text-cyan-700">{product.categoryName}</p>
          <h1 className="section-title text-4xl font-semibold text-slate-950">{product.name}</h1>
          <p className="text-base text-slate-600">{product.description}</p>
        </div>
        <ProductGallery product={product} />
        <Card className="space-y-3">
          <h2 className="section-title text-2xl font-semibold text-slate-950">Incluye</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            {product.features.map((feature) => (
              <li key={feature}>• {feature}</li>
            ))}
          </ul>
        </Card>
      </div>
      <Card className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
        <div>
          <p className="text-3xl font-semibold text-slate-950">{formatCurrency(product.price)}</p>
          <p className="text-sm text-slate-400 line-through">{formatCurrency(product.listPrice)}</p>
        </div>
        <div className="space-y-2 text-sm text-slate-600">
          <p>{product.delivery}</p>
          <p>{product.licenseType}</p>
        </div>
        <Link className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800" href="/carrito">
          Revisar carrito
        </Link>
      </Card>
    </div>
  );
}
