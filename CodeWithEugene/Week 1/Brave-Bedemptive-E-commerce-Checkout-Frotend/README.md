# Brave Redemptive E-commerce Frontend

A modern React-Vite frontend application for an e-commerce checkout system built as part of the microservices architecture challenge.

## 🚀 Features

- **Modern React with TypeScript**: Built with Vite for fast development and build times
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Cart Management**: Add, update, and remove items from shopping cart
- **Product Catalog**: Browse and view product details
- **User Authentication**: Simple login system for demo purposes
- **Real-time Updates**: Cart updates in real-time with backend integration

## 🏗️ Architecture

This frontend is part of a microservices-based e-commerce system. It communicates with the following backend services:

- **Cart Service**: Handles cart operations (add, update, remove items)
- **User Authentication**: Manages user sessions and authentication

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Backend Cart Service** running on `http://localhost:5000`

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone [your-repository-url]
cd Brave-Bedemptive-E-commerce-Checkout-Frotend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Copy the environment file and configure it:

```bash
cp .env.example .env
```

Update `.env` with your backend URL:

```bash
VITE_API_BASE_URL=http://localhost:5000
```

### 4. Start the Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## 🧪 Backend Setup

Make sure your backend cart service is running. The backend should be available at:

**Repository**: `/home/eugenius/Documents/Eugenius/Projects/Brave Redemptive/Week 1/Brave-Bedemptive-E-commerce-Checkout-Backend`

The frontend expects the following API endpoints:

- `GET /get-cart/:userId` - Get user's cart
- `POST /add-to-cart` - Add item to cart
- `PUT /update-cart-item` - Update cart item quantity
- `DELETE /remove-from-cart` - Remove item from cart
- `DELETE /clear-cart/:userId` - Clear entire cart

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Header/         # Navigation header
│   ├── Login/          # Authentication component
│   ├── ProductList/    # Product display and catalog
│   └── Cart/           # Shopping cart management
├── services/           # API service layer
│   └── cartService.ts  # Cart API interactions
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared interfaces
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## 🎨 Components Overview

### Header Component
- Navigation between Products and Cart pages
- User information display
- Cart item counter
- Logout functionality

### Login Component
- Simple authentication form
- User session management
- Responsive design

### ProductList Component
- Display of available products
- Add to cart functionality
- Product filtering and categorization
- Stock status indication

### Cart Component
- View cart items
- Update item quantities
- Remove items from cart
- Cart total calculation
- Checkout button (ready for future implementation)

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 Responsive Design

The application is fully responsive and optimized for:

- **Desktop**: Full grid layout with sidebar cart summary
- **Tablet**: Adapted grid with responsive navigation
- **Mobile**: Single-column layout with mobile-optimized components

## 🔗 API Integration

The frontend uses Axios for HTTP requests with the following features:

- **Automatic Base URL Configuration**: Set via environment variables
- **Request/Response Interceptors**: For logging and error handling
- **Error Handling**: User-friendly error messages
- **Loading States**: Visual feedback during API calls

## 🎯 Future Enhancements

- **Payment Integration**: Stripe or PayPal checkout
- **Product Search**: Advanced filtering and search functionality
- **User Profiles**: Extended user management
- **Order History**: Track past purchases
- **Wishlist**: Save items for later
- **Reviews & Ratings**: Product feedback system

## 🧪 Testing

The application includes mock data for testing without backend dependency:

- Sample products with images from Unsplash
- Simulated API responses
- Error handling demonstrations

## 📊 Performance Optimization

- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Responsive images with fallbacks
- **Bundle Splitting**: Optimized build output
- **CSS Optimization**: Minimal and efficient styling

## 🔐 Security Considerations

- **Input Validation**: Client-side validation for all forms
- **XSS Protection**: Sanitized user inputs
- **HTTPS Ready**: Production-ready security headers
- **Environment Variables**: Secure configuration management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is part of the Brave Redemptive coding challenge.

## 📞 Support

For questions or issues, please contact:

- **Developer**: Eugene
- **Email**: [your-email@example.com]
- **Repository**: [GitHub Repository Link]

---

**Note**: This is a frontend application that requires the backend cart service to be running for full functionality. Make sure to start the backend service before testing the complete application flow.
