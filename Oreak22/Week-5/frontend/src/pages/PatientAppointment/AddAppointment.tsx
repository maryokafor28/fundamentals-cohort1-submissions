import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, isSameDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import axiosClient from "@/api/axiosClient";
import type { IPatient } from "../patient/components/PatientForm";
import { useAuth } from "@/context/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock booked appointments (to visualize booked time slots)
const bookedSlots = [
  { date: new Date(2025, 9, 25), from: "09:00", to: "10:30" },
  { date: new Date(2025, 9, 26), from: "13:00", to: "14:00" },
];

const AddAppointment = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [patients, setPatients] = useState<IPatient[]>([]);
  const [patientName, setPatientName] = useState("");
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !fromTime || !toTime || !patientName) {
      alert("Please fill all required fields");
      return;
    }
    // doctorName,
    //   patientId,
    //   patientName,
    //   appointmentDate,
    //   appointmentTime,
    //   reason,
    //   notes,
    try {
      const appointmentData = {
        doctorName: user?.name,
        patientName,
        appointmentDate: format(selectedDate, "yyyy-MM-dd"),
        appointmentTime: `${fromTime} - ${toTime}`,
        patientId: patients.find((p) => p.name === patientName)?._id,
      };
      await axiosClient.post("/appointment", appointmentData).then((res) => {
        console.log(res.data);
        alert("Appointment added successfully!");
      });
    } catch (err) {
      console.log(err);
    }
    console.log({
      date: selectedDate,
      fromTime,
      toTime,
    });
  };
  useEffect(() => {
    try {
      const getPatient = async () => {
        await axiosClient.get("/patient/getpatient").then((res) => {
          if (res.data.status) {
            console.log(res.data);
            setPatients(res.data.patient);
          }
        });
      };

      getPatient();
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <div className="p-6 w-4/5 lg:w-2/5 mx-auto">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            Add Appointment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            {/* Doctor Name */}
            <div className="grid gap-2">
              <Label htmlFor="doctorName">Doctor Name</Label>
              <Input
                disabled
                value={user?.name}
                id="doctorName"
                placeholder="Enter doctor name"
                required
              />
            </div>

            {/* Patient Name */}
            <div className="grid gap-2">
              <div>
                <Label>Patient Name</Label>
                <Select onValueChange={(e) => setPatientName(e)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {patients.length <= 0 ? (
                      <SelectItem value=" " disabled>
                        Loadding......
                      </SelectItem>
                    ) : (
                      <>
                        {patients.map((bg, index) => (
                          <SelectItem key={index} value={bg.name}>
                            {bg.name}
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Appointment Date */}
            <div className="grid gap-2">
              <Label htmlFor="date">Appointment Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    modifiers={{
                      booked: (day) =>
                        bookedSlots.some((b) => isSameDay(day, b.date)),
                    }}
                    modifiersStyles={{
                      booked: {
                        backgroundColor: "#fee2e2",
                        color: "#991b1b",
                        borderRadius: "6px",
                      },
                    }}
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-gray-500">
                Dates in red have booked time slots.
              </p>
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fromTime">Time From</Label>
                <Input
                  id="fromTime"
                  type="time"
                  value={fromTime}
                  onChange={(e) => setFromTime(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="toTime">Time To</Label>
                <Input
                  id="toTime"
                  type="time"
                  value={toTime}
                  onChange={(e) => setToTime(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-emerald-700 hover:bg-emerald-800 text-white"
              >
                Save Appointment
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Legend for booked slots */}
      <div className="mt-4 text-sm text-gray-600">
        <p className="font-medium mb-1">Booked Slots:</p>
        {bookedSlots.map((slot, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-2 w-2 bg-red-400 rounded-full" />
            <span>
              {format(slot.date, "PPP")} ({slot.from} - {slot.to})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddAppointment;
