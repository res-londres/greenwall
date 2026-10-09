import * as bus from '../eventBus.js';
import * as events from '../events.js';
import * as postManager from '../managers/postManager.js';
import * as commentManager from '../managers/commentManager.js';
import { isPostLiked } from '../managers/likeManager.js';
import { getCurrentProfileID } from '../managers/userManager.js';
import { getCurrentWall, getCurrentWallID } from '../managers/wallManager.js';
import { createEmptyWallHTML, createFetchingWallHTML, createPostHTML } from '../views/wallView.js';

export function init() {
    bus.on(events.NAV_CHANGED, renderPosts);
    // TODO: adding post shouldnt render all posts, only insert the new post on top
    bus.on(events.POST_CREATED, renderPosts);
    bus.on(events.POSTS_LOADED, renderPosts);
    bus.on(events.POSTS_APPENDED, renderOlderPosts);
    bus.on(events.POST_LIKED, renderUpdateTargetPost);
    bus.on(events.COMMENT_CREATED, renderUpdateTargetPost);
}

function renderUpdateTargetPost(post) {
    if (!post || !post.post_id) {
        return;
    }

    const oldPostRender = document.getElementById(post.post_id);
    if (!oldPostRender) {
        return;
    }

    const fragment = createPostHTML(post, {
        isLiked: isPostLiked(post.post_id),
        likeCount: post.likes,
        commentCount: commentManager.getPostCommentsCount(post.post_id),
    });
    const newPost = fragment.firstElementChild;
    oldPostRender.replaceWith(newPost);
}

export function renderPosts() {
    // TODO: should this be here?
    document.getElementById('scrollable-section').scrollTop = 0;
    const currentWall = getCurrentWall();
    const currentWallProfileID = currentWall.dataset.profileid;
    if (currentWallProfileID === 'null') {
        renderGlobalPosts(currentWall);
    } else {
        renderPostsByProfile(currentWallProfileID, currentWall);
    }
}

function renderGlobalPosts(currentWall = null) {
    // TODO: render global posts latest on top, when u get to postTime
    currentWall = currentWall === null ? getCurrentWall() : currentWall;
    const globalPosts = postManager.getGlobalPostsList();

    clearWallExceptSentinel(currentWall);

    if (globalPosts.length === 0) {
        const placeholder = postManager.isLoaded() ? createEmptyWallHTML() : createFetchingWallHTML();
        insertHTMLBeforeSentinel(currentWall, placeholder);
        return;
    }

    globalPosts.forEach(function(post) {
        const fragment = createPostHTML(post, {
            isLiked: isPostLiked(post.post_id),
            likeCount: post.likes,
            commentCount: commentManager.getPostCommentsCount(post.post_id),
        });
        insertBeforeSentinel(currentWall, fragment);
    });
}

function renderPostsByProfile(profileID, currentWall) {
    const postsByUser = postManager.getPostsByProfileList(profileID);

    clearWallExceptSentinel(currentWall);

    if (postsByUser.length === 0) {
        const placeholder = postManager.isLoaded() ? createEmptyWallHTML() : createFetchingWallHTML();
        insertHTMLBeforeSentinel(currentWall, placeholder);
        return;
    }

    postsByUser.forEach(function(post) {
        const fragment = createPostHTML(post, {
            isLiked: isPostLiked(post.post_id),
            likeCount: post.likes,
            commentCount: commentManager.getPostCommentsCount(post.post_id),
        });
        insertBeforeSentinel(currentWall, fragment);
    });
}

function renderOlderPosts({ posts, wallID }) {
    if (getCurrentWallID() !== wallID) return;

    const wall = document.getElementById(wallID);
    if (!wall) return;

    wall.querySelectorAll('[data-role="wall-placeholder"]').forEach(function(el) {
        el.remove();
    });

    posts.forEach(function(post) {
        const fragment = createPostHTML(post, {
            isLiked: isPostLiked(post.post_id),
            likeCount: post.likes,
            commentCount: commentManager.getPostCommentsCount(post.post_id),
        });
        insertBeforeSentinel(wall, fragment);
    });
}

function clearWallExceptSentinel(wall) {
    const sentinel = wall.querySelector('[data-role="scroll-sentinel"]');
    Array.from(wall.children).forEach(function(child) {
        if (child !== sentinel) child.remove();
    });
}

function insertBeforeSentinel(wall, fragment) {
    const sentinel = wall.querySelector('[data-role="scroll-sentinel"]');
    wall.insertBefore(fragment, sentinel);
}

function insertHTMLBeforeSentinel(wall, html) {
    const sentinel = wall.querySelector('[data-role="scroll-sentinel"]');
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    wall.insertBefore(template.content, sentinel);
}
