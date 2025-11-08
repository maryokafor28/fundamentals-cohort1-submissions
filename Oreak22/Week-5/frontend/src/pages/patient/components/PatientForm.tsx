import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
// import { useToast } from "@/hooks/use-toast";

interface PatientData {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  gender?: string;
  bloodGroup?: string;
  address?: string;
  dob?: string;
  status?: string;
  photo?: File | null;
}

interface PatientFormProps {
  mode?: "add" | "edit";
  initialData?: PatientData;
  onSubmitSuccess?: () => void;
  createAction?: (data: IPatient) => Promise<void> | undefined;
}
export interface IPatient {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  bloodGroup: string;
  address: string;
  report?: string[];
  doctor?: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
  photo?: File | null;
}

const PatientForm = ({
  mode = "add",
  initialData,
  onSubmitSuccess,
  createAction,
}: PatientFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<IPatient>({
    name: "",
    email: "",
    phone: "",
    gender: "",
    bloodGroup: "",
    address: "",
    dob: "",
    status: "",
    photo: null,
  });

  useEffect(() => {
    if (initialData) {
      setForm({ ...form, ...initialData });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, photo: e.target.files?.[0] || null });
  };
  const { user } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const patientData = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        gender: form.gender,
        dob: form.dob,
        bloodGroup: form.bloodGroup,
        address: form.address,
        doctor: user?.id,
        status: form.status,
      };

      if (createAction) {
        await createAction(patientData);
      } else {
        // await updateAction(patientId, patientData);
      }

      toast({
        title:
          mode === "add"
            ? "Patient Added Successfully"
            : "Patient Updated Successfully",
        description: `${form.name} has been ${
          mode === "add" ? "registered" : "updated"
        }.`,
      });

      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err: any) {
      console.error("Error submitting patient form:", err);

      toast({
        title: "Error",
        description:
          err?.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {mode === "add" ? "Add Patient" : "Edit Patient"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Name */}
          <div>
            <Label>Name *</Label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Name"
            />
          </div>

          {/* Email */}
          <div>
            <Label>Email *</Label>
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Email"
            />
          </div>

          {/* Phone */}
          <div>
            <Label>Phone</Label>
            <Input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
            />
          </div>

          {/* Gender */}
          <div>
            <Label>Gender</Label>
            <Select
              value={form.gender}
              onValueChange={(value) => setForm({ ...form, gender: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Blood Group */}
          <div>
            <Label>Blood Group</Label>
            <Select
              value={form.bloodGroup}
              onValueChange={(value) => setForm({ ...form, bloodGroup: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Blood Group" />
              </SelectTrigger>
              <SelectContent>
                {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                  (bg) => (
                    <SelectItem key={bg} value={bg}>
                      {bg}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Photo */}
          <div className="md:col-span-2">
            <Label>Photo</Label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <Label>Address</Label>
            <Textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter Address"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <Label>Date of Birth</Label>
            <Input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
            />
          </div>

          {/* Status */}
          <div>
            <Label>Status *</Label>
            <Select
              value={form.status}
              onValueChange={(value) => setForm({ ...form, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit */}
          <div className="md:col-span-2 flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {loading
                ? "Saving..."
                : mode === "add"
                ? "Save Patient"
                : "Update Patient"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
export default PatientForm;
