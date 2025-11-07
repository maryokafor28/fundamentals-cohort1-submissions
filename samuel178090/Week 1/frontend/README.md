# QDACK E-commerce Frontend
Url = https://qdacf.netlify.app/  Admin email: admin@example.com password: admin123 
Customer email: customer@example.com password: customer123
A modern, responsive e-commerce frontend built with Next.js 15 and React 19, designed to consume microservices APIs.

## 🏗️ Frontend Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐ │
│  │   PAGES LAYER   │    │ COMPONENTS LAYER│    │ SERVICES     │ │
│  ├─────────────────┤    ├─────────────────┤    │ LAYER        │ │
│  │ • Homepage      │    │ • ProductItem   │    ├──────────────┤ │
│  │ • Products      │    │ • CartItems     │    │ • API Client │ │
│  │ • Product Detail│    │ • TopHead       │    │ • User Svc   │ │
│  │ • Authentication│    │ • Footer        │    │ • Product Svc│ │
│  │ • Checkout      │    │ • Auth Forms    │    │ • Order Svc  │ │
│  │ • My Account    │    │ • Cart Canvas   │    │ • Axios      │ │
│  └─────────────────┘    └─────────────────┘    └──────────────┘ │
│           │                       │                       │     │
│           └───────────────────────┼───────────────────────┘     │
│                                   │                             │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                 STATE MANAGEMENT                            │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │ • React Context API                                        │ │
│  │ • User Authentication State                                │ │
│  │ • Shopping Cart State                                      │ │
│  │ • LocalStorage Persistence                                 │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                   │                             │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                 STYLING & UI                                │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │ • Bootstrap 5                                               │ │
│  │ • React-Bootstrap Components                                │ │
│  │ • Custom CSS Modules                                        │ │
│  │ • React Bootstrap Icons                                     │ │
│  │ • Responsive Design                                         │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND APIs                                 │
├─────────────────────────────────────────────────────────────────┤
│  http://localhost:3100/api/v1/                                 │
│  ├── /products (GET, POST, PUT, DELETE)                        │
│  ├── /users (POST, PUT, GET)                                   │
│  ├── /orders (GET, POST)                                       │
│  └── /csrf-token (GET)                                         │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend API running on port 3100

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd mservice-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Configure environment variables
# See Environment Configuration section below
```

### Environment Configuration

Create `.env.local` file:

```env
# API Configuration
NEXT_PUBLIC_BASE_API_URL_LOCAL=http://localhost:3100
NEXT_PUBLIC_BASE_API_URL=http://localhost:3100
NEXT_PUBLIC_BASE_API_PREFIX=/api/v1
NEXT_PUBLIC_API_TIMEOUT=15000

# Environment
NODE_ENV=development
PORT=3000
```

### Development Server

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
mservice-frontend/
├── pages/                    # Next.js pages (routing)
│   ├── index.tsx            # Homepage
│   ├── products/            # Products pages
│   │   ├── index.tsx        # Products listing
│   │   └── [id].tsx         # Product detail
│   ├── auth.tsx             # Authentication
│   ├── checkout.tsx         # Checkout page
│   └── my-account.tsx       # User dashboard
├── components/              # Reusable components
│   ├── Auth/                # Authentication components
│   ├── Products/            # Product-related components
│   ├── shared/              # Shared components
│   │   ├── TopHead.tsx      # Header with navigation
│   │   ├── Footer.tsx       # Footer component
│   │   └── Layout.tsx       # Page layout wrapper
│   ├── CartItems.tsx        # Cart items display
│   └── CartOffCanvas.tsx    # Shopping cart sidebar
├── context/                 # React Context for state
│   └── index.tsx           # Global state management
├── services/               # API service layer
│   ├── api.ts              # Base API configuration
│   ├── user.service.ts     # User-related API calls
│   ├── product.service.ts  # Product-related API calls
│   └── order.service.ts    # Order-related API calls
├── styles/                 # CSS and styling
│   ├── globals.css         # Global styles
│   └── *.module.css        # Component-specific styles
├── helper/                 # Utility functions
│   └── utils.ts            # Helper functions
├── public/                 # Static assets
└── package.json           # Dependencies and scripts
```

