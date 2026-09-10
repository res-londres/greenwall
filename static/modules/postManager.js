import * as bus from './eventBus.js';

const globalPosts = [] // [{postID, attribution, subject, content}, {anotherPost}]

export function addPost(post) {
    globalPosts.push(post);
    bus.emit('postManager:postAdded', post);
}