
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
                <Link href="/quiz" passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Assessment
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              {isClient && careerSuggestions && (
                 <NavigationMenuItem>
                  <Link href="/dashboard" passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      <LayoutDashboard className="mr-2" />
                      Dashboard
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}
              <NavigationMenuItem>
                <Link href="/colleges" passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Colleges
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
               <NavigationMenuItem>
                <Link href="/profile" passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Profile
                  </NavigationMenuLink>
                </Link>
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
