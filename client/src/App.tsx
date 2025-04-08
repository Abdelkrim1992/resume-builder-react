import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
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

// Placeholder for protected route
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Later this will check for authentication
  // For now, it just redirects to sign-up
  const [, setLocation] = useLocation();
  setLocation("/sign-up");
  return null;
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
