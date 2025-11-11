"use client";
import { useState } from "react";
import { registerUser } from "@/api/authApi";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user"); // ✅ Add role state
  const [error, setError] = useState("");

  // ✅ Password validation function
  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(pwd)) {
      return "Password must include at least one uppercase letter";
    }
    if (!/[a-z]/.test(pwd)) {
      return "Password must include at least one lowercase letter";
    }
    if (!/[0-9]/.test(pwd)) {
      return "Password must include at least one number";
    }
    return null; // Valid password
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // ✅ Validate password before sending
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return; // Stop here, don't send to backend
    }

    try {
      await registerUser({
        email,
        password,
        role, // ✅ Include selected role
      });

      router.push("/login");
    } catch (err) {
      if (err instanceof Error) {
        const errorMessage = err.message.toLowerCase();

        // ✅ Check if user already exists
        if (
          errorMessage.includes("already exists") ||
          errorMessage.includes("already registered") ||
          errorMessage.includes("user exists")
        ) {
          // Show brief message then redirect
          setError("User already exists. Redirecting to login...");
          setTimeout(() => {
            router.push("/login");
          }, 2000); // Wait 2 seconds before redirecting
        } else {
          setError(err.message);
        }
      } else {
        setError("Registration failed");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6">
      <h2 className="text-2xl font-bold mb-4">Register</h2>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(""); // Clear error when user types
            }}
            placeholder="Enter your password"
            required
            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? "border-red-500" : ""
            }`}
          />
        </div>

        {/* ✅ Role selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role
          </label>
          <div className="flex gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="role"
                value="user"
                checked={role === "user"}
                onChange={(e) => setRole(e.target.value as "user" | "admin")}
                className="mr-2"
              />
              <span className="text-gray-700">User</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={role === "admin"}
                onChange={(e) => setRole(e.target.value as "user" | "admin")}
                className="mr-2"
              />
              <span className="text-gray-700">Admin</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Register
        </button>
      </form>

      {/* ✅ Show error only when validation fails */}
      {error && (
        <div
          className={`mt-4 px-4 py-3 rounded border ${
            error.includes("Redirecting")
              ? "bg-yellow-50 border-yellow-200 text-yellow-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {error}
        </div>
      )}

      <p className="mt-4 text-center text-gray-600">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          Login here
        </a>
      </p>
    </div>
  );
}
