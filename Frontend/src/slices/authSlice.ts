import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
    _id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    delivery?: {
        title: string;
        address: {
            streetNumber?: string;
            buildingNumber?: string;
            floorNumber?: string;
            apartmentNumber?: string;
            city?: string;
            country?: string;
            landmark?: string;
            notes?: string;
            postalCode?: number;
        }[];
        phone?: string;
    }[];
}

interface AuthState {
    userInfo: UserInfo | null;
}

const initialState: AuthState = {
    userInfo: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo')!)
        : null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<UserInfo>) => {
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.userInfo = null;
            localStorage.removeItem('userInfo');
        },
        register: (state, action: PayloadAction<UserInfo>) => {
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        }
    },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;