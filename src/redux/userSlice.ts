import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {UserType} from "utils/UserType";

import apiInstance from "utils/api";

interface UserState {
    authenticated: boolean;
    userType: string;
}

const initialState: UserState = {
    authenticated: false,
    userType: UserType.STUDENT,
}

export const login = createAsyncThunk(
    'LOGIN',
    async (payload: { username: string, password: string }) => apiInstance.login(payload),
)

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            apiInstance.removeTokenAuth();
            state.authenticated = false;
            state.userType = UserType.STUDENT;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state) => ({
            ...state,
            authenticated: true,
            userType: apiInstance.userType,
        }))
    }
});

export const { logout } = userSlice.actions;

export default userSlice.reducer