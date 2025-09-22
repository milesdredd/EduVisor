
"use client";

import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/layout/header';
import { Toaster } from '@/components/ui/toaster';
import { useResultsStore } from '@/hooks/use-results-store';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

// export const metadata: Metadata = {
//   title: 'EduVisor',
//   description: 'Find your career path and the education to get you there.',
// };


function AuthProvider({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useResultsStore();
    const router = useRouter();
    const pathname = usePathname();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            if (!isAuthenticated && pathname !== '/login') {
                router.replace('/login');
            } else {
                setIsCheckingAuth(false);
            }
        };

        // A small delay to allow the store to hydrate from localStorage
        const timer = setTimeout(checkAuth, 100);

        return () => clearTimeout(timer);
    }, [isAuthenticated, pathname, router]);

    if (isCheckingAuth && pathname !== '/login') {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    return <>{children}</>;
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>EduVisor</title>
        <meta name="description" content="Find your career path and the education to get you there." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400..800;1,400..800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              {!isLoginPage && <Header />}
              <main className="flex-grow">{children}</main>
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
