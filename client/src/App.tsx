import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";

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

// Mock authentication state
const useAuthState = () => {
  // Check localStorage to see if we have a temp user
  const storedUser = localStorage.getItem('tempUser');
  const [isSignedIn, setIsSignedIn] = useState(!!storedUser);
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);

  // Setup effect to listen for storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const user = localStorage.getItem('tempUser');
      setIsSignedIn(!!user);
      setUser(user ? JSON.parse(user) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { isSignedIn, user };
};

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn } = useAuthState();
  const [_, navigate] = useLocation();

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login");
    }
  }, [isSignedIn, navigate]);

  // If signed in, render the children
  if (isSignedIn) {
    return <>{children}</>;
  }

  // Otherwise show loading state - redirect will happen in effect
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
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
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;
