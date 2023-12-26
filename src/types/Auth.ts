export type RegisterRequest = {
firstName: string,
lastName: string,
email: string,
password: string,
description: string,
avatar?: Blob | null,
};

export type LoginRequest = {
email: string,
password: string,
};

export type LoginResponse = {
accessToken: string,
refreshToken: string,
};
