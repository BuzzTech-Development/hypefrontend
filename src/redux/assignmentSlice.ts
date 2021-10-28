import {createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import apiInstance from "utils/api";
import {RootState} from "./store";
import moment from "moment";

export interface Assignment {
    name: string;
    id?: number;
    createdAt: string;
    description?: string;
    points: number;
    badge?: number;
    dueDate: string;
    undated: boolean;
    graded: boolean;
    grade?: number;
    numFiles: number; // temp for files
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