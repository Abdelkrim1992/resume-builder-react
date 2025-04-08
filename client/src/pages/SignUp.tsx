import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { SignUp as ClerkSignUp } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SignUp = () => {
  const [_, navigate] = useLocation();
  // We'll use a simple dark mode detection for now
  const isDarkMode = false;
  const [clerkError, setClerkError] = useState(false);

  useEffect(() => {
    // Check if Clerk is available
    const timer = setTimeout(() => {
      try {
        // Check if Clerk component is available by looking for its elements
        if (!document.querySelector('[data-clerk-frontend-api]')) {
          setClerkError(true);
        }
      } catch (error) {
        console.error("Error checking Clerk availability:", error);
        setClerkError(true);
      }
    }, 2000); // Wait a bit to see if Clerk initializes

    return () => clearTimeout(timer);
  }, []);

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
          {clerkError ? (
            <div className="text-center py-8">
              <p className="text-destructive mb-4">
                Our authentication service is temporarily unavailable.
              </p>
              <Button onClick={() => navigate("/")} className="w-full">
                Return to Home
              </Button>
            </div>
          ) : (
            <ClerkSignUp 
              signInUrl="/login"
              redirectUrl="/"
              appearance={{
                baseTheme: isDarkMode ? dark : undefined,
                elements: {
                  formButtonPrimary: 
                    "bg-primary hover:bg-primary/90 text-primary-foreground",
                  formFieldInput:
                    "border-input bg-background text-foreground",
                  card: "bg-transparent shadow-none",
                  footer: "hidden"
                }
              }}
            />
          )}
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