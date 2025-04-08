import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

// Import the auth state handler from a proper location
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

const SignUp = () => {
  const [_, navigate] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, isSignedIn } = useAuthState();

  // If already signed in, redirect to home
  useEffect(() => {
    if (isSignedIn) {
      navigate("/");
    }
  }, [isSignedIn, navigate]);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password length
    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      });
      return;
    }
    
    // Create a user object and save to localStorage
    const userData = {
      name,
      email,
      imageUrl: null // No image for now
    };
    
    signIn(userData);
    
    toast({
      title: "Account created!",
      description: "Welcome to CAREERX.AI!",
    });
    
    // Redirect to the home page
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center">
            <span className="font-bold text-xl">
              CAREERX<span className="text-primary">.AI</span>
            </span>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold">Create your account</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Or{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <Card className="p-6">
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters long
              </p>
            </div>
            
            <Button type="submit" className="w-full mt-4">
              Create Account
            </Button>
          </form>
          
          <div className="mt-4 pt-4 border-t border-border">
            <Button variant="outline" className="w-full" onClick={() => navigate("/")}>
              Continue as Guest
            </Button>
          </div>
        </Card>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            By signing up, you agree to our{" "}
            <Link href="#" className="font-medium text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="font-medium text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;