import * as bus from './eventBus.js';

const globalPosts = {};      // {post_id: {post}, post_id: {another_post}}
let currentPostID = null;

export function setCurrentPostID(newPostID) {
    currentPostID = newPostID;
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

export function addPost(post) {
    const postID = post.post_id;
    globalPosts[postID] = post;
    bus.emit('postManager:addPost');
}