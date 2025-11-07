// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./component/Layout";
import Dashboard from "./pages/Dashboard";
import User from "./pages/User";
import Transaction from "./pages/Transactions";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<User />} />
          <Route path="/transactions" element={<Transaction />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
