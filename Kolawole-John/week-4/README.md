File: frontend/README.md
markdown# DevConnect Frontend

A modern, responsive React application for the DevConnect platform - A developer collaboration platform where developers can share projects, find collaborators, and build together.

## 🚀 Features

- **User Authentication** - Sign up, login, and secure JWT-based authentication
- **Project Management** - Create, view, update, and delete projects
- **Collaboration** - Mark projects as looking for collaborators
- **Comments System** - Engage with projects through comments
- **Search & Filter** - Find projects by status and keywords
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Real-time Updates** - Using React Query for automatic data synchronization

## 🛠️ Tech Stack

- **React 18.3.1** - UI library
- **Vite 5.4.20** - Build tool and dev server
- **React Router DOM 6.30.1** - Client-side routing
- **TanStack Query 5.90.5** - Data fetching and caching
- **Axios 1.12.2** - HTTP client
- **React Hook Form 7.65.0** - Form handling
- **React Hot Toast 2.6.0** - Toast notifications
- **Lucide React 0.294.0** - Icon library
- **Tailwind CSS 3.4.18** - Utility-first CSS framework

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running on `http://localhost:5000`

### Setup Steps

1. **Clone the repository**

```bash
git clone
cd devconnect-frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Create environment file**

```bash
cp .env.example .env
```

4. **Configure environment variables**

Edit `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

For production:

```env
VITE_API_URL=https://your-backend-url.com/api
```

5. **Start development server**

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/          # Layout components (Navbar, Footer)
│   │   ├── common/          # Reusable components
│   │   ├── auth/            # Authentication components
│   │   ├── projects/        # Project-related components
│   │   └── comments/        # Comment components
│   ├── pages/               # Page components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Third-party configurations
│   ├── utils/               # Helper functions and constants
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # App entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── .env                     # Environment variables
├── .env.example             # Environment variables template
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
└── package.json             # Dependencies and scripts
```

## 🎯 Available Scripts

### Development

```bash
npm run dev
```

Starts the development server with hot module replacement at `http://localhost:5173`

### Build

```bash
npm run build
```

Creates an optimized production build in the `dist/` folder

### Preview

```bash
npm run preview
```

Preview the production build locally

### Lint

```bash
npm run lint
```

Run ESLint to check code quality

## 🎨 Key Features Explained

### Authentication Flow

- JWT-based authentication with HTTP-only cookies
- Automatic token refresh
- Protected routes for authenticated users
- Persistent login state

### Data Management

- **React Query** for efficient data fetching and caching
- Automatic background refetching
- Optimistic updates for better UX
- Request deduplication

### UI/UX Features

- Responsive design with Tailwind CSS
- Loading states and skeleton screens
- Error boundaries for graceful error handling
- Toast notifications for user feedback
- Smooth page transitions

## 🔧 Configuration

### Environment Variables

| Variable       | Description          | Default                     |
| -------------- | -------------------- | --------------------------- |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

### Tailwind Configuration

Custom theme extensions in `tailwind.config.js`:

- Primary color palette
- Custom animations (fade-in, slide-up)
- Custom utility classes (btn-primary, input-field, card)

### React Query Configuration

Settings in `src/lib/queryClient.js`:

- Stale time: 5 minutes
- Cache time: 10 minutes
- No refetch on window focus
- 1 retry on failure

## 📱 Pages & Routes

| Route             | Component      | Access    |
| ----------------- | -------------- | --------- |
| `/`               | Home           | Public    |
| `/login`          | Login          | Public    |
| `/signup`         | Signup         | Public    |
| `/projects/:id`   | ProjectDetails | Public    |
| `/profile/:id`    | Profile        | Protected |
| `/create-project` | CreateProject  | Protected |

## 🎭 Component Hierarchy

```
App
├── Layout
│   ├── Navbar
│   └── Footer
└── Routes
    ├── Home
    │   ├── ProjectFilters
    │   ├── ProjectList
    │   │   └── ProjectCard
    │   └── CreateProjectModal
    ├── ProjectDetails
    │   └── CommentSection
    ├── Profile
    ├── CreateProject
    ├── Login (LoginForm)
    └── Signup (SignupForm)
```

## 🚀 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**

```bash
npm install -g vercel
```

2. **Login to Vercel**

```bash
vercel login
```

3. **Deploy**

```bash
vercel
```

4. **Set environment variables in Vercel dashboard**

```
VITE_API_URL=https://your-backend-url.com/api
```

5. **Deploy to production**

```bash
vercel --prod
```

### Deploy to Netlify

1. **Build the project**

```bash
npm run build
```

2. **Install Netlify CLI**

```bash
npm install -g netlify-cli
```

3. **Deploy**

```bash
netlify deploy --prod
```

4. **Configure redirects**

Create `public/_redirects`:

```
/*    /index.html   200
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID  /F
```

### CORS Errors

- Ensure backend is running
- Check `VITE_API_URL` in `.env`
- Verify backend CORS configuration allows your frontend origin

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Hot Reload Not Working

- Clear browser cache
- Restart dev server
- Check for JavaScript errors in console

## 📊 Performance Optimization

- **Code Splitting** - Routes are lazy-loaded
- **React Query Caching** - Minimizes unnecessary API calls
- **Image Optimization** - Lazy loading for images
- **Bundle Size** - Optimized with Vite's build tools
- **Compression** - Production builds are compressed

## 🔒 Security Features

- JWT tokens stored in localStorage with expiration
- HTTP-only cookies for authentication
- XSS protection with React's built-in escaping
- CSRF protection via SameSite cookies
- Input validation with React Hook Form

## 🎨 Styling Guidelines

### Tailwind Classes

```jsx
// Buttons
Primary;
Secondary;

// Inputs

// Cards
Content;
```

### Custom Colors

```css
primary-50 to primary-900 - Brand colors
gray-50 to gray-900 - Neutral colors
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Code Style

- Use functional components with hooks
- Follow ESLint configuration
- Use meaningful variable names
- Comment complex logic
- Keep components small and focused

## 🧪 Testing

Currently, this project doesn't include tests. To add testing:

```bash
# Install testing libraries
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Add test script to package.json
"test": "vitest"
```

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- React team for the amazing library
- Vercel team for Vite
- TanStack team for React Query
- Tailwind Labs for Tailwind CSS

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

## 🔗 Links

- **Live Demo**: https://your-app.vercel.app
- **Backend Repository**: https://github.com/yourusername/devconnect-backend
- **API Documentation**: https://documenter.getpostman.com/your-collection

---

Built with ❤️ using React and Vite
