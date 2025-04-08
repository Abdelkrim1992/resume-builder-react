import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import App from "./App";
import "./index.css";

// Get Clerk publishable key from environment variables
// Using the known value directly since environment variables might not be loading correctly
const CLERK_PUBLISHABLE_KEY = "pk_test_Y2xhc3NpYy1tYW1tb3RoLTI4LmNsZXJrLmFjY291bnRzLmRldiQ";

// Debug: Log the key
console.log("Using Clerk Publishable Key:", CLERK_PUBLISHABLE_KEY);

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} afterSignOutUrl="/">
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </ClerkProvider>
);
