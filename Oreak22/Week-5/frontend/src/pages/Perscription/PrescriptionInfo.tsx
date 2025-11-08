import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft } from "lucide-react";
import axiosClient from "@/api/axiosClient";

interface Prescription {
  _id: string;
  patient: {
    name: string;
    email: string;
    phone: string;
    gender: string;
    age: number;
  };
  doctor: {
    name: string;
    department: string;
    designation: string;
  };
  diagnosis: string;
  medicine: string;
  dosage: string;
  duration: string;
  notes: string;
  createdAt: string;
}

export default function PrescriptionInfo() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const res = await axiosClient.get(`/api/prescriptions/${id}`);
        setPrescription(res.data);
      } catch (err) {
        console.error("Failed to fetch prescription:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescription();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
      </div>
    );

  if (!prescription)
    return (
      <div className="text-center text-gray-500 py-10">
        Prescription not found.
      </div>
    );

  const { patient, doctor } = prescription;

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/dashboard/prescriptions")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <h1 className="text-xl font-semibold">Prescription Details</h1>
      </div>

      <Card className="max-w-4xl mx-auto shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Prescription ID: {prescription._id}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Patient Information */}
          <section>
            <h2 className="font-semibold text-gray-700 mb-2">Patient Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{patient.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{patient.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{patient.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium capitalize">{patient.gender}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-medium">{patient.age}</p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Doctor Information */}
          <section>
            <h2 className="font-semibold text-gray-700 mb-2">Doctor Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{doctor.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{doctor.department}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Designation</p>
                <p className="font-medium">{doctor.designation}</p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Prescription Details */}
          <section>
            <h2 className="font-semibold text-gray-700 mb-2">
              Prescription Info
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Diagnosis</p>
                <p className="font-medium">{prescription.diagnosis}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Medicine</p>
                <p className="font-medium">{prescription.medicine}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dosage</p>
                <p className="font-medium">{prescription.dosage}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{prescription.duration}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Additional Notes</p>
              <p className="font-medium">{prescription.notes || "N/A"}</p>
            </div>
          </section>

          <Separator />

          {/* Created Date */}
          <section>
            <p className="text-sm text-muted-foreground">Created On</p>
            <p className="font-medium">
              {new Date(prescription.createdAt).toLocaleString()}
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
