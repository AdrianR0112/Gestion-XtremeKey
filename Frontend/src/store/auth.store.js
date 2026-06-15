import { createSlice } from "@reduxjs/toolkit";

const storedToken = typeof localStorage !== "undefined" ? localStorage.getItem("authToken") : null;
const storedUser = typeof localStorage !== "undefined" ? localStorage.getItem("authUser") : null;

const initialState = {
    token: storedToken || null,
    user: storedUser ? JSON.parse(storedUser) : null,
    isAuthenticated: Boolean(storedToken),
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { token, user } = action.payload || {};
            state.token = token || null;
            state.user = user || null;
            state.isAuthenticated = Boolean(token);

            if (token) {
                localStorage.setItem("authToken", token);
            }

            if (user) {
                localStorage.setItem("authUser", JSON.stringify(user));
            }
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem("authToken");
            localStorage.removeItem("authUser");
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;