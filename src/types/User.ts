import {PostType} from './Post';

export type UserType = {
id: number,
firstName: string,
lastName: string,
email: string,
description?: string,
avatarId: number | null,
role?: string,
nickname: string,
isBanned?: boolean,
createTime: Date,
updateTime: Date,
subscriptions: UserType[],
posts: PostType[],
pinnedPostId: number,
};

export type EditUserDataType = {
firstName?: string,
lastName?: string,
email?: string,
description?: string,
};
