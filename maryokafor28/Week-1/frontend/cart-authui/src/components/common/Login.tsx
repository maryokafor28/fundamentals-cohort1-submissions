"use client";

import { useState } from "react";
import { authService } from "@/components/api/authservices";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import AuthImage from "@/components/widgets/AuthImage";
import type { LoginData } from "@/components/types/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState<LoginData>({ identifier: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting login:", form);

    setMessage("");

    try {
      const response = await authService.login(form);
      // Expected: { token: "...", user: { _id, email, name } }

      if (response.token && response.user) {
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("user", JSON.stringify(response.user)); // <-- Save user

        setMessage("Successfully logged in!");
        router.push("/cart");
      } else {
        setMessage("Login failed - no token or user received");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        setMessage(err.message);
      } else {
        console.error(err);
        setMessage("Login failed");
      }
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
          <h2 className="text-2xl font-semibold">Login</h2>
          <p className="mb-6">Enter your details below</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name/Email</Label>
              <Input
                id="identifier"
                type="text"
                name="identifier"
                placeholder="Enter email or username"
                value={form.identifier}
                onChange={handleChange}
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
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Login
            </Button>
            {message && (
              <p
                className={`text-sm ${
                  message.includes("Successfully") ||
                  message.includes("successful")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
