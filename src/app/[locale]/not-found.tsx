import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-zinc-50 px-6 text-center dark:bg-black">
      <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
        {t("title")}
      </h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-400">
        {t("description")}
      </p>
    </div>
  );
}
