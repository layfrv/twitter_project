import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from '../axios';
import {GET_USERS} from '../constants/user';
import {UserType} from '../types/User';
import {PostType} from '../types/Post';

export const getUsers = createAsyncThunk(
    'users/getUsers',
    async (): Promise<UserType[]> => {
        try {
            const users = await axios.get(GET_USERS);
            return users.data;
        } catch (error) {
            return error;
        }
    },
);

export const getUserById = createAsyncThunk(
    'users/getUserById',
    async (id: number, {dispatch}) => {
        try {
            const response = await axios.get(`${GET_USERS}/${id}`);
            return response.data;
        } catch (error) {
            return error;
        }
    },
);

const userSlice = createSlice({
    name: 'users',
    initialState: {
        users: [] as UserType[],
        originalUsers: [] as UserType[],
        usersStatus: 'loading',
        selectedUserId: null,
        selectedUser: null,
        selectedUserStatus: 'loading',
        userPosts: [] as PostType[],
    },
    reducers: {
        selectUserId: (state, action) => {
            state.selectedUserId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUsers.pending, (state) => {
                state.usersStatus = 'loading';
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.users = action.payload;
                state.originalUsers = action.payload;
                state.usersStatus = 'succeeded';
            })
            .addCase(getUsers.rejected, (state) => {
                state.selectedUserStatus = 'error';
            })
            .addCase(getUserById.pending, (state) => {
                state.usersStatus = 'loading';
            })
            .addCase(getUserById.fulfilled, (state, action) => {
                state.selectedUser = action.payload;
                state.selectedUserStatus = 'succeeded';
            })
            .addCase(getUserById.rejected, (state) => {
                state.selectedUserStatus = 'error';
            });
    },
});

export const {selectUserId} = userSlice.actions;
export default userSlice.reducer;
