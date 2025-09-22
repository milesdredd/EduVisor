
"use client";

import { useResultsStore } from '@/hooks/use-results-store';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/header';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useResultsStore();
    const router = useRouter();
    const pathname = usePathname();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const isLoginPage = pathname === '/login';

    useEffect(() => {
        const checkAuth = () => {
            const authenticated = useResultsStore.getState().isAuthenticated;
            if (!authenticated && !isLoginPage) {
                router.replace('/login');
            } else {
                setIsCheckingAuth(false);
            }
        };

        checkAuth();
    }, [pathname, router, isLoginPage]);

    if (isCheckingAuth && !isLoginPage) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    return (
        <div className="min-h-screen flex flex-col">
            {!isLoginPage && <Header />}
            <main className="flex-grow">{children}</main>
        </div>
    );
}
