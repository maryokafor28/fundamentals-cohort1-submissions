import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  Activity,
  MessageSquareText,
  MapPin,
} from "lucide-react";
import axiosClient from "@/api/axiosClient";
import { useParams } from "react-router-dom";

interface Appointment {
  _id: string;
  doctor: {
    name: string;
    specialization: string;
    photo: string;
  };
  patient: {
    name: string;
    gender: string;
    photo: string;
  };
  appointmentDate: string;
  appointmentTime: string;
  status: "Completed" | "Upcoming" | "Cancelled";
  location: string;
  notes: string;
}

const PatientAppointmentInfo: React.FC = () => {
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axiosClient.get(`/appointment/${id}`);
        setAppointment(response.data);
      } catch (error) {
        console.error("Error fetching appointment:", error);
        setError("Failed to load appointment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id]);

  if (loading) return <p>Loading appointment...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!appointment) return <p>No appointment data found.</p>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">
        Appointment Information
      </h2>

      <Card className="border shadow-sm">
        <CardContent className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Doctor Info */}
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 border-2 border-emerald-700">
              <AvatarImage src={appointment.doctor.photo} />
              <AvatarFallback>
                {appointment.doctor.name?.charAt(0) ?? "D"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-gray-600 text-sm">Doctor</p>
              <h3 className="text-lg font-semibold text-gray-800">
                {appointment.doctor.name}
              </h3>
              <p className="text-sm text-gray-500">
                {appointment.doctor.specialization}
              </p>
            </div>
          </div>

          {/* Patient Info */}
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 border-2 border-emerald-700">
              <AvatarImage src={appointment.patient.photo} />
              <AvatarFallback>
                {appointment.patient.name?.charAt(0) ?? "P"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-gray-600 text-sm">Patient</p>
              <h3 className="text-lg font-semibold text-gray-800">
                {appointment.patient.name}
              </h3>
              <p className="text-sm text-gray-500">
                {appointment.patient.gender}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointment Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-700" /> Appointment Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base text-gray-800">
              {appointment.appointmentDate}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-700" /> Appointment Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base text-gray-800">
              {appointment.appointmentTime}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-700" /> Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                appointment.status === "Completed"
                  ? "bg-emerald-100 text-emerald-700"
                  : appointment.status === "Upcoming"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {appointment.status}
            </span>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-700" /> Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base text-gray-800">{appointment.location}</p>
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <MessageSquareText className="h-5 w-5 text-emerald-700" /> Doctor’s
            Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{appointment.notes}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientAppointmentInfo;
