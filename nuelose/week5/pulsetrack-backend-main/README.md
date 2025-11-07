# PulseTrack Backend
## Overview
A comprehensive Health Monitoring Backend API

Built with Node.js, Express.js, and MongoDB (Mongoose)

PulseTrack is a health monitoring platform that integrates user fitness data, meal tracking, and medical appointments into one ecosystem.
This backend provides RESTful APIs for managing Users, Activities, Meals, Doctors, Appointments, and Reports.

##  Table of Contents
- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Entities & Relationships](#entities--relationships)
- [User Endpoints](#user-endpoints)
- [Activity Endpoints](#activity-endpoints)
- [Appointment Endpoints](#appointment-endpoints)
- [Doctors Endpoints](#doctor-endpoints)
- [Meal Endpoints](#meal-endpoints)
- [Report Endpoints](#report-endpoints)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [License](#license)


## Features

- RESTful CRUD APIs for multiple entities.

- MongoDB schema relationships:

    - One-to-Many between Users and Activities/Meals/Appointments.

    - Many-to-One between Appointments and Doctors.

- Centralized error handling and validation middleware.

- Environment-based configuration.

- Clean and modular code organization.

- Connected to a React-Vite frontend for visualization.

## Tech Stack
| **Layer**              | **Technology** |
|-------------------------|----------------|
| **Runtime**             | Node.js        |
| **Framework**           | Express.js     |
| **Database**            | MongoDB        |
| **ORM**                 | Mongoose       |
| **API Documentation**   | Postman        |
| **Environment Management** | dotenv     |




## Database Design
| **Entity**     | **Description**                         | **Relationships**                                   |
|----------------|------------------------------------------|----------------------------------------------------|
| **User**       | Represents an application user           | One-to-Many with Activities, Meals, Appointments, Reports |
| **Activity**   | Tracks user fitness activity (steps, calories, etc.) | Belongs to one User                                |
| **Meal**       | Tracks user’s meal and nutrition         | Belongs to one User                                |
| **Doctor**     | Represents a doctor profile              | One-to-Many with Appointments                      |
| **Appointment**| Connects a User with a Doctor            | Belongs to User & Doctor                           |
| **Report**     | Medical report generated for a user      | Belongs to User                                    |


## API Endpoints
### Users 
| **Method** | **Endpoint**       | **Description**        |
|-------------|--------------------|------------------------|
| **GET**     | `/api/users`       | Get all users          |
| **GET**     | `/api/users/:id`   | Get user by ID         |
| **POST**    | `/api/users`       | Create a new user      |
| **PUT**     | `/api/users/:id`   | Update user details    |
| **DELETE**  | `/api/users/:id`   | Delete a user          |

### Activities
| **Method** | **Endpoint**            | **Description**        |
|-------------|-------------------------|------------------------|
| **GET**     | `/api/activities`       | Get all activities     |
| **POST**    | `/api/activities`       | Create new activity    |
| **GET**     | `/api/activities/:id`   | Get activity by ID     |
| **PUT**     | `/api/activities/:id`   | Update activity        |
| **DELETE**  | `/api/activities/:id`   | Delete activity        |

### Appointments
| **Method** | **Endpoint**            | **Description**        |
|-------------|-------------------------|------------------------|
| **GET**     | `/api/activities`       | Get all activities     |
| **POST**    | `/api/activities`       | Create new activity    |
| **GET**     | `/api/activities/:id`   | Get activity by ID     |
| **PUT**     | `/api/activities/:id`   | Update activity        |
| **DELETE**  | `/api/activities/:id`   | Delete activity        |


### Doctors
| **Method** | **Endpoint**            | **Description**        |
|-------------|-------------------------|------------------------|
| **GET**     | `/api/doctors`       | Get all doctors     |
| **POST**    | `/api/doctors`       | Create new doctors    |
| **GET**     | `/api/doctors/:id`   | Get doctors by ID     |
| **PUT**     | `/api/doctors/:id`   | Update doctors        |
| **DELETE**  | `/api/doctors/:id`   | Delete doctors        |

### Meals
| **Method** | **Endpoint**            | **Description**        |
|-------------|-------------------------|------------------------|
| **GET**     | `/api/meals`       | Get all meals     |
| **POST**    | `/api/meals`       | Create new meals    |
| **GET**     | `/api/meals/:id`   | Get meals by ID     |
| **PUT**     | `/api/meals/:id`   | Update meals        |
| **DELETE**  | `/api/meals/:id`   | Delete meals        |

### Report
| **Method** | **Endpoint**            | **Description**        |
|-------------|-------------------------|------------------------|
| **GET**     | `/api/report`       | Get all report     |
| **POST**    | `/api/report`       | Create new report    |
| **GET**     | `/api/report/:id`   | Get report by ID     |
| **PUT**     | `/api/report/:id`   | Update report        |
| **DELETE**  | `/api/report/:id`   | Delete report        |


## Installation & Setup
1. Clone the Repository
```bash
git clone https://github.com/nuelose/pulsetrack-backend.git
cd pulsetrack-backend
```

2. Install Dependencies
```
npm install
```

3. Configure Environment Variables

Create a .env file in the project root and add:
```bash
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pulsetrack
NODE_ENV=development
```


(You can check .env.example for reference)

4. Run the Development Server
```bash
npm run dev
```



### API Documentation

Full API documentation is available on Postman: [API Documentation](https://documenter.getpostman.com/view/49262917/2sB3WjxiCP)

[API URL](https://pulsetrack-backend.vercel.app/api)


## Future Improvements

Implement user authentication (JWT)

Role-based access (User, Doctor, Admin)

Add analytics for activities and nutrition

Integrate email or SMS notifications for appointments

Add file upload for medical reports

## Author

Emmanuel Akalo
akalo.emmanuel18@gmail.com
