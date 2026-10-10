import * as bus from '../eventBus.js';
import * as events from '../events.js';
import { getCurrentProfileID } from './userManager.js';

const comments = {
    user: {},     // { profile_id: { post_id: { comment_id: comment } } }
    other: {}     // { post_id: { comment_id: comment } }
};

const commentsPagination = {
    // { post_id: { oldestMineID, oldestOtherID, hasMoreMine, hasMoreOther, isInitialFetching } }
};

// ---------- INITIALIZATION ---------- //

export function initPagination(postID) {
    if (!(postID in commentsPagination)) {
        commentsPagination[postID] = {
            oldestMineID: null,
            oldestOtherID: null,
            hasMoreMine: true,
            hasMoreOther: true,
            isInitialFetching: false
        };
    }
}

export function getCommentsPagination(postID) {
    return { ...(commentsPagination[postID] || {
        oldestMineID: null,
        oldestOtherID: null,
        hasMoreMine: true,
        hasMoreOther: true,
        isInitialFetching: false
    }) };
}

export function setInitialFetching(postID, isFetching) {
    initPagination(postID);
    commentsPagination[postID].isInitialFetching = isFetching;
}

// ---------- READS ---------- //

export function hasCachedComments(postID) {
    if (!(postID in commentsPagination)) return false;
    return commentsPagination[postID].oldestMineID !== null
        || commentsPagination[postID].oldestOtherID !== null;
}

export function getCommentsList(postID) {
    const currentProfileID = getCurrentProfileID();
    const mine = comments.user[currentProfileID]?.[postID] || {};
    const others = comments.other[postID] || {};

    const mineList = Object.values(mine).sort(function(a, b) {
        return b.comment_id - a.comment_id;
    });
    const othersList = Object.values(others).sort(function(a, b) {
        return b.comment_id - a.comment_id;
    });

    return mineList.concat(othersList);
}

export function getCommentsCount(postID) {
    const currentProfileID = getCurrentProfileID();
    const mine = comments.user[currentProfileID]?.[postID] || {};
    const others = comments.other[postID] || {};
    return Object.keys(mine).length + Object.keys(others).length;
}

export function getPostCommentsCount(postID) {
    return getCommentsCount(postID);
}

// ---------- WRITES ---------- //

export function addInitialComments(postID, newComments, meta) {
    initPagination(postID);

    const currentProfileID = getCurrentProfileID();

    newComments.forEach(function(comment) {
        if (comment.profile_id === currentProfileID) {
            if (!(currentProfileID in comments.user)) {
                comments.user[currentProfileID] = {};
            }
            if (!(postID in comments.user[currentProfileID])) {
                comments.user[currentProfileID][postID] = {};
            }
            comments.user[currentProfileID][postID][comment.comment_id] = comment;
        } else {
            if (!(postID in comments.other)) {
                comments.other[postID] = {};
            }
            comments.other[postID][comment.comment_id] = comment;
        }
    });

    updateCursors(postID, newComments, currentProfileID);

    const p = commentsPagination[postID];
    p.hasMoreMine = meta.hasMoreMine;
    p.hasMoreOther = meta.hasMoreOther;
    p.isInitialFetching = false;

    bus.emit(events.COMMENTS_LOADED, { postID });
}

export function addPaginatedComments(postID, newComments, meta) {
    initPagination(postID);

    const currentProfileID = getCurrentProfileID();

    newComments.forEach(function(comment) {
        if (comment.profile_id === currentProfileID) {
            if (!(currentProfileID in comments.user)) {
                comments.user[currentProfileID] = {};
            }
            if (!(postID in comments.user[currentProfileID])) {
                comments.user[currentProfileID][postID] = {};
            }
            comments.user[currentProfileID][postID][comment.comment_id] = comment;
        } else {
            if (!(postID in comments.other)) {
                comments.other[postID] = {};
            }
            comments.other[postID][comment.comment_id] = comment;
        }
    });

    updateCursors(postID, newComments, currentProfileID);

    const p = commentsPagination[postID];
    p.hasMoreMine = meta.hasMoreMine;
    p.hasMoreOther = meta.hasMoreOther;

    bus.emit(events.COMMENTS_APPENDED, { postID, comments: newComments });
}

export function addComment(comment, postID) {
    initPagination(postID);

    const currentProfileID = getCurrentProfileID();

    if (!(currentProfileID in comments.user)) {
        comments.user[currentProfileID] = {};
    }
    if (!(postID in comments.user[currentProfileID])) {
        comments.user[currentProfileID][postID] = {};
    }
    comments.user[currentProfileID][postID][comment.comment_id] = comment;

    // No cursor update: the new comment is the user's own and goes to the top.

    bus.emit(events.COMMENT_CREATED);
}

export function clear() {
    Object.keys(comments.user).forEach(function(key) {
        delete comments.user[key];
    });
    Object.keys(comments.other).forEach(function(key) {
        delete comments.other[key];
    });
    Object.keys(commentsPagination).forEach(function(key) {
        delete commentsPagination[key];
    });
}

// ---------- HELPERS ---------- //

function updateCursors(postID, newComments, currentProfileID) {
    const p = commentsPagination[postID];

    newComments.forEach(function(comment) {
        if (comment.profile_id === currentProfileID) {
            if (p.oldestMineID === null || comment.comment_id < p.oldestMineID) {
                p.oldestMineID = comment.comment_id;
            }
        } else {
            if (p.oldestOtherID === null || comment.comment_id < p.oldestOtherID) {
                p.oldestOtherID = comment.comment_id;
            }
        }
    });
}