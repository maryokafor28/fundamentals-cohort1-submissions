"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await apiFetch("/api/auth/register", {
        method: "POST",
        body: formData,
      });

      setSuccess("Account created successfully! Please log in.");
      setFormData({ name: "", email: "", password: "" });
      router.push("/login");
    } catch (err: unknown) {
      // ✅ Extract the actual error message from backend
      const errorMessage =
        err instanceof Error ? err.message : "Registration failed";

      console.log("🔍 Error:", errorMessage); // DEBUG
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl p-8 text-white">
        <h1 className="text-center text-3xl font-bold mb-6">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="name"
            placeholder="name"
            value={formData.name}
            onChange={handleChange}
            className="bg-white/20 border-white/30 text-white placeholder:text-gray-200"
            required
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="bg-white/20 border-white/30 text-white placeholder:text-gray-200"
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="bg-white/20 border-white/30 text-white placeholder:text-gray-200"
            required
          />
          {error && <p className="text-red-300 text-sm">{error}</p>}
          {success && <p className="text-green-300 text-sm">{success}</p>}
          <Button
            type="submit"
            className="w-full bg-blue-800 hover:bg-blue-900 hover:scale-[1.02] transition-transform duration-150 text-white"
            disabled={loading}
          >
            {loading ? "Registering..." : "Sign Up"}
          </Button>
        </form>
        <p className="text-center text-sm mt-6 text-gray-200">
          Already have an account?{" "}
          <a href="/login" className="text-blue-300 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
