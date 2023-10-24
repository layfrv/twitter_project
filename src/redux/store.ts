import {configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import appReducer from './appReducer';
import postsReducer from './postsReducer';
import userReducer from './userReducer';
import usersReducer from './usersReducer';

export const store = configureStore({
    reducer: {
        app: appReducer,
        user: userReducer,
        posts: postsReducer,
        users: usersReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
