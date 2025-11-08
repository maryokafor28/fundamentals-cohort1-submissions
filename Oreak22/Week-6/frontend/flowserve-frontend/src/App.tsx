import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import UsersPage from "./pages/Users";
import TransactionsPage from "./pages/Transactions";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow p-4">
        <div className="container mx-auto flex gap-4">
          <Link to="/users" className="font-semibold">
            Users
          </Link>
          <Link to="/transactions" className="font-semibold">
            Transactions
          </Link>
        </div>
      </nav>

      <main className="container mx-auto p-6">
        <Routes>
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
        </Routes>
      </main>
    </div>
  );
}
