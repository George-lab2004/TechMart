import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
    _id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    expiresAt?: number;
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

const getInitialUserInfo = (): UserInfo | null => {
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
        const userInfo: UserInfo = JSON.parse(userInfoString);
        if (userInfo.expiresAt && Date.now() > userInfo.expiresAt) {
            localStorage.removeItem('userInfo');
            return null;
        }
        return userInfo;
    }
    return null;
};

const initialState: AuthState = {
    userInfo: getInitialUserInfo(),
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