# PulseTrack Backend API

A comprehensive health monitoring application backend built with Node.js, Express, and MongoDB. This API serves as the backend for PulseTrack - integrating user fitness data, meal tracking, and medical appointments into a single ecosystem.

## Features

- **User Management**: Complete user profiles with health metrics and preferences
- **Activity Tracking**: Comprehensive fitness activity logging with detailed statistics
- **Meal Tracking**: Detailed nutrition tracking with macro and micronutrient analysis
- **Doctor Management**: Complete doctor profiles with specializations and availability
- **Appointment System**: Full appointment scheduling and management system
- **Medical Reports**: Comprehensive medical report management with lab results and findings
- **RESTful API**: Well-structured REST endpoints with validation and error handling
- **Database Relationships**: Complex entity relationships with proper data modeling

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate limiting
- **Authentication**: JWT (ready for implementation)
- **Environment**: dotenv for configuration

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas)

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Brave-Bedemptive-Week-5-Backend
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
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/pulsetrack
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   CLIENT_URL=http://localhost:5173
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Production start**
   ```bash
   npm start
   ```

The server will be running on `http://localhost:5000`

## Database Schema

### Core Entities

1. **Users**: User profiles with health metrics, preferences, and medical history
2. **Activities**: Fitness activities with duration, calories, heart rate, and location
3. **Meals**: Detailed meal tracking with nutrition information and food items
4. **Doctors**: Doctor profiles with specializations, availability, and clinic information
5. **Appointments**: Medical appointments with patient-doctor relationships
6. **Reports**: Medical reports with lab results, findings, and recommendations

### Entity Relationships

- **User → Activities** (One-to-Many)
- **User → Meals** (One-to-Many)
- **User → Appointments** (One-to-Many as Patient)
- **Doctor → Appointments** (One-to-Many)
- **User → Reports** (One-to-Many)
- **Appointment → Reports** (One-to-One/Many)

## API Endpoints

### Users
- `GET /api/users` - Get all users with pagination
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (soft delete)
- `GET /api/users/:id/stats` - Get user health statistics

### Activities
- `GET /api/activities` - Get all activities with filtering
- `GET /api/activities/:id` - Get activity by ID
- `POST /api/activities` - Create new activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity
- `GET /api/activities/user/:userId/stats` - Get user activity statistics

### Meals
- `GET /api/meals` - Get all meals with filtering
- `GET /api/meals/:id` - Get meal by ID
- `POST /api/meals` - Create new meal
- `PUT /api/meals/:id` - Update meal
- `DELETE /api/meals/:id` - Delete meal
- `GET /api/meals/user/:userId/stats` - Get user meal statistics
- `GET /api/meals/user/:userId/nutrition/:date` - Get daily nutrition summary

### Doctors
- `GET /api/doctors` - Get all doctors with filtering
- `GET /api/doctors/:id` - Get doctor by ID
- `POST /api/doctors` - Create new doctor
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor (soft delete)
- `GET /api/doctors/:id/availability` - Get doctor availability
- `GET /api/doctors/search/nearby` - Find nearby doctors

### Appointments
- `GET /api/appointments` - Get all appointments with filtering
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment
- `GET /api/appointments/patient/:patientId/upcoming` - Get upcoming appointments
- `GET /api/appointments/stats/:userId` - Get appointment statistics

### Reports
- `GET /api/reports` - Get all reports with filtering
- `GET /api/reports/:id` - Get report by ID
- `POST /api/reports` - Create new report
- `PUT /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report
- `GET /api/reports/user/:userId/summary` - Get user reports summary
- `PUT /api/reports/:id/review` - Review and approve report

## API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}, // Response data
  "pagination": {}, // For paginated responses
  "errors": [] // For validation errors
}
```

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API rate limiting
- **Input Validation**: Comprehensive validation with express-validator
- **Error Handling**: Centralized error handling middleware

## Testing

You can test the API endpoints using:

1. **Postman**: Import the provided Postman collection
2. **HTTP Client**: Use any REST client
3. **Health Check**: `GET /api/health` for server status

Example health check response:
```json
{
  "status": "OK",
  "message": "PulseTrack API is running",
  "timestamp": "2024-10-21T12:20:22.000Z",
  "environment": "development"
}
```

## Project Structure

```
src/
├── models/          # Mongoose schemas
│   ├── User.js
│   ├── Activity.js
│   ├── Meal.js
│   ├── Doctor.js
│   ├── Appointment.js
│   └── Report.js
├── routes/          # API routes
│   ├── users.js
│   ├── activities.js
│   ├── meals.js
│   ├── doctors.js
│   ├── appointments.js
│   └── reports.js
├── .env.example     # Environment template
├── .gitignore       # Git ignore rules
├── package.json     # Dependencies
└── server.js        # Application entry point
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/pulsetrack` |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_EXPIRE` | JWT expiration time | `30d` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |

## Deployment

### Production Setup

1. Set environment to production:
   ```env
   NODE_ENV=production
   ```

2. Use a production MongoDB instance (MongoDB Atlas recommended)

3. Set secure JWT secret

4. Configure reverse proxy (Nginx recommended)

5. Use process manager (PM2 recommended):
   ```bash
   npm install -g pm2
   pm2 start server.js --name "pulsetrack-api"
   ```

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation

## TODO / Future Enhancements

- [ ] Add JWT authentication middleware
- [ ] Implement file upload for images
- [ ] Add email notifications
- [ ] Implement real-time features with WebSockets
- [ ] Add comprehensive test suite
- [ ] Add API documentation with Swagger
- [ ] Implement caching with Redis
- [ ] Add monitoring and logging
