import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { userActions } from '../store/user-slice'

const Login = () => {
   const [userData, setUserData] = useState({email: "", password: ""})
   const [error, setError] = useState("")
   const [successMessage, setSuccessMessage] = useState("")
   const [isLoading, setIsLoading] = useState(false)
   const [showPassword, setShowPassword] = useState(false)
   const navigate = useNavigate()
   const dispatch = useDispatch()
   const location = useLocation()

   // Show success message from registration
   useEffect(() => {
     if (location.state?.message) {
       setSuccessMessage(location.state.message)
     }
   }, [location])

   //function to change userData
   const changeInputHandler = (e) => {
    setUserData(prevState => {
      return {...prevState, [e.target.name]: e.target.value}
    })
   }

   // function to login user
   const loginUser = async (e) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")
    
    if (!userData.email?.trim() || !userData.password) {
        setError("Please fill in all fields")
        return
    }

    setIsLoading(true)
    
    try{
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/login`, 
        {
          email: userData.email.trim(),
          password: userData.password
        }, 
        { withCredentials: true }
      )
      
      console.log('Login response:', response.data)
      
      if(response.status === 200 && response.data.token){
        // Combine user data with token
        const userWithToken = {
          ...response.data.user,
          token: response.data.token
        }
        
        console.log('Storing user with token:', userWithToken)
        
        // Update Redux state
        dispatch(userActions.changeCurrentUser(userWithToken))
        
        // Save to localStorage
        localStorage.setItem("currentUser", JSON.stringify(userWithToken))
        
        navigate('/')
      } else {
        setError("Login failed. Please try again.")
      }
    } catch (err){
      console.error('Login error:', err)
      const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials."
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
   }

  return (
   <section className="register">
    <div className="container register__container">
      <h2>Sign In</h2>
      <form onSubmit={loginUser}>
       {successMessage && <p className="form__success-message">{successMessage}</p>}
       {error && <p className="form__error-message">{error}</p>}
         <input 
           type="email" 
           name='email' 
           placeholder='Email' 
           value={userData.email} 
           onChange={changeInputHandler}
           disabled={isLoading}
           autoFocus
           required
         />
        <div className="password__controller">
          <label htmlFor="password">Password</label>
          <input 
            type={showPassword ? "text" : "password"} 
            name="password"
            id="password" 
            placeholder="Password" 
            value={userData.password} 
            onChange={changeInputHandler}
            disabled={isLoading}
            required
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash/> : <FaEye/>}
          </span>
        </div>
        <p>Don't have an account? <Link to="/register">Sign up</Link></p>
        <button 
          type="submit" 
          className="btn primary"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
   </section>
  )
}

export default Login