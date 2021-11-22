import apiInstance from "../utils/api";
import {RootState} from "./store";
import {createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import {Assignment} from "./assignmentSlice";

export interface Submission {
    assignment: number;
    comments: string;
    graded: boolean;
    points: number;
}

const submissionsAdapter = createEntityAdapter<Submission>();

export const getSubmissions = createAsyncThunk(
    'GET_SUBMISSIONS',
    async () => apiInstance.getSubmissions(),
)

export const createSubmission = createAsyncThunk(
    'CREATE_SUBMISSION',
    async (payload: Submission) => {
        return apiInstance.createSubmission(payload);
    },
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
    }
})

export const submissionsSelectors = submissionsAdapter.getSelectors<RootState>(state => state.submissions);

export default submissionsSlice.reducer;