import { Card } from "@/components/ui/Card";
import type { Product } from "@/types/product";

type ProductGalleryProps = {
  product: Product;
};

export function ProductGallery({ product }: ProductGalleryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {product.images.map((image, index) => (
        <Card className="min-h-56 bg-slate-50" key={`${product.id}-${index}`}>
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-cyan-50 p-6 text-center text-sm text-slate-500">
            {image.alt}
          </div>
        </Card>
      ))}
    </div>
  );
}
