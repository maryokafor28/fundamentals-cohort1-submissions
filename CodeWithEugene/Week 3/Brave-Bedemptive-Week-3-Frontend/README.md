# Secure Task Manager Frontend

A modern React-Vite frontend application for the Secure Task Management API. Implements secure JWT handling, role-based UI, and comprehensive task management with a clean, responsive interface.

## 🔗 Backend Repository

**Backend API**: [Brave-Bedemptive-Week-3-Backend](https://github.com/your-username/Brave-Bedemptive-Week-3-Backend)

> This frontend application requires the backend API to be running. Please refer to the backend repository for API setup, documentation, and deployment instructions.

## 🚀 Features

- **Secure Authentication**: JWT tokens stored in memory (not localStorage) for XSS protection
- **Role-Based UI**: Different interfaces for Admin and User roles
- **Task Management**: Create, read, update, and delete tasks with advanced filtering
- **Real-time Updates**: React Query for efficient data fetching and caching
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Form Validation**: Client-side validation with react-hook-form
- **Toast Notifications**: User feedback with react-hot-toast
- **Modern UI Components**: Clean, accessible interface with Lucide React icons

## 🛠️ Technology Stack

- **Framework**: React 18 with Vite
- **Routing**: React Router DOM
- **State Management**: React Query + Context API
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form
- **HTTP Client**: Axios with interceptors
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see backend README)

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Brave-Bedemptive-Week-3-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

The application will be available at `http://localhost:3000`

## 🔐 Security Implementation

### Secure JWT Token Storage

**Access Tokens**: Stored in memory (JavaScript variables)
- ✅ **XSS Protection**: Not accessible via `localStorage` or `sessionStorage`
- ✅ **Automatic Cleanup**: Cleared when browser tab closes
- ✅ **Memory-Only**: Cannot be accessed by malicious scripts
- ✅ **No Persistence**: Tokens don't survive page refreshes

**Refresh Tokens**: Managed via HttpOnly cookies
- ✅ **HttpOnly**: Not accessible via JavaScript
- ✅ **Automatic Transmission**: Sent with API requests
- ✅ **Secure Flags**: SameSite and Secure in production
- ✅ **Server-Side Management**: Backend controls token lifecycle

### Implementation Details

```javascript
// Token storage in memory (secure approach)
let accessToken = null

export const setAccessToken = (token) => {
  accessToken = token
}

export const getAccessToken = () => {
  return accessToken
}

export const clearAccessToken = () => {
  accessToken = null
}

// Axios interceptor for automatic token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      try {
        const response = await axios.post('/api/auth/refresh', {}, {
          withCredentials: true,
        })
        const { accessToken: newAccessToken } = response.data
        setAccessToken(newAccessToken)
        // Retry original request
        return api(originalRequest)
      } catch (refreshError) {
        clearAccessToken()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
```

### Why This Approach is Secure

1. **XSS Mitigation**: Access tokens in memory cannot be stolen via XSS attacks
2. **CSRF Protection**: Refresh tokens in HttpOnly cookies are protected from CSRF
3. **Automatic Rotation**: Tokens are refreshed automatically without user intervention
4. **Session Management**: Server controls token lifecycle and can revoke access
5. **No Client Storage**: Sensitive tokens are never stored in browser storage

## 🎨 UI Components

### Authentication Pages
- **Login**: Email/username and password authentication
- **Register**: User registration with validation
- **Password Visibility**: Toggle password visibility
- **Form Validation**: Real-time validation feedback

### Dashboard
- **Welcome Section**: Personalized greeting with user role
- **Statistics Cards**: Task counts and status breakdown
- **Priority Overview**: Visual representation of task priorities
- **Quick Actions**: Direct links to common tasks

### Task Management
- **Task List**: Paginated list with search and filtering
- **Task Modal**: Create/edit tasks with comprehensive form
- **Status Badges**: Visual status indicators
- **Priority Indicators**: Color-coded priority levels
- **Due Date Warnings**: Overdue and due-soon indicators

### Profile Management
- **User Information**: View and edit profile details
- **Security Information**: Display security features
- **Account Actions**: Logout options

## 🔄 State Management

### Authentication Context
```javascript
const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)
  
  const login = async (credentials) => {
    const { user, accessToken } = await authService.login(credentials)
    setAccessToken(accessToken)
    dispatch({ type: 'LOGIN_SUCCESS', payload: user })
  }
  
  const logout = async () => {
    await authService.logout()
    clearAccessToken()
    dispatch({ type: 'LOGOUT' })
  }
  
  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
```

