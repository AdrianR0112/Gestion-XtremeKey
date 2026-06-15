import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    sidebarOpen: false,
    loading: false,
    searchQuery: "",
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setSidebarOpen: (state, action) => {
            state.sidebarOpen = action.payload;
        },
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
    },
});

export const { setSidebarOpen, toggleSidebar, setLoading, setSearchQuery } = uiSlice.actions;
export default uiSlice.reducer;