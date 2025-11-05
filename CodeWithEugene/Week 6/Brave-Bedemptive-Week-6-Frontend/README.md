# Brave-Bedemptive-Week-6-Frontend
A modern, interactive React + Vite + TypeScript frontend application for the FlowServe API system. This application provides a beautiful user interface for managing users and simulating financial transactions.

## Project Overview

FlowServe Frontend is a fintech simulation application that interfaces with the FlowServe backend API to provide:
- User account management with CRUD operations
- Real-time transaction simulation and monitoring
- Dashboard with comprehensive statistics
- Responsive design for mobile and desktop

## Tech Stack

- **Framework:** React 18 with Vite
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Routing:** React Router DOM
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- FlowServe Backend running on port 5000

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/Brave-Bedemptive-Week-6-Frontend.git
cd Brave-Bedemptive-Week-6-Frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` file and configure:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

4. **Start the development server:**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

## Environment Configuration

Create a `.env` file in the root directory with the following variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:5000/api` |

## Backend Integration

This frontend application requires the FlowServe backend to be running. The backend should provide the following endpoints:

### User Endpoints
- `GET /api/users` - Get all users with pagination
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/stats` - Get user statistics

### Transaction Endpoints
- `GET /api/transactions` - Get all transactions with filters
- `GET /api/transactions/:id` - Get transaction by ID
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/user/:userId` - Get user transactions
- `GET /api/transactions/stats` - Get transaction statistics

## Features Overview

### 1. Dashboard (Home Page)
- Real-time statistics overview
- Total users, balance, and transaction counts
- Transaction status breakdown
- Quick navigation to key features

### 2. User Management
- **Create Users:** Add new users with initial balance
- **View Users:** List all users with search and pagination
- **Update Users:** Edit user details and balance
- **Delete Users:** Remove users from the system
- **User Details:** View comprehensive user information

### 3. Transaction Management
- **Create Transactions:** Perform credit/debit operations
- **Transaction History:** View all transactions with filters
- **Bulk Simulation:** Simulate multiple random transactions
- **Export Data:** Download transactions as CSV
- **Real-time Updates:** Instant balance updates after transactions

### 4. UI/UX Features
- Responsive design for all screen sizes
- Loading states and error handling
- Toast notifications for user feedback
- Modal dialogs for forms
- Pagination for large datasets
- Data export functionality

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Layout.tsx     # Main layout with navigation
│   ├── UserList.tsx   # User table component
│   ├── TransactionList.tsx # Transaction list component
│   ├── Loader.tsx     # Loading spinner
│   ├── ErrorMessage.tsx # Error display component
│   └── Modal.tsx      # Modal dialog component
├── pages/             # Application pages
│   ├── HomePage.tsx   # Dashboard with statistics
│   ├── UsersPage.tsx  # User management page
│   └── TransactionsPage.tsx # Transaction management
├── services/          # API service layer
│   ├── api.ts        # Axios configuration
│   ├── userService.ts # User API methods
│   └── transactionService.ts # Transaction API methods
├── store/            # State management
│   └── useStore.ts   # Zustand store
├── types/            # TypeScript definitions
│   └── index.ts      # Shared interfaces
├── App.tsx           # Main application component
├── main.tsx          # Application entry point
└── index.css         # Global styles with Tailwind
```

## Screenshots

### Dashboard
The dashboard provides a comprehensive overview of the system with real-time statistics and quick actions.

### User Management
Manage users with a beautiful interface featuring create, read, update, and delete operations.

### Transaction Simulation
Simulate and monitor financial transactions with advanced filtering and export capabilities.

## Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to Netlify via drag-and-drop or CLI.

## Testing

Run the development server and test the following features:

1. **User Management:**
   - Create a new user with initial balance
   - Edit user details
   - Delete a user
   - View user information

2. **Transaction Flow:**
   - Create credit/debit transactions
   - Simulate bulk transactions
   - Filter transactions by user/type/status
   - Export transaction data

3. **Responsive Design:**
   - Test on various screen sizes
   - Verify mobile navigation works correctly

## Troubleshooting

### Common Issues

1. **API Connection Error:**
   - Ensure the backend is running on port 5000
   - Check the `VITE_API_BASE_URL` in `.env`
   - Verify CORS is enabled on the backend

2. **Build Errors:**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version (should be v16+)

3. **Styling Issues:**
   - Ensure TailwindCSS is properly configured
   - Check PostCSS configuration

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [TailwindCSS Documentation](https://tailwindcss.com)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## Contributing

This is a learning project for the Brave Redemptive Fundamentals cohort. Feel free to fork and modify for your own learning purposes.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Cohort: Brave Redemptive Fundamentals – Software Engineering Track

## Acknowledgments

- Brave Redemptive team for the project guidelines
- Microsoft Azure Architecture documentation for API design best practices
