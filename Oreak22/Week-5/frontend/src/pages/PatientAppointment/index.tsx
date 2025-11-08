import axiosClient from "@/api/axiosClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Filter, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Appointment {
  _id: string;
  doctorName: string;
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
}
const PatientAppointment = () => {
  const [appointments, setAppointment] = useState<Appointment[]>([]);

  useEffect(() => {
    try {
      const fetchAppointments = async () => {
        const response = await axiosClient.get("/appointment");
        setAppointment(response.data);
        console.log(response.data);
      };
      fetchAppointments();
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  }, []);

  const navigate = useNavigate();
  return (
    <div className="p-6 space-y-4">
      {/* Page Header */}

      {/* Table Section */}
      <Card className="shadow-sm p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Patient Appointment
          </h2>
          <div className="flex gap-2">
            <Button
              variant={"link"}
              onClick={() => navigate("/patient_appointment/addapointment")}
            >
              <Plus />
              Add Appointment
            </Button>
            <Button
              variant="default"
              className="bg-emerald-700 hover:bg-emerald-800"
            >
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
          </div>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-[60px] font-semibold">ID</TableHead>
                <TableHead className="font-semibold">Doctor Name</TableHead>
                <TableHead className="font-semibold">Patient Name</TableHead>
                <TableHead className="font-semibold">
                  Appointment Date
                </TableHead>
                <TableHead className="font-semibold">
                  Appointment Time
                </TableHead>
                <TableHead className="text-right font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appt, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell>{index+1}</TableCell>
                  <TableCell>{appt.doctorName}</TableCell>
                  <TableCell>{appt.patientName}</TableCell>
                  <TableCell>{appt.appointmentDate}</TableCell>
                  <TableCell>{appt.appointmentTime}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-emerald-700 hover:bg-emerald-100"
                      onClick={() =>
                        navigate(`/patient_appointment/${appt._id}`)
                      }
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <p>
          Showing 1 to {appointments.length} of {appointments.length} entries
        </p>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm">
            «
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-emerald-700 text-white"
          >
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="ghost" size="sm">
            »
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientAppointment;
