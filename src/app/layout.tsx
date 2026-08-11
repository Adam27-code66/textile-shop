import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { AuthProvider } from '@/context/AuthContext';
import { ProductProvider } from '@/context/ProductContext';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'AREA 51 ARCHIVES | Premium Textile & Apparel',
  description:
    'Premium apparel designed for those who refuse to blend in. Shop oversized tees, shirts, hoodies, dresses, and fine textiles.',
  keywords: ['textiles', 'apparel', 'streetwear', 'fashion', 'area 51', 'archives'],
  openGraph: {
    title: 'AREA 51 ARCHIVES | Premium Textile & Apparel',
    description: 'Premium apparel and textiles designed for those who refuse to blend in.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <body className="min-h-screen bg-[#08090C] text-white antialiased">
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <WishlistProvider>
                <Navbar />
                <main>{children}</main>
                <Footer />
              </WishlistProvider>
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
