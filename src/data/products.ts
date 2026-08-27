import type { Locale } from "next-intl";
import productsJson from "./products.json";

export type Product = {
  slug: string;
  sku: string;
  price: number;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
};

export const products = productsJson as Product[];

const bySlug = new Map(products.map((product) => [product.slug, product]));

export function getProduct(slug: string): Product | undefined {
  return bySlug.get(slug);
}
