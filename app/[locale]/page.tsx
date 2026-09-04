import { setRequestLocale } from "next-intl/server";
import { HomePage } from "@/views/home";

export default async function Page({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return <HomePage />;
}
