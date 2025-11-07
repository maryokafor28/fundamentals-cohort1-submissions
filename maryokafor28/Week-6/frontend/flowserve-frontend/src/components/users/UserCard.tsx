import type { User } from "../../types";
import { Button } from "../common/Button";

interface UserCardProps {
  user: User;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export const UserCard = ({ user, onDelete, isDeleting }: UserCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition flex items-center justify-between">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
        <p className="text-sm text-gray-600">{user.email}</p>
        <p className="text-xs text-gray-400 mt-1">
          Joined: {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>
      <Button
        variant="danger"
        onClick={() => onDelete(user.id)}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </Button>
    </div>
  );
};
