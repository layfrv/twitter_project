import {createSlice} from '@reduxjs/toolkit';
import {getUser} from './userReducer';

const appSlice = createSlice({
    name: 'app',
    initialState: {
        isReady: true,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUser.pending, (state) => {
                state.isReady = false;
                state.error = null;
            })
            .addCase(getUser.fulfilled, (state) => {
                state.isReady = true;
                state.error = null;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.isReady = true;
                state.error = action.payload;
            });
    },
});

export default appSlice.reducer;
