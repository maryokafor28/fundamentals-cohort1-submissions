# 🩺 PulseTrack Backend

PulseTrack is a health and fitness tracking backend system designed to manage users, doctors, activities, meals, appointments, and health reports.  
Built with **TypeScript**, **Express**, and **MongoDB (Mongoose)** — following a clean, scalable, and modular architecture.

---

## 🚀 Features

- 👥 **User Management:** Create, update, soft delete, and fetch users
- 🩺 **Doctor Management:** Manage doctors and track total appointments
- 🏃‍♂️ **Activity Tracking:** Log user workouts with calories and duration
- 🍽️ **Meal Tracking:** Record meals with auto-calculated calorie totals
- 📅 **Appointments:** Connect users and doctors through a relational link
- 📄 **Reports:** Generate progress or consultation reports
- ✅ **Data Validation:** Strong schema validation and hybrid relationships
- 🔗 **Database Modeling:** Combination of embedding and referencing for optimal performance

---

## 🏗️ Tech Stack

| Layer       | Technology             |
| ----------- | ---------------------- |
| Runtime     | Node.js                |
| Language    | TypeScript             |
| Framework   | Express.js             |
| Database    | MongoDB (via Mongoose) |
| Environment | dotenv                 |
| Logger      | morgan                 |
| API Testing | Postman                |

---

## 🧠 Database Design and Implementation

### 1️⃣ Database Overview

The system is modeled using **MongoDB** with **Mongoose ODM**, balancing **referencing** and **embedding** techniques to ensure both flexibility and performance.

Each entity (User, Doctor, Activity, Meal, Appointment, Report) is represented as a Mongoose model with clear schema validation, timestamps, and indexing.

---

### 2️⃣ Entity Relationships

| Relationship              | Type                  | Description                             |
| ------------------------- | --------------------- | --------------------------------------- |
| **User → Activities**     | 1:N                   | A user can have multiple activities     |
| **User → Meals**          | 1:N                   | A user can have multiple meal logs      |
| **User → Appointments**   | 1:N                   | A user can schedule many appointments   |
| **Doctor → Appointments** | 1:N                   | A doctor can have multiple appointments |
| **User ↔ Doctor**         | M:N (via Appointment) | Many users can see many doctors         |
| **User → Reports**        | 1:N                   | A user can generate multiple reports    |

---

### 3️⃣ Modeling Strategy

- **Referencing** is used for entities that grow independently and are frequently updated (e.g., `User`, `Doctor`, `Appointment`).
- **Embedding** is used for subdocuments that are dependent and rarely updated separately (e.g., `Meal.items`, `Appointment.patients`).

This hybrid design minimizes query complexity while maintaining referential integrity.

---

### 4️⃣ Core Entities

#### 👤 **User**

- Fields: `name`, `email`, `role`, `isActive`
- Relationships: Linked to `Activity`, `Meal`, `Appointment`, and `Report`
- Index: Unique index on `email`
- Use: Represents any authenticated person (user, doctor, or admin)

#### 🩺 **Doctor**

- Fields: `name`, `email`, `specialty`, `totalAppointments`
- Index: Search index on `specialty`
- Use: Represents medical professionals available for appointments

#### 🏃‍♂️ **Activity**

- Fields: `user`, `type`, `durationMinutes`, `calories`, `metadata`
- Relationship: References `User`
- Use: Tracks user workouts and calorie expenditure
- Soft delete enabled via `isDeleted`

#### 🍽️ **Meal**

- Fields: `user`, `title`, `items` (embedded), `totalCalories`, `time`
- Relationship: References `User`
- Use: Stores meal entries with auto-calculated calories from items

#### 📅 **Appointment**

- Fields: `user`, `doctor`, `patients[]`, `appointmentDate`, `status`, `notes`
- Relationships: References both `User` and `Doctor`
- Use: Links doctors and patients; increments doctor’s totalAppointments
- Hybrid model: Embedded `patients` subdocument for historical accuracy

#### 📄 **Report**

- Fields: `user`, `doctor (optional)`, `title`, `body`
- Relationship: References `User` and optionally `Doctor`
- Use: Stores doctor consultation summaries or user progress reports

---

### 5️⃣ Data Integrity Features

| Feature                | Description                                                           |
| ---------------------- | --------------------------------------------------------------------- |
| **Soft Delete**        | Instead of removing documents, flags `isDeleted` to maintain history  |
| **Pre/Post Hooks**     | Validates existence of referenced entities before save                |
| **Auto Calculations**  | `Meal` schema calculates `totalCalories` automatically before save    |
| **Indexes**            | Used for faster lookups (`email`, `specialty`, `createdAt`)           |
| **Validation**         | Email regex, date validation (future appointments), and enum fields   |
| **Referential Safety** | Prevents orphan records by verifying related entities during creation |

---

### 6️⃣ Example Relationship Flow

- User ──────< Activity
- User ──────< Meal
- User ──────< Appointment >────── Doctor
- User ──────< Report >────── Doctor

This design ensures flexible querying — for example:

- Fetch a user’s activities and meals for analytics
- Retrieve all appointments for a doctor
- Generate personalized reports from user data

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

git clone https://github.com/Favourof/pulsetrack-frontend.git
cd pulsetrack-backend

### 2️⃣ Install Dependencies

npm install

### 3️⃣ Configure Environment

PORT=4000
MONGO_URI=mongodb://localhost:27017/pulsetrack
NODE_ENV=development

4️⃣ Run Development Server

npm run dev

## 🧪 API Testing Sequence

1️⃣ Create User
2️⃣ Create Doctor
3️⃣ Log Activity
4️⃣ Log Meal
5️⃣ Schedule Appointment
6️⃣ Generate Report

PostMan Documentation: https://documenter.getpostman.com/view/33609178/2sB3Wjyio3

## 🧠 Future Enhancements

Automatic Weekly Report Generation (aggregate meals + activities)

Authentication & Role-based Access Control (RBAC)

## 👨🏽‍💻 Author

- Favour Omotosho
- Fullstack Engineer | Database Design & System Architecture
- favourtobiloba200@gmail.com
