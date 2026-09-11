import * as bus from './eventBus.js';

// TODO: how about a dict for globalPosts for easier lookup?
const globalPosts = [] // [{post_id, attribution, subject, content}, {anotherPost}]
let currentPostID = null;

export function setCurrentPostID(newPostID) {
    currentPostID = newPostID;
}

export function getGlobalPosts() {
    return structuredClone(globalPosts);
}

export function getCurrentPost() {
    for (const post of globalPosts) {
        if (currentPostID === post.post_id) {
            return post;
        }
    }
}

export function addPost(post) {
    globalPosts.unshift(post);
    bus.emit('postManager:postAdded');
}