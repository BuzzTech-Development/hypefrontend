import apiInstance from "../utils/api";
import {RootState} from "./store";
import {createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";

export interface Submission {
    id: number;
    assignment: number;
    comments: string;
    graded: boolean;
    points: number;
    files: any;
}

const submissionsAdapter = createEntityAdapter<Submission>();

export const getSubmissions = createAsyncThunk(
    'GET_SUBMISSIONS',
    async () => apiInstance.getSubmissions(),
)

export const createSubmission = createAsyncThunk(
    'CREATE_SUBMISSION',
    async (payload: any) => {
        return apiInstance.createSubmission(payload);
    },
)

export const gradeSubmission = createAsyncThunk(
    'GRADE_SUBMISSION',
    async (payload: number) => {
        return apiInstance.gradeSubmission(payload);
    }
)

const submissionsSlice = createSlice({
    name: 'submissions',
    initialState: submissionsAdapter.getInitialState(),
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getSubmissions.fulfilled, (state, action) => {
                submissionsAdapter.setAll(state, action.payload);
            })
            .addCase(createSubmission.fulfilled, (state, action) => {
                submissionsAdapter.addOne(state, action.payload)
            })
            .addCase(gradeSubmission.fulfilled, (state, action) => {
                submissionsAdapter.updateOne(state, {id: action.payload.id, changes: {graded: true, points: action.payload.points}})
            })
    }
})

export const submissionsSelectors = submissionsAdapter.getSelectors<RootState>(state => state.submissions);

export default submissionsSlice.reducer;