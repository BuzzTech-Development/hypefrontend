import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

import apiInstance from "utils/api";

enum UserRole {
    Admin = 'ADMIN',
    Instructor = 'INSTRUCTOR',
    Student = 'STUDENT',
    Parent = 'PARENT',
}

export interface UserDetail {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    date_joined: string;
    profile: null | {
        role: UserRole;
        cohorts: number[];
    }
}

interface UserState {
    authenticated: boolean;
    userDetail?: UserDetail;
    currentCohort?: number;
}

const initialState: UserState = {
    authenticated: false,
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
        },
    },
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action) => ({
            ...state,
            authenticated: true,
            userDetail: action.payload,
            currentCohort: action.payload.profile?.cohorts[0],
        }))
    }
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
