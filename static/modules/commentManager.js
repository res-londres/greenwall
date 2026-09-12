import * as bus from './eventBus.js';
import { getCurrentPostID } from './postManager.js';

const postComments = {};    // {post_id: {comment_id: {comment}, comment_id: {another_comment}}, post_id: {comments}}

export function getCommentsList() {
    return Object.values(getPostComments());
}

export function addComment(comment) {
    const commentID = comment.comment_id;
    getPostComments()[commentID] = comment;
    bus.emit('postManager:addComment');
}

// HELPERS //
function getPostComments() {
    const currentPostID = getCurrentPostID();
    if (!(currentPostID in postComments)) {
        postComments[currentPostID] = {};
    }
    return postComments[currentPostID];
}