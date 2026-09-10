import * as bus from './eventBus.js';
import { createPostHTML } from './HTMLCreator.js';
import { getCurrentWall } from './wallManager.js';

// INIT //
export function init() {
    bus.on('postManager:postAdded', renderPost);
}

function renderPost(post) {
    const postHTML = createPostHTML(post);
    const currentWall = getCurrentWall();
    currentWall.innerHTML += postHTML;
}