# DevConnect Frontend

A modern React-based frontend for DevConnect - A developer collaboration platform where developers can share projects, collaborate, and provide feedback.

## 🚀 Features

- **User Authentication** - Register, login, and manage your profile
- **Project Management** - Create, view, update, and delete projects
- **Collaboration** - Comment on projects and engage with other developers
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Modern UI** - Built with TailwindCSS for a clean, professional look

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **TailwindCSS** - Utility-first CSS framework
- **React Icons** - Icon library
- **React Hot Toast** - Toast notifications

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- DevConnect Backend API running (default: `http://localhost:5000`)

## 🔧 Installation

1. **Clone the repository**
```bash
   git clone https://github.com/Tjoseph-O/DevConnect-frontend.git
   cd devconnect-frontend
```

2. **Install dependencies**
```bash
   npm install
```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
```env
   VITE_API_URL=http://localhost:5000/api
```

4. **Start the development server**
```bash
   npm run dev
```

   The app will be available at `http://localhost:5173`

## 📁 Project Structure
```
devconnect-frontend/
├── public/                 # Static files
├── src/
│   ├── components/         # Reusable components
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/              # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Projects.jsx
│   │   ├── ProjectDetails.jsx
│   │   └── CreateProject.jsx
│   ├── context/            # React Context
│   │   └── AuthContext.jsx
│   ├── services/           # API services
│   │   └── api.js
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # App entry point
│   └── index.css           # Global styles
├── .env                    # Environment variables
├── index.html              # HTML template
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind configuration
├── vite.config.js          # Vite configuration
└── README.md
```

## 🎯 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🔐 Authentication Flow

1. **Registration**: Users create an account with username, email, and password
2. **Login**: Users authenticate with email and password
3. **Token Storage**: JWT tokens are stored in localStorage
4. **Protected Routes**: Certain routes require authentication (create project, profile)
5. **Auto-redirect**: Unauthenticated users are redirected to login page

## 📱 Features Breakdown

### Public Features
- View all projects
- View project details
- View comments on projects
- Browse by technology stack

### Authenticated Features
- Create new projects
- Edit your own projects
- Delete your own projects
- Add comments to projects
- Delete your own comments
- Update profile information

## 🎨 UI Components

### Pages
- **Home** - Landing page with hero section and features
- **Projects** - Grid view of all projects with filters
- **Project Details** - Full project information with comments
- **Create Project** - Form to create new projects
- **Login/Signup** - Authentication pages
- **Profile** - User profile and their projects

### Components
- **Navbar** - Navigation with auth status
- **ProjectCard** - Project preview card
- **ProtectedRoute** - Route wrapper for authentication
- **CommentSection** - Comments display and input

## 🔌 API Integration

The frontend communicates with the backend API through the following endpoints:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user
- `PUT /api/auth/profile` - Update profile

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Comments
- `GET /api/comments/project/:projectId` - Get project comments
- `POST /api/comments/project/:projectId` - Create comment
- `DELETE /api/comments/:id` - Delete comment

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Deploy to Vercel

1. **Install Vercel CLI**
```bash
   npm install -g vercel
```

2. **Deploy**
```bash
   vercel
```

3. **Set Environment Variables**
   
   In Vercel dashboard, add:
```
   VITE_API_URL=https://devconnect-backend-zqsi.onrender.com/api
```

### Deploy to Netlify

1. **Build the project**
```bash
   npm run build
```

2. **Deploy via Netlify CLI**
```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
```

3. **Or via Netlify Dashboard**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variable: `VITE_API_URL`

## ⚙️ Configuration

### Tailwind Configuration

Customize colors, fonts, and other design tokens in `tailwind.config.js`:
```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: {
         tte
        },
      },
    },
  },
}
```

### API Base URL

Update the API URL in `.env`:
```env
VITE_API_URL=https://devconnect-backend-zqsi.onrender.com/api
```

## 🐛 Troubleshooting

### Common Issues

**Issue: API requests failing**
- Check if backend server is running
- Verify `VITE_API_URL` in `.env` is correct
- Check for CORS issues in backend configuration

**Issue: Authentication not persisting**
- Clear localStorage and try logging in again
- Check if JWT token is being saved correctly
- Verify token expiration settings

**Issue: Styles not loading**
- Run `npm install` to ensure TailwindCSS is installed
- Check if `tailwind.config.js` is configured correctly
- Restart dev server after config changes

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:PORT/api` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.



## 🙏 Acknowledgments

- React team for the amazing framework
- Vite for blazing fast development experience
- TailwindCSS for the utility-first CSS framework
- All contributors and supporters


## 🔗 Links

- **Frontend Demo**: https://devconnect-4i70.onrender.com/
- **Backend API**: 
- **API Documentation**: 
- **Backend Repository**: https://github.com/Tjoseph-O/DevConnect-backend

## 📊 Project Status

🚀 **Status**: Active Development

### Completed Features
- ✅ User authentication
- ✅ Project CRUD operations
- ✅ Comments system
- ✅ Responsive design

### Upcoming Features
- 🔲 User profiles with projects
- 🔲 Project search and filtering
- 🔲 Like/upvote system
- 🔲 User avatars upload
- 🔲 Real-time notifications
- 🔲 Project categories/tags

---

