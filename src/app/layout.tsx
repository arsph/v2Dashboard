import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { TransactionsProvider } from '@/context/TransactionsContext';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedLayout from '@/components/layout/ProtectedLayout';

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

async function initDatabase() {
  try {
    console.log('Layout: Attempting to initialize database...');
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/init-db`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Layout: Database initialization failed:', errorData);
      throw new Error(errorData.details || 'Failed to initialize database');
    }
    
    const data = await response.json();
    console.log('Layout: Database initialization response:', data);
  } catch (error) {
    console.error('Layout: Error during database initialization:', error);
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await initDatabase();

  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <ProtectedLayout>
            <TransactionsProvider>
              <SidebarProvider defaultOpen={true}>
                <AppSidebar />
                <SidebarInset>
                  {children}
                </SidebarInset>
                <Toaster />
              </SidebarProvider>
            </TransactionsProvider>
          </ProtectedLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
