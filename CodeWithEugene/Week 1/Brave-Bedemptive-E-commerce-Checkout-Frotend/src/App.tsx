import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import ProductList from './components/ProductList/ProductList';
import Cart from './components/Cart/Cart';
import Login from './components/Login/Login';
import { User } from './types';
import './App.css';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCartItemCount(0);
  };

  const updateCartCount = (count: number) => {
    setCartItemCount(count);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="app">
        <Header
          user={user}
          onLogout={handleLogout}
          cartItemCount={cartItemCount}
        />
        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <ProductList
                  userId={user._id}
                  onCartUpdate={updateCartCount}
                />
              }
            />
            <Route
              path="/cart"
              element={
                <Cart
                  userId={user._id}
                  onCartUpdate={updateCartCount}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
