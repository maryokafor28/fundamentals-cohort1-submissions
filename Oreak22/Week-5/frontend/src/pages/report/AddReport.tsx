import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
// import { toast } from "@/hooks/use-toast";

interface Patient {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

const AddReport = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    foodAllergy: "",
    heartDisease: "",
    diabetic: "",
    highBloodPressure: "",
    surgery: "",
    accident: "",
    familyMedicalHistory: "",
    currentMedication: "",
    pregnancy: "",
    others: "",
  });
  const { toast } = useToast();
  // fetch matching patients dynamically
  useEffect(() => {
    const fetchPatients = async () => {
      if (search.length < 2) return;
      try {
        const res = await fetch(`/api/patients?search=${search}`);
        const data = await res.json();
        setPatients(data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
    fetchPatients();
  }, [search]);

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setSearch(patient.name);
    setPatients([]); // close dropdown
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) {
      toast({ title: "Please select a patient" });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/patient-case-studies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: selectedPatient._id,
          ...formData,
        }),
      });

      if (res.ok) {
        toast({ title: "Patient case study added successfully!" });
        setFormData({
          foodAllergy: "",
          heartDisease: "",
          diabetic: "",
          highBloodPressure: "",
          surgery: "",
          accident: "",
          familyMedicalHistory: "",
          currentMedication: "",
          pregnancy: "",
          others: "",
        });
        setSelectedPatient(null);
        setSearch("");
      } else {
        toast({ title: "Error saving record" });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Add Patient Case Study</h2>

      <Card>
        <CardContent className="p-6">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Patient Search / Select */}
            <div className="col-span-2 relative">
              <Label>Select Patient *</Label>
              <Input
                placeholder="Search patient by name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedPatient(null);
                }}
              />
              {patients.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border rounded mt-1 shadow">
                  {patients.map((p) => (
                    <li
                      key={p._id}
                      onClick={() => handleSelectPatient(p)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {p.name} — {p.email}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Auto-filled Patient Info */}
            <div>
              <Label>Name</Label>
              <Input value={selectedPatient?.name || ""} disabled />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={selectedPatient?.email || ""} disabled />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={selectedPatient?.phone || ""} disabled />
            </div>

            {/* Editable Fields */}
            <div>
              <Label>Food Allergy</Label>
              <Input
                name="foodAllergy"
                placeholder="Yes/No or details"
                value={formData.foodAllergy}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Heart Disease</Label>
              <Input
                name="heartDisease"
                placeholder="Yes/No or details"
                value={formData.heartDisease}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Diabetic</Label>
              <Input
                name="diabetic"
                placeholder="Yes/No"
                value={formData.diabetic}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>High Blood Pressure</Label>
              <Input
                name="highBloodPressure"
                placeholder="Yes/No"
                value={formData.highBloodPressure}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Surgery</Label>
              <Input
                name="surgery"
                placeholder="Describe if any"
                value={formData.surgery}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Accident</Label>
              <Input
                name="accident"
                placeholder="Describe if any"
                value={formData.accident}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Family Medical History</Label>
              <Input
                name="familyMedicalHistory"
                placeholder="Any relevant info"
                value={formData.familyMedicalHistory}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Current Medication</Label>
              <Input
                name="currentMedication"
                placeholder="List current meds"
                value={formData.currentMedication}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Pregnancy</Label>
              <Input
                name="pregnancy"
                placeholder="Yes/No or details"
                value={formData.pregnancy}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Others</Label>
              <Input
                name="others"
                placeholder="Other conditions"
                value={formData.others}
                onChange={handleChange}
              />
            </div>

            <div className="col-span-2 flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Case Study"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default AddReport;
