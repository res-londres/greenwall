import * as bus from '../eventBus.js';

const globalPosts = {};     // {post_id: {post}, post_id: {another_post}}
let currentPostID = null;

// SETTER //
export function setCurrentPostID(newPostID) {
    currentPostID = newPostID;
}

// GETTER //
export function getGlobalPostsList() {
    return Object.values(globalPosts);
}

export function getCurrentPostID() {
    return currentPostID;
}

export function getCurrentPost() {
    return structuredClone(globalPosts[currentPostID]);
}

export function getPostByID(postID) {
    return structuredClone(globalPosts[postID]);
}

// POST LIKES //
export function setPostLikes(postID, newLikes) {
    globalPosts[postID].likes = newLikes;
}

export function getPostLikes(postID) {
    return globalPosts[postID].likes;
}

export function incrementPostLikes(postID) {
    globalPosts[postID].likes += 1;
}

export function decrementPostLikes(postID) {
    globalPosts[postID].likes -= 1;
}


// ETC //
export function addPost(post) {
    const postID = post.post_id;
    globalPosts[postID] = post;
    bus.emit('postManager:addPost');
}

// deprecated //
export function getGlobalPosts() {
    return structuredClone(globalPosts);
}