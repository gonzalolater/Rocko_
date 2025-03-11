import { Toaster } from 'react-hot-toast';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/chips/Header/Header';
import LoanProvider from '@/context/loanContext/loanContext';
import AlertProvider from '@/context/alertContext/alertContext';
import Providers from './Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Rocko',
  description: 'Rocko - Crypto backed loans',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          <Toaster position="bottom-right" reverseOrder />
          <LoanProvider>
            <AlertProvider>{children}</AlertProvider>
          </LoanProvider>
        </Providers>
      </body>
    </html>
  );
}
