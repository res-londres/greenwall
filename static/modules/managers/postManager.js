import * as bus from '../eventBus.js';
import { getCurrentProfileID } from './profileManager.js';

const globalPosts = {};     // {post_id: {post}, post_id: {another_post}}
const postsByProfile = {};     // {profile_id: {post_id: {post}}, profile_id: {..}}
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

// unused?
export function getPostsByProfileList(profileID) {
    if (!(profileID in postsByProfile)) {
        postsByProfile[profileID] = {};
    }
    return Object.values(postsByProfile[profileID]);
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
export function addPost(post, profileID = null) {
    const postID = post.post_id;
    profileID = profileID === null ? getCurrentProfileID() : profileID;
    globalPosts[postID] = post;
    if (!(profileID in postsByProfile)) {
        postsByProfile[profileID] = {};
    }
    postsByProfile[profileID][postID] = post;
    bus.emit('postManager:addPost');
}

// deprecated //
export function getGlobalPosts() {
    return structuredClone(globalPosts);
}