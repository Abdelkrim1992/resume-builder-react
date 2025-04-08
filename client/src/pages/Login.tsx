import { Link, useLocation } from "wouter";
import { SignIn } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { Card } from "@/components/ui/card";

const Login = () => {
  const [_, navigate] = useLocation();
  // We'll use a simple dark mode detection for now
  const isDarkMode = false;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center">
            <span className="font-bold text-xl">
              CAREERX<span className="text-primary">.AI</span>
            </span>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold">Sign in to your account</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Or{" "}
            <Link href="/sign-up" className="font-medium text-primary hover:underline">
              create a new account
            </Link>
          </p>
        </div>
        
        <Card className="p-6">
          <SignIn 
            signUpUrl="/sign-up"
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
        </Card>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            By signing in, you agree to our{" "}
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

export default Login;
