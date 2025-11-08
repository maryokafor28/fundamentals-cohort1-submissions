import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import type { doctorProps } from "@/context/type";
import { useState } from "react";

const departments = [
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "General Surgery",
  "Outpatient Department (OPD)",
];

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const genders = ["Male", "Female"];
const statuses = ["Active", "Inactive"];

const newDoctorSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  department: z.string().min(2, "Department is required"),
  designation: z.string().optional(),
  specialist: z.string().optional(),
  status: z.enum(["Active", "Inactive"]),
  gender: z.enum(["Male", "Female", "Other"]),
  dob: z.string().optional(),
  bloodGroup: z.enum(bloodGroups).optional(),
  address: z.string().optional(),
  bio: z.string().max(1000, "Bio must be 1000 characters or less").optional(),
  image: z.string().url("Invalid image URL").or(z.literal("")).optional(),
  password: z
    .string()
    .min(6, "Password is required and must be at least 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

type NewDoctorForm = z.infer<typeof newDoctorSchema>;

const NewDoctor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<NewDoctorForm>({
    resolver: zodResolver(newDoctorSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      department: departments[0],
      designation: "",
      specialist: "",
      status: "Active",
      gender: "Male",
      dob: "",
      bloodGroup: "O+",
      address: "",
      bio: "",
      image: "",
      password: "",
    },
  });
  const onSubmit = async (data: NewDoctorForm) => {
    try {
      setLoading(true);
      await signup(data as doctorProps).then((res) => {
        if (res) {
          toast({
            title: "Doctor created",
            description: "New doctor added successfully.",
          });
          setTimeout(() => navigate("/auth/login"), 1500);
          setLoading(false);
        }
        setLoading(false);
      });
      // const res = await fetch("/api/doctors", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data),
      // });
      // if (!res.ok) throw new Error(await res.text());
    } catch (err: any) {
      toast({
        title: "Creation failed",
        description: err.message || "Could not create doctor.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative w-full max-w-3xl">
        {/* Subtle floating icon */}
        <svg
          className="absolute -top-8 -left-8 w-20 h-20 text-emerald-200 opacity-30"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2L15 8H9L12 2ZM12 22L9 16H15L12 22ZM2 12L8 15V9L2 12ZM22 12L16 9V15L22 12Z" />
        </svg>

        <Card className="rounded-2xl shadow-lg bg-white/90 backdrop-blur-sm border border-emerald-100">
          <CardHeader className="text-center pb-0">
            <CardTitle className="text-3xl font-semibold">
              <span className="text-emerald-700">Pulse</span>
              <span className="text-pink-600">Track</span>
            </CardTitle>
            <p className="text-gray-500 mt-2 text-sm">
              Add a new doctor to your hospital system
            </p>
          </CardHeader>

          <CardContent className="pt-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 text-sm md:text-base"
            >
              {/* Name + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Name</Label>
                  <Input
                    {...register("name")}
                    placeholder="Dr. John Doe"
                    className="h-11"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    {...register("email")}
                    placeholder="doctor@example.com"
                    className="h-11"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Gender, DOB, Blood Group, Department */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <Label>Gender</Label>
                  <Select
                    onValueChange={(val) => setValue("gender", val as any)}
                    defaultValue="Male"
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {genders.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Date of Birth</Label>
                  <Input
                    {...register("dob")}
                    placeholder="YYYY-MM-DD"
                    className="h-11"
                  />
                </div>

                <div>
                  <Label>Blood Group</Label>
                  <Select
                    onValueChange={(val) => setValue("bloodGroup", val as any)}
                    defaultValue="O+"
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodGroups.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Department, Status, Designation */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <Label>Department</Label>
                  <Select
                    onValueChange={(val) => setValue("department", val)}
                    defaultValue={departments[0]}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Status</Label>
                  <Select
                    onValueChange={(val) => setValue("status", val as any)}
                    defaultValue="Active"
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Designation</Label>
                  <Input
                    {...register("designation")}
                    placeholder="MBBS, MD"
                    className="h-11"
                  />
                </div>
              </div>

              {/* Specialist + Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Specialist</Label>
                  <Input
                    {...register("specialist")}
                    placeholder="Cardiologist"
                    className="h-11"
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    {...register("phone")}
                    placeholder="(xxx) xxx-xxxx"
                    className="h-11"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <Label>Address</Label>
                <Input
                  {...register("address")}
                  placeholder="Full address"
                  className="h-11"
                />
              </div>

              {/* Bio */}
              <div>
                <Label>Bio</Label>
                <Textarea
                  {...register("bio")}
                  placeholder="Short biography"
                  rows={4}
                />
              </div>

              {/* Image URL */}
              <div>
                <Label>Image URL</Label>
                <Input
                  {...register("image")}
                  placeholder="https://example.com/photo.jpg"
                  className="h-11"
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  {...register("password")}
                  placeholder="*******"
                  className="h-11"
                  type="password"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password?.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-2"
                >
                  {loading ? "Saving..." : "Create Doctor"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default NewDoctor;
