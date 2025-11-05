import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Menu,
  X,
  LayoutDashboard,
  Users,
  Activity,
  UtensilsCrossed,
  UserCheck,
  Calendar,
  FileText,
  Settings,
  LogOut,
  Heart,
  Bell
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Activities', href: '/activities', icon: Activity },
  { name: 'Meals', href: '/meals', icon: UtensilsCrossed },
  { name: 'Doctors', href: '/doctors', icon: UserCheck },
  { name: 'Appointments', href: '/appointments', icon: Calendar },
  { name: 'Reports', href: '/reports', icon: FileText },
]

export default function Layout({ children, currentUser }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const isActiveRoute = (href) => {
    if (href === '/') {
      return location.pathname === '/' || location.pathname === '/dashboard'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-neutral-200">
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-neutral-900">PulseTrack</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md hover:bg-neutral-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = isActiveRoute(item.href)
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                    ${isActive 
                      ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600' 
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={`
                    w-5 h-5 mr-3 transition-colors duration-200
                    ${isActive ? 'text-primary-600' : 'text-neutral-400'}
                  `} />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User menu */}
          <div className="p-4 border-t border-neutral-200">
            <div className="flex items-center space-x-3 p-2">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                {currentUser?.name?.[0] || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {currentUser?.name || 'User'}
                </p>
                <p className="text-xs text-neutral-500 truncate">
                  {currentUser?.email || 'user@example.com'}
                </p>
              </div>
            </div>
            
            <div className="mt-2 space-y-1">
              <button className="flex items-center w-full px-3 py-2 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors duration-200">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
              <button className="flex items-center w-full px-3 py-2 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors duration-200">
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-neutral-200 lg:shadow-none">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1 lg:flex lg:items-center lg:justify-between">
              <div className="min-w-0">
                <h1 className="text-2xl font-semibold text-neutral-900 lg:text-3xl">
                  {getCurrentPageTitle(location.pathname)}
                </h1>
              </div>

              <div className="hidden lg:flex lg:items-center lg:space-x-4">
                <button className="relative p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-600 rounded-full"></span>
                </button>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-neutral-900">
                      {currentUser?.name || 'User'}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {currentUser?.role || 'Member'}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {currentUser?.name?.[0] || 'U'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

function getCurrentPageTitle(pathname) {
  const routes = {
    '/': 'Dashboard',
    '/dashboard': 'Dashboard',
    '/users': 'Users',
    '/activities': 'Activities',
    '/activities/new': 'New Activity',
    '/meals': 'Meals',
    '/meals/new': 'New Meal',
    '/doctors': 'Doctors',
    '/doctors/new': 'New Doctor',
    '/appointments': 'Appointments',
    '/appointments/new': 'New Appointment',
    '/reports': 'Reports',
    '/reports/new': 'New Report',
  }

  return routes[pathname] || 'PulseTrack'
}
