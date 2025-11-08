import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface report {
  _id: string;
  patientName: string;
  email: string;
  phone: string;
  foodAllergy: string;
  heartDisease: string;
  diabetic: string;
  highBloodPressure: string;
  surgery: string;
  accident: string;
  familyMedicalHistory: string;
  currentMedication: string;
  pregnancy: string;
  others: string;
  createdAt: string;
}

const ReportInfo = () => {
  const { id } = useParams();
  const [caseStudy, setCaseStudy] = useState<report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCaseStudy = async () => {
      try {
        const res = await fetch(`/api/patient-case-studies/${id}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setCaseStudy(data);
      } catch (error) {
        console.error(error);
        setCaseStudy(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCaseStudy();
  }, [id]);

  if (loading)
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-48 w-full" />
      </div>
    );

  if (!caseStudy)
    return (
      <div className="p-6 text-center text-gray-500">
        No case study information found for this patient.
      </div>
    );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Patient Case Study Info</h2>

      <Card className="shadow-sm">
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div>
            <Label className="font-medium text-gray-600">Name</Label>
            <p className="mt-1">{caseStudy.patientName || "—"}</p>
          </div>
          <div>
            <Label className="font-medium text-gray-600">Email</Label>
            <p className="mt-1">{caseStudy.email || "—"}</p>
          </div>
          <div>
            <Label className="font-medium text-gray-600">Phone</Label>
            <p className="mt-1">{caseStudy.phone || "—"}</p>
          </div>

          {/* Medical Info */}
          <div>
            <Label>Food Allergy</Label>
            <p className="mt-1">{caseStudy.foodAllergy || "—"}</p>
          </div>
          <div>
            <Label>Heart Disease</Label>
            <p className="mt-1">{caseStudy.heartDisease || "—"}</p>
          </div>
          <div>
            <Label>Diabetic</Label>
            <p className="mt-1">{caseStudy.diabetic || "—"}</p>
          </div>
          <div>
            <Label>High Blood Pressure</Label>
            <p className="mt-1">{caseStudy.highBloodPressure || "—"}</p>
          </div>
          <div>
            <Label>Surgery</Label>
            <p className="mt-1">{caseStudy.surgery || "—"}</p>
          </div>
          <div>
            <Label>Accident</Label>
            <p className="mt-1">{caseStudy.accident || "—"}</p>
          </div>
          <div>
            <Label>Family Medical History</Label>
            <p className="mt-1">{caseStudy.familyMedicalHistory || "—"}</p>
          </div>
          <div>
            <Label>Current Medication</Label>
            <p className="mt-1">{caseStudy.currentMedication || "—"}</p>
          </div>
          <div>
            <Label>Pregnancy</Label>
            <p className="mt-1">{caseStudy.pregnancy || "—"}</p>
          </div>
          <div>
            <Label>Others</Label>
            <p className="mt-1">{caseStudy.others || "—"}</p>
          </div>

          <div className="col-span-2 border-t pt-4 text-sm text-gray-500">
            <p>
              Created on: {new Date(caseStudy.createdAt).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default ReportInfo;
