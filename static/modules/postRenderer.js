import * as bus from './eventBus.js';
import * as HTMLCreator from './HTMLCreator.js';
import * as postManager from './managers/postManager.js';
import * as commentManager from './managers/commentManager.js';
import { getCurrentWall } from './managers/wallManager.js';

// INIT //
export function init() {
    renderGlobalPosts();
    bus.on('postManager:addPost', renderGlobalPosts);
    bus.on('postManager:addPostComment', renderPostComments);
    bus.on('post:openPostModal', renderPostModal);
    bus.on('post:openPostModal', renderPostComments);
    bus.on('like:toggleLike', renderGlobalPosts);
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

function renderPostComments() {
    const postModalCommentsList = document.getElementById('post-modal-comment-list');
    const postComments = commentManager.getPostCommentsList();
    // empty comments html
    postModalCommentsList.innerHTML = '';
    let html = '';

    postComments.forEach(function(comment) {
        html += HTMLCreator.createCommentHTML(comment, postManager.getCurrentPostID);
    });
    postModalCommentsList.innerHTML += html;
}

function renderPostModal() {
    const postModalContent = document.getElementById('post-modal-content');
    const post = postManager.getCurrentPost();
    postModalContent.innerHTML = HTMLCreator.createPostModalHTML(post);
}