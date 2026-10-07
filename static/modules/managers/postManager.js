import * as bus from '../eventBus.js';
import * as events from '../events.js';

const globalPosts = {};     // {post_id: {post}, post_id: {another_post}}
const postsByProfile = {};     // {profile_id: {post_id: {post}}, profile_id: {..}}
let postModalActive = false;
let currentPostID = null;
let isPostLoaded = false;

// SETTER //
export function setCurrentPostID(newPostID) {
    currentPostID = newPostID;
}

// GETTER //
export function getGlobalPostsList() {
    return Object.values(globalPosts).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export function getPostsByProfileList(profileID) {
    if (!(profileID in postsByProfile)) {
        postsByProfile[profileID] = {};
    }
    return Object.values(postsByProfile[profileID]).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export function getCurrentPostID() {
    return currentPostID;
}

export function getCurrentPost() {
    if (currentPostID == null || !(currentPostID in globalPosts)) {
        return null;
    }
    return structuredClone(globalPosts[currentPostID]);
}

export function getPostByID(postID) {
    if (postID == null || !(postID in globalPosts)) {
        return null;
    }
    return structuredClone(globalPosts[postID]);
}

// POST LIKES //
export function setPostLikes(postID, newLikes) {
    if (postID == null || !(postID in globalPosts)) {
        return;
    }
    globalPosts[postID].likes = newLikes;
}

export function getPostLikes(postID) {
    if (postID == null || !(postID in globalPosts)) {
        return 0;
    }
    return globalPosts[postID].likes;
}

export function incrementPostLikes(postID) {
    if (postID == null || !(postID in globalPosts)) {
        return;
    }
    globalPosts[postID].likes += 1;
}

export function decrementPostLikes(postID) {
    if (postID == null || !(postID in globalPosts)) {
        return;
    }
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
export function addPost(post) {
    if (!post || !post.post_id || !post.profile_id) return;

    const postID = post.post_id;
    const profileID = post.profile_id;
    globalPosts[postID] = post;
    if (!(profileID in postsByProfile)) {
        postsByProfile[profileID] = {};
    }
    postsByProfile[profileID][postID] = post;
    bus.emit(events.POST_CREATED);
}

export function loadPosts(posts) {
    posts.forEach((post) => {
        if (!post || !post.post_id || !post.profile_id) return;
        globalPosts[post.post_id] = post;
        if (!(post.profile_id in postsByProfile)) {
            postsByProfile[post.profile_id] = {};
        }
        postsByProfile[post.profile_id][post.post_id] = post;
    });

    isPostLoaded = true;
    bus.emit(events.POSTS_LOADED);
}

export function addPosts(posts) {
    posts.forEach((post) => {
        if (!post || !post.post_id || !post.profile_id) return;
        globalPosts[post.post_id] = post;
        if (!(post.profile_id in postsByProfile)) {
            postsByProfile[post.profile_id] = {};
        }
        postsByProfile[post.profile_id][post.post_id] = post;
    });

    bus.emit(events.POSTS_APPENDED);
}

export function clearPosts() {
    Object.keys(globalPosts).forEach((key) => delete globalPosts[key]);
    Object.keys(postsByProfile).forEach((key) => delete postsByProfile[key]);
    isPostLoaded = false;
}

export function getHighestPostID() {
    const ids = Object.keys(globalPosts).map(Number);
    if (ids.length === 0) return null;
    return Math.max(...ids);
}

export function getLowestPostID() {
    const ids = Object.keys(globalPosts).map(Number);
    if (ids.length === 0) return null;
    return Math.min(...ids);
}

export function isLoaded() {
    return isPostLoaded;
}
