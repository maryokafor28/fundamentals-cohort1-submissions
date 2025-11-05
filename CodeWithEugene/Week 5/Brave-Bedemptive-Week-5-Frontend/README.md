# PulseTrack Frontend

A modern, responsive React frontend for PulseTrack - a comprehensive health monitoring application. Built with React, Vite, and Tailwind CSS to provide an intuitive interface for managing user health data, fitness activities, meal tracking, and medical appointments.

## Features

- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Real-time Data**: Live updates using React Query for efficient data fetching
- **Comprehensive Dashboard**: Overview of health metrics and recent activities
- **User Management**: Complete user profiles with health information
- **Activity Tracking**: Log and monitor fitness activities with detailed analytics
- **Meal Tracking**: Nutrition logging with comprehensive food database
- **Doctor Management**: Healthcare provider profiles and availability
- **Appointment System**: Schedule and manage medical appointments
- **Medical Reports**: View and create detailed health reports
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Query for server state
- **Routing**: React Router DOM
- **Forms**: React Hook Form with validation
- **HTTP Client**: Axios with interceptors
- **Icons**: Lucide React
- **Charts**: Recharts for data visualization
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

## Prerequisites

Before running this application, make sure you have:

- Node.js (v16+ recommended)
- npm or yarn
- PulseTrack Backend API running (see backend README)

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Brave-Bedemptive-Week-5-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=PulseTrack
   VITE_APP_VERSION=1.0.0
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main layout component
│   ├── LoadingSpinner.jsx
│   └── ErrorMessage.jsx
├── pages/              # Page components
│   ├── Dashboard.jsx   # Main dashboard
│   ├── Users.jsx       # User management
│   ├── UserProfile.jsx # User detail view
│   ├── Activities.jsx  # Activity tracking
│   ├── Meals.jsx       # Meal tracking
│   ├── Doctors.jsx     # Doctor management
│   ├── Appointments.jsx # Appointment system
│   ├── Reports.jsx     # Medical reports
│   └── NotFound.jsx    # 404 page
├── lib/                # Utilities and API
│   ├── api.js          # API client and endpoints
│   └── utils.js        # Helper functions
├── App.jsx             # Main app component
├── main.jsx            # Application entry point
└── index.css           # Global styles
```

## Design System

### Colors
- **Primary**: Blue shades for main actions and navigation
- **Secondary**: Green shades for positive actions and success states
- **Accent**: Red shades for warnings and critical actions
- **Neutral**: Gray shades for text and backgrounds

### Components
- **Buttons**: Primary, secondary, outline, ghost variants
- **Forms**: Consistent input styling with validation states
- **Cards**: Elevated containers with hover effects
- **Navigation**: Responsive sidebar with active states
- **Badges**: Status indicators with color coding

### Typography
- **Font**: Inter for clean, modern text
- **Headings**: Semibold weights with proper hierarchy
- **Body**: Regular weight with good contrast

## Key Features

### Dashboard
- Health metrics overview
- Recent activities and meals
- Upcoming appointments
- Quick action buttons

### User Management
- Comprehensive user profiles
- Health statistics (BMI, age, etc.)
- Medical conditions and allergies
- Activity and meal history

### Activity Tracking
- Multiple activity types
- Duration and calorie tracking
- Intensity levels
- Location and weather data

### Meal Tracking
- Detailed nutrition information
- Food item database
- Macro and micronutrient tracking
- Meal planning and recipes

### Doctor Management
- Provider profiles and specializations
- Clinic information and locations
- Availability scheduling
- Rating and review system

### Appointment System
- Patient-doctor scheduling
- Status tracking and updates
- Appointment history
- Reminder notifications

### Medical Reports
- Lab results and imaging
- Clinical findings
- Report generation and sharing
- Status tracking workflow

## API Integration

The frontend communicates with the PulseTrack backend API:

- **Base URL**: `http://localhost:5000/api`
- **Authentication**: JWT tokens (when implemented)
- **Error Handling**: Consistent error responses
- **Loading States**: React Query for data fetching
- **Caching**: Automatic query caching and invalidation

### API Endpoints Used

- `GET /users` - User management
- `GET /activities` - Activity data
- `GET /meals` - Meal tracking
- `GET /doctors` - Healthcare providers
- `GET /appointments` - Appointment scheduling
- `GET /reports` - Medical reports

## Responsive Design

The application is fully responsive with:

- **Mobile-first approach**: Optimized for mobile devices
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch-friendly**: Large touch targets and gestures
- **Adaptive layouts**: Grid and flexbox layouts that adapt
- **Mobile navigation**: Collapsible sidebar for mobile

## Performance

- **Code splitting**: Route-based code splitting
- **Lazy loading**: Dynamic imports for better performance
- **Image optimization**: Responsive images with proper formats
- **Caching**: React Query for efficient data caching
- **Bundle optimization**: Vite's optimized build process

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type checking (if using TypeScript)
npm run type-check
```

### Code Style

- **ESLint**: Code linting with React rules
- **Prettier**: Code formatting (if configured)
- **Component naming**: PascalCase for components
- **File naming**: camelCase for utilities, PascalCase for components

## Deployment

### Build and Deploy

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to your hosting service**
   - The `dist/` folder contains the built application
   - Configure your web server to serve the SPA
   - Set up proper routing for client-side navigation

### Environment Variables

For production deployment, set:
- `VITE_API_URL`: Your production API URL
- Configure CORS on your backend for the frontend domain

## Customization

### Styling
- Modify `tailwind.config.js` for design system changes
- Update `src/index.css` for global styles
- Create custom components in `src/components/`

### API Configuration
- Update `src/lib/api.js` for API changes
- Modify base URL and endpoints as needed
- Add authentication headers when implemented

### Features
- Add new pages in `src/pages/`
- Create reusable components in `src/components/`
- Extend utility functions in `src/lib/utils.js`

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Check the backend API documentation
- Review the component documentation

## TODO / Future Enhancements

- [ ] Add authentication and user sessions
- [ ] Implement real-time notifications
- [ ] Add data visualization charts
- [ ] Implement offline support with service workers
- [ ] Add comprehensive testing suite
- [ ] Implement internationalization (i18n)
- [ ] Add accessibility improvements
- [ ] Implement advanced search and filtering and creating user, activity, and appointment data from the PulseTrack backend via interactive CRUD screens.
