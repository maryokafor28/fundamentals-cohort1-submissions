import { create } from "zustand";

interface AppState {
  loading: boolean;
  setLoading: (value: boolean) => void;
  error: string | null;
  setError: (msg: string | null) => void;
}

const useAppStore = create<AppState>((set) => ({
  loading: false,
  setLoading: (value) => set({ loading: value }),
  error: null,
  setError: (msg) => set({ error: msg }),
}));

export default useAppStore;
