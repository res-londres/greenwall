import { getCurrentPostID } from './postManager.js';
import { getCurrentProfileID } from './profileManager.js';

const likedPostByProfile = {}          // {profile_id: {post_id: true, post_id: true}}
const likedPostByCommentByProfile = {} // {profile_id: {post_id: {comment_id: true, comment_id: true}}}

// POST LIKES //
export function isPostLiked(postID) {
    const currentProfileID = getCurrentProfileID();
    return currentProfileID in likedPostByProfile && postID in likedPostByProfile[currentProfileID];
}

export function addLikedPost(postID) {
    const currentProfileID = getCurrentProfileID();
    if (!(currentProfileID in likedPostByProfile)) {
        likedPostByProfile[currentProfileID] = {};
    }
    likedPostByProfile[currentProfileID][postID] = true;
}

export function removeLikedPost(postID) {
    const currentProfileID = getCurrentProfileID();
    if (!(currentProfileID in likedPostByProfile)) {
        return;
    }
    delete likedPostByProfile[currentProfileID][postID];
}

// COMMENT LIKES //
export function isCommentLiked(commentID) {
    const currentProfileID = getCurrentProfileID();
    const currentPostID = getCurrentPostID();
    return currentProfileID in likedPostByCommentByProfile && currentPostID in likedPostByCommentByProfile[currentProfileID] && commentID in likedPostByCommentByProfile[currentProfileID][currentPostID];
}

export function addCommentLike(commentID) {
    const currentProfileID = getCurrentProfileID();
    const currentPostID = getCurrentPostID();
    if (!(currentProfileID in likedPostByCommentByProfile)) {
        likedPostByCommentByProfile[currentProfileID] = {};
    }
    if (!(currentPostID in likedPostByCommentByProfile[currentProfileID])) {
        likedPostByCommentByProfile[currentProfileID][currentPostID] = {};
    }
    likedPostByCommentByProfile[currentProfileID][currentPostID][commentID] = true;
}

export function removeCommentLike(commentID) {
    const currentProfileID = getCurrentProfileID();
    const currentPostID = getCurrentPostID();
    if (!(currentProfileID in likedPostByCommentByProfile)) {
        return;
    }
    if (!(currentPostID in likedPostByCommentByProfile[currentProfileID])) {
        return;
    }
    delete likedPostByCommentByProfile[currentProfileID][currentPostID][commentID];
}