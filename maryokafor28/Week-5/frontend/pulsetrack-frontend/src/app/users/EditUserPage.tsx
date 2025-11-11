import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/hooks/useAuth";
import UserForm from "@/components/users/UserForm";
import type { User } from "@/lib/types";

export default function EditUserPage() {
  const { id } = useParams();
  const { getUserById, updateUser, error } = useUsers();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [userData, setUserData] = useState<Partial<User> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      if (!id) return;

      // ✅ Check if user is trying to edit their own profile
      if (id !== currentUser?._id) {
        alert("You can only edit your own profile");
        navigate("/users");
        return;
      }

      setIsFetching(true);
      const user = await getUserById(id);
      setUserData(user);
      setIsFetching(false);
    }

    fetchUser();
  }, [id, getUserById, currentUser, navigate]);

  const handleUpdate = async (data: Partial<User>) => {
    if (!id) return;

    setIsLoading(true);
    try {
      await updateUser(id, data);
      navigate("/users");
    } catch {
      // Error is handled in the hook
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <p className="text-center mt-10">Loading user...</p>;
  if (!userData) return <p className="text-center mt-10">User not found</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-primary">
          Edit Your Profile
        </h1>
      </div>

      <UserForm
        onSubmit={handleUpdate}
        onCancel={() => navigate("/users")}
        loading={isLoading}
        error={error}
        initialData={userData}
        isEditing={true}
      />
    </div>
  );
}
