import { configureStore } from '@reduxjs/toolkit'
import { logger } from 'redux-logger';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import userSlice from "./userSlice";

const store = configureStore({
    reducer: {
        user: userSlice,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(logger),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Create typed useDispatch and useSelector hooks
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store