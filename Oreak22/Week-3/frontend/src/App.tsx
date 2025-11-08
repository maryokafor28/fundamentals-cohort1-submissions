import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./auth/Login";
import Signup from "./auth/Register";
import Layer from "./components/Layer";
import { AuthProvider } from "./context/AuthContext";
import { lazy, Suspense } from "react";
import Search from "./pages/Search";
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreateTask = lazy(() => import("./pages/CreateTask"));
function App() {
  return (
    <Suspense fallback={<>Loading.......</>}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* authentication */}
            <Route path="/auth">
              <Route
                path="login"
                element={
                  <>
                    <Login />
                  </>
                }
              />
              <Route
                path="signup"
                element={
                  <>
                    <Signup />
                  </>
                }
              />
            </Route>
            {/*  */}
            <Route path="/">
              <Route
                path=""
                element={<Navigate replace to={"/auth/login"} />}
              />
              <Route
                path="*"
                element={<Navigate replace to={"/auth/login"} />}
              />
              <Route
                path="dashboard"
                element={
                  <>
                    <Layer>
                      <Dashboard />
                    </Layer>
                  </>
                }
              />
              <Route
                path="create-task"
                element={
                  <>
                    <Layer>
                      <CreateTask />
                    </Layer>
                  </>
                }
              />
              <Route
                path="search"
                element={
                  <>
                    <Layer>
                      <Search />
                    </Layer>
                  </>
                }
              />
            </Route>
            {/*  */}
          </Routes>
        </Router>
      </AuthProvider>
    </Suspense>
  );
}

export default App;
