# PulseTrack Backend API

Backend API for PulseTrack health monitoring application. Built using Test-Driven Development (TDD) with Node.js, Express, and MongoDB.

## 🚀 Features

- **User Management**: Complete CRUD operations for user profiles
- **Activity Tracking**: Log and manage fitness activities
- **Appointment Scheduling**: Manage medical appointments with doctors
- **Built with TDD**: 180+ comprehensive tests
- **RESTful API Design**: Clean and intuitive endpoints
- **Data Validation**: Robust validation using Mongoose schemas
- **Relationship Management**: One-to-many relationships between entities

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/Tjoseph-O/pulsetrack-backend.git
cd pulsetrack-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/pulsetrack
```

## 🧪 Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# View test coverage
npm test -- --coverage
```

## 🏃 Running the Application
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`

## 📁 Project Structure
```
pulsetrack-backend/
├── src/
│   ├── config/
│   │   └── database.js         # MongoDB connection
│   ├── models/
│   │   ├── User.js             # User model
│   │   ├── Activity.js         # Activity model
│   │   └── Appointment.js      # Appointment model
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── activityController.js
│   │   └── appointmentController.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── activityRoutes.js
│   │   └── appointmentRoutes.js
│   └── server.js               # App entry point
├── tests/
│   ├── unit/                   # Unit tests
│   ├── integration/            # Integration tests
│   └── setup/                  # Test configuration
└── package.json
```

## 🔗 API Endpoints

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create new user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

### Activities

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/activities` | Get all activities |
| GET | `/api/activities?userId=:id` | Get activities by user |
| GET | `/api/activities/:id` | Get activity by ID |
| POST | `/api/activities` | Create new activity |
| PUT | `/api/activities/:id` | Update activity |
| DELETE | `/api/activities/:id` | Delete activity |

### Appointments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/appointments` | Get all appointments |
| GET | `/api/appointments?userId=:id` | Get appointments by user |
| GET | `/api/appointments?status=:status` | Get appointments by status |
| GET | `/api/appointments/:id` | Get appointment by ID |
| POST | `/api/appointments` | Create new appointment |
| PUT | `/api/appointments/:id` | Update appointment |
| DELETE | `/api/appointments/:id` | Delete appointment |

## 📝 API Request Examples

### Create User
```bash
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "weight": 75,
  "height": 180,
  "gender": "male"
}
```

### Create Activity
```bash
POST /api/activities
Content-Type: application/json

{
  "userId": "user_id_here",
  "activityType": "running",
  "duration": 45,
  "distance": 6,
  "caloriesBurned": 400,
  "notes": "Morning run"
}
```

### Create Appointment
```bash
POST /api/appointments
Content-Type: application/json

{
  "userId": "user_id_here",
  "doctorName": "Dr. Smith",
  "specialty": "cardiology",
  "appointmentDate": "2024-12-20T10:00:00Z",
  "reason": "Annual check-up",
  "location": "City Hospital"
}
```

## 🧑‍💻 Development Approach

This project follows Test-Driven Development (TDD):

1. **RED**: Write failing tests
2. **GREEN**: Write minimal code to pass tests
3. **REFACTOR**: Improve code while keeping tests green

## 📊 Test Coverage

Current test coverage: **180+ tests** covering:
- Unit tests for all models
- Integration tests for all controllers
- Route tests for all endpoints
- Database connection and utilities



## 📄 License

MIT


## 🙏 Acknowledgments

Built as part of the Software Engineering Week 5 Challenge at Brave Redemptive.