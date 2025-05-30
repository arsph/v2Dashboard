import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { TransactionsProvider } from '@/context/TransactionsContext';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedLayout from '@/components/layout/ProtectedLayout';
import ClientLayout from '@/components/layout/ClientLayout';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'V2 Dashboard',
  description: 'A modern dashboard for managing sales and expenses',
  icons: {
    icon: '/img/logo.png',
    shortcut: '/img/logo.png',
    apple: '/img/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <ProtectedLayout>
            <TransactionsProvider>
              <SidebarProvider defaultOpen={true}>
                <ClientLayout>
                  <AppSidebar />
                  <SidebarInset>
                    {children}
                  </SidebarInset>
                  <Toaster />
                </ClientLayout>
              </SidebarProvider>
            </TransactionsProvider>
          </ProtectedLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
