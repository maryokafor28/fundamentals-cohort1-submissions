"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // ✅ Redirect logged-in users to projects
  useEffect(() => {
    if (!loading && user) {
      router.push("/projects");
    }
  }, [user, loading, router]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Welcome to DevConnect
        </h1>
        <p className="text-xl md:text-2xl text-gray-300">
          Share your projects, get feedback, and connect with Great Minds
        </p>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => router.push("/signup")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
          >
            Get Started
          </Button>
          <Button
            onClick={() => router.push("/login")}
            className="bg-white/10 hover:bg-white/20 text-white px-8 py-6 text-lg border border-white/20"
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}
