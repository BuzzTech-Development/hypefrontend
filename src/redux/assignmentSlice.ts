import {createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import apiInstance from "utils/api";
import {RootState} from "./store";

export interface Submission {
    id: number;
    author: number;
    time: string;
    assignment: number;
    comments: string;
    graded: boolean;
    points: number;
    files: any;
}

export interface Assignment {
    name: string;
    id: number;
    cohort: number;
    creation_date: string;
    description: string;
    points: number;
    badge: number;
    due_date: string;
    file_extensions: string[];
    submissions: Submission[]
}



const assignmentsAdapter = createEntityAdapter<Assignment>();

export const getAssignments = createAsyncThunk(
    'GET_ASSIGNMENTS',
    async () => apiInstance.getAssignments(),
)

export const createAssignment = createAsyncThunk(
    'CREATE_ASSIGNMENT',
    async (payload: any) => {
        return apiInstance.createAssignment(payload);
    },
)

export const createSubmission = createAsyncThunk(
    'CREATE_SUBMISSION',
    async (payload: any) => {
        return apiInstance.createSubmission(payload);
    },
)

export const gradeSubmission = createAsyncThunk(
    'GRADE_SUBMISSION',
    async (payload: any) => {
        return apiInstance.gradeSubmission(payload);
    }
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
            .addCase(createSubmission.fulfilled, (state, action) => {
                const assignment = {...state.entities[action.payload.assignment]};
                if (assignment.submissions) {
                    assignment.submissions = [...assignment.submissions, action.payload];
                } else {
                    assignment.submissions = [action.payload];
                }
                assignmentsAdapter.updateOne(state, {id: action.payload.assignment, changes: assignment});
            })
            .addCase(gradeSubmission.fulfilled, (state, action) => {
                const assignment = {...state.entities[action.payload.assignment]};
                const submissions = assignment.submissions?.filter((submission) => submission.id == action.payload.id);
                if (submissions) {
                    submissions[0].graded = true;
                    submissions[0].points = action.payload.points;
                } else return;
                assignmentsAdapter.updateOne(state, {id: action.payload.assignment, changes: assignment})
            })
    }
})

export const assignmentsSelectors = assignmentsAdapter.getSelectors<RootState>(state => state.assignments);

export default assignmentsSlice.reducer;