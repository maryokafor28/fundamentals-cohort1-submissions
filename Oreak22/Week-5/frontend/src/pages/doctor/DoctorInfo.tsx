import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Pencil, Trash, Facebook, Twitter, Instagram } from "lucide-react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosClient from "@/api/axiosClient";

interface Doctor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  designation: string;
  specialist: string;
  status: string;
  address: string;
  bio: string;
  image?: string;
}

// Edit form will include a few editable fields only:
const editSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(7, "Enter a valid phone"),
  department: z.string().min(2),
  bio: z.string().max(200).optional(),
  image: z.string().url().optional().or(z.literal("")).optional(),
  specialist: z.string().min(2),
});
type EditFormValues = z.infer<typeof editSchema>;

export default function DoctorInfo() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      department: "",
      bio: "",
      image: "",
      specialist: "",
    },
  });

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/doctor/${id}`);
        if (!(await res.data.status))
          throw new Error("Failed to fetch doctor data");
        setDoctor(res.data.doctor);
        setError(null);
        console.log(res.data.doctor);
        reset({
          name: res.data.doctor.name ?? "",
          email: res.data.doctor.email ?? "",
          phone: res.data.doctor.phone ?? "",
          department: res.data.doctor.department ?? "",
          bio: res.data.doctor.bio ?? "",
          image: res.data.doctor.image ?? "",
          specialist: res.data.doctor.specialist ?? "",
        });
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDoctor();
  }, [id, reset]);

  const onSave = async (values: EditFormValues) => {
    if (!doctor) return;
    try {
      setSaving(true);
      const res = await axiosClient.put(`/doctor/update/${doctor._id}`, {
        body: values,
      });
      if (!res.data.status) {
        throw new Error("Failed to update doctor");
      }
      const updated = await res.data.doctor;
      console.log(updated);
      setDoctor(updated);
      setIsEditOpen(false);
      toast({
        title: "Doctor updated",
        description: "Doctor information saved successfully.",
      });
    } catch (err: any) {
      setError(err.response.data.message || "An error occurred");
      console.log(err);
      toast({
        title: "Update failed",
        description: err.message || "Could not update doctor.",
      });
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!doctor) return;
    try {
      setDeleting(true);
      const res = await axiosClient.delete(
        `/doctors/deleteProfile/${doctor._id}`
      );
      if (!res.data.status) {
        throw new Error("Failed to delete doctor");
      }
      toast({
        title: "Doctor deleted",
        description: "The doctor was deleted successfully.",
      });
      navigate("/doctors");
    } catch (err: any) {
      toast({
        title: "Delete failed",
        description: err.message || "Could not delete doctor.",
      });
    } finally {
      setDeleting(false);
      setIsDeleteOpen(false);
    }
  };

  if (loading)
    return (
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-[400px] w-full rounded-2xl" />
        <div className="md:col-span-2 space-y-4">
          <Skeleton className="h-[50px] w-1/2" />
          <Skeleton className="h-[250px] w-full" />
        </div>
      </div>
    );

  if (error)
    return (
      <div className="p-6">
        <Card className="p-6 text-red-500 text-center">{error}</Card>
      </div>
    );

  if (!doctor) return null;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Side - Profile */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader className="flex flex-col items-center gap-4 p-6">
          <img
            src={
              doctor.image ||
              "https://via.placeholder.com/300x300?text=No+Image"
            }
            alt={doctor.name}
            className="w-40 h-40 rounded-full object-cover border-4 border-primary/20"
          />
          <div className="text-center">
            <h2 className="text-xl font-semibold">{doctor.name}</h2>
            <p className="text-muted-foreground">{doctor.department}</p>
          </div>
          <Badge
            className={
              doctor.status === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }
          >
            {doctor.status}
          </Badge>

          <div className="flex gap-2 pt-2">
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex items-center gap-2"
                >
                  <Pencil className="h-4 w-4" /> Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Edit Doctor</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSave)} className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <Input {...register("name")} />
                    {errors.name && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Email</Label>
                    <Input {...register("email")} />
                    {errors.email && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Phone</Label>
                    <Input {...register("phone")} />
                    {errors.phone && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Department</Label>
                    <Input {...register("department")} />
                    {errors.department && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.department.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Specialist</Label>
                    <Input {...register("specialist")} />
                    {errors.specialist && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.specialist.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Image URL</Label>
                    <Input
                      {...register("image")}
                      placeholder="https://example.com/photo.jpg"
                    />
                    {errors.image && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.image.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Short Bio</Label>
                    <Textarea {...register("bio")} rows={4} />
                    {errors.bio && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.bio.message}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsEditOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={saving}>
                      {saving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <Trash className="h-4 w-4" /> Delete
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                  <DialogTitle>Confirm delete</DialogTitle>
                </DialogHeader>
                <p>
                  Are you sure you want to delete this doctor? This action
                  cannot be undone.
                </p>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="ghost"
                    onClick={() => setIsDeleteOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={onDelete}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Separator className="w-full" />
          <div className="flex justify-center gap-4 text-muted-foreground pt-2">
            <Facebook className="w-5 h-5 cursor-pointer hover:text-primary" />
            <Twitter className="w-5 h-5 cursor-pointer hover:text-primary" />
            <Instagram className="w-5 h-5 cursor-pointer hover:text-primary" />
          </div>
        </CardHeader>
      </Card>

      {/* Right Side - Details */}
      <Card className="md:col-span-2 rounded-2xl shadow-md">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{doctor.name}</h3>
              <p className="text-sm text-muted-foreground">
                {doctor.designation} • {doctor.specialist}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditOpen(true);
                }}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setIsDeleteOpen(true);
                }}
              >
                Delete
              </Button>
            </div>
          </div>

          <Separator />

          <h4 className="text-sm font-medium">Personal Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3">
            <p>
              <span className="font-medium">Email:</span> {doctor.email}
            </p>
            <p>
              <span className="font-medium">Phone:</span> {doctor.phone}
            </p>
            <p>
              <span className="font-medium">Gender:</span> {doctor.gender}
            </p>
            <p>
              <span className="font-medium">Date of Birth:</span> {doctor.dob}
            </p>
            <p>
              <span className="font-medium">Blood Group:</span>{" "}
              {doctor.bloodGroup}
            </p>
            <p>
              <span className="font-medium">Department:</span>{" "}
              {doctor.department}
            </p>{" "}
            <p>
              <span className="font-medium">Address:</span> {doctor.address}
            </p>
            <p>
              <span className="font-medium">Specialist:</span>{" "}
              {doctor.specialist}
            </p>
            <p>
              <span className="font-medium">Status:</span>{" "}
              <Badge
                className={
                  doctor.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }
              >
                {doctor.status}
              </Badge>
            </p>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium">Biography</h4>
            <p className="text-muted-foreground">{doctor.bio}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
