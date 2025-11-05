import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  CheckSquare, 
  User, 
  Shield 
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const Sidebar = () => {
  const { isAdmin } = useAuth()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Tasks',
      href: '/tasks',
      icon: CheckSquare,
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
    },
  ]

  // Add admin-only navigation items
  if (isAdmin()) {
    navigation.push({
      name: 'Admin Panel',
      href: '/admin',
      icon: Shield,
    })
  }

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-900">
            Task Manager
          </span>
        </div>
      </div>
      
      <nav className="px-4 pb-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
