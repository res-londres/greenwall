import * as bus from '../eventBus.js';
import { getCurrentAccountID } from './profileManager.js';

const globalPosts = {};     // {post_id: {post}, post_id: {another_post}}
const postsByUsers = {};     // {user_id: {post_id: {post}}, user_id: {..}}
let postModalActive = false;
let currentPostID = null;

// TODO: rename everything -ByUsers, it should be -ByAccounts
// TODO: in extension, rename everything that uses userID because most likely they mean accountID

// SETTER //
export function setCurrentPostID(newPostID) {
    currentPostID = newPostID;
}

// GETTER //
export function getGlobalPostsList() {
    return Object.values(globalPosts);
}

export function getPostsByUserList(userID) {
    if (!(userID in postsByUsers)) {
        postsByUsers[userID] = {};
    }
    return Object.values(postsByUsers[userID]);
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

// POST MODAL ACTIVE //
export function setPostModalActive(isActive) {
    postModalActive = isActive;
}

export function isPostModalActive() {
    return postModalActive;
}

// ETC //
export function addPost(post, userID = null) {
    const postID = post.post_id;
    userID = userID === null ? getCurrentAccountID() : userID;
    globalPosts[postID] = post;
    if (!(userID in postsByUsers)) {
        postsByUsers[userID] = {};
    }
    postsByUsers[userID][postID] = post;
    bus.emit('postManager:addPost');
}

// deprecated //
export function getGlobalPosts() {
    return structuredClone(globalPosts);
}