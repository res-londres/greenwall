import { getCurrentPostID } from './postManager.js';
import { getCurrentAccountID } from './profileManager.js';

const likedPostsByAccount = {}          // {account_id: {post_id: true, post_id: true}}
const likedCommentsByPostByAccount = {} // {account_id: {post_id: {comment_id: true, comment_id: true}}}

// POST LIKES //
export function isPostLiked(postID) {
    const currentAccountID = getCurrentAccountID();
    return currentAccountID in likedPostsByAccount && postID in likedPostsByAccount[currentAccountID];
}

export function addLikedPost(postID) {
    const currentAccountID = getCurrentAccountID();
    if (!(currentAccountID in likedPostsByAccount)) {
        likedPostsByAccount[currentAccountID] = {};
    }
    likedPostsByAccount[currentAccountID][postID] = true;
}

export function removeLikedPost(postID) {
    const currentAccountID = getCurrentAccountID();
    if (!(currentAccountID in likedPostsByAccount)) {
        return;
    }
    delete likedPostsByAccount[currentAccountID][postID];
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