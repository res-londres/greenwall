import * as bus from '../eventBus.js';
import { getCurrentAccountID } from './profileManager.js';

const globalPosts = {};     // {post_id: {post}, post_id: {another_post}}
const postsByAccounts = {};     // {account_id: {post_id: {post}}, account_id: {..}}
let postModalActive = false;
let currentPostID = null;

// SETTER //
export function setCurrentPostID(newPostID) {
    currentPostID = newPostID;
}

// GETTER //
export function getGlobalPostsList() {
    return Object.values(globalPosts);
}

export function getPostsByAccountList(accountID) {
    if (!(accountID in postsByAccounts)) {
        postsByAccounts[accountID] = {};
    }
    return Object.values(postsByAccounts[accountID]);
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
export function addPost(post, accountID = null) {
    const postID = post.post_id;
    accountID = accountID === null ? getCurrentAccountID() : accountID;
    globalPosts[postID] = post;
    if (!(accountID in postsByAccounts)) {
        postsByAccounts[accountID] = {};
    }
    postsByAccounts[accountID][postID] = post;
    bus.emit('postManager:addPost');
}

// deprecated //
export function getGlobalPosts() {
    return structuredClone(globalPosts);
}