import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import type { Doctor } from "@/lib/types";

interface Props {
  initialData?: Partial<Doctor>;
  onCancel: () => void | Promise<void>;
  onSubmit: (data: Partial<Doctor>) => void;
  loading?: boolean;
  error: string | null;
  isEditing?: boolean;
}

export default function DoctorForm({
  initialData = {},
  onSubmit,
  loading = false,
}: Props) {
  const [form, setForm] = useState({
    name: initialData.name || "",
    specialization: initialData.specialization || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ Update form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        specialization: initialData.specialization || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // ✅ Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // ✅ Validation
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (form.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!form.specialization.trim()) {
      newErrors.specialization = "Specialization is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (form.phone && !/^\+?[\d\s-()]+$/.test(form.phone)) {
      newErrors.phone = "Invalid phone number format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit(form);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-blue-700">
          Edit Your Profile
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Update your professional information
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ✅ Full Name */}
          <div>
            <Label htmlFor="name" className="text-gray-700 font-medium">
              Full Name *
            </Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Dr. John Doe"
              className={errors.name ? "border-red-500" : ""}
              disabled={loading}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.name}
              </p>
            )}
          </div>

          {/* ✅ Specialization */}
          <div>
            <Label
              htmlFor="specialization"
              className="text-gray-700 font-medium"
            >
              Specialization *
            </Label>
            <Input
              id="specialization"
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              placeholder="Cardiologist, Neurologist, etc."
              className={errors.specialization ? "border-red-500" : ""}
              disabled={loading}
            />
            {errors.specialization && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.specialization}
              </p>
            )}
          </div>

          {/* ✅ Email */}
          <div>
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="doctor@example.com"
              className={errors.email ? "border-red-500" : ""}
              disabled={loading}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.email}
              </p>
            )}
          </div>

          {/* ✅ Phone (Optional) */}
          <div>
            <Label htmlFor="phone" className="text-gray-700 font-medium">
              Phone Number (Optional)
            </Label>
            <Input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
              className={errors.phone ? "border-red-500" : ""}
              disabled={loading}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.phone}
              </p>
            )}
          </div>

          {/* ✅ Info Alert */}
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              Only you can edit your profile. Other doctors and patients can
              view your information.
            </AlertDescription>
          </Alert>

          {/* ✅ Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
