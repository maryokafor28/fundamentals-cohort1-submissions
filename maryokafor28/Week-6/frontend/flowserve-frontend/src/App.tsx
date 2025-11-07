import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { TransactionsPage } from "./pages/TransactionPage";
import { ManageUsersPage } from "./pages/ManageUsersPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Main App Pages */}
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/users" element={<ManageUsersPage />} />

        {/* 404 - Redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
