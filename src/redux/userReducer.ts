import {
    createAsyncThunk,
    createSlice,
} from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import axios from '../axios';
import {AUTH_LOGIN, AUTH_REGISTER} from '../constants/auth';
import {
    EDIT_USER_DATA,
    GET_USER,
    SUBSCRIBE_USER_ID,
    UPLOAD_AVATAR_USER,
} from '../constants/user';
import {LoginRequest, RegisterRequest} from '../types/Auth';
import {EditUserDataType, UserType} from '../types/User';

export const registerUser = createAsyncThunk('user/registerUser', async (data: RegisterRequest, {rejectWithValue}) => {
    try {
        const response = await axios.post(AUTH_REGISTER, data);
        return true;
    } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        }
        return rejectWithValue(error);
    }
});

export const loginUser = createAsyncThunk(
    'user/loginUser',
    async (data: LoginRequest, {rejectWithValue}) => {
        try {
            const tokensResponse = await axios.post(AUTH_LOGIN, data);
            Cookies.set('accessToken', tokensResponse.data.accessToken, {
                secure: true,
            });
            Cookies.set('refreshToken', tokensResponse.data.refreshToken, {
                secure: true,
            });
            const userResponse = await axios.get(GET_USER);
            return userResponse.data as UserType;
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue(error.message);
        }
    },
);

export const logoutUser = createAsyncThunk(
    'user/logoutUser',
    async (_, {dispatch}) => {
        try {
            await Cookies.remove('refreshToken');
            await Cookies.remove('accessToken');
            return true;
        } catch (error) {
            return error;
        }
    },
);

export const getUser = createAsyncThunk(
    'user/getUser',
    async (_, {rejectWithValue}) => {
        try {
            const response = await axios.get(GET_USER);
            return response.data as UserType;
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue(error.message);
        }
    },
);

export const uploadAvatar = createAsyncThunk(
    'user/uploadAvatar',
    async (data: FormData, {rejectWithValue}) => {
        try {
            const response = await axios.post(UPLOAD_AVATAR_USER, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // console.log('upload photo succeed');
            return true;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

export const editUser = createAsyncThunk(
    'user/editUser',
    async (newData: EditUserDataType, {rejectWithValue}) => {
        try {
            const response = await axios.patch(EDIT_USER_DATA, newData);
            return response.data as UserType;
        } catch (error) {
            // console.log(error);
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue(error.message);
        }
    },
);

export const deleteUser = createAsyncThunk(
    'user/deleteUser',
    async (_, {rejectWithValue}) => {
        try {
            await axios.delete(EDIT_USER_DATA);
            // console.log('success deleted');
            return true;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

export const subscribeUser = createAsyncThunk(
    'user/subscribeUser',
    async (id: number, {rejectWithValue}) => {
        const subscribeUrl = SUBSCRIBE_USER_ID.replace('{id}', id.toString());

        try {
            const response = await axios.post(subscribeUrl, id);
            return response.data as UserType;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

export const unsubscribeUser = createAsyncThunk(
    'user/unsubscribeUser',
    async (id: number, {rejectWithValue, dispatch}) => {
        const subscribeUrl = SUBSCRIBE_USER_ID.replace('{id}', id.toString());
        try {
            const response = await axios.delete(subscribeUrl, {
                data: {id},
            });
            return response.data as UserType;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null as null | UserType,
        subscriptions: null as null | UserType[],
        isLoadingUser: false,
        isRegistration: false,
        isUpdated: false,
        userError: null,
        editError: null,
    },
    reducers: {
        resetError: (state) => {
            state.userError = null;
        },
        resetUpdate: (state) => {
            state.isUpdated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoadingUser = true;
                state.userError = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.isLoadingUser = false;
                state.userError = null;
                state.isRegistration = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoadingUser = false;
                state.userError = action.payload;
            })
            .addCase(loginUser.pending, (state) => {
                state.isLoadingUser = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLoadingUser = false;
                state.userError = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoadingUser = false;
                state.userError = action.payload;
            })
            .addCase(logoutUser.pending, (state) => {
                state.isLoadingUser = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isLoadingUser = false;
                state.userError = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.isLoadingUser = false;
                state.userError = action.payload;
            })
            .addCase(getUser.pending, (state) => {
                state.isLoadingUser = true;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.subscriptions = action.payload.subscriptions;
                state.isLoadingUser = false;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.isLoadingUser = false;
                state.userError = action.payload;
            })
            .addCase(uploadAvatar.pending, (state) => {
                state.isLoadingUser = true;
                state.editError = null;
            })
            .addCase(uploadAvatar.fulfilled, (state, action) => {
                state.isUpdated = true;
                state.isLoadingUser = false;
                state.userError = null;
            })
            .addCase(uploadAvatar.rejected, (state, action) => {
                state.isLoadingUser = false;
                state.editError = action.payload;
            })
            .addCase(editUser.pending, (state) => {
                state.isLoadingUser = true;
                state.editError = null;
            })
            .addCase(editUser.fulfilled, (state, action) => {
                state.isLoadingUser = false;
                state.isUpdated = true;
                state.editError = null;
                state.user = action.payload;
            })
            .addCase(editUser.rejected, (state, action) => {
                state.isLoadingUser = false;
                state.editError = action.payload;
            })
            .addCase(deleteUser.pending, (state) => {
                state.isLoadingUser = true;
            })
            .addCase(deleteUser.fulfilled, (state) => {
                state.isLoadingUser = false;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.isLoadingUser = false;
                state.userError = action.payload;
            })
            .addCase(subscribeUser.pending, (state) => {
                state.isLoadingUser = true;
            })
            .addCase(subscribeUser.fulfilled, (state, action) => {
                state.isLoadingUser = false;
                state.user = action.payload;
                state.subscriptions = action.payload.subscriptions;
            })
            .addCase(subscribeUser.rejected, (state, action) => {
                state.isLoadingUser = false;
                state.userError = action.payload;
            })
            .addCase(unsubscribeUser.pending, (state) => {
                state.isLoadingUser = true;
            })
            .addCase(unsubscribeUser.fulfilled, (state, action) => {
                state.isLoadingUser = false;
                state.user = action.payload;
                state.subscriptions = action.payload.subscriptions;
            })
            .addCase(unsubscribeUser.rejected, (state, action) => {
                state.isLoadingUser = false;
                state.userError = action.payload;
            });
    },
});

export const {resetError, resetUpdate} = userSlice.actions;
export default userSlice.reducer;
