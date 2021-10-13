import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { logger } from 'redux-logger';
import { configureStore } from '@reduxjs/toolkit'

import userSlice from "./userSlice";
import meetingsSlice from "./meetingsSlice";
import assignmentSlice from "./assignmentSlice";

const store = configureStore({
    reducer: {
        user: userSlice,
        meetings: meetingsSlice,
        assignments: assignmentSlice,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(logger),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Create typed useDispatch and useSelector hooks
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store