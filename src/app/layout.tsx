import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { Header } from '@/components/layout/header';
import { MobileNav } from '@/components/mobile-nav';
import { Toaster } from 'sonner';
import { ErrorBoundary } from '@/components/ui/error-boundary';

export const metadata: Metadata = {
  title: 'PAWS Agadir | Dog Rescue & Adoption',
  description:
    'Community platform for rescuing stray dogs in Agadir-Taghazout, Morocco. Report dogs in need, track vaccinations, and connect with local helpers.',
  keywords: ['dog rescue', 'Agadir', 'Morocco', 'animal welfare', 'adoption', 'stray dogs'],
  authors: [{ name: 'PAWS Agadir' }],
  openGraph: {
    title: 'PAWS Agadir - Dog Rescue & Protection',
    description: 'Protecting stray dogs in Agadir & Taghazout, Morocco',
    type: 'website',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PAWS Agadir',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#2563eb',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-sans">
        <ErrorBoundary>
          <Providers>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1 pb-16 md:pb-0">{children}</main>
              <MobileNav />
            </div>
            <Toaster position="top-center" richColors />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
