import { createSlice } from "@reduxjs/toolkit";

const storedUser = typeof localStorage !== "undefined" ? localStorage.getItem("authUser") : null;

const initialState = {
    user: storedUser ? JSON.parse(storedUser) : null,
    isAuthenticated: Boolean(storedUser),
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user } = action.payload || {};
            state.user = user || null;
            state.isAuthenticated = Boolean(user);

            if (user) {
                localStorage.setItem("authUser", JSON.stringify(user));
            }
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem("authUser");
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
