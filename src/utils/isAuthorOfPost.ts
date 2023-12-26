export default function isAuthorOfPost(postCreatorId, userId) {
    if (postCreatorId === userId) {
        return true;
    }
    return false;
}
