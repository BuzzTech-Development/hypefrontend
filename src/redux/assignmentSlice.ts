import {createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";

import apiInstance from "utils/api";
import {RootState} from "./store";

export interface Assignment {
    name: string;
    date: string;
    time: string;
    description: string;
    points: number;
    selectedBadge: number;
    graded: boolean;
    grade: number;
}

const assignmentsAdapter = createEntityAdapter<Assignment>({
    selectId: (assignment) => assignment.date + assignment.time,
});

export const getAssignments = createAsyncThunk(
    'GET_ASSIGNMENTS',
    async () => apiInstance.getAssignments(),
)

export const createAssignment = createAsyncThunk(
    'CREATE_ASSIGNMENT',
    async (payload: Assignment) => apiInstance.createAssignment(payload),
)

const assignmentsSlice = createSlice({
    name: 'assignments',
    initialState: assignmentsAdapter.getInitialState(),
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAssignments.fulfilled, (state, action) => {
                console.log(action.payload);
                assignmentsAdapter.setAll(state, action.payload);
            })
            .addCase(createAssignment.fulfilled, (state, action) => {
                assignmentsAdapter.addOne(state, action.payload)
            })
    }
})

export const assignmentsSelectors = assignmentsAdapter.getSelectors<RootState>(state => state.assignments);

export default assignmentsSlice.reducer;