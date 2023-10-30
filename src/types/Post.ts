import {UserType} from './User';

export type UserSliceType = {
users: UserType[] | [];
originalUsers: UserType[] | [];
usersStatus: 'loading' | 'error' | 'succeeded';
selectedUser: UserType | null;
selectedUserId: number | null;
selectedUserStatus: 'loading' | 'error' | 'succeeded';
};

export type CommentType = {
id: number;
text: string;
userId: number;
postId: number;
user: UserType;
createTime: string;
};

export type TagType = {
title: string;
id: number;
};

export type idDataType = {
postId: number;
commentId: number;
};

export type PostType = {
id: number;
title: string;
text: string;
creatorId: number;
likesCount: number;
pinnedPostId: number;
isLiked: boolean;
tags: TagType[];
imageId: number;
createTime: Date;
creator?: UserType;
comments: CommentType[];
};

export type PostRequest = {
title: string;
text: string;
tags: string[];
selectedPostId?: number;
image?: File;
};

interface PostsSliceState {
userPosts: PostType[] | [];
postsFeed: PostType[] | [];
isLoadingPosts: boolean;
selectedPostId: number | null;
selectedPost: PostType | null;
pinnedPostId: number | null;
comments: CommentType[] | [];
commentsLoading: boolean;
postStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
error: any;
}

export type newCommentType = {
text: string;
id: number;
postId: number;
};

export type TagDataType = {
title: string;
}

export type ImageDataType = {
imageFile: FormData;
selectedPostId: number;
};
