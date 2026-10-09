import * as bus from './eventBus.js';
import * as events from './events.js';
import * as postManager from './managers/postManager.js';
import { getCurrentWall } from './managers/wallManager.js';
import * as wallDom from './views/wallDom.js';

let isFetchingOlder = false;
let sentinelObserver = null;
let isAuthenticated = false;

export function init() {
    bus.on(events.AUTH_LOGGED_IN, onAuthLoggedIn);
    bus.on(events.AUTH_LOGGED_OUT, onAuthLoggedOut);
    bus.on(events.PROFILE_SWITCHED, resetProfileWallPagination);
    bus.on(events.POSTS_LOADED, scheduleSentinelCheck);
    bus.on(events.POST_CREATED, scheduleSentinelCheck);
    setupSentinelObserver();
}

function onAuthLoggedIn() {
    isAuthenticated = true;
}

function onAuthLoggedOut() {
    isAuthenticated = false;
}

function resetProfileWallPagination() {
    postManager.resetWallMeta('profile-wall');
}

function setupSentinelObserver() {
    const sentinels = wallDom.getAllSentinels();
    if (sentinels.length === 0) return;

    sentinelObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                maybeFetchOlder();
            }
        });
    }, { threshold: 0 });

    sentinels.forEach((sentinel) => sentinelObserver.observe(sentinel));
}

function scheduleSentinelCheck() {
    requestAnimationFrame(maybeFetchOlder);
}

function maybeFetchOlder() {
    if (!isAuthenticated) return;
    if (isFetchingOlder) return;
    if (!postManager.isLoaded()) return;

    const wall = getCurrentWall();
    if (!wall) return;

    const wallID = wall.id;
    const meta = postManager.getWallMeta(wallID);
    if (!meta.hasMoreOlder) return;

    const sentinel = wallDom.getSentinel(wall);
    if (!sentinel) return;
    if (!isSentinelInViewport(sentinel)) return;

    void fetchOlderPosts(wall);
}

function isSentinelInViewport(sentinel) {
    const container = document.getElementById('scrollable-section');
    if (!container) return false;
    const containerRect = container.getBoundingClientRect();
    const sentinelRect = sentinel.getBoundingClientRect();
    return sentinelRect.top < containerRect.bottom && sentinelRect.bottom > containerRect.top;
}

async function fetchOlderPosts(wall) {
    const wallID = wall.id;
    const isProfileWall = wall.dataset.profileid !== 'null';
    const profileID = isProfileWall ? wall.dataset.profileid : null;

    const beforeID = profileID !== null
        ? postManager.getLowestPostIDByProfile(profileID)
        : postManager.getLowestPostID();

    if (beforeID === null && profileID === null) return;

    isFetchingOlder = true;
    wallDom.setSentinelLoading(wall, true);

    try {
        const payload = { limit: 30 };
        if (beforeID !== null) {
            payload.before_id = beforeID;
        }
        if (profileID !== null) {
            payload.profile_id = profileID;
        }

        let body;
        try {
            const response = await fetch('/api/post/list', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            body = await response.json();
        } catch {
            console.error('[postPagination] Failed to fetch older posts');
            return;
        }

        if (!body.ok) {
            console.error('[postPagination] Failed to fetch older posts:', body.error);
            return;
        }

        const posts = body.data.posts;

        if (posts.length < 30) {
            postManager.setWallMeta(wallID, { hasMoreOlder: false });
        }

        postManager.addOlderPosts(posts, wallID);
    } finally {
        isFetchingOlder = false;
        wallDom.setSentinelLoading(wall, false);
        requestAnimationFrame(maybeFetchOlder);
    }
}
