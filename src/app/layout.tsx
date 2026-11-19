import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Presentasi Hub — Galeri Deck & Dokumentasi HTML",
  description:
    "Portal modern untuk menampilkan, meninjau, dan membagikan presentasi HTML interaktif dengan tampilan kartu yang elegan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} ${jetbrains.variable} min-h-screen bg-zinc-50 text-zinc-900 antialiased transition-colors duration-300 dark:bg-[#09090b] dark:text-zinc-100`}
      >
        {children}
      </body>
    </html>
  );
}
