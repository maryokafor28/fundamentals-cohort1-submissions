"use client"
import { useRequireAuth } from "@/hooks/user";
import OurDoctors from "@/components/OurDoctors";
import { useUser } from "@/context/user";
import Link from "next/link";

export default function Home() {
  const { user, isLoading } = useUser(); 

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-12 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 text-gray-900 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          {user ? (
            <>
              <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
                Welcome, <span className="text-indigo-600">{user.name}</span>!
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Here's a quick overview of your health journey.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                  <h3 className="text-2xl font-semibold text-indigo-700">{user.activities.length}</h3>
                  <p className="text-gray-600">Activities Logged</p>
                  <Link href="/activities" className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800">
                    View Activities
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </Link>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                  <h3 className="text-2xl font-semibold text-indigo-700">{user.appointments.length}</h3>
                  <p className="text-gray-600">Appointments Scheduled</p>
                  <Link href="/appointments" className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800">
                    View Appointments
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </Link>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                  <h3 className="text-2xl font-semibold text-indigo-700">{user.meals.length}</h3>
                  <p className="text-gray-600">Meals Logged</p>
                  <Link href="/meals" className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800">
                    View Meals
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
                Welcome to <span className="text-indigo-600">Pulse Track</span>!
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Your personal health and activity tracker. Please login or register to continue.
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  href="/login"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center px-6 py-3 border border-indigo-600 text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Register
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Our Doctors Section */}
      <OurDoctors />

    </div>
  );
}
