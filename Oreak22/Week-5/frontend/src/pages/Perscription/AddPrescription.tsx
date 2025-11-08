import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosClient from "@/api/axiosClient";

export default function AddPrescription() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    diagnosis: "",
    medicine: "",
    dosage: "",
    duration: "",
    notes: "",
  });
  // Fetch patient and doctor lists
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, doctorsRes] = await Promise.all([
          axiosClient.get("/api/patients"),
          axiosClient.get("/api/doctors"),
        ]);
        setPatients(patientsRes.data);
        setDoctors(doctorsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  // When a patient is selected, auto-fill their details
  useEffect(() => {
    if (formData.patientId) {
      const found = patients.find((p) => p._id === formData.patientId);
      setSelectedPatient(found || null);
    }
  }, [formData.patientId, patients]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosClient.post("/api/prescriptions", formData);
      navigate("/dashboard/prescriptions");
    } catch (err) {}
  };

  return (
    <div className="p-6">
      <Card className="max-w-3xl mx-auto shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Add Prescription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Select */}
            <div className="grid gap-2">
              <Label>Patient</Label>
              <Select
                onValueChange={(value) =>
                  setFormData({ ...formData, patientId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p._id} value={p._id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Auto-filled Patient Info */}
            {selectedPatient && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input value={selectedPatient.email || ""} disabled />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={selectedPatient.phone || ""} disabled />
                </div>
                <div>
                  <Label>Gender</Label>
                  <Input value={selectedPatient.gender || ""} disabled />
                </div>
                <div>
                  <Label>Age</Label>
                  <Input value={selectedPatient.age || ""} disabled />
                </div>
              </div>
            )}

            {/* Doctor Select */}
            <div className="grid gap-2">
              <Label>Doctor</Label>
              <Select
                onValueChange={(value) =>
                  setFormData({ ...formData, doctorId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((d) => (
                    <SelectItem key={d._id} value={d._id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Prescription Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Diagnosis</Label>
                <Input
                  value={formData.diagnosis}
                  onChange={(e) =>
                    setFormData({ ...formData, diagnosis: e.target.value })
                  }
                  placeholder="e.g. Malaria, Typhoid"
                />
              </div>
              <div>
                <Label>Medicine</Label>
                <Input
                  value={formData.medicine}
                  onChange={(e) =>
                    setFormData({ ...formData, medicine: e.target.value })
                  }
                  placeholder="e.g. Paracetamol, Amoxicillin"
                />
              </div>
              <div>
                <Label>Dosage</Label>
                <Input
                  value={formData.dosage}
                  onChange={(e) =>
                    setFormData({ ...formData, dosage: e.target.value })
                  }
                  placeholder="e.g. 2 tablets daily"
                />
              </div>
              <div>
                <Label>Duration</Label>
                <Input
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  placeholder="e.g. 5 days"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label>Additional Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Enter additional information..."
              />
            </div>

            {/* Submit */}
            <div className="pt-4">
              <Button
                type="submit"
                className="bg-emerald-700 hover:bg-emerald-800"
              >
                Submit Prescription
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
