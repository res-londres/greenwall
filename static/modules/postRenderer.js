import * as bus from './eventBus.js';
import * as HTMLCreator from './HTMLCreator.js';
import { getCurrentWall } from './wallManager.js';
import { getGlobalPosts } from './postManager.js';

// INIT //
export function init() {
    renderGlobalPosts();
    bus.on('postManager:postAdded', renderGlobalPosts);
}

function renderGlobalPosts() {
    const currentWall = getCurrentWall();
    const globalPosts = getGlobalPosts();
    if (globalPosts.length === 0) {
        currentWall.innerHTML = HTMLCreator.createEmptyWallHTML();
        return;
    }
    currentWall.innerHTML = '';
    let html = '';
    globalPosts.forEach(function(post) {
        html += HTMLCreator.createPostHTML(post);
    });
    currentWall.innerHTML += html;
}