import type { ReactNode } from "react";
import { geistMono, geistSans } from "../styles/fonts";
import "../styles/globals.css";

type Props = {
  lang: string;
  children: ReactNode;
};

// The <html>/<body> pair every route renders. Base styles live in
// globals.css; only the font variables need to be attached here.
export function RootDocument({ lang, children }: Props) {
  return (
    <html lang={lang} className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
