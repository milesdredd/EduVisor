
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, Book, BrainCircuit, User, LogOut, Menu } from 'lucide-react';
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
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button';

export function Header() {
  const { careerSuggestions, chosenCareer, user, logout: storeLogout, reset } = useResultsStore();
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const showDashboardLinks = isClient && (careerSuggestions || chosenCareer);

  const handleLogout = () => {
    storeLogout();
    reset();
    router.push('/login');
  }

  const navLinks = (
    <>
      <Link href="/quiz" legacyBehavior passHref>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
          Assessment
          </NavigationMenuLink>
      </Link>
      {showDashboardLinks && (
        <Link href="/dashboard" legacyBehavior passHref>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <LayoutDashboard className="mr-2" />
              Dashboard
          </NavigationMenuLink>
        </Link>
      )}
      <Link href="/colleges" legacyBehavior passHref>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
          Colleges
          </NavigationMenuLink>
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/icons/icon.png" alt="EduVisor Logo" width={30} height={30} />
            <span className="font-bold">EduVisor</span>
          </Link>
        </div>

        <div className="hidden md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/quiz" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Assessment
                      </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                {showDashboardLinks && (
                <>
                    <NavigationMenuItem>
                        <Link href="/dashboard" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                        </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </>
                )}
                <NavigationMenuItem>
                <Link href="/colleges" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Colleges
                    </NavigationMenuLink>
                </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
        </div>
        
        <div className="flex items-center justify-end space-x-2">
          <ThemeToggle />
          {isClient && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.username}`} alt={user?.username || 'User'} />
                    <AvatarFallback>{user?.username?.[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <div className="flex flex-col gap-4 py-8">
                       <SheetClose asChild>
                         <Link href="/quiz" className="flex items-center gap-2 text-lg font-medium">Assessment</Link>
                       </SheetClose>
                        {showDashboardLinks && (
                          <SheetClose asChild>
                            <Link href="/dashboard" className="flex items-center gap-2 text-lg font-medium">
                              <LayoutDashboard className="h-5 w-5" />
                              Dashboard
                            </Link>
                          </SheetClose>
                        )}
                       <SheetClose asChild>
                        <Link href="/colleges" className="flex items-center gap-2 text-lg font-medium">Colleges</Link>
                       </SheetClose>
                    </div>
                </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
