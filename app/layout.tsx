import type { Metadata } from "next";
import localFont from "next/font/local";

const montserrat = localFont({
  src: [
    {
      path: "../public/fonts/Montserrat-VariableFont_wght.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-sans",
});

import "./globals.css";
import { CartProvider } from "@/hooks/use-cart";

export const metadata: Metadata = {
  title: {
    default: "NardiShop", 
    template: "%s | NardiShop"
  },
  description: "Discover stylish products.",
  icons: {
    icon: "  /NardiShop/placeholder/icon.png", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 3. Add the font class to the body */}
      <body className={`${montserrat.variable} antialiased bg-[#212121]`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}