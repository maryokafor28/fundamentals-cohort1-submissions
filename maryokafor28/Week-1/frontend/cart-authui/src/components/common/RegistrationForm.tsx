"use client";

import { useState } from "react";
import { authService } from "@/components/api/authservices";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import AuthImage from "@/components/widgets/AuthImage";
import { useRouter } from "next/navigation";

export default function RegistrationForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(""); // Clear previous messages

    try {
      const response = await authService.register(form);
      console.log("Registration response:", response);

      // Check if registration failed
      if (response.error) {
        setMessage(response.error);
        setIsLoading(false);
        return; // Don't redirect on error
      }

      // Registration successful
      setMessage(response.message || "Registration successful!");

      // Wait a moment to show success message, then redirect
      setTimeout(() => {
        router.push("/login");
      }, 2000); // 2 second delay to show success message
    } catch (err: unknown) {
      console.error("Registration error:", err);

      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage("Something went wrong during registration!");
      }

      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left: Image */}
      <div className="hidden md:flex items-center justify-center">
        <AuthImage />
      </div>

      {/* Right: Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold">Create an account</h2>
          <p className="mb-6">Enter your details below</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                disabled={isLoading}
                required
                minLength={4}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>

            {message && (
              <p
                className={`text-sm ${
                  message.includes("successful") ||
                  message.includes("Registration successful")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
          </form>

          <Button variant={"link"} className="w-full" disabled={isLoading}>
            <p>
              Already have an account?{" "}
              <a href="/login" className="underline">
                Log in
              </a>
            </p>
          </Button>
        </div>
      </div>
    </div>
  );
}
