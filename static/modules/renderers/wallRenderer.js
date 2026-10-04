import * as bus from '../eventBus.js';
import * as events from '../events.js';
import * as postManager from '../managers/postManager.js';
import * as commentManager from '../managers/commentManager.js';
import { isPostLiked } from '../managers/likeManager.js';
import { getCurrentProfileID } from '../managers/userManager.js';
import { getCurrentWall } from '../managers/wallManager.js';
import { createEmptyWallHTML, createPostHTML } from '../views/wallView.js';

export function init() {
    bus.on(events.NAV_CHANGED, renderPosts);
    // TODO: adding post shouldnt render all posts, only insert the new post on top
    bus.on(events.POST_CREATED, renderPosts);
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
    const currentWall = getCurrentWall();
    const currentWallProfileID = currentWall.dataset.profileid;
    if (currentWallProfileID === 'null') {
        renderGlobalPosts(currentWall);
    } else if (currentWallProfileID === 'user') {
        renderPostsByAccount(null, currentWall);
    } else {
        // for when we open another account profile
    }
}

function renderGlobalPosts(currentWall = null) {
    // TODO: render global posts latest on top, when u get to postTime
    currentWall = currentWall === null ? getCurrentWall() : currentWall;
    const globalPosts = postManager.getGlobalPostsList();
    if (globalPosts.length === 0) {
        currentWall.innerHTML = createEmptyWallHTML();
        return;
    }
    currentWall.replaceChildren();
    globalPosts.forEach(function(post) {
        const fragment = createPostHTML(post, {
            isLiked: isPostLiked(post.post_id),
            likeCount: post.likes,
            commentCount: commentManager.getPostCommentsCount(post.post_id),
        });
        currentWall.appendChild(fragment);
    });
}

function renderPostsByAccount(profileID = null, currentWall = null) {
    profileID = profileID === null ? getCurrentProfileID() : profileID;
    currentWall = currentWall === null ? getCurrentWall() : currentWall;
    const postsByUser = postManager.getPostsByProfileList(profileID);
    if (postsByUser.length === 0) {
        currentWall.innerHTML = createEmptyWallHTML();
        return;
    }
    currentWall.replaceChildren();
    postsByUser.forEach(function(post) {
        const fragment = createPostHTML(post, {
            isLiked: isPostLiked(post.post_id),
            likeCount: post.likes,
            commentCount: commentManager.getPostCommentsCount(post.post_id),
        });
        currentWall.appendChild(fragment);
    });
}
