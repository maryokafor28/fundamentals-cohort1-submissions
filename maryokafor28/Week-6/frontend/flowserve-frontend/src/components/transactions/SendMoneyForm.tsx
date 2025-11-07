import { useState } from "react";
import type { User } from "../../types";
import { Button } from "../common/Button";

interface SendMoneyFormProps {
  users: User[];
  currentUserId: string;
  onSubmit: (
    receiverId: string,
    amount: number,
    description?: string
  ) => Promise<void>;
}

export const SendMoneyForm = ({
  users,
  currentUserId,
  onSubmit,
}: SendMoneyFormProps) => {
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableReceivers = users.filter((u) => u.id !== currentUserId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(receiverId, parseFloat(amount), description || undefined);
      setReceiverId("");
      setAmount("");
      setDescription("");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send money";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Send Money</h3>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="receiver"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Send To
          </label>
          <select
            id="receiver"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            required
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">Select receiver...</option>
            {availableReceivers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Amount
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description (Optional)
          </label>
          <input
            id="description"
            type="text"
            placeholder="What's this for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>

        <Button
          type="submit"
          disabled={loading || availableReceivers.length === 0}
          className="w-full"
        >
          {loading ? "Sending..." : "Send Money"}
        </Button>

        {availableReceivers.length === 0 && (
          <p className="text-yellow-600 text-sm text-center">
            No other users available to send money to.
          </p>
        )}
      </div>
    </form>
  );
};
