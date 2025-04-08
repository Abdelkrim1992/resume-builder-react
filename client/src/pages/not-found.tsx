import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            We couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
          </p>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
