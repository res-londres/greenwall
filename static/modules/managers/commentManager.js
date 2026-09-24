import * as bus from '../eventBus.js';
import { getCurrentPostID } from './postManager.js';

const commentsByPost = {};    // {post_id: {comment_id: {comment}, comment_id: {another_comment}}, post_id: {comments}}`

export function getPostCommentsList() {
    return Object.values(getPostComments());
}

export function getPostCommentsCount(postID) {
    return Object.values(getPostComments(postID)).length;
}

export function addPostComment(comment) {
    const commentID = comment.comment_id;
    getPostComments()[commentID] = comment;
    bus.emit('postManager:addPostComment');
}

// COMMENT LIKES //
export function setCommentLikes(commentID, newLikes) {
    commentsByPost[getCurrentPostID()][commentID].likes = newLikes;
}

export function getCommentLikes(commentID) {
    return commentsByPost[getCurrentPostID()][commentID].likes;
}

export function incrementCommentLikes(commentID) {
    commentsByPost[getCurrentPostID()][commentID].likes += 1;
}

export function decrementCommentLikes(commentID) {
    commentsByPost[getCurrentPostID()][commentID].likes -= 1;
}

// HELPERS //
function getPostComments(postID = null) {
    const currentPostID = postID == null ? getCurrentPostID() : postID;
    if (!(currentPostID in commentsByPost)) {
        commentsByPost[currentPostID] = {};
    }
    return commentsByPost[currentPostID];
}