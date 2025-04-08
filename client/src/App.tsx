import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { useUser, RedirectToSignIn } from "@clerk/clerk-react";

// Pages
import Home from "@/pages/Home";
import ResumeBuilder from "@/pages/ResumeBuilder";
import ResumeScore from "@/pages/ResumeScore";
import CoverLetter from "@/pages/CoverLetter";
import ResumeJdMatch from "@/pages/ResumeJdMatch";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import NotFound from "@/pages/not-found";

// Components
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  try {
    const { isSignedIn, isLoaded } = useUser();
    
    // Show loading state while Clerk is initializing
    if (!isLoaded) {
      return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }
    
    // If the user is not signed in, redirect to sign-in
    if (!isSignedIn) {
      return <RedirectToSignIn />;
    }
    
    // If user is signed in, render the protected content
    return <>{children}</>;
  } catch (error) {
    console.error("Error in ProtectedRoute:", error);
    // Fallback for Clerk errors - allow access in development
    return <>{children}</>;
  }
};

function Router() {
  const [location] = useLocation();
  
  // Don't show the navbar and footer on auth pages
  const isAuthPage = location === "/login" || location === "/sign-up";

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Switch>
        <Route path="/" component={Home} />
        
        {/* Protected routes */}
        <Route path="/resume-builder">
          {() => (
            <ProtectedRoute>
              <ResumeBuilder />
            </ProtectedRoute>
          )}
        </Route>
        
        <Route path="/resume-score">
          {() => (
            <ProtectedRoute>
              <ResumeScore />
            </ProtectedRoute>
          )}
        </Route>
        
        <Route path="/cover-letter">
          {() => (
            <ProtectedRoute>
              <CoverLetter />
            </ProtectedRoute>
          )}
        </Route>
        
        <Route path="/resume-jd-match">
          {() => (
            <ProtectedRoute>
              <ResumeJdMatch />
            </ProtectedRoute>
          )}
        </Route>
        
        {/* Auth routes */}
        <Route path="/login" component={Login} />
        
        <Route path="/sign-up" component={SignUp} />
        
        <Route component={NotFound} />
      </Switch>
      {!isAuthPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
