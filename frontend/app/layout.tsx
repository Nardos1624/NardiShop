import type { Metadata } from "next";
import localFont from "next/font/local";

const montserrat = localFont({
  src: [
    {
      path: "../public/fonts/Montserrat-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-sans",
});

import "./globals.css";
import { CartProvider } from "@/hooks/use-cart";
import SocialLinksBar from "@/components/social-links-bar";
import AnnouncementBar from "@/components/announcement-bar";

export const metadata: Metadata = {
  title: {
    default: "NardiShop", 
    template: "%s | NardiShop"
  },
  description: "Discover stylish products.",
  icons: {
    icon: "  /placeholder/icon.png", 
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
      <body className={`${montserrat.variable} antialiased bg-white text-[#281E18]`}>
        <CartProvider>
          <AnnouncementBar />
          {children}
          <SocialLinksBar />
        </CartProvider>
      </body>
    </html>
  );
}