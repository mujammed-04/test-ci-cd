import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { products } from "@/data/products";

export default async function ProductsPage({
  params,
}: PageProps<"/[locale]/products">) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations("ProductsPage");

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-1 flex-col gap-8 bg-white px-16 py-24 dark:bg-black">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
            {t("title")}
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            {t("count", { count: products.length })}
          </p>
        </div>

        <ul className="flex flex-col divide-y divide-black/[.08] dark:divide-white/[.145]">
          {products.map((product) => (
            <li key={product.slug}>
              <Link
                href={`/products/${product.slug}`}
                className="flex flex-col gap-1 py-4 transition-colors hover:bg-black/[.03] dark:hover:bg-white/[.04]"
              >
                <span className="font-medium text-black dark:text-zinc-50">
                  {product.name[locale]}
                </span>
                <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                  {product.sku}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
