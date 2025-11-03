import { useState } from "react";

export interface DoctorFormData {
  name: string;
  specialty: string;
  phone: string;
  email: string;
  hospital: string;
}

interface AddDoctorFormProps {
  onClose: () => void;
  onSubmit: (doctorData: DoctorFormData) => void;
}

const AddDoctorForm = ({ onClose, onSubmit }: AddDoctorFormProps) => {
  const [formData, setFormData] = useState<DoctorFormData>({
    name: "",
    specialty: "",
    phone: "",
    email: "",
    hospital: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[500px] relative">
        <h2 className="text-xl font-semibold mb-4">Add New Doctor</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter full name"
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-green-500"
            />
          </div>

          {/* Specialty */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Specialty *
            </label>
            <input
              type="text"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              required
              placeholder="e.g. Cardiologist"
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-green-500"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="e.g. +234 800 000 0000"
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-green-500"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="e.g. doctor@example.com"
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-green-500"
            />
          </div>

          {/* Hospital */}
          <div>
            <label className="block text-sm font-medium mb-1">Hospital *</label>
            <input
              type="text"
              name="hospital"
              value={formData.hospital}
              onChange={handleChange}
              required
              placeholder="e.g. Lagos State General Hospital"
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-green-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Add Doctor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctorForm;
