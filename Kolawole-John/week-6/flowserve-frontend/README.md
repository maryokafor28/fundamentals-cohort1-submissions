# FlowServe Frontend

Modern React-Vite frontend application for managing users and transactions in the FlowServe fintech platform.

## 🚀 Features

- **User Management**: View, create, edit, and delete users
- **Transaction Management**: Create and view transactions
- **Real-time Updates**: Instant feedback on all operations
- **Responsive Design**: Mobile-first, works on all devices
- **Error Handling**: Comprehensive error states and user feedback
- **Loading States**: Clear loading indicators for better UX

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **State Management**: React Hooks
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Running FlowServe Backend API

## 🔧 Installation

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

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

4. **Start development server**

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
flowserve-frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx
│   │   ├── UserList.jsx
│   │   ├── UserForm.jsx
│   │   ├── TransactionList.jsx
│   │   ├── TransactionForm.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ErrorMessage.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── userService.js
│   │   └── transactionService.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Users.jsx
│   │   └── Transactions.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🎨 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🌐 Pages

### Home (`/`)

Dashboard overview with quick stats and recent activity

### Users (`/users`)

- View all users in a paginated table
- Create new users
- Edit existing users
- Delete users
- View user details and wallet balance

### Transactions (`/transactions`)

- View all transactions
- Create new transactions (credit/debit)
- Filter transactions by user
- View transaction details

## 🔌 API Integration

The frontend communicates with the backend API using Axios. All API calls are centralized in the `services` directory:

- `userService.js` - User-related API calls
- `transactionService.js` - Transaction-related API calls
- `api.js` - Axios configuration and interceptors

## 🎯 Key Features

### User Management

- **List Users**: Paginated list with search and filter
- **Create User**: Form validation and error handling
- **Edit User**: Pre-filled form with current data
- **Delete User**: Confirmation dialog before deletion
- **View Details**: Expandable rows showing transaction history

### Transaction Management

- **Create Transaction**:
  - Select user from dropdown
  - Choose transaction type (Credit/Debit)
  - Enter amount and description
  - Real-time balance validation
- **View Transactions**:
  - Paginated list
  - Filter by user
  - Sort by date
  - Status indicators

### State Management

- Loading states for all async operations
- Error boundaries for graceful error handling
- Success notifications
- Form validation feedback

## 🎨 Styling

The application uses Tailwind CSS for styling with a modern, clean design:

- Color scheme: Blue primary, gray neutrals
- Responsive breakpoints for mobile, tablet, desktop
- Custom components with consistent styling
- Hover and focus states for better UX

## 🔒 Error Handling

Comprehensive error handling for:

- Network errors
- API errors (4xx, 5xx)
- Validation errors
- Rate limiting errors
- Timeout errors

All errors display user-friendly messages with actionable feedback.

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:

- Mobile devices (< 640px)
- Tablets (640px - 1024px)
- Desktops (> 1024px)

## 🚀 Deployment

### Using Vercel

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Deploy:

```bash
vercel
```

### Using Netlify

1. Build the project:

```bash
npm run build
```

2. Deploy the `dist` folder to Netlify

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

## 🔧 Configuration

### Vite Configuration

The `vite.config.js` file includes:

- React plugin
- Path aliases
- Build optimization
- Development server settings

### Tailwind Configuration

The `tailwind.config.js` file includes:

- Custom color palette
- Extended spacing
- Custom utilities
- Plugin configuration

## 📚 Dependencies

### Production Dependencies

- `react` - UI library
- `react-dom` - React DOM renderer
- `react-router-dom` - Routing
- `axios` - HTTP client
- `lucide-react` - Icon library

### Development Dependencies

- `vite` - Build tool
- `@vitejs/plugin-react` - React plugin for Vite
- `tailwindcss` - Utility-first CSS framework
- `autoprefixer` - PostCSS plugin
- `postcss` - CSS processor
- `eslint` - Code linter

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React documentation
- Vite documentation
- Tailwind CSS
- FlowServe Backend API
