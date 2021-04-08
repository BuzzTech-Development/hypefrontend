import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import apiInstance from "../utils/api";

interface UserState {
    authenticated: boolean;
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
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state) => ({
            ...state,
            authenticated: true,
        }))
    }
});

export default userSlice.reducer