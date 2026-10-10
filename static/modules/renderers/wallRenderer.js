import * as bus from '../eventBus.js';
import * as events from '../events.js';
import * as postManager from '../managers/postManager.js';
import * as commentManager from '../managers/commentManager.js';
import { isPostLiked } from '../managers/likeManager.js';
import { getCurrentWall, getCurrentWallID } from '../managers/wallManager.js';
import * as listDom from '../views/listDom.js';
import { createEmptyWallHTML, createFetchingWallHTML, createPostHTML } from '../views/wallView.js';

export function init() {
    bus.on(events.NAV_CHANGED, renderPosts);
    bus.on(events.POST_CREATED, renderPosts);
    bus.on(events.POSTS_LOADED, renderPosts);
    bus.on(events.POSTS_APPENDED, renderOlderPosts);
    bus.on(events.POST_LIKED, renderUpdateTargetPost);
    bus.on(events.COMMENT_CREATED, renderUpdateTargetPost);
    bus.on(events.WALL_REFRESH_REQUESTED, renderPosts);
}

export function renderPosts() {
    document.getElementById('scrollable-section').scrollTo({
        top: 0,
        behavior: 'smooth'
    });

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
        listDom.setItems(wall, []);
        listDom.showPlaceholder(wall, postManager.isLoaded() ? createEmptyWallHTML() : createFetchingWallHTML());
    } else {
        listDom.clearPlaceholder(wall);
        listDom.setItems(wall, posts.map(buildPostFragment));
    }

    refreshWall(wall);
}

function renderPostsByProfile(profileID, wall) {
    const posts = postManager.getPostsByProfileList(profileID);

    if (posts.length === 0) {
        listDom.setItems(wall, []);
        listDom.showPlaceholder(wall, postManager.isLoaded() ? createEmptyWallHTML() : createFetchingWallHTML());
    } else {
        listDom.clearPlaceholder(wall);
        listDom.setItems(wall, posts.map(buildPostFragment));
    }

    refreshWall(wall);
}

function renderOlderPosts({ posts, wallID }) {
    if (getCurrentWallID() !== wallID) return;
    const wall = document.getElementById(wallID);
    if (!wall) return;

    listDom.clearPlaceholder(wall);
    listDom.appendItems(wall, posts.map(buildPostFragment));
    refreshWall(wall);
}

function renderUpdateTargetPost(post) {
    if (!post || !post.post_id) return;
    const wall = getCurrentWall();
    if (!wall) return;

    listDom.replaceItem(wall, post.post_id, buildPostFragment(post));
    refreshWall(wall);
}

function refreshWall(wall) {
    const wallID = wall.id;
    const meta = postManager.getWallMeta(wallID);
    listDom.refreshState(wall, meta.hasMoreOlder);
}

function buildPostFragment(post) {
    return createPostHTML(post, {
        isLiked: isPostLiked(post.post_id),
        likeCount: post.likes,
        commentCount: commentManager.getPostCommentsCount(post.post_id),
    });
}
