import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/layers/Layout";
import { lazy, Suspense } from "react";
import Lazyload from "./components/loader/Lazyload";
import Auth from "./components/authentication";

const Home = lazy(() => import("./pages/home"));
const Login = lazy(() => import("./pages/auth/login/Login"));
const Signin = lazy(() => import("./pages/auth/signup/Signup"));
const FindAccount = lazy(() => import("./pages/auth/findAccount/FindAccount"));
const ResetPassword = lazy(
  () => import("./pages/auth/password_reset/ResetPassword")
);
const Cart = lazy(() => import("./pages/cart/Index"));
const Addproduct = lazy(() => import("./pages/Admin/AddProduct"));

function App() {
  return (
    <>
      <Router>
        <Suspense fallback={<Lazyload />}>
          <Routes>
            <Route path="/">
              <Route
                path="/"
                element={
                  <Layout>
                    <Home />
                  </Layout>
                }
              />
            </Route>
            {/* authrize routes */}
            <Route path="/">
              <Route
                path="/mycart"
                element={
                  <Layout>
                    <Auth>
                      <Cart />
                    </Auth>
                  </Layout>
                }
              />
            </Route>
            {/* admin routes */}
            <Route path="/admin">
              <Route
                path="addproduct"
                element={
                  <Auth>
                    <Addproduct />
                  </Auth>
                }
              />
            </Route>
            {/* authentication routes */}
            <Route path="/auth">
              <Route
                path="login"
                element={
                  <Layout>
                    <Login />
                  </Layout>
                }
              />

              <Route
                path="login/:path"
                element={
                  <Layout>
                    <Login />
                  </Layout>
                }
              />

              <Route
                path="register"
                element={
                  <Layout>
                    <Signin />
                  </Layout>
                }
              />
              <Route
                path="reset-password"
                element={
                  <Layout>
                    <FindAccount />
                  </Layout>
                }
              />
              <Route
                path="reset-password/:token"
                element={
                  <Layout>
                    <ResetPassword />
                  </Layout>
                }
              />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </>
  );
}

export default App;
