export type ProductCategory = {
  slug: string;
  name: string;
  description: string;
};

export type ProductImage = {
  src: string;
  alt: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  listPrice: number;
  categorySlug: string;
  categoryName: string;
  featured: boolean;
  delivery: string;
  licenseType: string;
  images: ProductImage[];
  features: string[];
};
