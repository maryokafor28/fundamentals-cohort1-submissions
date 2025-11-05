import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "../features/projectSlice";

export const store = configureStore({
  reducer: {
    projects: projectReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
