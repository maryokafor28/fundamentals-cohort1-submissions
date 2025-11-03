import { useState } from "react";
import type { TransactionFormData } from "../types/type";

interface AddTransactionFormProps {
  onClose: () => void;
  onSubmit: (transactionData: TransactionFormData) => void;
}

const AddTransactionForm = ({ onClose, onSubmit }: AddTransactionFormProps) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    type: "DEPOSIT",
    senderEmail: "",
    receiverEmail: "",
    userEmail: "",
    amount: 0,
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[550px] relative">
        <h2 className="text-xl font-semibold mb-4">Create Transaction</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Transaction Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              <option value="DEPOSIT">Deposit</option>
              <option value="TRANSFER">Transfer</option>
              <option value="WITHDRAWAL">Withdrawal</option>
            </select>
          </div>

          {formData.type === "TRANSFER" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Sender Email *
                </label>
                <input
                  type="email"
                  name="senderEmail"
                  value={formData.senderEmail}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Receiver Email *
                </label>
                <input
                  type="email"
                  name="receiverEmail"
                  value={formData.receiverEmail}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md px-3 py-2 text-sm"
                />
              </div>
            </>
          )}

          {(formData.type === "DEPOSIT" || formData.type === "WITHDRAWAL") && (
            <div>
              <label className="block text-sm font-medium mb-1">
                User Email *
              </label>
              <input
                type="email"
                name="userEmail"
                value={formData.userEmail}
                onChange={handleChange}
                required
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Amount *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-3 py-2 text-sm"
              min={1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g., Transfer to savings"
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
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
              Create Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionForm;
