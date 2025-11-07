import { create } from "zustand";
import type { User } from "../api/user.api";
import { getUsers, createUser, updateUser, deleteUser } from "../api/user.api";

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  addUser: (user: User) => Promise<void>;
  editUser: (id: string, user: Partial<User>) => Promise<void>;
  removeUser: (id: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getUsers();
      set({ users: Array.isArray(data) ? data : [], loading: false });
    } catch (error: unknown) {
      if (error instanceof Error) {
        set({ error: error.message, loading: false });
      } else {
        set({ error: String(error), loading: false });
      }
    }
  },

  addUser: async (user) => {
    set({ loading: true });
    try {
      const data = await createUser(user);
      await useUserStore.getState().fetchUsers();
      set((state) => ({ users: [...state.users, data], loading: false }));
    } catch (error: unknown) {
      if (error instanceof Error) {
        set({ error: error.message, loading: false });
      } else {
        set({ error: String(error), loading: false });
      }
    }
  },

  editUser: async (id, user) => {
    set({ loading: true });
    try {
      const data = await updateUser(id, user);
      await useUserStore.getState().fetchUsers();
      set((state) => ({
        users: state.users.map((u) => (u._id === id ? data : u)),
        loading: false,
      }));
    } catch (error: unknown) {
      if (error instanceof Error) {
        set({ error: error.message, loading: false });
      } else {
        set({ error: String(error), loading: false });
      }
    }
  },

  removeUser: async (id) => {
    set({ loading: true });
    try {
      await deleteUser(id);
      set((state) => ({
        users: state.users.filter((u) => u._id !== id),
        loading: false,
      }));
    } catch (error: unknown) {
      if (error instanceof Error) {
        set({ error: error.message, loading: false });
      } else {
        set({ error: String(error), loading: false });
      }
    }
  },
}));
