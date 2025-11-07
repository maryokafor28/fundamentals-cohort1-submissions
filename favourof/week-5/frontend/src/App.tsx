import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Doctors from "./pages/Doctors";
import Activities from "./pages/Activities";
import { Meals } from "./pages/Meals";
import { Appointments } from "./pages/Appointments";
import { Reports } from "./pages/Reports";
import Navbar from "./components/layout/Navbar";

const App = () => (
  <BrowserRouter>
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/meals" element={<Meals />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </main>
    </div>
  </BrowserRouter>
);

export default App;
