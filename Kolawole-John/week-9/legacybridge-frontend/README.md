# LegacyBridge Frontend

Modern React + TypeScript + Tailwind CSS frontend for the LegacyBridge integration service.

## 🚀 Features

- ✅ **Modern React** with TypeScript
- ✅ **React Query** for smart data fetching and caching
- ✅ **Tailwind CSS** for responsive, beautiful UI
- ✅ **React Router** for navigation
- ✅ **Error Boundaries** for graceful error handling
- ✅ **Loading States** with skeleton loaders
- ✅ **Responsive Design** - works on all devices
- ✅ **Production Ready** - optimized for performance

## 📋 Prerequisites

- Node.js 18+ and npm
- Backend API running (see `legacybridge-backend`)

## 🛠️ Installation

```bash
# Install dependencies
npm install
```

## ⚙️ Configuration

Create `.env.development` file:

```bash
VITE_API_URL=http://localhost:3000
```

Create `.env.production` file for production:

```bash
VITE_API_URL=https://your-backend-api.com
```

## 🚀 Development

```bash
# Start development server
npm run dev

# Runs on http://localhost:5173
```

## 🏗️ Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── EmptyState.tsx
│   │   └── Pagination.tsx
│   ├── layout/          # Layout components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   └── payments/        # Payment components
│       ├── PaymentCard.tsx
│       └── PaymentStats.tsx
├── pages/               # Page components
│   ├── Home.tsx
│   ├── Payments.tsx
│   ├── PaymentDetail.tsx
│   ├── Customers.tsx
│   └── CustomerDetail.tsx
├── services/            # API services
│   ├── api.ts           # Axios configuration
│   └── queries.ts       # React Query hooks
├── types/               # TypeScript types
│   └── index.ts
├── utils/               # Utility functions
│   ├── format.ts        # Formatters
│   └── constants.ts     # Constants
├── App.tsx              # Main app component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## 🎨 Pages

### Dashboard (`/`)

- Payment statistics overview
- Recent payments
- System status
- Quick navigation

### Payments (`/payments`)

- List all payments
- Filter by status (completed, pending, failed)
- Pagination
- Click to view details

### Payment Detail (`/payments/:id`)

- Full payment information
- Customer details
- Transaction timeline
- Metadata

### Customers (`/customers`)

- List all customers
- Grid layout
- Pagination
- Click to view profile

### Customer Detail (`/customers/:id`)

- Customer information
- Payment history
- Statistics
- Recent transactions

## 🔧 Available Scripts

| Script            | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |

## 📦 Dependencies

### Core

- `react` - UI library
- `react-dom` - React DOM renderer
- `react-router-dom` - Routing
- `typescript` - Type safety

### Data Fetching

- `@tanstack/react-query` - Data fetching & caching
- `axios` - HTTP client

### UI & Styling

- `tailwindcss` - Utility-first CSS
- `lucide-react` - Icons
- `clsx` - Class name utility

### Utilities

- `date-fns` - Date formatting
- `recharts` - Charts (if needed)

## 🎯 Key Features Implementation

### Smart Caching

React Query automatically:

- Caches API responses
- Refetches stale data
- Handles loading states
- Manages errors

### Error Handling

- Error boundaries catch crashes
- Inline error displays
- Retry functionality
- User-friendly messages

### Loading States

- Skeleton loaders
- Spinner components
- Optimistic updates
- Smooth transitions

### Responsive Design

- Mobile-first approach
- Tailwind breakpoints
- Adaptive layouts
- Touch-friendly

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

### Netlify

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Environment variables: `VITE_API_URL`

### Environment Variables

Set these in your deployment platform:

```
VITE_API_URL=https://your-backend-api.com
```

## 🔍 Troubleshooting

### API Connection Issues

```bash
# Check backend is running
curl http://localhost:3000/health

# Check environment variables
echo $VITE_API_URL
```

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### TypeScript Errors

```bash
# Check TypeScript compilation
npx tsc --noEmit
```

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Query](https://tanstack.com/query)
- [React Router](https://reactrouter.com)

## 🤝 Contributing

1. Follow existing code style
2. Use TypeScript strictly
3. Add proper error handling
4. Test on multiple devices

## 📄 License

MIT License - Built for Week 9 Challenge

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
