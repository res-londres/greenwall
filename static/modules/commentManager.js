import * as bus from './eventBus.js';
import { getCurrentPostID } from './postManager.js';

const commentsByPost = {};    // {post_id: {comment_id: {comment}, comment_id: {another_comment}}, post_id: {comments}}

export function getPostCommentsList() {
    return Object.values(getPostComments());
}

export function addPostComment(comment) {
    const commentID = comment.comment_id;
    getPostComments()[commentID] = comment;
    bus.emit('postManager:addPostComment');
}

// HELPERS //
function getPostComments() {
    const currentPostID = getCurrentPostID();
    if (!(currentPostID in commentsByPost)) {
        commentsByPost[currentPostID] = {};
    }
    return commentsByPost[currentPostID];
}