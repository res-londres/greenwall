import { getCurrentPostID } from './postManager.js';

const likedPosts = {}     // {post_id: true, post_id: true}
const likedCommentsByPost = {}     // {post_id: {comment_id: true, comment_id: true}, post_id: {..}}

// POST LIKES //
export function isPostLiked(postID) {
    return postID in likedPosts;
}

export function addLikedPost(postID) {
    likedPosts[postID] = true;
}

export function removeLikedPost(postID) {
    delete likedPosts[postID];
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