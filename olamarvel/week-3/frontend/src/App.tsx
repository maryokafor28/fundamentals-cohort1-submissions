import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user, logout } = useAuth();

  return (
    <div style={{ maxWidth: 900, margin: "20px auto", padding: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <Link to="/" style={{ marginRight: 10 }}>Home</Link>
          {user ? <Link to="/tasks">Tasks</Link> : null}
        </div>
        <div>
          {user ? (
            <>
              <span style={{ marginRight: 10 }}>Hi, {user.email} ({user.role})</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ marginRight: 10 }}>Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </header>

      <Routes>
        <Route path="/" element={<div>Welcome — use the links to Register / Login.</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </div>
  );
}
