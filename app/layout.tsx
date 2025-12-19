import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/hooks/use-cart";
const montserrat = Montserrat({ 
 
  weight: ["400"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "NardiShop", 
    template: "%s | NardiShop"
  },
  description: "Discover stylish products.",
  icons: {
    icon: "/placeholder/icon.png", 
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
      <body className={`${montserrat.className} antialiased bg-[#212121]`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}