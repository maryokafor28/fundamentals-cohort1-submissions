import { useState, useEffect } from 'react'
import './App.css'

const API_BASE = 'http://localhost:3000/api'

function App() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [token, setToken] = useState('')

  // Login function
  const handleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@test.com',
          password: 'password'
        })
      })
      
      if (!response.ok) throw new Error('Login failed')
      
      const data = await response.json()
      setToken(data.token)
      alert('Login successful!')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE}/products`)
      if (!response.ok) throw new Error('Failed to fetch products')
      
      const data = await response.json()
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE}/orders`)
      if (!response.ok) throw new Error('Failed to fetch orders')
      
      const data = await response.json()
      setOrders(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Create test order
  const createTestOrder = async () => {
    if (!products.length) {
      setError('Please fetch products first')
      return
    }

    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          items: [{ productId: products[0].id, quantity: 1 }]
        })
      })
      
      if (!response.ok) throw new Error('Failed to create order')
      
      alert('Order created successfully!')
      fetchOrders() // Refresh orders
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1>CodePilot Frontend</h1>
        <p>Testing Backend API Integration</p>
      </header>

      <main className="main-content">
        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {loading && <div className="loading">Loading...</div>}

        <section className="auth-section">
          <h2>Authentication</h2>
          <button onClick={handleLogin} disabled={loading}>
            Login as Admin
          </button>
          {token && (
            <div className="token-display">
              <strong>Token:</strong> {token.substring(0, 20)}...
            </div>
          )}
        </section>

        <section className="products-section">
          <h2>Products</h2>
          <button onClick={fetchProducts} disabled={loading}>
            Refresh Products
          </button>
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <h3>{product.name}</h3>
                <p>Price: ${product.price}</p>
                <p>Category: {product.category}</p>
                <p>Stock: {product.stock}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="orders-section">
          <h2>Orders</h2>
          <div className="orders-actions">
            <button onClick={fetchOrders} disabled={loading}>
              Refresh Orders
            </button>
            <button onClick={createTestOrder} disabled={loading}>
              Create Test Order
            </button>
          </div>
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <h3>Order #{order.id}</h3>
                <p>User ID: {order.userId}</p>
                <p>Total: ${order.total}</p>
                <p>Status: {order.status}</p>
                <p>Items: {order.items.length}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App