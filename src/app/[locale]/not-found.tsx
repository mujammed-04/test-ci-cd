import { useTranslations } from "next-intl";
import NotFoundMessage from "@/components/not-found-message";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return <NotFoundMessage title={t("title")} description={t("description")} />;
}
