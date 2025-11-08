import { Suspense } from "react";
import "./App.css";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Login from "./pages/auth/Login";
import { AuthProvider } from "./context/AuthContext";
import Signup from "./pages/auth/Signup";
import Layout from "./components/ui/layout";
import Dashboard from "./pages/dashboard";
import NewProject from "./pages/new-project";
import Project from "./pages/Project";
import View from "./pages/View";

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
              <Route path="/" element={<Navigate to="/auth/login" />} />
              <Route
                path="dashboard"
                element={
                  <>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </>
                }
              />
              <Route
                path="new-project"
                element={
                  <>
                    <Layout>
                      <NewProject />
                    </Layout>
                  </>
                }
              />
              <Route
                path="project/:userName/:id"
                element={
                  <>
                    <Layout>
                      <Project />
                    </Layout>
                  </>
                }
              />
              <Route
                path="/:userName"
                element={
                  <>
                    <Layout>
                      <View />
                    </Layout>
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
