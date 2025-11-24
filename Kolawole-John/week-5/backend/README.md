# PulseTrack Backend

Health monitoring application backend API built with Node.js, Express, and MongoDB.

## Features

- User management
- Activity tracking
- Appointment scheduling
- Doctor management
- RESTful API architecture

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd pulsetrack-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
```

4. Start the server:

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Activities

- `GET /api/activities` - Get all activities
- `GET /api/activities/user/:userId` - Get user's activities
- `POST /api/activities` - Log new activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity

### Appointments

- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/user/:userId` - Get user's appointments
- `POST /api/appointments` - Book appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

## Database Schema

### User

- name, email, age, gender, height, weight

### Activity

- user (ref), activityType, duration, distance, caloriesBurned, date

### Appointment

- user (ref), doctor (ref), appointmentDate, appointmentTime, status, reason

### Doctor

- name, specialization, email, phone, availableDays, consultationFee

## Project Structure

```
src/
├── config/          # Database configuration
├── models/          # Mongoose schemas
├── routes/          # API routes
├── controllers/     # Request handlers
└── middleware/      # Custom middleware
```

## Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose

## Author

Your Name
