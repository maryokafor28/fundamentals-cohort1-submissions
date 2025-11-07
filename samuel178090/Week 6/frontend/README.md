# FlowServe Frontend

A modern React frontend for the FlowServe digital payment platform.

Frontend URL: https://paymentplatform.netlify.app/
Backend URL: https://flowserve-api.onrender.com
 Admin Login:
Option 1 (Email):
Email field: admin@flowserve.com
Password field: admin123

Option 2 (Phone):
Phone field: 01000000000
Password field: admin123

User Login:
Option 1 (Email):
Email field: john.doe@example.com
Password field: password123

Option 2 (Phone):
Phone field: 01234567890
Password field: password123

How to Login:
Go to login page
Enter EITHER email OR phone in the appropriate field
Enter password in password field Click login


## 🏗️ Architecture

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Context + Hooks
- **API Client**: Custom fetch-based service
- **Payment Integration**: Stripe Elements

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd flowserve-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3001
   ```

## 📋 Features

### Core Functionality
- **User Authentication** - Login/Register with JWT
- **Dashboard** - Account overview and quick actions
- **Transaction Management** - Send/Request money
- **User Directory** - Browse and search users
- **Virtual Credit Cards** - Generate and manage VCCs
- **Fund Management** - Add funds via card or cash

### UI/UX Features
- **Responsive Design** - Mobile-first approach
- **Loading States** - Skeleton loaders and spinners
- **Error Handling** - User-friendly error messages
- **Form Validation** - Real-time input validation
- **Toast Notifications** - Success/error feedback

## 🔧 Configuration

### Environment Variables

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key

# App Configuration
VITE_APP_NAME=FlowServe
VITE_APP_VERSION=1.0.0
VITE_ENABLE_DEBUG=true
```

## 📱 Pages & Components

### Public Pages
- **Landing Page** (`/`) - Marketing and features
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - User registration

### Protected Pages
- **Dashboard** (`/dashboard`) - Account overview
- **Transactions** (`/transactions`) - Send/request money
- **Users** (`/users`) - User directory
- **Profile** (`/profile`) - User settings

### Key Components
- **Navbar** - Navigation and user menu
- **Footer** - Links and information
- **AddFundsModal** - Payment processing
- **TransactionSimulator** - Money transfer interface
- **UserList** - User directory with search

## 🎨 Styling

### Tailwind CSS
The project uses Tailwind CSS for styling with:
- **Responsive Design** - Mobile-first breakpoints
- **Custom Colors** - Brand color palette
- **Component Classes** - Reusable utility classes
- **Dark Mode** - Ready for dark theme

### Design System
- **Primary Color**: Blue (#3B82F6)
- **Success Color**: Green (#10B981)
- **Error Color**: Red (#EF4444)
- **Warning Color**: Yellow (#F59E0B)

## 🔐 Authentication

### JWT Token Management
- **Storage**: localStorage
- **Refresh**: Automatic token refresh
- **Expiry**: 24-hour token lifetime
- **Cleanup**: Automatic cleanup on logout

### Protected Routes
Routes are protected using the `ProtectedRoute` component:
```jsx
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

## 📡 API Integration

### API Service
Custom API service with:
- **Request/Response Interceptors**
- **Error Handling**
- **Retry Logic**
- **Request Timeout**
- **Loading States**

### Example Usage
```javascript
import apiService from '../services/api';

// Get user profile
const user = await apiService.getCurrentUser();

// Send money
await apiService.sendMoneyByPhone({
  recipientPhone: '01234567890',
  amount: 100.00
});
```

## 🧪 Testing

### Test Credentials
For development/testing:
- **Phone**: `01234567890`
- **Password**: `password123`

### Mock Data
The frontend works with mock backend data including:
- Sample users
- Transaction history
- Virtual credit cards

## 🚀 Build & Deployment

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Production Build
```bash
npm run build
```
Output: `dist/` folder ready for deployment

### Deployment Options
- **Vercel** - Recommended for React apps
- **Netlify** - Static site hosting
- **Railway** - Full-stack deployment
- **AWS S3** - Static website hosting

## 📊 Performance

### Optimization Features
- **Code Splitting** - Lazy loading components
- **Bundle Optimization** - Vite's built-in optimization
- **Image Optimization** - Responsive images
- **Caching** - API response caching

### Bundle Analysis
```bash
npm run build
npm run preview
```

## 🛠️ Development

### Project Structure
```
src/
├── components/          # React components
│   ├── payments/       # Payment-related components
│   └── ...
├── services/           # API services
├── styles/            # CSS files
├── utils/             # Utility functions
└── main.jsx           # App entry point
```

### Code Style
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Conventional Commits** - Commit message format

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License
Gmail: josephsammy1994@gmail.com
MIT License - see LICENSE file for details.

## 🆘 Support

For issues and questions:
- Create GitHub issues
- Check browser console for errors
- Review network requests in DevTools

## 🔮 Roadmap

- [ ] Mobile app (React Native)
- [ ] Progressive Web App (PWA)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Offline functionality
