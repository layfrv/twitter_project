import noneAvatar from '../ui/images/none-avatar.png';

const useCreateAvatarUrl = (avatarId) => {
    const avatarUrl = avatarId
        ? `https://practice-backend.kozhin.dev/api/file/${avatarId}`
        : noneAvatar;

    return avatarUrl;
};

export default useCreateAvatarUrl;
