# PulseTrack Backend

This is the backend API I built for PulseTrack, a health monitoring system that handles everything from tracking workouts to scheduling doctor appointments. It's part of my database modeling challenge where I needed to design complex entity relationships.

## What It Does

I implemented the following features:

- **User/Patient Management** - Store patient info, medical history, and health metrics
- **Activity Tracking** - Log fitness activities like running, walking, cycling, swimming, etc.
- **Appointment System** - Schedule and manage appointments between patients and doctors
- **Doctor Profiles** - Manage healthcare providers with their specializations
- **Meal Tracking** - Record daily meals with nutritional information
- **Health Reports** - Generate and store medical reports with test results

## Technologies I Used

- **Node.js & Express** - For building the REST API
- **MongoDB** - As my database (NoSQL felt right for this use case)
- **Mongoose** - Made working with MongoDB much easier with schemas and validation
- **CORS** - So my frontend can talk to the backend without issues

## Setup Instructions

Here's how to get this running on your machine:

1. **Clone the repo** and navigate to the backend folder

2. **Install dependencies:**
```bash
   npm install
```

3. **Create a `.env` file** in the root directory:
```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/pulsetrack
   NODE_ENV=development
```

4. **Make sure MongoDB is running** on your machine. If you haven't installed it yet, grab it from the official MongoDB website.

5. **Seed the database** with some sample data so you have something to work with:
```bash
   node src/seed.js
```
   This creates sample patients, doctors, activities, and appointments.

6. **Start the server:**
```bash
   npm run dev
```

The API should now be running on `http://localhost:5000`

## API Routes I Built

### Users/Patients
- `GET /api/users` - Fetch all users
- `GET /api/users/:id` - Get a specific user by ID
- `POST /api/users` - Add a new user
- `PUT /api/users/:id` - Update user details
- `DELETE /api/users/:id` - Remove a user

### Activities
- `GET /api/activities` - Get all logged activities
- `GET /api/activities/:id` - Get specific activity
- `POST /api/activities` - Log a new activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity

### Appointments
- `GET /api/appointments` - List all appointments
- `GET /api/appointments/:id` - Get appointment details
- `POST /api/appointments` - Schedule new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get specific doctor
- `POST /api/doctors` - Add new doctor
- `PUT /api/doctors/:id` - Update doctor info
- `DELETE /api/doctors/:id` - Remove doctor

## How I Structured the Database

I designed the schema to handle complex relationships between entities:

**Main Collections:**
- **Users** - Patient records with health info
- **Activities** - Fitness logs linked to users
- **Appointments** - Meetings between users and doctors
- **Doctors** - Healthcare provider profiles
- **Meals** - Nutritional tracking for users
- **Reports** - Medical test results and diagnoses

**Key Relationships:**
- One User → Many Activities (one-to-many)
- One User → Many Appointments (one-to-many)
- One Doctor → Many Appointments (one-to-many)
- Appointments connect Users and Doctors (many-to-many through appointments)

I used Mongoose's `ref` feature to create these relationships, which lets me populate related data when querying.

## Available Scripts

- `npm start` - Run the production server
- `npm run dev` - Run with nodemon (auto-restarts on file changes)
- `node src/seed.js` - Populate the database with test data

## Project Structure
```
src/
├── models/              # Mongoose schemas
│   ├── User.js
│   ├── Activity.js
│   ├── Appointment.js
│   ├── Doctor.js
│   ├── Meal.js
│   └── Report.js
├── routes/              # API route handlers
│   ├── users.js
│   ├── activities.js
│   ├── appointments.js
│   └── doctors.js
├── controllers/         # Business logic
├── config/             # Configuration files
└── seed.js             # Database seeding script
```

## What I Learned

Building this backend taught me a lot about:
- Designing database schemas with proper relationships
- Using Mongoose for data validation and references
- Building RESTful APIs with Express
- Handling CRUD operations efficiently
- Structuring a Node.js application properly

The hardest part was definitely getting the relationships right between users, doctors, and appointments. I had to think carefully about how the data connects and how to query it efficiently.

## Testing

You can test all the endpoints using:
- **Postman** (I've included a collection in the repo)
- **Thunder Client** (VS Code extension)
- Or just use `curl` if you're into that

The seed script creates some test data to get you started right away.

## Notes

- Make sure MongoDB is running before starting the server
- The frontend expects this API to run on port 5000
- All routes are prefixed with `/api`
- I added basic error handling, but there's room for improvement

Feel free to explore the code and reach out if you have questions!