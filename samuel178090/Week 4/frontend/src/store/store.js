import { configureStore } from "@reduxjs/toolkit";
import uiSlice from "./ui-slice";
import userSlice from "./user-slice";

const store = configureStore({
    reducer: {
        ui: uiSlice,      // Remove .reducer (already exported from slice)
        user: userSlice   // Remove .reducer (already exported from slice)
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false // Needed for socket in user state
        })
})

export default store;