import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";

export function AppProviders({ children }: { children: ReactNode }) {
  return <NextIntlClientProvider>{children}</NextIntlClientProvider>;
}
