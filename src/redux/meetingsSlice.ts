import {createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";

import apiInstance from "utils/api";

export interface Meeting {
    id: number;
    name: string;
    cohort: number;
    date: string;
    start_time: string;
    end_time: string;
    link: string;
}

const meetingsAdapter = createEntityAdapter<Meeting>({
    selectId: (meeting) => meeting.id,
});

export const getMeetings = createAsyncThunk(
    'GET_MEETINGS',
    async (cohortId: number) => apiInstance.getMeetings(cohortId),
)

const meetingsSlice = createSlice({
    name: 'meetings',
    initialState: meetingsAdapter.getInitialState(),
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getMeetings.fulfilled, (state, action) => {
            meetingsAdapter.setAll(state, action.payload);
        })
    }
})

export default meetingsSlice.reducer;