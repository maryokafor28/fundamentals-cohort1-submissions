# 🎨 DeployHub Frontend

Modern React dashboard for monitoring DeployHub backend services.

## 🌐 Deployed URL

**Production:** https://deployhub-frontend-xxxx.vercel.app

## ✨ Features

- Real-time system monitoring
- Auto-refresh every 30 seconds
- Responsive design
- Error handling with retry
- Beautiful gradient UI
- Live metrics display

## 🛠️ Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Styling:** CSS3
- **Deployment:** Vercel

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Environment Variables

`.env`:

```env
VITE_API_URL=http://localhost:3001/api
```

`.env.production`:

```env
VITE_API_URL=https://deployhub-backend-xxxx.onrender.com/api
```

## 📊 Dashboard Features

### Status Monitoring

- Service health status
- Version information
- System uptime
- Environment details

### System Metrics

- Memory usage & capacity
- CPU core count
- Platform information
- Node.js version

### Service Info

- Available features
- API endpoints
- Service capabilities

## 🔄 CI/CD

Automated deployment via GitHub Actions:

1. Build production bundle
2. Deploy to Vercel

## 👤 Author

John Kolawole - [GitHub](https://github.com/YOUR_USERNAME)

## 📝 License

MIT
