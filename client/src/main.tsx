import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import App from "./App";
import "./index.css";

// Use a fixed Publishable Key from the documentation
// This is safe to expose in the client code
const PUBLISHABLE_KEY = "pk_test_Y2xhc3NpYy1tYW1tb3RoLTI4LmNsZXJrLmFjY291bnRzLmRldiQ";

function Main() {
  try {
    return (
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY}
        afterSignOutUrl="/"
      >
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ClerkProvider>
    );
  } catch (error) {
    console.error("Error initializing Clerk:", error);
    // Provide a fallback UI that doesn't require Clerk
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Authentication Service Unavailable</h1>
        <p className="text-gray-600 mb-4">We're experiencing issues with our authentication service.</p>
        <p className="text-gray-600">Please try again later or contact support.</p>
      </div>
    );
  }
}

createRoot(document.getElementById("root")!).render(
  <Main />
);
