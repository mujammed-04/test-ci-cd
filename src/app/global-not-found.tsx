import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NotFoundMessage from "@/components/not-found-message";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "404 – Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <NotFoundMessage
          title="404 – Page Not Found"
          description="The page you are looking for does not exist."
        />
      </body>
    </html>
  );
}
