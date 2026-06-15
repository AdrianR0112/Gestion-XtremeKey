import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth.store";
import uiReducer from "./ui.store";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        ui: uiReducer,
    },
});

export default store;