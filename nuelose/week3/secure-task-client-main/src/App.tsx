import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { useAuth } from "./context/AuthContextObject"; 
import Register from "./pages/Register";
import Login from "./pages/Login";
import type { ReactNode } from "react";
import Tasks from "./pages/Tasks";
import CreateTask from "./pages/CreateTask";

const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { accessToken, loading } = useAuth()!;
  if (loading) return <div>Loading...</div>;
  return accessToken ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-task"
            element={
              <ProtectedRoute>
                <CreateTask />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/tasks" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
