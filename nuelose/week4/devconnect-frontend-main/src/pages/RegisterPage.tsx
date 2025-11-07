import { useState } from "react";
import { BASE_URL } from "../api/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const {login} = useAuth()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      toast.success("Registration successful!");
      login(data.user, data.token);

      navigate('/projects')
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0f172a] text-slate-100">
      <div className="bg-[#1b2537] flex flex-col items-center p-8 rounded-2xl border border-[#49566e] gap-8 text-center">
        <div className="bg-[#38bdf8] p-1 rounded-lg text-slate-800 w-fit">
          &lt;/&gt;
        </div>

        <div>
          <h2>Join DevConnect</h2>
          <p>Collaborate. Share. Build.</p>
        </div>

        <form className="space-y-4 w-64" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-slate-400 rounded-sm p-2 w-full bg-transparent"
          />

          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-slate-400 rounded-sm p-2 w-full bg-transparent"
          />

          <input
            type="password"
            placeholder="•••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-slate-400 rounded-sm p-2 w-full bg-transparent"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            disabled={loading}
            className="bg-[#38bdf8] w-full rounded-lg py-2 text-slate-800"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
