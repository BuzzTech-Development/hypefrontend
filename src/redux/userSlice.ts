import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

import apiInstance from "utils/api";

enum UserRole {
    Admin = 'ADMIN',
    Instructor = 'INSTRUCTOR',
    Student = 'STUDENT',
    Parent = 'PARENT',
}

export interface UserDetail {
    pk: number;
    username: string;
    password: string;
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
    invalidCred?: boolean;
}

const initialState: UserState = {
    authenticated: false,
    invalidCred:  false
}

export const login = createAsyncThunk(
    'LOGIN',
    async (payload: { username: string, password: string }) => apiInstance.login(payload),
)

export const refresh = createAsyncThunk(
    'REFRESH',
    async () => apiInstance.refreshToken()
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
        builder
        .addCase(login.fulfilled, (state, action) => ({
            ...state,
            authenticated: true,
            userDetail: action.payload,
            currentCohort: action.payload.profile?.cohorts[0],
            invalidCred: false
        }))
        .addCase(login.rejected, (state, action) => ({
            ...state,
            authenticated: false,
            invalidCred: true
        }))
        .addCase(refresh.fulfilled, (state, action) => ({
            ...state,
            authenticated: true,
            userDetail: action.payload,
            currentCohort: action.payload.profile?.cohorts[0],
            invalidCred: false
        }))

    }
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
