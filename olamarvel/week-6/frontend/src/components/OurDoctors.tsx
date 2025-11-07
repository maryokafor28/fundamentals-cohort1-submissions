"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Doctor } from "@/lib/type";
import { getDoctors } from "@/services/doctor";
import DoctorCard from "@/components/DoctorCard"; // Assuming this is the correct path
import Link from "next/link";

const OurDoctors = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDoctorsData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const fetchedDoctors = await getDoctors();
                setDoctors(fetchedDoctors);
            } catch (err) {
                setError("Failed to load doctors. Please try again later.");
                console.error("Error fetching doctors in OurDoctors component:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDoctorsData();
    }, []);

    return (
        <section className="py-10 lg:py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="max-w-[470px] mx-auto text-center mb-10 lg:mb-16">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                        Our Great Doctors
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        World-class care for everyone. Our health system offers unmatched expert health care. <Link href="/doctors" className="text-indigo-600 hover:underline">View All Doctors</Link> or <Link href="/doctors/create" className="text-indigo-600 hover:underline">Create a New Doctor</Link>
                    </p>
                </div>

                {isLoading && (
                    <div className="flex justify-center items-center h-48">
                        <p className="text-gray-500 text-lg">Loading doctors...</p>
                    </div>
                )}

                {error && !isLoading && (
                    <div className="flex justify-center items-center h-48">
                        <p className="text-red-600 text-lg">{error}</p>
                    </div>
                )}

                {!isLoading && !error && doctors.length > 0 && (
                    <Swiper
                        modules={[Pagination]}
                        spaceBetween={30}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        breakpoints={{
                            640: { slidesPerView: 1, spaceBetween: 0 },
                            768: { slidesPerView: 2, spaceBetween: 20 },
                            1024: { slidesPerView: 3, spaceBetween: 30 },
                        }}
                        className="pb-10"
                    >
                        {doctors.map((doctor) => (
                            <SwiperSlide key={doctor._id} className="py-5">
                                <DoctorCard doctor={doctor} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}

                {!isLoading && !error && doctors.length === 0 && (
                    <div className="text-center bg-white p-10 rounded-lg shadow-md max-w-xl mx-auto">
                        <p className="text-gray-500 text-lg">No doctors found at the moment.</p>
                        <p className="text-gray-500 mt-2">Please check back later or contact support.</p>
                    </div>
                )}

            </div>
        </section>
    );
};

export default OurDoctors;
