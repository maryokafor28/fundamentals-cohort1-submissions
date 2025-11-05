# PulseTrack: Health Monitoring Application

PulseTrack is a comprehensive health monitoring application designed to integrate user fitness data, meal tracking, and medical appointments into a single, cohesive ecosystem. This project was developed as part of the Software Engineering Week 5 Challenge, focusing on robust database modeling, backend API development, and frontend integration.

This repository contains the **[CHOOSE ONE: backend/frontend]** part of the project.

## Live Demo

The live version of the frontend application is deployed on Vercel and can be viewed here:

**[https://pluse-track-frontend.vercel.app/](https://pluse-track-frontend.vercel.app/)**

*Note: The backend is hosted on a separate service. There might be a brief initial loading time for the first API request.*

## Table of Contents

- [Project Overview](#project-overview)
- [Features Implemented](#features-implemented)
- [Technology Stack](#technology-stack)
- [Database Schema Design](#database-schema-design)
- [API Documentation](#api-documentation)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)

## Project Overview

The challenge was to design and implement a full-stack application with a focus on a robust database schema and the relationships between complex entities. The application allows users to register, log in, and manage their health-related data, including fitness activities and medical appointments with various doctors.

## Features Implemented

- **User Authentication**: Secure user registration and login using JWT (JSON Web Tokens) with access and refresh tokens.
- **Automatic Token Refresh**: Implemented an Axios interceptor on the frontend to automatically refresh expired access tokens for a seamless user experience.
- **Protected Routes**: Backend API routes are protected, requiring valid authentication to access user-specific data. Frontend routes that require authentication are also protected, redirecting unauthenticated users.
- **Activity Management**: Authenticated users can create, view a list of, and see detailed information for their fitness activities.
- **Doctor Management**: Authenticated users can view a list of doctors, add new doctors to the system, and view a detailed profile for each doctor, including a list of patients they have interacted with.
- **Appointment Scheduling**: Users can schedule, view a list of, and see detailed information for their medical appointments, selecting from the available doctors.
- **Responsive UI**: A clean and responsive user interface built with Next.js and styled with Tailwind CSS.
- **"Coming Soon" Placeholders**: Sections for future features (like Meal tracking) are gracefully handled with a "Coming Soon" page.

## Technology Stack

### Backend

- **Framework**: Node.js, Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **Middleware**: CORS, Express-validator for input validation
- **Environment Management**: Dotenv

### Frontend

- **Framework**: React, Next.js (with App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API Communication**: Axios
- **UI Components**: Swiper.js for carousels

## Database Schema Design

The database is designed around a user-centric model with several interconnected entities. The relationships are established using Mongoose's `ref` property to link documents across collections.

- **User**: The central model. Each user has a one-to-many relationship with Activities, Appointments, and Meals.
  - `activities: [ObjectId]` -> ref: 'Activity'
  - `appointments: [ObjectId]` -> ref: 'Appointment'

- **Activity**: Belongs to a single user.
  - `user: ObjectId` -> ref: 'User'

- **Doctor**: A standalone entity that can be associated with multiple appointments.

- **Appointment**: The intermediary model that links a `User` and a `Doctor`, forming a many-to-many relationship between them.
  - `user: ObjectId` -> ref: 'User'
  - `doctor: ObjectId` -> ref: 'Doctor'

This design allows for efficient querying of a user's health data and easily establishes which users have interacted with which doctors through their shared appointments.

## API Documentation

The API is thoroughly documented using Postman. The collection includes detailed descriptions for each endpoint, including validation rules, controller logic, expected request bodies, and example success/error responses.

The Postman collection is available in the backend repository as `postman_collection.json` but you can also access it using this [link - postman docs](https://documenter.getpostman.com/view/49353777/2sB3Wjz43p).

To use it:
1. Import `postman_collection.json` into your Postman client or use the link.
2. Configure a Postman environment and set the `baseUrl` variable to your backend's URL (e.g., `http://localhost:5000`).
3. Run the "Login User" request to automatically capture the JWT and set it as the `authToken` environment variable for use in protected routes.

---

## Setup and Installation

Follow these instructions to get the project running locally.

### Backend (`pulsetrack-backend`)

**Prerequisites:**
- Node.js (v18 or later recommended)
- MongoDB (local instance or a cloud service like MongoDB Atlas)

**Instructions:**
1.  Clone the repository:
    ```bash
    git clone <your-backend-repo-url>
    cd pulsetrack-backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the root of the backend project and add the following environment variables:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    ACCESS_TOKEN_SECRET=your_super_secret_access_token_key
    REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key
    ACCESS_TOKEN_EXPIRES_IN=15m
    REFRESH_TOKEN_EXPIRES_IN=7d
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
    The backend API should now be running on `http://localhost:5000`.

### Frontend (`pulsetrack-frontend`)

**Prerequisites:**
- Node.js (v18 or later recommended)

**Instructions:**
1.  Clone the repository:
    ```bash
    git clone <your-frontend-repo-url>
    cd pulsetrack-frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env.local` file in the root of the frontend project. This file will store the URL of your running backend API.
    ```env
    NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
    The application should now be accessible at `http://localhost:3000`.

## Usage

Once both the backend and frontend servers are running, you can:
1.  Navigate to `http://localhost:3000`.
2.  Register a new user account.
3.  Log in with your new credentials.
4.  Navigate through the "Activities", "Doctors", and "Appointments" sections to create and view data.
5.  Test the protected routes by logging out and attempting to access a protected page.
