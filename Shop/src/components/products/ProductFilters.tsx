import Link from "next/link";

import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/types/product";

type ProductFiltersProps = {
  categories: ProductCategory[];
  activeCategory?: string;
};

export function ProductFilters({ categories, activeCategory }: ProductFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link className={cn("rounded-full px-4 py-2 text-sm transition", !activeCategory ? "bg-slate-950 text-white" : "bg-white text-slate-600 hover:bg-slate-100")} href="/productos">
        Todos
      </Link>
      {categories.map((category) => (
        <Link className={cn("rounded-full px-4 py-2 text-sm transition", activeCategory === category.slug ? "bg-slate-950 text-white" : "bg-white text-slate-600 hover:bg-slate-100")} href={`/productos?categoria=${category.slug}`} key={category.slug}>
          {category.name}
        </Link>
      ))}
    </div>
  );
}
