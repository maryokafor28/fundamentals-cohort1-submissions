import type { User } from "../../types";
import { UserCard } from "./UserCard";
import { LoadingSpinner } from "../common/Loading";
import { ErrorMessage } from "../common/ErrorMessage";

interface UserListProps {
  users: User[];
  loading: boolean;
  error: string | null;
  onDelete: (id: string) => void;
  onRetry: () => void;
  deletingUserId?: string;
}

export const UserList = ({
  users,
  loading,
  error,
  onDelete,
  onRetry,
  deletingUserId,
}: UserListProps) => {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={onRetry} />;
  if (users.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">
        No users found. Create one to get started!
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          onDelete={onDelete}
          isDeleting={deletingUserId === user.id}
        />
      ))}
    </div>
  );
};
