import {createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import apiInstance from "utils/api";
import {RootState} from "./store";

export interface Assignment {
    name: string;
    id?: number;
    cohort: number;
    creation_date?: string;
    description?: string;
    points: number;
    badge?: number;
    due_date: string;
    file_extensions: string[];
}

const assignmentsAdapter = createEntityAdapter<Assignment>();

export const getAssignments = createAsyncThunk(
    'GET_ASSIGNMENTS',
    async () => apiInstance.getAssignments(),
)

export const createAssignment = createAsyncThunk(
    'CREATE_ASSIGNMENT',
    async (payload: Assignment) => {
        return apiInstance.createAssignment(payload);
    },
)

const assignmentsSlice = createSlice({
    name: 'assignments',
    initialState: assignmentsAdapter.getInitialState(),
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAssignments.fulfilled, (state, action) => {
                assignmentsAdapter.setAll(state, action.payload);
            })
            .addCase(createAssignment.fulfilled, (state, action) => {
                assignmentsAdapter.addOne(state, action.payload)
            })
    }
})

export const assignmentsSelectors = assignmentsAdapter.getSelectors<RootState>(state => state.assignments);

export default assignmentsSlice.reducer;