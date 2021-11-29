import {createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";

import apiInstance from "utils/api";
import {RootState} from "./store";

export interface Announcement {
    id: number;
    subject: string;
    text: string;
    created_at: string;
}

const announcementsAdapter = createEntityAdapter<Announcement>({
    selectId: (announcement) => announcement.id,
});

export const getAnnouncements = createAsyncThunk(
    'GET_ANNOUNCEMENTS',
    async (cohortId: number) => apiInstance.getAnnouncements(cohortId),
)

const announcementsSlice = createSlice({
    name: 'announcements',
    initialState: announcementsAdapter.getInitialState(),
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAnnouncements.fulfilled, (state, action) => {
            announcementsAdapter.setAll(state, action.payload);
        })
    }
})

export const announcementsSelectors = announcementsAdapter.getSelectors<RootState>(state => state.announcements)

export default announcementsSlice.reducer;