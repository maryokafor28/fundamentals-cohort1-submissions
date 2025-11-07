import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { userActions } from '../store/user-slice'

const Register = () => {
   const [userData, setUserData] = useState({
     fullName: "", 
     email: "", 
     password: "", 
     confirmPassword: ""
   })
   const [error, setError] = useState("")
   const [isLoading, setIsLoading] = useState(false)
   const [showPassword, setShowPassword] = useState(false)
   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
   const navigate = useNavigate()
   const dispatch = useDispatch()

   const changeInputHandler = (e) => {
    setUserData(prevState => {
      return {...prevState, [e.target.name]: e.target.value}
    })
   }

   const registerUser = async (e) => {
    e.preventDefault()
    setError("")
    
    if (!userData.fullName?.trim() || !userData.email?.trim() || !userData.password || !userData.confirmPassword) {
        setError("Please fill in all fields")
        return
    }

    if (userData.password.length < 6) {
        setError("Password must be at least 6 characters")
        return
    }

    if (userData.password !== userData.confirmPassword) {
        setError("Passwords do not match")
        return
    }

    setIsLoading(true)
    
    try{
      console.log('Sending registration data:', userData)
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/register`, 
        {
          fullName: userData.fullName.trim(),
          email: userData.email.trim(),
          password: userData.password,
          confirmPassword: userData.confirmPassword
        }
      )
      
      console.log('Registration successful:', response.data)
      
      if(response.status === 201){
        navigate('/login', { 
          state: { message: 'Registration successful! Please login.' }
        })
      }
    } catch (err){
      console.error('Registration error:', err)
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again."
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
   }

  return (
   <section className="register">
    <div className="container register__container">
      <h2>Sign Up</h2>
      <form onSubmit={registerUser}>
       {error && <p className="form__error-message">{error}</p>}
        <input 
          type="text" 
          name='fullName' 
          placeholder='Full Name' 
          value={userData.fullName} 
          onChange={changeInputHandler} 
          disabled={isLoading}
          autoFocus 
          required
        />
        <input 
          type="email" 
          name='email' 
          placeholder='Email' 
          value={userData.email} 
          onChange={changeInputHandler}
          disabled={isLoading}
          required
        />
        <div className="password__controller">
          <label htmlFor="password">Password</label>
          <input 
            type={showPassword ? "text" : "password"} 
            name="password" 
            id="password"
            placeholder="Password (min 6 characters)" 
            value={userData.password} 
            onChange={changeInputHandler}
            disabled={isLoading}
            required
            minLength={6}
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash/> : <FaEye/>}
          </span>
        </div>

        <div className="password__controller">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input 
            type={showConfirmPassword ? "text" : "password"} 
            name="confirmPassword"
            id="confirmPassword" 
            placeholder="Confirm Password" 
            value={userData.confirmPassword} 
            onChange={changeInputHandler}
            disabled={isLoading}
            required
          />
          <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <FaEyeSlash/> : <FaEye/>}
          </span>
        </div>

        <p>Already have an account? <Link to="/login">Login</Link></p>
        
        <button 
          type="submit" 
          className="btn primary"
          disabled={isLoading}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
   </section>
  )
}

export default Register