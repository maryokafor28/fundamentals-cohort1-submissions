import { useState, useEffect } from 'react';
import { authAPI, productsAPI, ordersAPI } from './services/api';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('login');

  // Auth state
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Product state
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      loadUserData();
    }
  }, []);

  const loadUserData = async () => {
    try {
      const { data } = await authAPI.getCurrentUser();
      setUser(data.data);
      loadProducts();
      loadOrders();
    } catch (err) {
      console.error('Failed to load user data', err);
      localStorage.removeItem('authToken');
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data } = await productsAPI.getAll();
      setProducts(data.data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const { data } = await ordersAPI.getMyOrders();
      setOrders(data.data);
    } catch (err) {
      setError('Failed to load orders');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await authAPI.register(authForm);
      alert('Registration successful! Please login.');
      setActiveTab('login');
      setAuthForm({ name: '', email: '', password: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const { data } = await authAPI.login({
        email: authForm.email,
        password: authForm.password,
      });
      localStorage.setItem('authToken', data.data.token);
      setUser(data.data.user);
      setActiveTab('products');
      loadProducts();
      loadOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setProducts([]);
    setOrders([]);
    setActiveTab('login');
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await productsAPI.create(productForm);
      alert('Product created successfully!');
      setProductForm({ name: '', description: '', price: '', stock: '' });
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (productId) => {
    const quantity = prompt('Enter quantity:');
    if (!quantity || isNaN(quantity) || quantity <= 0) return;

    try {
      setLoading(true);
      setError('');
      await ordersAPI.create({
        items: [{ productId: parseInt(productId), quantity: parseInt(quantity) }],
      });
      alert('Order created successfully!');
      loadProducts();
      loadOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="app">
        <div className="container">
          <h1>🚀 CodePilot API Client</h1>
          
          <div className="tabs">
            <button 
              className={activeTab === 'login' ? 'active' : ''} 
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button 
              className={activeTab === 'register' ? 'active' : ''} 
              onClick={() => setActiveTab('register')}
            >
              Register
            </button>
          </div>

          {error && <div className="error">{error}</div>}

          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="auth-form">
              <h2>Login</h2>
              <input
                type="email"
                placeholder="Email"
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Login'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="auth-form">
              <h2>Register</h2>
              <input
                type="text"
                placeholder="Name"
                value={authForm.name}
                onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password (min 6 characters)"
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                required
                minLength={6}
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Register'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <h1>🚀 CodePilot Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user.name}!</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>

        <div className="tabs">
          <button 
            className={activeTab === 'products' ? 'active' : ''} 
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button 
            className={activeTab === 'create-product' ? 'active' : ''} 
            onClick={() => setActiveTab('create-product')}
          >
            Create Product
          </button>
          <button 
            className={activeTab === 'orders' ? 'active' : ''} 
            onClick={() => setActiveTab('orders')}
          >
            My Orders ({orders.length})
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        {activeTab === 'products' && (
          <div className="section">
            <h2>Available Products</h2>
            {loading ? (
              <p>Loading...</p>
            ) : products.length === 0 ? (
              <p>No products available. Create one to get started!</p>
            ) : (
              <div className="products-grid">
                {products.map((product) => (
                  <div key={product.id} className="product-card">
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <div className="product-details">
                      <span className="price">${product.price}</span>
                      <span className="stock">Stock: {product.stock}</span>
                    </div>
                    <button 
                      onClick={() => handleCreateOrder(product.id)}
                      disabled={product.stock === 0}
                      className="order-btn"
                    >
                      {product.stock === 0 ? 'Out of Stock' : 'Place Order'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'create-product' && (
          <div className="section">
            <h2>Create New Product</h2>
            <form onSubmit={handleCreateProduct} className="product-form">
              <input
                type="text"
                placeholder="Product Name"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                required
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                required
                min="0"
              />
              <input
                type="number"
                placeholder="Stock Quantity"
                value={productForm.stock}
                onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                required
                min="0"
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Product'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="section">
            <h2>My Orders</h2>
            {orders.length === 0 ? (
              <p>No orders yet. Place your first order!</p>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <h3>Order #{order.id}</h3>
                      <span className={`status status-${order.status}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="order-items">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="order-item">
                          <span>{item.productName}</span>
                          <span>x{item.quantity}</span>
                          <span>${item.subtotal.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="order-total">
                      <strong>Total: ${order.totalAmount.toFixed(2)}</strong>
                    </div>
                    <small>Created: {new Date(order.createdAt).toLocaleString()}</small>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
