import { getCurrentPostID } from './postManager.js';
import { getCurrentAccountID } from './profileManager.js';

const likedPostsByAccount = {}     // {account_id: {post_id: true, post_id: true}}
const likedCommentsByPost = {}     // {post_id: {comment_id: true, comment_id: true}, post_id: {..}}

// POST LIKES //
export function isPostLiked(postID) {
    const accountID = getCurrentAccountID();
    return accountID in likedPostsByAccount && postID in likedPostsByAccount[accountID];
}

export function addLikedPost(postID) {
    const accountID = getCurrentAccountID();
    if (!(accountID in likedPostsByAccount)) {
        likedPostsByAccount[accountID] = {};
    }
    likedPostsByAccount[accountID][postID] = true;
}

export function removeLikedPost(postID) {
    const accountID = getCurrentAccountID();
    if (!(accountID in likedPostsByAccount)) {
        return;
    }
    delete likedPostsByAccount[accountID][postID];
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