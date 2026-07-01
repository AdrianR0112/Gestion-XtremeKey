import { notFound } from "next/navigation";

import { ProductGrid } from "@/components/products/ProductGrid";
import { productsApi } from "@/modules/products/products.api";
import { isValidCategorySlug } from "@/modules/products/products.validators";

type CategoryPageProps = {
  params: {
    slug: string;
  };
};

export default function CategoryPage({ params }: CategoryPageProps) {
  if (!isValidCategorySlug(params.slug)) {
    notFound();
  }

  const categories = productsApi.listCategories();
  const category = categories.find((item) => item.slug === params.slug);
  const products = productsApi.list(params.slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="page-shell space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-medium text-cyan-700">Categoria</p>
        <h1 className="section-title text-4xl font-semibold text-slate-950">{category.name}</h1>
        <p className="text-sm text-slate-600">{category.description}</p>
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
