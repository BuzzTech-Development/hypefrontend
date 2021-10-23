import {createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import apiInstance from "utils/api";
import {RootState} from "./store";
import moment from "moment";

export interface Assignment {
    name: string;
    id?: number;
    createdAt: moment.Moment | string;
    description?: string;
    points: number;
    badge?: number;
    dueDate: moment.Moment | string;
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
    async (payload: Assignment) => apiInstance.createAssignment(payload),
)

const assignmentsSlice = createSlice({
    name: 'assignments',
    initialState: assignmentsAdapter.getInitialState(),
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAssignments.fulfilled, (state, action) => {
                const data : Assignment[] = action.payload;
                for (let i = 0; i < data.length; i++) {
                    data[i].createdAt = moment(data[i].createdAt);
                    data[i].dueDate = moment(data[i].dueDate);
                }
                assignmentsAdapter.setAll(state, data);
            })
            .addCase(createAssignment.fulfilled, (state, action) => {
                assignmentsAdapter.addOne(state, action.payload)
            })
    }
})

export const assignmentsSelectors = assignmentsAdapter.getSelectors<RootState>(state => state.assignments);

export default assignmentsSlice.reducer;