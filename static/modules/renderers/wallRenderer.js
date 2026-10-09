import * as bus from '../eventBus.js';
import * as events from '../events.js';
import * as postManager from '../managers/postManager.js';
import * as commentManager from '../managers/commentManager.js';
import { isPostLiked } from '../managers/likeManager.js';
import { getCurrentWall, getCurrentWallID } from '../managers/wallManager.js';
import * as wallDom from '../views/wallDom.js';
import { createPostHTML } from '../views/wallView.js';

export function init() {
    bus.on(events.NAV_CHANGED, renderPosts);
    bus.on(events.POST_CREATED, renderPosts);
    bus.on(events.POSTS_LOADED, renderPosts);
    bus.on(events.POSTS_APPENDED, renderOlderPosts);
    bus.on(events.POST_LIKED, renderUpdateTargetPost);
    bus.on(events.COMMENT_CREATED, renderUpdateTargetPost);
}

export function renderPosts() {
    document.getElementById('scrollable-section').scrollTop = 0;

    const currentWall = getCurrentWall();
    const currentWallProfileID = currentWall.dataset.profileid;
    if (currentWallProfileID === 'null') {
        renderGlobalPosts(currentWall);
    } else {
        renderPostsByProfile(currentWallProfileID, currentWall);
    }
}

function renderGlobalPosts(wall) {
    const posts = postManager.getGlobalPostsList();

    if (posts.length === 0) {
        wallDom.setPosts(wall, []);
        wallDom.showPlaceholder(wall, postManager.isLoaded() ? 'empty' : 'fetching');
    } else {
        wallDom.clearPlaceholder(wall);
        wallDom.setPosts(wall, posts.map(buildPostFragment));
    }

    refreshWall(wall);
}

function renderPostsByProfile(profileID, wall) {
    const posts = postManager.getPostsByProfileList(profileID);

    if (posts.length === 0) {
        wallDom.setPosts(wall, []);
        wallDom.showPlaceholder(wall, postManager.isLoaded() ? 'empty' : 'fetching');
    } else {
        wallDom.clearPlaceholder(wall);
        wallDom.setPosts(wall, posts.map(buildPostFragment));
    }

    refreshWall(wall);
}

function renderOlderPosts({ posts, wallID }) {
    if (getCurrentWallID() !== wallID) return;
    const wall = document.getElementById(wallID);
    if (!wall) return;

    wallDom.clearPlaceholder(wall);
    wallDom.appendPosts(wall, posts.map(buildPostFragment));
    refreshWall(wall);
}

function renderUpdateTargetPost(post) {
    if (!post || !post.post_id) return;
    const wall = getCurrentWall();
    if (!wall) return;

    wallDom.replacePost(wall, post.post_id, buildPostFragment(post));
    refreshWall(wall);
}

function refreshWall(wall) {
    const wallID = wall.id;
    const meta = postManager.getWallMeta(wallID);
    wallDom.refreshWallState(wall, meta.hasMoreOlder);
}

function buildPostFragment(post) {
    return createPostHTML(post, {
        isLiked: isPostLiked(post.post_id),
        likeCount: post.likes,
        commentCount: commentManager.getPostCommentsCount(post.post_id),
    });
}
