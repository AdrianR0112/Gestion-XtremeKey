import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductGrid } from "@/components/products/ProductGrid";
import { productsApi } from "@/modules/products/products.api";

type ProductsPageProps = {
  searchParams?: {
    categoria?: string;
    q?: string;
  };
};

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  const category = searchParams?.categoria;
  const query = searchParams?.q;
  const products = productsApi.list(category, query);
  const categories = productsApi.listCategories();

  return (
    <div className="page-shell space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-medium text-cyan-700">Catalogo</p>
        <h1 className="section-title text-4xl font-semibold text-slate-950">Productos</h1>
        <p className="text-sm text-slate-600">Filtra por categoria y navega productos con detalle, carrito y checkout conectados.</p>
      </div>
      <ProductFilters activeCategory={category} categories={categories} />
      <ProductGrid products={products} />
    </div>
  );
}
