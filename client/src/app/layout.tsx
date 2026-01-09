import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider, AuthProvider, ToastProvider } from "@/providers";
import { CartDrawer } from "@/components/cart";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ECOMREST - Your Online Store",
    template: "%s | ECOMREST",
  },
  description:
    "Discover quality products at great prices. Shop the latest trends in fashion, electronics, home goods, and more.",
  keywords: ["ecommerce", "online store", "shopping", "products"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} font-sans antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            <ToastProvider>
              {children}
              <CartDrawer />
            </ToastProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
