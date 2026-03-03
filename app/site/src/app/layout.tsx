import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import type { Metadata } from "next";
import ClientLayout from "./client-layout";

export const metadata: Metadata = {
  title: "Lux Financial",
  description: "The complete financial platform. Fiat, crypto, stablecoins, digital securities. CEX, DEX, AMM. 200+ countries.",
  openGraph: {
    title: "Lux Financial | Make payments seamlessly, without complexity and at lower costs.",
    description: "The complete financial platform. Fiat, crypto, stablecoins, digital securities. CEX, DEX, AMM. 200+ countries.",
    url: "https://lux.financial/",
    type: "website",
  },
  robots: "index, follow",
  icons: {
    icon: { url: "/favicon.svg", type: "image/svg+xml" },
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en_GB" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <ClientLayout>{children}</ClientLayout>
    </html>
  );
}
