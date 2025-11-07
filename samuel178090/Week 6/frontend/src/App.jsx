import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

// Lazy load components for better performance
const LandingPage = lazy(() => import("./components/LandingPage.jsx"));
const Register = lazy(() => import("./components/Register.jsx"));
const Login = lazy(() => import("./components/Login.jsx"));
const UserList = lazy(() => import("./components/UserList.jsx"));
const TransactionSimulator = lazy(() => import("./components/TransactionSimulator.jsx"));
const Dashboard = lazy(() => import("./components/Dashboard.jsx"));
const AdminDashboard = lazy(() => import("./components/AdminDashboard.jsx"));
const AdminLogin = lazy(() => import("./components/AdminLogin.jsx"));
const AdminUserManager = lazy(() => import("./components/AdminUserManager.jsx"));
const CreateAdmin = lazy(() => import("./components/CreateAdmin.jsx"));
const SubaccountsManager = lazy(() => import("./components/SubaccountsManager.jsx"));
const UserProfile = lazy(() => import("./components/UserProfile.jsx"));
const VCCManager = lazy(() => import("./components/VCCManager.jsx"));
const UserSettings = lazy(() => import("./components/UserSettings.jsx"));
const TransactionHistory = lazy(() => import("./components/TransactionHistory.jsx"));

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="text-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-600 font-semibold">Loading...</p>
    </div>
  </div>
);

// 404 Not Found Page
const NotFound = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
    <div className="text-center">
      <h1 className="text-9xl font-bold text-blue-500 mb-4">404</h1>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a
        href="/"
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 font-semibold inline-block"
      >
        Go Back Home
      </a>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Admin Protected Route
const AdminProtectedRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');
  const location = useLocation();

  if (!adminToken) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

// Public Only Route (redirect to home if already logged in)
const PublicOnlyRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (token) {
    return <Navigate to="/transactions" replace />;
  }

  return children;
};

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
};

// Component to conditionally render navbar
const ConditionalNavbar = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  if (isAdminRoute) {
    return null; // Admin routes have their own navbar
  }
  
  return <Navbar />;
};

// Component to conditionally render footer
const ConditionalFooter = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  if (isAdminRoute) {
    return null; // Admin routes don't need footer
  }
  
  return <Footer />;
};

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        <ScrollToTop />
        <ConditionalNavbar />
        <div className="flex-grow">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Auth Routes - Redirect if already logged in */}
              <Route 
                path="/register" 
                element={
                  <PublicOnlyRoute>
                    <Register />
                  </PublicOnlyRoute>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <PublicOnlyRoute>
                    <Login />
                  </PublicOnlyRoute>
                } 
              />

              {/* Protected Routes - Require authentication */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/transactions" 
                element={
                  <ProtectedRoute>
                    <TransactionSimulator />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/users" 
                element={
                  <ProtectedRoute>
                    <UserList />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/users/:userId" 
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                } 
              />
              {/* Admin Routes - Separate from user routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route 
                path="/admin" 
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                } 
              />
              <Route 
                path="/admin/dashboard" 
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <AdminProtectedRoute>
                    <AdminUserManager />
                  </AdminProtectedRoute>
                } 
              />
              <Route 
                path="/admin/create-admin" 
                element={
                  <AdminProtectedRoute>
                    <CreateAdmin />
                  </AdminProtectedRoute>
                } 
              />
              <Route 
                path="/subaccounts" 
                element={
                  <ProtectedRoute>
                    <SubaccountsManager />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/vcc" 
                element={
                  <ProtectedRoute>
                    <VCCManager />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <UserSettings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/history" 
                element={
                  <ProtectedRoute>
                    <TransactionHistory />
                  </ProtectedRoute>
                } 
              />

              {/* 404 Not Found - Must be last */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
        <ConditionalFooter />
      </Router>
    </div>
  );
}

export default App;