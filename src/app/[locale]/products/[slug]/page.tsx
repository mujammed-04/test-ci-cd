import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getProduct, products } from "@/data/products";

// Every product page is prerendered at build time; anything else is a 404.
export const dynamicParams = false;

// The parent `[locale]` segment runs this once per locale, so returning the
// slugs alone yields locales × products prerendered pages.
export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/products/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProduct(slug);

  if (!product || !hasLocale(routing.locales, locale)) {
    return {};
  }

  return {
    title: product.name[locale],
    description: product.description[locale],
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/[locale]/products/[slug]">) {
  const { locale, slug } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  const t = await getTranslations("ProductPage");
  const format = await getFormatter();

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-1 flex-col gap-8 bg-white px-16 py-24 dark:bg-black">
        <Link
          href="/products"
          className="text-sm font-medium text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          {t("backToList")}
        </Link>

        <div className="flex flex-col gap-4">
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
            {product.sku}
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
            {product.name[locale]}
          </h1>
          <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {product.description[locale]}
          </p>
        </div>

        <p className="text-2xl font-semibold text-black dark:text-zinc-50">
          {format.number(product.price, { style: "currency", currency: "USD" })}
        </p>
      </main>
    </div>
  );
}
