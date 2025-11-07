import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { CiSearch } from 'react-icons/ci'
import ProfileImage from './ProfileImage'

const Navbar = () => {
  const [user, setUser] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const currentUser = useSelector(state => state?.user?.currentUser)
  const userId = currentUser?.id
  const token = currentUser?.token
  const navigate = useNavigate()
  
  // GET USER FROM DB
  const getUser = async () => {
    if (!userId || !token) return
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      setUser(response?.data)
    } catch (error) {
      console.error('Error fetching user:', error)
    }   
  }

  useEffect(() => {
    getUser()
  }, [userId, token])

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  // Log user out after an hour
  useEffect(() => {
    if (!token) return
    
    const timer = setTimeout(() => {
      navigate('/logout')
    }, 1000 * 60 * 60) // 1 hour
    
    return () => clearTimeout(timer)
  }, [token, navigate])
    
  return (
    <nav className="navbar">
      <div className="container navbar__container">
        <Link to="/" className="navbar__logo">FassCode</Link>
        <form className="navbar__search" onSubmit={handleSearch}>
          <input 
            type="search" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">
            <CiSearch />
          </button>
        </form>
        <div className="navbar__right">
          {token ? (
            <>
              <Link to={`/users/${userId}`} className='navbar__profile'>
                <ProfileImage image={user?.profilePhoto || currentUser?.profilePhoto} />
              </Link>
              <Link to="/logout" className="navbar__logout">Logout</Link>
            </>
          ) : (
            <Link to="/login" className="navbar__login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar