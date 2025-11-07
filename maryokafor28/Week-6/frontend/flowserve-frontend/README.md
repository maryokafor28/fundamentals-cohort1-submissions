# FlowServe Frontend

A modern, responsive web application for real-time transaction processing built with React, TypeScript, Tailwind CSS, and Vite.

## 🚀 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Fetch API** - HTTP requests

## 📋 Features

- ✅ User selection (simulated authentication)
- ✅ User management (create, view, delete users)
- ✅ Send money between users
- ✅ Transaction history with filters
- ✅ Status filtering (All, Pending, Completed, Failed, Cancelled)
- ✅ Pagination support
- ✅ Real-time updates
- ✅ Responsive design (mobile-friendly)
- ✅ Error handling and loading states
- ✅ Clean, modern UI with Tailwind CSS

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see [https://github.com/maryokafor28/flowserve-backend.git](link))

## 📦 Installation

1. **Clone the repository:**

```bash
git clone <https://github.com/maryokafor28/flowserve-frontend.git>
cd flowserve-frontend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:4000
```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

App runs on `http://localhost:5173`

### Production Build

```bash
npm run build
```

---

## 📱 App Features & Usage

### 1. Landing Page (User Selection)

- View all existing users
- Select which user you are (simulates login)
- Create new users via "Manage Users"
- Your selection is saved in localStorage

### 2. Transactions Page (Main Dashboard)

- **Send Money Form:**
  - Select receiver from dropdown
  - Enter amount and optional description
  - Submit to create transaction
- **Transaction History:**
  - View all your sent and received transactions
  - Green border = received money
  - Red border = sent money
  - Filter by status (All, Pending, Completed, Failed, Cancelled)
  - Navigate pages with Previous/Next buttons
  - Update transaction status (Mark Complete/Failed)

### 3. Manage Users Page (Admin)

- View all users with pagination
- Create new users (name + email)
- Delete users
- Returns to landing page after user management

---

## 🎨 UI Components

### Common Components

- `Button` - Reusable button with variants (primary, secondary, danger)
- `LoadingSpinner` - Shows during API calls
- `ErrorMessage` - Displays errors with retry option
- `Navbar` - Top navigation with user menu

### User Components

- `UserCard` - Displays user info with delete button
- `UserList` - Lists all users
- `CreateUserForm` - Form to create new users

### Transaction Components

- `TransactionCard` - Shows transaction details with status
- `TransactionList` - Lists all transactions
- `SendMoneyForm` - Form to send money
- `TransactionFilters` - Status filters and pagination controls

---

## 📁 Project Structure

```
flowserve-frontend/
├── public/
├── src/
│   ├── api/                  # API communication
│   │   ├── config.ts         # Fetch wrapper
│   │   ├── userApi.ts        # User endpoints
│   │   └── transactionApi.ts # Transaction endpoints
│   ├── components/           # Reusable components
│   │   ├── common/           # Shared UI components
│   │   ├── users/            # User-related components
│   │   └── transactions/     # Transaction components
│   ├── hooks/                # Custom React hooks
│   │   ├── useUsers.ts
│   │   ├── useTransactions.ts
│   │   └── useCurrentUser.ts
│   ├── pages/                # Page components
│   │   ├── LandingPage.tsx
│   │   ├── TransactionsPage.tsx
│   │   └── ManageUsersPage.tsx
│   ├── types/                # TypeScript types
│   │   └── index.ts
│   ├── utils/                # Helper functions
│   │   └── currentUser.ts    # LocalStorage helpers
│   ├── App.tsx               # Main app with routing
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
├── .env                      # Environment variables
├── .gitignore
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🎯 User Flow

```
1. Landing Page
   ↓
   Select "I am John Doe"
   ↓
   Click "Continue"
   ↓
2. Transactions Dashboard
   ↓
   Send $100 to Jane
   ↓
   Transaction appears in history
   ↓
   Filter by "Completed"
   ↓
3. Switch User (from navbar)
   ↓
   Back to Landing Page
   ↓
   Select "I am Jane"
   ↓
   See received $100 from John
```

---

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
```

---

## 🎨 Styling Guide

This project uses **Tailwind CSS** for styling. Key utilities used:

**Colors:**

- Primary: `bg-blue-600`, `text-blue-600`
- Success: `bg-green-600`, `text-green-600`
- Danger: `bg-red-600`, `text-red-600`
- Warning: `bg-yellow-600`, `text-yellow-600`

**Common Patterns:**

```tsx
// Button
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
  Click Me
</button>

// Card
<div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
  Content
</div>

// Input
<input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
```

---

## 🔄 State Management

Uses **React Hooks** for state management:

- `useState` - Component-level state
- `useEffect` - Side effects (API calls)
- Custom hooks - Reusable logic (useUsers, useTransactions)
- LocalStorage - Persist current user selection

**No external state library needed!**

---

## 🌐 API Integration

All API calls use the native **Fetch API** with a custom wrapper:

```typescript
// Example API call
const users = await userApi.getUsers(1, 20);

// Under the hood:
fetch("http://localhost:4000/api/users?page=1&limit=20").then((res) =>
  res.json()
);
```

**Error Handling:**

- Network errors are caught and displayed
- Loading states shown during requests
- Retry functionality on errors

---

## 📱 Responsive Design

The app is fully responsive:

- **Mobile:** Single column layout, stacked components
- **Tablet:** Two-column grid for some pages
- **Desktop:** Full layout with sidebar and main content

**Breakpoints:**

- `sm:` 640px
- `md:` 768px
- `lg:` 1024px
- `xl:` 1280px

---

## Common Issues & Solutions

### Issue: Can't connect to backend

**Solution:**

1. Ensure backend is running on port 4000
2. Check `.env` file has correct `VITE_API_BASE_URL`
3. Restart frontend dev server after changing `.env`

### Issue: "User not found" after refresh

**Solution:**

- User was deleted but still in localStorage
- Click "Switch User" and select again

### Issue: Transactions not updating

**Solution:**

- Check browser console for errors
- Try refreshing the page
- Verify backend is running

---

## 🧪 Testing the App

### Quick Test Scenario:

1. **Create Users:**

   - Go to "Manage Users"
   - Create: Alice, Bob, Charlie

2. **Send Money:**

   - Go to Landing → Select Alice
   - Send $100 to Bob
   - Send $50 to Charlie

3. **View Received:**

   - Switch to Bob
   - See $100 received from Alice

4. **Test Filters:**

   - Click "Pending" filter
   - Click "Completed" filter
   - Navigate pages

5. **Update Status:**
   - Click "Mark Complete" on pending transaction
   - Status changes to completed

---

## 🚢 Deployment

### Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variable: `VITE_API_BASE_URL=https://flowserve-backend-a163.onrender.com`
4. Deploy

### Manual Build

```bash
npm run build
# Deploy the 'dist' folder to any static host
```

---

## 🔗 Related Repositories

- [https://github.com/maryokafor28/flowserve-backend.git](link-to-backend-repo) - Node.js + Express + PostgreSQL

---

## 🤝 Contributing

This is a test project for learning purposes.

## 👤 Author

**Mary Amadi**  
GitHub: [@braveredemptive](https://github.com/braveredemptive)

---

## Support

For issues or questions, open an issue on GitHub.

---

## Acknowledgments

Built as part of the FlowServe fintech challenge to demonstrate scalable API design and modern frontend development practices.
