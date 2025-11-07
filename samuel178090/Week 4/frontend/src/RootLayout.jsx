import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Widgets from './components/Widgets'
import ThemeModal from './components/ThemeModal'

const RootLayout = () => {
  const themeModalIsOpen = useSelector(state => state?.ui?.themeModalIsOpen)
  const { primaryColor, backgroundColor } = useSelector(state => state?.ui?.theme || {})
  const token = useSelector(state => state?.user?.currentUser?.token)
  const location = useLocation()
  const navigate = useNavigate()

  // Apply theme classes to body
  useEffect(() => {
    const body = document.body
    body.className = `${primaryColor || ''} ${backgroundColor || ''}`.trim()
  }, [primaryColor, backgroundColor])

  // Redirect to login if not authenticated and not on auth pages
  useEffect(() => {
    const authPages = ['/login', '/register', '/logout']
    if (!token && !authPages.includes(location.pathname)) {
      navigate('/login', { replace: true })
    }
  }, [token, location.pathname, navigate])

  // Show navbar and sidebar only for authenticated users
  const showNavigation = !!token
  const isProfilePage = location.pathname.startsWith('/users/')

  // Don't render layout for unauthenticated users on protected routes
  const authPages = ['/login', '/register', '/logout']
  if (!token && !authPages.includes(location.pathname)) {
    return null
  }

  return (
    <>
      {showNavigation && <Navbar />}
      <main className='main'>
        <div className="container main__container">
          {showNavigation && <Sidebar />}
          {isProfilePage ? <Outlet /> : <Outlet />}
          {showNavigation && <Widgets />}
          {themeModalIsOpen && <ThemeModal />}
        </div>
      </main>
    </>
  )
}

export default RootLayout