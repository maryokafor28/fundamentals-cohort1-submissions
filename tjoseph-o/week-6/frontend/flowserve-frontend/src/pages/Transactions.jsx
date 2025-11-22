import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function Transactions() {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState('')
  const [amount, setAmount] = useState('')
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoadingUsers(true)
      try {
        const res = await api.get('/users', { params: { page: 1, limit: 100 } })
        setUsers(res.data.users || [])
      } catch (err) {
        setError('Failed to load users for transaction form')
      } finally {
        setLoadingUsers(false)
      }
    }
    load()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setResult(null)
    setError(null)
    try {
      const res = await api.post('/transactions/simulate', { userId: selectedUser, amount: Number(amount) })
      setResult(res.data)
    } catch (err) {
      setError(err.message || 'Transaction failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      <h2>Simulate Transaction</h2>

      {loadingUsers && <div className="state">Loading users...</div>}
      {error && <div className="state error">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <label>
          User
          <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} required>
            <option value="">Select a user</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
            ))}
          </select>
        </label>

        <label>
          Amount
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required min="0.01" step="0.01" />
        </label>

        <div>
          <button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Simulate'}</button>
        </div>
      </form>

      {result && (
        <div className="result">
          <h3>Result</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
