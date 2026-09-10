import * as bus from './eventBus.js';

// INIT //
export function init() {
    bus.on('postManager:postAdded', itWorks);
}

function itWorks(post) {
    console.log(`it works: ${post.subject} ${post.content}`);
}