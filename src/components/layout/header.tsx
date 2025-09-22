"use client";

import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"


export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block">
              EduVisor
            </span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/quiz" passHref>
                  <NavigationMenuLink asChild>
                    <a className={navigationMenuTriggerStyle()}>Assessment</a>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/colleges" passHref>
                  <NavigationMenuLink asChild>
                    <a className={navigationMenuTriggerStyle()}>Colleges</a>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
               <NavigationMenuItem>
                <Link href="/profile" passHref>
                   <NavigationMenuLink asChild>
                    <a className={navigationMenuTriggerStyle()}>Profile</a>
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
