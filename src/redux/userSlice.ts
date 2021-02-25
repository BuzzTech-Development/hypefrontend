import {createSlice} from "@reduxjs/toolkit";

interface UserState {
    authenticated: boolean;
}

const initialState: UserState = {
    authenticated: false,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
});

export default userSlice.reducer