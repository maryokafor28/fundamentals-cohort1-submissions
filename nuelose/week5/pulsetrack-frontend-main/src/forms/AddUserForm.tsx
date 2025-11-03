import { useState } from "react";
import Button from "../component/ui/Button";
import type { NewUserFormData } from "../types/type";

interface AddUserFormProps {
  onSubmit: (formData: NewUserFormData) => void;
  onCancel: () => void;
}

export default function AddUserForm({ onSubmit, onCancel }: AddUserFormProps) {
  const [formData, setFormData] = useState<NewUserFormData>({
    name: "",
    email: "",
    age: "",
    gender: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Full Name *</label>
        <input
          type="text"
          name="name"
          placeholder="Enter full name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Email Address *
        </label>
        <input
          type="email"
          name="email"
          placeholder="user@example.com"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border rounded-md p-2"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Age *</label>
          <input
            type="number"
            name="age"
            placeholder="25"
            value={formData.age}
            onChange={handleChange}
            required
            className="w-full border rounded-md p-2"
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Gender *</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full border rounded-md p-2"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>
        <Button type="submit">Save User</Button>
      </div>
    </form>
  );
}
