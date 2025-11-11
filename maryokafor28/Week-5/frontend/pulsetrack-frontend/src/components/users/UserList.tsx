import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { User } from "@/lib/types";

interface UserListProps {
  users: User[];
  currentUser: User | null;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export default function UserList({
  users,
  currentUser,
  onDelete,
  onEdit,
}: UserListProps) {
  if (!users.length) {
    return <p className="text-gray-500 text-center mt-10">No users found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => (
        <Card
          key={user._id}
          className="shadow-sm hover:shadow-md transition rounded-2xl"
        >
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{user.name}</CardTitle>
            <p className="text-sm text-gray-500">{user.email}</p>
          </CardHeader>

          <CardContent className="space-y-2">
            {user.age && (
              <p className="text-sm text-gray-600">
                Age: <span className="font-medium">{user.age}</span>
              </p>
            )}
            {user.height && (
              <p className="text-sm text-gray-600">
                Height: <span className="font-medium">{user.height} cm</span>
              </p>
            )}
            {user.weight && (
              <p className="text-sm text-gray-600">
                Weight: <span className="font-medium">{user.weight} kg</span>
              </p>
            )}

            {currentUser && currentUser._id === user._id && (
              <div className="flex justify-end gap-2 pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(user._id)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(user._id)}
                >
                  Delete
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
