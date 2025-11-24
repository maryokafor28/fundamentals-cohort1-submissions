# PulseTrack Frontend

React-based frontend for the PulseTrack health monitoring application.

## Features

- User management interface
- Activity logging and tracking
- Appointment booking system
- Responsive design
- Real-time data updates

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Running backend server

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd pulsetrack-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Configure API URL:
   Edit `src/services/api.js` and set:

```javascript
const API_URL = "http://localhost:5000/api";
```

4. Start development server:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
```

## Pages

- **Users** - Manage user profiles
- **Activities** - Log and view fitness activities
- **Appointments** - Book and manage medical appointments

## Technologies

- React 18
- Vite
- React Router DOM
- Axios
- CSS3

## Project Structure

```
src/
├── components/      # Reusable components
├── pages/          # Page components
├── services/       # API integration
└── App.jsx         # Main application
```

## API Integration

The frontend communicates with the backend through REST API calls using Axios. All API functions are centralized in `src/services/api.js`.

## Author

Kolawole John
