import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  User as UserIcon, 
  LogOut, 
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

// Mock user state
const useAuthState = () => {
  // Check localStorage to see if we have a temp user
  const storedUser = localStorage.getItem('tempUser');
  const [isSignedIn, setIsSignedIn] = useState(!!storedUser);
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);

  const signIn = (userData: any) => {
    localStorage.setItem('tempUser', JSON.stringify(userData));
    setUser(userData);
    setIsSignedIn(true);
  };

  const signOut = () => {
    localStorage.removeItem('tempUser');
    setUser(null);
    setIsSignedIn(false);
  };

  return { isSignedIn, user, signIn, signOut };
};

const Navbar = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Use our mock auth state 
  const { isSignedIn, user, signOut } = useAuthState();

  const navLinks = [
    { path: "/", label: "Resume", exact: true },
    { path: "/resume-score", label: "Resume Score" },
    { path: "/cover-letter", label: "Cover Letter" },
    { path: "/resume-jd-match", label: "Resume & JD Match" },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location === path;
    }
    return location.startsWith(path);
  };

  const handleSignOut = () => {
    signOut();
    // Navigate to home
    window.location.href = '/';
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.name) return "U";
    const nameparts = user.name.split(' ');
    if (nameparts.length >= 2) {
      return `${nameparts[0][0]}${nameparts[1][0]}`;
    }
    return nameparts[0][0] || "U";
  };

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div className="flex items-center">
                <span className="font-bold text-xl">
                  CAREERX<span className="text-primary">.AI</span>
                </span>
              </div>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`${
                    isActive(link.path, link.exact)
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isSignedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 text-base">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.imageUrl} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <span className="max-w-[100px] truncate">{user?.name || "User"}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem className="flex items-center space-x-2" disabled>
                    <UserIcon className="h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center space-x-2 text-destructive focus:text-destructive" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">
                    Login
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="ml-4">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`${
                  isActive(link.path, link.exact)
                    ? "bg-primary/10 border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:bg-accent hover:border-muted-foreground hover:text-foreground"
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-border">
            {isSignedIn ? (
              <div className="space-y-1">
                <div className="flex items-center px-4 py-2">
                  <div className="flex-shrink-0">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.imageUrl} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-foreground">{user?.name || "User"}</div>
                    <div className="text-sm font-medium text-muted-foreground">{user?.email}</div>
                  </div>
                </div>
                <Link href="#" className="block px-4 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent" onClick={() => setMobileMenuOpen(false)}>
                  Profile
                </Link>
                <button 
                  className="block w-full text-left px-4 py-2 text-base font-medium text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex items-center px-4 space-x-3">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
