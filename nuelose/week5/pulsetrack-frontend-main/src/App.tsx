// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./component/Layout";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointment";
import Reports from "./pages/Report";
import User from "./pages/User";
import Activity from "./pages/Activity";
import Meals from "./pages/Meals";
import Doctors from "./pages/Doctor";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/users" element={<User />} />
          <Route path="/activities" element={<Activity />} />
          <Route path="/meals" element={<Meals />} />
          <Route path="/doctors" element={<Doctors />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
