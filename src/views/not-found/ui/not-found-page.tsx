import { useTranslations } from "next-intl";
import { NotFoundMessage } from "@/shared/ui";

export function NotFoundPage() {
  const t = useTranslations("NotFound");

  return <NotFoundMessage title={t("title")} description={t("description")} />;
}
