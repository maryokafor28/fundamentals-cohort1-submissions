import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function Users() {
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [totalPages, setTotalPages] = useState(1)

  const fetchUsers = async (pageNumber = 1) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get('/users', { params: { page: pageNumber, limit: 10 } })
      setUsers(res.data.users || [])
      setTotalPages(res.data.totalPages || 1)
      setPage(pageNumber)
    } catch (err) {
      setError(err.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers(1)
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete user?')) return
    try {
      await api.delete(`/users/${id}`)
      // reload current page
      fetchUsers(page)
    } catch (err) {
      alert('Failed to delete user: ' + (err.message || 'error'))
    }
  }

  return (
    <div className="page">
      <h2>Users</h2>

      {loading && <div className="state">Loading users...</div>}
      {error && <div className="state error">Error: {error}</div>}

      {!loading && !error && (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <button onClick={() => handleDelete(u.id)} className="danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button onClick={() => fetchUsers(Math.max(1, page - 1))} disabled={page <= 1}>Prev</button>
            <span>Page {page} / {totalPages}</span>
            <button onClick={() => fetchUsers(Math.min(totalPages, page + 1))} disabled={page >= totalPages}>Next</button>
          </div>
        </>
      )}
    </div>
  )
}
