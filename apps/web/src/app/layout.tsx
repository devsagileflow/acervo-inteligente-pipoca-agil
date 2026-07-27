import type { Metadata } from "next";
import { Geist, Geist_Mono, Sora } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { PageViewTracker } from "./page-view-tracker";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sora",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Acervo Inteligente - Pipoca Ágil",
  description: "Acervo inteligente para a comunidade da Pipoca Ágil",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
