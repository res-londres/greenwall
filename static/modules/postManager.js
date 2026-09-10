import * as bus from './eventBus.js';

const globalPosts = [] // [{postID, attribution, subject, content}, {anotherPost}]

export function getGlobalPosts() {
    return structuredClone(globalPosts);
}

export function addPost(post) {
    globalPosts.unshift(post);
    bus.emit('postManager:postAdded', post);
}