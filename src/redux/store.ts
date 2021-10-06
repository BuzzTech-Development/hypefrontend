import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { logger } from 'redux-logger';
import { configureStore } from '@reduxjs/toolkit'

import userSlice from "./userSlice";
import meetingsSlice from "./meetingsSlice";

const store = configureStore({
    reducer: {
        user: userSlice,
        meetings: meetingsSlice,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(logger),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Create typed useDispatch and useSelector hooks
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store