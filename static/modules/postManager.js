import * as bus from './eventBus.js';

const globalPosts = {};     // {post_id: {post}, post_id: {another_post}}
const postComments = {};    // {post_id: {comment_id: {comment}, comment_id: {another_comment}}, post_id: {comments}}
let currentPostID = null;

export function setCurrentPostID(newPostID) {
    currentPostID = newPostID;
}

export function getCurrentPostId() {
    return currentPostID;
}

// deprecated
export function getGlobalPosts() {
    return structuredClone(globalPosts);
}

export function getGlobalPostsList() {
    return Object.values(globalPosts);
}

export function getCurrentPost() {
    return structuredClone(globalPosts[currentPostID]);
}

export function getCommentsList() {
    if (!(currentPostID in postComments)) {
        postComments[currentPostID] = {};
    }
    return Object.values(postComments[currentPostID]);
}

export function addPost(post) {
    const postID = post.post_id;
    globalPosts[postID] = post;
    bus.emit('postManager:addPost');
}

export function addComment(comment) {
    const commentID = comment.comment_id;
    if (!(currentPostID in postComments)) {
        postComments[currentPostID] = {};
    }
    postComments[currentPostID][commentID] = comment;
    bus.emit('postManager:addComment');
}