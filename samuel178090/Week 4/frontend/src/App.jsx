import React from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { Provider, useSelector } from 'react-redux'
import store from './store/store'

// Layouts
import RootLayout from './RootLayout'

// Pages
import Home from './pages/Home'
import Messages from './pages/Messages'
import Bookmarks from './pages/Bookmarks'
import Profile from './pages/Profile'
import Search from './pages/Search'
import SinglePost from './pages/SinglePost'
import Login from './pages/Login'
import Register from './pages/Register'
import Logout from './pages/Logout'
import ErrorPage from './pages/ErrorPage'

// Components
import MessagesList from './components/MessagesList'

// Styles
import './components/feed-tabs.css'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = useSelector(state => state?.user?.currentUser?.token)
  return token ? children : <Navigate to="/login" replace />
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { 
        index: true, 
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        )
      },
      { 
        path: 'messages', 
        element: (
          <ProtectedRoute>
            <MessagesList />
          </ProtectedRoute>
        )
      },
      { 
        path: 'messages/:receiverId', 
        element: (
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        )
      },
      { 
        path: 'bookmarks', 
        element: (
          <ProtectedRoute>
            <Bookmarks />
          </ProtectedRoute>
        )
      },
      { 
        path: 'users/:id', 
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        )
      },
      { 
        path: 'search', 
        element: (
          <ProtectedRoute>
            <Search />
          </ProtectedRoute>
        )
      },
      { 
        path: 'posts/:id', 
        element: (
          <ProtectedRoute>
            <SinglePost />
          </ProtectedRoute>
        )
      },
    ]
  },
  { path: 'login', element: <Login /> },
  { path: 'register', element: <Register /> },
  { path: 'logout', element: <Logout /> },
  { path: '*', element: <ErrorPage /> }, // 404 catch-all
])

const App = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  )
}

export default App