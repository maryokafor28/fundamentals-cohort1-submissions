# PulseTrack Frontend

Hey! This is the frontend for my PulseTrack health monitoring application. It's built with React and Vite as part of my backend engineering challenge.

## Demo Credentials

If you want to test the app with different user roles:
- URL https://pulsetrak.netlify.app/
- Patient: patient@demo.com / password
- Doctor: doctor@demo.com / password
- Admin: admin@demo.com / password

## What This App Does

I built this interface to manage the entire health monitoring ecosystem. Here's what you can do:

- **Dashboard** - Quick overview and easy navigation to all the main features
- **Patients** - View and manage patient profiles with their health info
- **Activities** - Track fitness activities like running, yoga, gym sessions, etc.
- **Appointments** - Schedule and manage doctor-patient appointments
- **Doctors** - Manage healthcare provider profiles and their specializations

Everything is responsive and I've added proper loading states and error handling throughout.

## Tech Stack I Used

- React 18 with Vite (much faster than Create React App!)
- React Router for navigation
- Axios for making API calls to my backend
- Pure CSS for styling (kept it simple)

## Getting Started

First, clone this repo and install the dependencies:
```bash
npm install
```

Then start the dev server:
```bash
npm run dev
```

The app will open at [http://localhost:5173](http://localhost:5173)

**Important:** Make sure you have the backend server running on `http://localhost:5000` first, otherwise the API calls won't work!

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## How I Organized the Code
```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Top navigation bar
│   └── LoadingSpinner.jsx # Loading indicator
├── pages/              # Main page views
│   ├── Dashboard.jsx   # Landing page with overview
│   ├── Users.jsx       # Patient management
│   ├── Activities.jsx  # Fitness tracking
│   ├── Appointments.jsx # Scheduling interface
│   └── Doctors.jsx     # Doctor profiles
├── services/           # API integration layer
│   ├── api.js          # Axios base configuration
│   ├── userService.js  # User CRUD operations
│   ├── activityService.js # Activity CRUD operations
│   ├── appointmentService.js # Appointment CRUD operations
│   └── doctorService.js # Doctor CRUD operations
└── App.jsx             # Root component with routing
```

I separated the API logic into service files to keep things clean and reusable.

## Key Features I Implemented

### Dashboard Page
Simple landing page with cards that link to each module. Nothing fancy, just functional navigation.

### Patients/Users Page
- See all patients in the system
- Add new patients with their health details
- Delete patients (with confirmation, of course)
- Shows activity and appointment counts for each patient

### Activities Page
- Log fitness activities for any patient
- Supports different activity types: running, walking, cycling, swimming, gym, yoga, and more
- Track duration and calories burned
- See all activities with patient names

### Appointments Page
- Schedule appointments between patients and doctors
- Pick from existing patients and doctors via dropdowns
- Set date, time, and appointment type
- View appointment status (scheduled, confirmed, completed, etc.)

### Doctors Page
- Manage doctor profiles
- Add new doctors with specialization and contact info
- See how many appointments each doctor has
- Specializations include cardiology, neurology, pediatrics, and more

## Error Handling

I tried to make the UX smooth by adding:
- Loading spinners whenever data is being fetched
- Clear error messages if something goes wrong
- Basic form validation
- Confirmation dialogs before deleting anything important

## Notes

This frontend talks to my PulseTrack backend API. The base URL is set to `http://localhost:5000/api` in the services config. If your backend runs on a different port, just update it in `src/services/api.js`.

## What I Learned

Building this really helped me understand:
- How to structure a React app with proper separation of concerns
- Managing API calls and state effectively
- Creating reusable components
- Handling loading and error states gracefully
- Working with forms and user input validation

Feel free to explore the code and let me know if you have any questions!
