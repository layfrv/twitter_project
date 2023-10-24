export default function isAuthorOfPost(postId, profileId) {
    if (postId === profileId) {
        return true;
    }
    return false;
}
