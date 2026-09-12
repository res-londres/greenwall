const likedPostsByUser = {'user_id': {}}    // {user_id: {post_id: true, post_id: true}, user_id: {..}}
// mock data

export function isLikedByUser(userID, postID) {
    return ((userID in likedPostsByUser) && (postID in likedPostsByUser[userID]));
}

export function addlikedPostByUser(userID, postID) {
    if (!(userID in likedPostsByUser)) {
        likedPostsByUser[userID] = {}
    }
    likedPostsByUser[userID][postID] = true;
}

export function removeLikedPostByUser(userID, postID) {
    if (!(userID in likedPostsByUser)) return;
    if (!(postID in likedPostsByUser[userID])) return;
    delete likedPostsByUser[userID][postID];
}