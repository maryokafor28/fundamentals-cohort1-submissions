import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const auth = useAuth();
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      await auth.login(email, password);
      nav("/tasks");
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Login</h2>
      <div><input value={email} onChange={e => setEmail(e.target.value)} placeholder="email" /></div>
      <div><input value={password} onChange={e => setPassword(e.target.value)} placeholder="password" type="password" /></div>
      <button type="submit">Login</button>
      {err && <div style={{ color: "red" }}>{err}</div>}
    </form>
  );
}
