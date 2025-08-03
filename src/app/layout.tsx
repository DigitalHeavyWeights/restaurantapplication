import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './test.css';
import { MobileNav } from './components/layout/MobileNav';
import { Sidebar } from './components/layout/Sidebar';
import { CartSummary } from './components/order/CartSummary';
import { AuthInitializer } from './components/auth/AuthInitializer'
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/layout/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Restaurant Ordering System',
  description: 'Mobile-first restaurant ordering and management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthInitializer>
          <div className="min-h-screen bg-neutral-50">
            <Navbar />
            {children}
            <MobileNav />
            <Sidebar />
            <CartSummary />
            <Toaster position="top-center" />
          </div>
        </AuthInitializer>
      </body>
    </html>
  );
}