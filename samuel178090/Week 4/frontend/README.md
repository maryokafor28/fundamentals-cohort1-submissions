# DEVconnect Frontend

The React-based frontend for DEVconnect social media platform.

## 🚀 Live Demo

**Frontend**: [https://developerspac.netlify.app](https://developerspac.netlify.app)

## 🧪 Test Accounts

1. **Account 1**
   - Email: `josephsammy1994@gmail.com`
   - Password: `mayowa2211`

2. **Account 2**
   - Email: `afemi7804@gmail.com`
   - Password: `sammy2211`

## 🛠️ Tech Stack

- **React 18** - Modern UI library
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Fast build tool
- **CSS3** - Custom styling with CSS variables

## ✨ Features

- 🔐 User authentication with JWT
- 👤 User profiles with avatar upload
- 📝 Create, edit, delete posts
- ❤️ Like posts and comments
- 💬 Comment on posts
- 👥 Follow/unfollow users
- 💌 Real-time messaging
- 🔖 Bookmark posts
- 🖼️ Image upload support
- 🎨 Multiple themes (5 colors + dark mode)
- 📱 Fully responsive design

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone and navigate**
```bash
git clone https://github.com/ajewolesamuel/DEVconnect.git
cd DEVconnect/clientfrontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
cp .env.example .env
```

4. **Configure environment**
```env
VITE_API_URL=http://localhost:5000/api
```

5. **Start development server**
```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── CreatePost.jsx   # Post creation form
│   ├── Feed.jsx         # Individual post component
│   ├── Navbar.jsx       # Navigation bar
│   ├── Sidebar.jsx      # Left navigation sidebar
│   ├── Widgets.jsx      # Right sidebar widgets
│   ├── UserProfile.jsx  # User profile card
│   └── ...
├── pages/              # Page components
│   ├── Home.jsx        # Main feed page
│   ├── Profile.jsx     # User profile page
│   ├── Messages.jsx    # Chat interface
│   ├── Bookmarks.jsx   # Saved posts
│   └── ...
├── store/              # Redux store
│   ├── store.js        # Store configuration
│   ├── user-slice.js   # User state management
│   └── ui-slice.js     # UI state management
├── utils/              # Utility functions
├── assets/             # Static assets
├── App.jsx             # Main app component
├── RootLayout.jsx      # Layout wrapper
└── index.css           # Global styles
```

## 🎨 Styling

The app uses CSS custom properties (variables) for theming:

- **5 Color Themes**: Red, Blue, Yellow, Green, Purple
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Mobile-first approach
- **CSS Grid**: Modern layout system

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🌐 Deployment

### Netlify (Recommended)

1. **Build the project**
```bash
npm run build
```

2. **Deploy to Netlify**
- Connect your GitHub repository
- Set build command: `npm run build`
- Set publish directory: `dist`
- Add environment variables in Netlify dashboard

### Manual Deployment

```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🔌 API Integration

The frontend communicates with the backend API through Axios:

```javascript
// Example API call
const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${token}`
  }
})
```

## 🎯 Key Components

### Authentication
- JWT token management
- Automatic login/logout
- Protected routes

### Real-time Features
- Socket.io integration
- Live messaging
- Real-time notifications

### State Management
- Redux Toolkit for global state
- User authentication state
- UI theme preferences

## 📱 Responsive Design

- **Desktop**: Full three-column layout
- **Tablet**: Adapted two-column layout
- **Mobile**: Single column with bottom navigation

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -m 'Add NewFeature'`)
4. Push to branch (`git push origin feature/NewFeature`)
5. Open Pull Request

## 👨💻 Author

**Ajewole Joseph Samuel**
- GitHub: [@ajewolesamuel](https://github.com/ajewolesamuel)
- Email: josephsammy1994@gmail.com

## 📄 License

MIT License - see [LICENSE](../LICENSE) file for details.