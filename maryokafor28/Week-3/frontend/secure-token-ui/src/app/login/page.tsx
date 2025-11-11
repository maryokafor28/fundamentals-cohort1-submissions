// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Attempting login..."); // Debug
      await login(email, password);

      console.log("Login successful, redirecting..."); // Debug

      // ✅ Only redirect if login succeeded (no error thrown)
      router.push("/task");
    } catch (err) {
      console.error("Login failed:", err); // Debug

      // ✅ Display error to user
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Debug: Log current user state
  console.log("Current user:", user);

  return (
    <div className="max-w-md mx-auto mt-8 p-6">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            placeholder="Email"
            required
            disabled={loading}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="Password"
            required
            disabled={loading}
            className={`w-full px-4 py-2 border rounded ${
              error ? "border-red-500" : ""
            }`}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* ✅ Display error */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <p className="mt-4 text-center text-gray-600">
        Don have an account?{" "}
        <Link href="/" className="text-blue-600 hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
}
