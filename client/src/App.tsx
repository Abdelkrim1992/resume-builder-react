import { Switch, Route } from "wouter";
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

function Router() {
  return (
    <>
      <Navbar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/resume-builder" component={ResumeBuilder} />
        <Route path="/resume-score" component={ResumeScore} />
        <Route path="/cover-letter" component={CoverLetter} />
        <Route path="/resume-jd-match" component={ResumeJdMatch} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={SignUp} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
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
