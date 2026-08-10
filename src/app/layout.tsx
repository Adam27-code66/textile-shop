import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'AREA 51 ARCHIVES | Premium Streetwear',
  description:
    'Premium streetwear designed for those who refuse to blend in. Limited drops, unlimited expression. Shop oversized tees, hoodies, shirts, pants, and accessories.',
  keywords: ['streetwear', 'fashion', 'clothing', 'premium', 'area 51', 'archives', 'urban'],
  openGraph: {
    title: 'AREA 51 ARCHIVES | Premium Streetwear',
    description: 'Premium streetwear designed for those who refuse to blend in.',
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
        <CartProvider>
          <WishlistProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
