import * as bus from './eventBus.js';
import * as HTMLCreator from './HTMLCreator.js';
import * as postManager from './postManager.js';
import { getCurrentWall } from './wallManager.js';

// INIT //
export function init() {
    renderGlobalPosts();
    bus.on('postManager:addPost', renderGlobalPosts);
    bus.on('post:openPostModal', renderPostModal);
}

function renderGlobalPosts() {
    // TODO: render global posts latest on top, when u get to postTime
    const currentWall = getCurrentWall();
    const globalPosts = postManager.getGlobalPostsList();
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

function renderPostModal() {
    const postModalContent = document.getElementById('post-modal-content');
    const post = postManager.getCurrentPost();
    postModalContent.innerHTML = HTMLCreator.createPostModalHTML(post);
}