import { getCurrentPostID } from './postManager.js';

// TODO: redo everything involving likedPostByUser, we should only keep track of this client's likes, not other users so it should only be one
const likedPostsByUser = {'user_id': {}}    // {user_id: {post_id: true, post_id: true}, user_id: {..}}
// mock data
const likedCommentsByPost = {}     // {post_id: {comment_id: true, comment_id: true}, post_id: {..}}

// BRUH: remove all -ByUser because it will always be this client (user)

// POST LIKES //
// TODO: isLikedByUser => isPostLiked
export function isLikedByUser(userID, postID) {
    return ((userID in likedPostsByUser) && (postID in likedPostsByUser[userID]));
}

export function addlikedPostByUser(userID, postID) {
    if (!(userID in likedPostsByUser)) {
        likedPostsByUser[userID] = {};
    }
    likedPostsByUser[userID][postID] = true;
}

export function removeLikedPostByUser(userID, postID) {
    if (!(userID in likedPostsByUser)) return;
    if (!(postID in likedPostsByUser[userID])) return;
    delete likedPostsByUser[userID][postID];
}

// COMMENT LIKES //
export function isCommentLiked(commentID) {
    const currentPostID = getCurrentPostID();
    return ((currentPostID in likedCommentsByPost) && (commentID in likedCommentsByPost[currentPostID]));
}

export function addCommentLike(commentID) {
    const currentPostID = getCurrentPostID();
    if (!(currentPostID in likedCommentsByPost)) {
        likedCommentsByPost[currentPostID] = {};
    }
    likedCommentsByPost[currentPostID][commentID] = true;
}

export function removeCommentLike(commentID) {
    const currentPostID = getCurrentPostID();
    if (!(currentPostID in likedCommentsByPost)) return;
    if (!(commentID in likedCommentsByPost[currentPostID])) return;
    delete likedCommentsByPost[currentPostID][commentID];
}