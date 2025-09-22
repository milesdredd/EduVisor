
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { useResultsStore } from '@/hooks/use-results-store';
import { useEffect, useState } from 'react';

export function Header() {
  const { careerSuggestions } = useResultsStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image src="/icons/icon.png" alt="EduVisor Logo" width={30} height={30} />
            <span className="font-bold hidden sm:inline-block">EduVisor</span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/quiz">
                    Assessment
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {isClient && careerSuggestions && (
                 <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/dashboard">
                      <LayoutDashboard className="mr-2" />
                      Dashboard
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/colleges">
                    Colleges
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
               <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/profile">
                    Profile
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
