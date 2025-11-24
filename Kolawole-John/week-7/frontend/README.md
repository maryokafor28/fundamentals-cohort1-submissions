# CodePilot Frontend

> React-Vite client for testing the CodePilot Backend API

## 🚀 Features

- **User Authentication** - Register and login functionality
- **Product Management** - View and create products
- **Order Placement** - Place orders with real-time stock updates
- **Order Tracking** - View order history and status
- **Error Handling** - Graceful error messages and loading states
- **Responsive Design** - Works on desktop and mobile

## 📦 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client for API calls
- **CSS3** - Modern styling with CSS variables

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 🔧 Configuration

Edit `.env` to configure the API endpoint:

```env
VITE_API_URL=http://localhost:5000/api
```

## 📱 Usage Guide

### Authentication
1. **Register** - Create a new account
2. **Login** - Access your dashboard
3. JWT token stored automatically

### Product Management
1. **Browse Products** - View all available items
2. **Create Products** - Add new items to catalog
3. **Check Stock** - Real-time availability

### Order Management
1. **Place Orders** - Select products and quantity
2. **Track Orders** - View order history and status
3. **Monitor Stock** - Automatic stock updates

## 🏗️ Project Structure

```
src/
├── services/
│   └── api.js          # API client configuration
├── App.jsx             # Main application component
├── App.css             # Application styles
└── main.jsx            # Entry point
```

## 🎨 Key Components

- **Authentication Forms** - Login and registration
- **Product Grid** - Display available products
- **Product Form** - Create new products
- **Order List** - View order history
- **Status Badges** - Visual order status indicators

## 🚀 Building for Production

```bash
npm run build
npm run preview
```

## 📄 License

MIT
