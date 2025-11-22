import React, { useEffect, useState } from 'react'
import api from '../services/api'

function UserForm({ onClose, onSave, initial = {} }) {
  const [name, setName] = useState(initial.name || '')
  const [email, setEmail] = useState(initial.email || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setName(initial.name || '')
    setEmail(initial.email || '')
  }, [initial])

  const validate = () => {
    if (!name.trim()) return 'Name is required'
    if (!email.trim()) return 'Email is required'
    // simple email check
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return 'Invalid email'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v = validate()
    if (v) return setError(v)
    setSaving(true)
    setError(null)
    try {
      const payload = { name: name.trim(), email: email.trim() }
      let res
      if (initial.id) {
        res = await api.put(`/users/${initial.id}`, payload)
      } else {
        res = await api.post('/users', payload)
      }
      onSave(res.data)
    } catch (err) {
      setError(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal">
      <form className="form modal-content" onSubmit={handleSubmit}>
        <h3>{initial.id ? 'Edit User' : 'Create User'}</h3>
        {error && <div className="state error">{error}</div>}
        <label>
          Name
          <input value={name} onChange={e => setName(e.target.value)} />
        </label>
        <label>
          Email
          <input value={email} onChange={e => setEmail(e.target.value)} />
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          <button type="button" onClick={onClose} className="danger">Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default function Users() {
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [totalPages, setTotalPages] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

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

  const openCreate = () => { setEditing(null); setModalOpen(true) }
  const openEdit = (user) => { setEditing(user); setModalOpen(true) }

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

  const handleSave = (saved) => {
    // close modal and refresh list; saved may be the created/updated user
    setModalOpen(false)
    fetchUsers(page)
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Users</h2>
        <div>
          <button onClick={openCreate}>Create User</button>
        </div>
      </div>

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
                    <button onClick={() => openEdit(u)}>Edit</button>
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

      {modalOpen && (
        <UserForm initial={editing || {}} onClose={() => setModalOpen(false)} onSave={handleSave} />
      )}
    </div>
  )
}
