import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  Droplet,
  User,
  Activity,
  Stethoscope,
} from "lucide-react";
import { useParams } from "react-router-dom";
import axiosClient from "@/api/axiosClient";
import type { IPatient } from "./components/PatientForm";

const PatientInfo: React.FC = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState<IPatient>({} as IPatient);
  //   const patient = {
  //     name: "Mr Patient",
  //     email: "mrpatient@email.com",
  //     phone: "+234 810 123 4567",
  //     gender: "Male",
  //     dob: "15 Mar 1992",
  //     address: "123 Health Street, Lagos, Nigeria",
  //     bloodGroup: "O+",
  //     status: "Active",
  //     photo: "/avatars/patient-avatar.png",
  //   };

  const appointments = [
    {
      id: 1,
      doctor: "Dr James Doe",
      date: "10 Dec 2024",
      time: "09:00 - 09:30",
      status: "Completed",
    },
    {
      id: 2,
      doctor: "Dr Sandra Obi",
      date: "15 Dec 2024",
      time: "10:00 - 10:45",
      status: "Upcoming",
    },
    {
      id: 3,
      doctor: "Dr Isaac Paul",
      date: "05 Jan 2025",
      time: "11:00 - 11:30",
      status: "Cancelled",
    },
  ];

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axiosClient.get(`/patient/${id}`);
        console.log(response.data);
        setPatient(response.data.patient);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };
    fetchPatient();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h2 className="text-xl font-semibold text-gray-800">
        Patient Information
      </h2>

      {/* Top Section: Profile Summary */}
      <Card className="border shadow-sm">
        <CardContent className="flex items-center gap-6 py-6">
          <Avatar className="w-24 h-24 border-2 border-emerald-700">
            <AvatarImage src={String(patient.photo)} alt={patient.name} />
            <AvatarFallback>{patient.name?.split("")[0]}</AvatarFallback>
          </Avatar>

          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {patient.name}
            </h3>
            <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
              <Mail className="h-4 w-4 text-emerald-700" /> {patient.email}
            </p>
            <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
              <Phone className="h-4 w-4 text-emerald-700" /> {patient.phone}
            </p>
            <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
              <MapPin className="h-4 w-4 text-emerald-700" /> {patient.address}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <User className="h-4 w-4 text-emerald-700" /> Gender
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base text-gray-800">{patient.gender}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-700" /> Date of Birth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base text-gray-800">{patient.dob}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Droplet className="h-4 w-4 text-emerald-700" /> Blood Group
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base text-gray-800">{patient.bloodGroup}</p>
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
                patient.status === "Active"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {patient.status}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Recent Appointments */}
      <Card className="shadow-sm mt-6">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-emerald-700" /> Recent
            Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-emerald-50 text-sm text-left text-gray-700">
                  <th className="p-3 border-b">ID</th>
                  <th className="p-3 border-b">Doctor</th>
                  <th className="p-3 border-b">Date</th>
                  <th className="p-3 border-b">Time</th>
                  <th className="p-3 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt, index) => (
                  <tr
                    key={appt.id}
                    className={`text-sm ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-emerald-50 transition`}
                  >
                    <td className="p-3 border-b">{appt.id}</td>
                    <td className="p-3 border-b">{appt.doctor}</td>
                    <td className="p-3 border-b">{appt.date}</td>
                    <td className="p-3 border-b">{appt.time}</td>
                    <td className="p-3 border-b">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appt.status === "Completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : appt.status === "Upcoming"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {appt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientInfo;
