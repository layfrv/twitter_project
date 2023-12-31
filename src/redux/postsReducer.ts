import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {AxiosResponse} from 'axios';
import axios from '../axios';
import {
    GET_FEED_POSTS,
    GET_POSTS,
    GET_POST_BY_ID,
    PIN_POST_ID,
    POST_IMAGE_ID,
    SEARCH_BY_TAG,
    UNPIN_POST,
    UPLOAD_POST,
} from '../constants/post';
import {
    CommentType,
    ImageDataType,
    PostRequest,
    PostType,
    TagDataType,
    idDataType,
    newCommentType,
} from '../types/Post';
import {RootState} from './store';

export const createPost = createAsyncThunk(
    'createPost',
    async (data: PostRequest, {rejectWithValue}) => {
        const textData = {title: data.title,
            text: data.text,
            tags: data.tags};

        try {
            const responsePost: AxiosResponse<PostType> = await axios.post(
                UPLOAD_POST,
                textData,
            );

            if (data.image !== null) {
                const imageFile = new FormData();
                imageFile.append('file', data.image);

                const response = await axios.post(
                    POST_IMAGE_ID + responsePost.data.id,
                    imageFile,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    },
                );
                return response.data as PostType;
            }
            return responsePost.data as PostType;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

export const uploadImagePost = createAsyncThunk(
    'post/uploadImage',
    async (data: ImageDataType, {rejectWithValue}) => {
        try {
            const imageFile = data.imageFile;
            const response = await axios.post(
                POST_IMAGE_ID + data.selectedPostId,
                imageFile,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue(error.message);
        }
    },
);

export const getUserPosts = createAsyncThunk(
    'posts/getUserPosts',
    async (userId: number, {dispatch, rejectWithValue}) => {
        try {
            const response = await axios.get(`${GET_POSTS}/?userId=${userId}`);
            return response.data;
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue(error.message);
        }
    },
);

export const getPostById = createAsyncThunk(
    'posts/getPostById',
    async (postId: number, {rejectWithValue}) => {
        try {
            const response = await axios.get(`${GET_POST_BY_ID}/${postId}`);
            return response.data;
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue(error.message);
        }
    },
);

export const getUserPostsFeed = createAsyncThunk(
    'posts/getUserPostsFeed',
    async (_, {rejectWithValue}) => {
        try {
            const response = await axios.get(GET_FEED_POSTS);
            return response.data as PostType[];
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue(error.message);
        }
    },
);

export const getAllPostsFeed = createAsyncThunk(
    'posts/getAllPostsFeed',
    async (_, {rejectWithValue}) => {
        try {
            const response = await axios.get(GET_POSTS);
            return response.data as PostType[];
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue(error.message);
        }
    },
);

export const editPost = createAsyncThunk(
    'posts/editUserPost',
    async (data: PostType, {rejectWithValue, getState}) => {
        const state = getState() as RootState;
        const selectedPostId = state.posts.selectedPostId;
        try {
            const response = await axios.patch(
                `${GET_POST_BY_ID}/${selectedPostId}`,
                data,
            );
            return response.data as PostType;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue(error);
        }
    },
);

export const deletePost = createAsyncThunk(
    'posts/deletePost',
    async (_, {getState, rejectWithValue}) => {
        const state = getState() as RootState;
        const posts = state.posts.userPosts;
        const selectedPostId = state.posts.selectedPostId;

        try {
            const response = await axios.delete(
                `${GET_POST_BY_ID}/${selectedPostId}`,
                {data: {id: selectedPostId}},
            );
            //console.log('success deleted');
            const newPosts = posts.filter((post) => post.id !== selectedPostId);
            return newPosts as PostType[];
        } catch (error) {
            //console.log(error);
            return rejectWithValue(error);
        }
    },
);

export const likedPost = createAsyncThunk(
    'posts/likedPost',
    async (postId: number) => {
        try {
            const response = await axios.post(`/api/post/${postId}/likes`);
            return true;
        } catch (error) {
            //console.log(error);
            return false;
        }
    },
);

export const pinPost = createAsyncThunk(
    'posts/pinPost',
    async (postId: number, {rejectWithValue}) => {
        try {
            const response = await axios.patch(`${PIN_POST_ID}${postId}`, postId);
            return response.data as PostType;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const pinPostFeed = createAsyncThunk(
    'posts/pinPostFeed',
    async (postId: number, {rejectWithValue}) => {
        try {
            const response = await axios.patch(`${PIN_POST_ID}${postId}`, postId);
            return response.data as PostType;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const unpinPost = createAsyncThunk(
    'posts/unpinPost',
    async (postId: number, {rejectWithValue}) => {
        try {
            const response = await axios.patch(`${UNPIN_POST}`);
            return response.data as PostType;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const addComment = createAsyncThunk(
    'posts/addComment',
    async (data: newCommentType, {dispatch, rejectWithValue}) => {
        const text = data.text;
        try {
            const response = await axios.post(`/api/post/${data.id}/comments`, {
                text,
            });
            dispatch(getPostById(data.postId));
            return response.data as CommentType;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const deleteComment = createAsyncThunk(
    'posts/deleteComment',
    async (data: idDataType, {rejectWithValue}) => {
        try {
            const commentIdData = data.commentId;
            const response = await axios.delete(
                `api/post/${data.postId}/comments/${data.commentId}`,
                {data: {id: commentIdData}},
            );
            return response.data as CommentType;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const getTags = createAsyncThunk(
    'posts/getTags',
    async () => {
        try {
            const response = await axios.get(SEARCH_BY_TAG);
            return response.data as TagDataType[];
        } catch (error) {
            return error;
        }
    },
);

const postsSlice = createSlice({
    name: 'posts',
    initialState: {
        userPosts: [],
        postsUserFeed: [],
        postsAllFeed: [],
        postsFeedByTag: [],
        tags: [],
        isLoadingPosts: true,
        selectedPostId: null,
        selectedPost: null as PostType,
        postStatus: 'idle',
        pinnedPostId: null,
        comments: [] as CommentType[],
        isLoadingComments: false,
        error: null,
    },
    reducers: {
        selectPost: (state, action) => {
            state.selectedPostId = action.payload;
        },
        setPinnedPostId: (state, action) => {
            state.pinnedPostId = action.payload;
        },
        sortPostByPinPost: (state) => {
            if (state.pinnedPostId !== null) {
                if (state.postsUserFeed.length !== 0) {
                    const pinnedPost = state.postsUserFeed.find(
                        (post) => post.id === state.pinnedPostId,
                    );
                    if (pinnedPost) {
                        const newPostsFeed = state.postsUserFeed.filter(
                            (post) => post.id !== pinnedPost.id,
                        );
                        newPostsFeed.unshift(pinnedPost);
                        state.postsUserFeed = newPostsFeed;
                    }
                }
                if (state.userPosts.length !== 0) {
                    const pinnedPost = state.userPosts.find(
                        (post) => post.id === state.pinnedPostId,
                    );
                    if (pinnedPost) {
                        const newPostsFeed = state.userPosts.filter(
                            (post) => post.id !== pinnedPost.id,
                        );

                        newPostsFeed.unshift(pinnedPost);
                        state.userPosts = newPostsFeed;
                    }
                }
            }
        },
        filterPostsByTag: (state, action) => {
            if (action.payload.typeNews === 'userNews') {
                const filtered = state.postsUserFeed.filter((post) => post.tags.some((tag) => tag.title === action.payload.title));
                state.postsFeedByTag = filtered;
            }
            if (action.payload.typeNews === 'allNews') {
                const filtered = state.postsAllFeed.filter((post) => post.tags.some((tag) => tag.title === action.payload.title));
                state.postsFeedByTag = filtered;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createPost.pending, (state) => {
                state.postStatus = 'loading';
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.userPosts.unshift(action.payload);
                state.postStatus = 'succeeded';
                state.error = null;
            })
            .addCase(createPost.rejected, (state, action) => {
                state.postStatus = 'failed';
                state.error = action.payload;
            })
            .addCase(deletePost.pending, (state, action) => {
                state.postStatus = 'loading';
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.postStatus = 'succeeded';
                state.userPosts = action.payload;
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.postStatus = 'failed';
                state.error = action.error;
            })
            .addCase(editPost.pending, (state, action) => {
                state.postStatus = 'loading';
            })
            .addCase(editPost.fulfilled, (state, action) => {
                state.postStatus = 'succeeded';
                state.userPosts = state.userPosts.filter(
                    (post) => post.id !== action.payload.id,
                );
                state.userPosts.unshift(action.payload);
            })
            .addCase(editPost.rejected, (state, action) => {
                state.postStatus = 'failed';
                state.error = action.error;
            })
            .addCase(uploadImagePost.pending, (state) => {
                state.postStatus = 'loading';
            })
            .addCase(uploadImagePost.fulfilled, (state) => {
                state.postStatus = 'succeeded';
            })
            .addCase(uploadImagePost.rejected, (state, action) => {
                state.postStatus = 'failed';
                state.error = action.error;
            })
            .addCase(getUserPosts.pending, (state) => {
                state.postStatus = 'loading';
                state.isLoadingPosts = true;
            })
            .addCase(getUserPosts.fulfilled, (state, action) => {
                state.postStatus = 'succeeded';
                state.userPosts = action.payload.reverse();
                state.error = null;
                state.isLoadingPosts = false;
            })
            .addCase(getUserPosts.rejected, (state, action) => {
                state.postStatus = 'failed';
                state.error = action.payload;
                state.isLoadingPosts = false;
            })
            .addCase(getPostById.pending, (state) => {
                state.postStatus = 'loading';
                state.isLoadingPosts = true;
            })
            .addCase(
                getPostById.fulfilled,
                (state, action: PayloadAction<PostType>) => {
                    state.postStatus = 'succeeded';
                    state.selectedPost = action.payload;
                    state.comments = action.payload.comments;
                    state.error = null;
                    state.isLoadingPosts = false;
                },
            )
            .addCase(getPostById.rejected, (state, action) => {
                state.postStatus = 'failed';
                state.error = action.payload;
                state.isLoadingPosts = false;
            })
            .addCase(getUserPostsFeed.pending, (state) => {
                state.isLoadingPosts = true;
            })
            .addCase(
                getUserPostsFeed.fulfilled,
                (state, action: PayloadAction<PostType[]>) => {
                    state.postsUserFeed = action.payload;
                    state.error = null;
                    state.isLoadingPosts = false;
                },
            )
            .addCase(getUserPostsFeed.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoadingPosts = false;
            })
            .addCase(getAllPostsFeed.pending, (state) => {
                state.isLoadingPosts = true;
            })
            .addCase(
                getAllPostsFeed.fulfilled,
                (state, action: PayloadAction<PostType[]>) => {
                    state.postsAllFeed = action.payload;
                    state.error = null;
                    state.isLoadingPosts = false;
                },
            )
            .addCase(getAllPostsFeed.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoadingPosts = false;
            })
            .addCase(addComment.pending, (state) => {
                state.isLoadingComments = true;
            })
            .addCase(addComment.fulfilled, (state, action) => {
                state.isLoadingComments = false;
                state.postStatus = 'succeeded';
                state.comments = [...state.comments, action.payload];
            })
            .addCase(addComment.rejected, (state, action) => {
                state.isLoadingComments = false;
                state.error = action.error;
            })
            .addCase(deleteComment.pending, (state) => {
                state.isLoadingComments = true;
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.comments = state.comments.filter(
                    (comment) => comment.createTime !== action.payload.createTime,
                );
                state.isLoadingComments = false;
            })
            .addCase(deleteComment.rejected, (state, action) => {
                state.error = action.error;
                state.isLoadingComments = false;
            })
            .addCase(pinPost.fulfilled, (state, action: PayloadAction<PostType>) => {
                state.pinnedPostId = action.payload.pinnedPostId;
            })
            .addCase(pinPostFeed.fulfilled, (state, action) => {
                state.pinnedPostId = action.payload.pinnedPostId;
                postsSlice.actions.sortPostByPinPost();
            })
            .addCase(unpinPost.fulfilled, (state) => {
                state.pinnedPostId = null;
            })
            .addCase(getTags.fulfilled, (state, action) => {
                state.tags = action.payload;
            });
    },
});

export const {
    selectPost,
    setPinnedPostId,
    sortPostByPinPost,
    filterPostsByTag,
} = postsSlice.actions;
export default postsSlice.reducer;
