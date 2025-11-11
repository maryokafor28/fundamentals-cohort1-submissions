import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Doctor } from "@/lib/types";

interface Props {
  initialData?: Partial<Doctor>;
  onSubmit: (data: Partial<Doctor>) => void;
}

export default function DoctorForm({ initialData = {}, onSubmit }: Props) {
  const [form, setForm] = useState({
    name: initialData.name || "",
    specialization: initialData.specialization || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="specialization">Specialization</Label>
        <Input
          id="specialization"
          name="specialization"
          value={form.specialization}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />
      </div>

      <Button type="submit" className="w-full">
        Save Doctor
      </Button>
    </form>
  );
}
