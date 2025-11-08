# CodePilot Frontend

A minimal React-Vite frontend application for testing the CodePilot backend API.

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## 🎯 Features

- **Authentication Testing**: Login functionality with token display
- **Product Management**: View and interact with products
- **Order Management**: Create and view orders
- **Error Handling**: Comprehensive error states and user feedback
- **Loading States**: Visual feedback during API calls
- **Responsive Design**: Mobile-friendly interface

## 🔧 Configuration

Make sure the backend server is running on `http://localhost:3000` before using the frontend.

## 📱 Usage

1. **Start the backend server** (see backend README)
2. **Start the frontend**: `npm run dev`
3. **Open browser**: Navigate to `http://localhost:5173`
4. **Test API endpoints**:
   - Click "Login as Admin" to authenticate
   - View products automatically loaded
   - Create test orders
   - Refresh data as needed

## 🛠️ API Integration

The frontend integrates with these backend endpoints:
- `POST /api/auth/login` - User authentication
- `GET /api/products` - Fetch products
- `GET /api/orders` - Fetch orders
- `POST /api/orders` - Create new orders

## 🎨 UI Components

- **Header**: Application branding and description
- **Auth Section**: Login functionality and token display
- **Products Section**: Product grid with details
- **Orders Section**: Order management and creation

## 📋 Error Handling

The application handles various error scenarios:
- Network connectivity issues
- API server errors
- Invalid responses
- Authentication failures

## 🔄 State Management

Uses React hooks for state management:
- `useState` for component state
- `useEffect` for side effects
- Loading and error states for better UX

This frontend serves as a practical testing interface for the backend API, demonstrating real-world usage patterns and error handling.