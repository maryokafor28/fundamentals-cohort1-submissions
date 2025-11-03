import { useState } from "react";
import Button from "../component/ui/Button";
import type { NewUserFormData } from "../types/type";

interface AddUserFormProps {
  onSubmit: (formData: NewUserFormData) => void;
  onCancel: () => void;
  initialData?: NewUserFormData;
}

export default function AddUserForm({ onSubmit, onCancel, initialData }: AddUserFormProps) {
  const [formData, setFormData] = useState<NewUserFormData>(initialData||{
    name: "",
    email: "",
    balance: 0.0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "balance" ? parseFloat(value) || 0 : value,
    }));
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
          <label className="block text-sm font-medium mb-1">
            Initial Balance
          </label>
          <input
            type="number"
            name="balance"
            placeholder="25"
            value={formData.balance}
            onChange={handleChange}
            required
            className="w-full border rounded-md p-2"
          />
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
        <Button type="submit">{initialData ? "Update User" : "Create User"}</Button>
      </div>
    </form>
  );
}
