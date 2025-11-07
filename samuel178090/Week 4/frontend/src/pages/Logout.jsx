import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { userActions } from '../store/user-slice'

const Logout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isLoggingOut, setIsLoggingOut] = useState(true)
  const token = useSelector(state => state?.user?.currentUser?.token)

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Call logout API if you have one
        if (token) {
          await axios.post(
            `${import.meta.env.VITE_API_URL}/users/logout`,
            {},
            {
              withCredentials: true,
              headers: { Authorization: `Bearer ${token}` }
            }
          )
        }
      } catch (error) {
        console.error('Logout API error:', error)
      } finally {
        // Clear Redux state
        dispatch(userActions.changeCurrentUser(null))
        
        // Clear localStorage
        localStorage.removeItem("currentUser")
        localStorage.removeItem("theme")
        
        setIsLoggingOut(false)
        
        // Navigate to login
        navigate('/login', { 
          state: { message: 'You have been logged out successfully' },
          replace: true 
        })
      }
    }

    performLogout()
  }, [dispatch, navigate, token])

  return (
    <div className="logout-container center">
      {isLoggingOut && (
        <>
          <div className="spinner"></div>
          <p>Logging out...</p>
        </>
      )}
    </div>
  )
}

export default Logout