### React Query Integration
```javascript
// Custom hooks for data fetching
export const useTasks = (params = {}) => {
  return useQuery(
    ['tasks', params],
    () => taskService.getTasks(params),
    {
      keepPreviousData: true,
      staleTime: 30000,
    }
  )
}

export const useCreateTask = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    (taskData) => taskService.createTask(taskData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tasks')
        toast.success('Task created successfully!')
      },
    }
  )
}
```

## 🎯 Role-Based Access Control

### User Role Features
- **View Own Tasks**: Users can only see tasks they created
- **Create Tasks**: Users can create new tasks
- **Edit Own Tasks**: Users can modify their own tasks
- **No Delete Access**: Users cannot delete tasks

### Admin Role Features
- **View All Tasks**: Admins can see all tasks in the system
- **Delete Tasks**: Admins can delete any task
- **Full CRUD Access**: Complete task management capabilities
- **Admin Panel**: Special admin interface (future enhancement)

### Implementation
```javascript
// Role-based component rendering
const { isAdmin, hasRole } = useAuth()

// Conditional rendering based on role
{isAdmin() && (
  <button onClick={() => handleDeleteTask(task._id)}>
    <Trash2 className="w-4 h-4" />
  </button>
)}

// Route protection
<Route 
  path="/admin" 
  element={isAdmin() ? <AdminPanel /> : <Navigate to="/dashboard" />} 
/>
```

## 📱 Responsive Design

### Mobile-First Approach
- **Breakpoints**: Tailwind CSS responsive utilities
- **Touch-Friendly**: Large touch targets for mobile devices
- **Flexible Layout**: Adapts to different screen sizes
- **Optimized Navigation**: Collapsible sidebar on mobile

### Design System
```css
/* Custom CSS classes for consistency */
.btn {
  @apply inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors;
}

.btn-primary {
  @apply bg-primary text-primary-foreground hover:bg-primary/90;
}

.card {
  @apply rounded-lg border bg-card text-card-foreground shadow-sm;
}
```

## 🧪 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main layout component
│   ├── Header.jsx      # Application header
│   ├── Sidebar.jsx     # Navigation sidebar
│   └── TaskModal.jsx   # Task creation/editing modal
├── pages/              # Page components
│   ├── Login.jsx       # Login page
│   ├── Register.jsx    # Registration page
│   ├── Dashboard.jsx   # Dashboard page
│   ├── Tasks.jsx       # Task management page
│   └── Profile.jsx     # User profile page
├── hooks/              # Custom React hooks
│   ├── useAuth.js      # Authentication hook
│   └── useTasks.js     # Task management hooks
├── services/           # API service layer
│   ├── api.js          # Axios configuration
│   ├── authService.js  # Authentication API calls
│   └── taskService.js  # Task API calls
├── context/            # React Context providers
│   └── AuthContext.jsx # Authentication context
├── utils/              # Utility functions
│   └── helpers.js      # Helper functions
└── styles/             # Styling files
    ├── index.css       # Main styles
    └── globals.css     # Global CSS variables
```

## 🔧 Configuration

### Vite Configuration
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

### Tailwind Configuration
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        // ... other colors
      },
    },
  },
  plugins: [],
}
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
```env
VITE_API_URL=https://your-api-domain.com
VITE_APP_NAME=Secure Task Manager
```

### Docker Deployment
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🧪 Testing

### Component Testing
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom

# Run tests
npm test
```

### E2E Testing
```bash
# Install Playwright
npm install --save-dev @playwright/test

# Run E2E tests
npx playwright test
```

## 📊 Performance Optimization

### Code Splitting
- **Route-based splitting**: Each page is loaded on demand
- **Component lazy loading**: Heavy components loaded when needed
- **Bundle optimization**: Vite's built-in optimization

### Caching Strategy
- **React Query**: Intelligent data caching and background updates
- **Browser caching**: Static assets cached with proper headers
- **Memory management**: Automatic cleanup of unused data

## 🔒 Security Best Practices

1. **No Sensitive Data in Client**: Access tokens never stored in browser storage
2. **HTTPS Only**: All communications encrypted in production
3. **Content Security Policy**: Strict CSP headers
4. **Input Sanitization**: Client-side validation and sanitization
5. **Error Handling**: No sensitive information in error messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@example.com or create an issue in the repository.

## 🔗 Related Resources

- [React Security Best Practices](https://reactjs.org/docs/security.html)
- [OWASP Frontend Security](https://owasp.org/www-project-frontend-security/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Query](https://tanstack.com/query/latest)