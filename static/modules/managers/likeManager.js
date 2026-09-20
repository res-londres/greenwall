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
    const currentAccountID = getCurrentAccountID();
    const currentPostID = getCurrentPostID();
    return currentAccountID in likedCommentsByPostByAccount && currentPostID in likedCommentsByPostByAccount[currentAccountID] && commentID in likedCommentsByPostByAccount[currentAccountID][currentPostID];
}

export function addCommentLike(commentID) {
    const currentAccountID = getCurrentAccountID();
    const currentPostID = getCurrentPostID();
    if (!(currentAccountID in likedCommentsByPostByAccount)) {
        likedCommentsByPostByAccount[currentAccountID] = {};
    }
    if (!(currentPostID in likedCommentsByPostByAccount[currentAccountID])) {
        likedCommentsByPostByAccount[currentAccountID][currentPostID] = {};
    }
    likedCommentsByPostByAccount[currentAccountID][currentPostID][commentID] = true;
}

export function removeCommentLike(commentID) {
    const currentAccountID = getCurrentAccountID();
    const currentPostID = getCurrentPostID();
    if (!(currentAccountID in likedCommentsByPostByAccount)) {
        return;
    }
    if (!(currentPostID in likedCommentsByPostByAccount[currentAccountID])) {
        return;
    }
    delete likedCommentsByPostByAccount[currentAccountID][currentPostID][commentID];
}