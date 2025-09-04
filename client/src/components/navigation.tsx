import { Link, useLocation } from "wouter";
import { useTheme } from "./theme-provider";
import { useAuth } from "@/hooks/useAuth";
import { GraduationCap, Sun, Moon } from "lucide-react";

export function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/quiz", label: "Assessment" },
    { href: "/colleges", label: "Colleges" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glassmorphism backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2" data-testid="link-logo">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              EduPath
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors ${
                  location === item.href
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid={`link-${item.label.toLowerCase()}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-card hover:bg-muted transition-colors"
              data-testid="button-toggle-theme"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
            
            {user && (
              <div className="flex items-center space-x-2 bg-card px-3 py-2 rounded-lg" data-testid="nav-user-info">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground text-sm font-medium">
                    {user.firstName?.charAt(0) || user.email?.charAt(0) || "U"}
                  </span>
                </div>
                <span className="text-sm font-medium">
                  {user.firstName || user.email?.split("@")[0] || "User"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
