# PulseTrack Frontend

A modern healthcare management system frontend built with React, TypeScript, Vite, and TailwindCSS.

## 🚀 Live Demo

**Production URL**: [https://pulsetrack-frontend-drab.vercel.app](https://pulsetrack-frontend-drab.vercel.app)

**Backend API**: [https://pulsetrack-backend-4pc4.onrender.com/api](https://pulsetrack-backend-4pc4.onrender.com/api)

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui
- **Routing**: React Router v6
- **Icons**: Lucide React
- **State Management**: React Context API
- **HTTP Client**: Fetch API

## ✨ Features

- User authentication (Sign up, Sign in, Logout)
- User profile management
- Browse and manage doctors
- Book and manage appointments
- Responsive design (mobile-friendly)
- Modern UI with TailwindCSS
- Protected routes with authentication
- Clean and intuitive interface

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/maryokafor28/pulsetrack-frontend.git
   cd pulsetrack-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

   For production (Vercel), use:

   ```env
   VITE_API_BASE_URL=https://pulsetrack-backend-4pc4.onrender.com/api
   ```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

The app will start at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🎨 UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) for pre-built, customizable components. To add new components:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
```

## 🔑 Authentication Flow

1. **Sign Up**: Users register with name, email, password, and role (user/doctor)
2. **Sign In**: Users login with email and password
3. **Token Storage**: JWT token is stored in localStorage
4. **Protected Routes**: Routes check authentication before allowing access
5. **Auto-login**: App checks for existing token on mount
6. **Logout**: Clears token and user state, redirects to home

## 🛣️ Routes

| Route           | Component    | Protection | Description            |
| --------------- | ------------ | ---------- | ---------------------- |
| `/`             | Home         | Public     | Landing page           |
| `/login`        | Login        | Public     | User login             |
| `/signup`       | Signup       | Public     | User registration      |
| `/users`        | Users        | Protected  | User management        |
| `/doctors`      | Doctors      | Protected  | Doctor listings        |
| `/appointments` | Appointments | Protected  | Appointment management |
| `/activities`   | Activities   | Protected  | Activity tracking      |

## 🔒 Environment Variables

### Local Development (.env)

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Production (Vercel Dashboard)

```env
VITE_API_BASE_URL=https://pulsetrack-backend-4pc4.onrender.com/api
```

**Note**: Vite requires environment variables to be prefixed with `VITE_` to be accessible in the browser.

## Deployment

This project is configured for deployment on [Vercel](https://vercel.com/).

### Deploy to Vercel

#### Option 1: Via Vercel Dashboard

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your repository
5. Add environment variables:
   - `VITE_API_BASE_URL`: `https://pulsetrack-backend-4pc4.onrender.com/api`
6. Click "Deploy"

#### Option 2: Via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

### Auto-Deploy

Vercel automatically deploys on every push to your main branch.

## 📦 Available Scripts

| Script            | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start development server with hot reload |
| `npm run build`   | Build for production                     |
| `npm run preview` | Preview production build locally         |
| `npm run lint`    | Run ESLint                               |

## 🎯 Key Features Implementation

### Authentication

```typescript
// Using the auth hook
import { useAuth } from "@/hooks/useAuth";

const { user, signin, signup, logout } = useAuth();
```

### Making API Calls

```typescript
// Using the API service
import { AuthAPI } from "@/services/authApi";

await AuthAPI.signin({ email, password });
const currentUser = await AuthAPI.getMe();
```

### Protected Routes

```typescript
// Wrap routes that require authentication
<ProtectedRoute>
  <Users />
  <Doctors />
</ProtectedRoute>
```

## Styling

This project uses TailwindCSS for styling. Key configurations:

- **Colors**: Defined in `tailwind.config.js`
- **Components**: Located in `src/components/ui/`
- **Global Styles**: `src/index.css`

Example usage:

```tsx
<button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90">
  Click me
</button>
```

## Troubleshooting

### CORS Errors

If you encounter CORS errors, ensure your backend allows your frontend origin:

```typescript
// Backend: src/server.ts
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://pulsetrack-frontend-drab.vercel.app",
    ],
    credentials: true,
  })
);
```

### Environment Variables Not Working

- Ensure variables are prefixed with `VITE_`
- Restart dev server after changing `.env`
- On Vercel, redeploy after adding variables

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## 👤 Author

**Your Name**

## 🔗 Related Links

- **Backend Repository**: [pulsetrack-backend](https://github.com/maryokafor28/pulsetrack-backend.git)
- **API Documentation**: [Postman Docs](https://documenter.getpostman.com/view/48798242/2sB3Wjz4Ce)
- **Live Backend**: [API URL](https://pulsetrack-backend-4pc4.onrender.com/api)

---
