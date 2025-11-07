import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { Link } from 'react-router-dom'
import ProfileImage from '../components/ProfileImage'

const Search = () => {
  const [searchParams] = useSearchParams()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const query = searchParams.get('q')
  const token = useSelector(state => state?.user?.currentUser?.token)

  const searchUsers = async () => {
    if (!query || !token) return

    setLoading(true)
    setError('')

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      
      // Filter users by search query
      const filteredUsers = response.data.filter(user =>
        user.fullName.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      )
      
      setUsers(filteredUsers)
    } catch (error) {
      console.error('Search error:', error)
      setError('Failed to search users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    searchUsers()
  }, [query, token])

  return (
    <section className="mainArea">
      <div className="search-results">
        <h2>Search Results for "{query}"</h2>
        
        {loading && <p>Searching...</p>}
        
        {error && <p className="error-message">{error}</p>}
        
        {!loading && !error && users.length === 0 && (
          <p>No users found for "{query}"</p>
        )}
        
        {users.length > 0 && (
          <div className="users-list">
            {users.map(user => (
              <div key={user._id} className="user-card">
                <Link to={`/users/${user._id}`} className="user-link">
                  <ProfileImage image={user.profilePhoto} />
                  <div className="user-info">
                    <h4>{user.fullName}</h4>
                    <small>{user.email}</small>
                    <small>{user.followers?.length || 0} followers</small>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Search