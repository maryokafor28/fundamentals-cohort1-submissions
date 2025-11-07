import { CiLock } from "react-icons/ci";
import { useState } from "react";
import { useAuth } from "../context/AuthContextObject";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/tasks");
    } catch {
      alert("Login failed")
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-[#f9f9fa]">
      <div className="border border-slate-200 py-20 px-10 rounded-xl">
        <div className="my-2 flex flex-col items-center">
          <CiLock className="text-slate-50 bg-gray-800 p-4 text-6xl rounded-xl" />
          <h1>Secure Tasks</h1>
          <p>Sign in to your account to continue</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mb-4">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="bg-slate-800 w-full rounded-lg text-slate-50 py-2 my-4">
            Login
          </button>
        </form>
        <p className="text-center">
          Don't have an account?
          <Link to="/register" className="text-blue-500">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