## 🎯 Key Features

### ✅ E-commerce Functionality
- **Product Catalog**: Browse 14+ products with images and details
- **Search & Filter**: Multi-field search and platform filtering
- **Shopping Cart**: Add/remove items with real-time updates
- **Checkout Process**: Complete order processing flow
- **User Authentication**: Login/register with JWT tokens
- **User Dashboard**: Account management and order history

### ✅ Technical Features
- **Server-Side Rendering**: Next.js SSR for better SEO
- **Responsive Design**: Mobile-first Bootstrap 5 design
- **State Management**: React Context API for global state
- **API Integration**: Axios-based service layer
- **Error Handling**: Comprehensive error management
- **Security**: CSRF token handling and secure authentication

### ✅ UI/UX Features
- **Professional Design**: Modern Bootstrap-based interface
- **User Avatars**: Dynamic profile images
- **Real-time Updates**: Live cart and pricing updates
- **Loading States**: Proper loading indicators
- **Toast Notifications**: User feedback system
- **Accessibility**: ARIA labels and keyboard navigation

## 🔧 API Integration

### Service Layer Architecture

```typescript
// services/api.ts - Base configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL_LOCAL;
const API_PREFIX = process.env.NEXT_PUBLIC_BASE_API_PREFIX;

// services/user.service.ts - User operations
export const Users = {
  registerNewUser: (userData) => requests.post('/users', userData),
  loginUser: (credentials) => requests.post('/users/login', credentials),
  logoutUser: () => requests.put('/users/logout', {}),
  // ... more methods
};

// services/product.service.ts - Product operations
export const Products = {
  getAllProducts: (params) => requests.get('/products', { params }),
  getProduct: (id) => requests.get(`/products/${id}`),
  searchProducts: (query) => requests.get(`/products?search=${query}`),
  // ... more methods
};
```

### State Management

```typescript
// context/index.tsx - Global state
const Context = createContext({
  state: { user: null },
  dispatch: () => {},
  cartItems: [],
  cartDispatch: () => {},
});

// Usage in components
const { state, dispatch, cartItems, cartDispatch } = useContext(Context);
```

## 🎨 Styling & Theming

### Bootstrap 5 Integration
- **Components**: React-Bootstrap for consistent UI
- **Grid System**: Responsive layout with Bootstrap grid
- **Utilities**: Bootstrap utility classes for spacing/colors
- **Icons**: React Bootstrap Icons for consistent iconography

### Custom Styling
- **CSS Modules**: Component-scoped styling
- **Global Styles**: Application-wide styles
- **Responsive Design**: Mobile-first approach
- **Brand Colors**: QDACK brand color scheme

## 🔒 Security Features

- **CSRF Protection**: Automatic CSRF token handling
- **JWT Authentication**: Secure token-based authentication
- **Secure Storage**: HTTP-only cookies for sensitive data
- **Input Validation**: Client-side form validation
- **XSS Protection**: Sanitized user inputs

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Features
- **Touch-friendly**: Large tap targets
- **Swipe Navigation**: Mobile-optimized interactions
- **Responsive Images**: Optimized for different screen sizes
- **Mobile Menu**: Collapsible navigation

## 🧪 Testing

### Manual Testing
```bash
# Test user registration
# Navigate to /auth and create account

# Test product search
# Use search bar in header

# Test shopping cart
# Add products and proceed to checkout

# Test authentication
# Login/logout functionality
```

### Test User Accounts
```bash
# Customer Account
Email: customer@example.com
Password: customer123

# Admin Account
Email: admin@example.com
Password: admin123
```

## 🚀 Deployment

### Production Build
```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables (Production)
```env
NEXT_PUBLIC_BASE_API_URL=https://your-api-domain.com
NEXT_PUBLIC_BASE_API_PREFIX=/api/v1
NODE_ENV=production
```

## 📚 Relevant Links

- **Next.js Documentation**: https://nextjs.org/docs
- **React Bootstrap**: https://react-bootstrap.github.io/
- **Bootstrap 5**: https://getbootstrap.com/docs/5.0/
- **React Context API**: https://reactjs.org/docs/context.html
- **Axios**: https://axios-http.com/docs/intro

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using Next.js and React**