import * as bus from './eventBus.js';
import * as events from './events.js';
import * as postManager from './managers/postManager.js';
import { setCurrentPostID, setPostModalActive } from './managers/postManager.js';
import { getCurrentWall } from './managers/wallManager.js';

const POLL_INTERVAL_MS = 30000;
let pollIntervalId = null;
let isFetching = false;
let sessionGeneration = 0;
let activeFetchGeneration = null;
let queuedFetchGeneration = null;
let isAuthenticated = false;
let isFetchingOlder = false;
let sentinelObserver = null;

export function init() {
    handlePostEvents();
    bus.on(events.AUTH_LOGGED_IN, onAuthLoggedIn);
    bus.on(events.AUTH_LOGGED_OUT, onAuthLoggedOut);
    bus.on(events.PROFILE_SWITCHED, resetProfileWallPagination);
    bus.on(events.POSTS_LOADED, scheduleSentinelCheck);
    bus.on(events.POST_CREATED, scheduleSentinelCheck);
    setupSentinelObserver();
}

function setupSentinelObserver() {
    const sentinels = document.querySelectorAll('[data-role="scroll-sentinel"]');
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

function maybeFetchOlder() {
    if (!isAuthenticated) return;
    if (isFetchingOlder) return;

    const wall = getCurrentWall();
    if (!wall) return;
    if (wall.dataset.hasMoreOlder === 'false') return;

    const sentinel = wall.querySelector('[data-role="scroll-sentinel"]');
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

function scheduleSentinelCheck() {
    requestAnimationFrame(maybeFetchOlder);
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
    setSentinelLoading(wall, true);

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
            console.error('[post] Failed to fetch older posts');
            return;
        }

        if (!body.ok) {
            console.error('[post] Failed to fetch older posts:', body.error);
            return;
        }

        const posts = body.data.posts;

        if (posts.length < 30) {
            wall.dataset.hasMoreOlder = 'false';
        }

        if (posts.length > 0) {
            postManager.addOlderPosts(posts, wallID);
        }
    } finally {
        isFetchingOlder = false;
        setSentinelLoading(wall, false);
        requestAnimationFrame(maybeFetchOlder);
    }
}

function setSentinelLoading(wall, isLoading) {
    const spinner = wall.querySelector('[data-role="scroll-spinner"]');
    if (!spinner) return;
    if (isLoading) {
        spinner.classList.remove('opacity-0');
        spinner.classList.add('opacity-100');
    } else {
        spinner.classList.remove('opacity-100');
        spinner.classList.add('opacity-0');
    }
}

function resetProfileWallPagination() {
    const profileWall = document.getElementById('profile-wall');
    if (profileWall) {
        profileWall.dataset.hasMoreOlder = 'true';
    }
}

function handlePostEvents() {
    document.addEventListener('click', function(event) {
        const actionElement = event.target.closest('[data-action]');
        if (actionElement) {
            const action = actionElement.dataset.action;
            const postID = actionElement.dataset.postid;

            event.stopPropagation();
            event.preventDefault();
            if (action === 'openPostModal') {
                openPostModal(document.getElementById('post-modal'), postID);
            } else if (action === 'likePost') {
                bus.emit(events.POST_LIKE_REQUESTED, postID);
            }
        }
    });
}

function openPostModal(postModal, postID) {
    if (!postID || !postManager.getPostByID(postID)) return;
    setCurrentPostID(postID);
    postModal.style.display = 'flex';
    setPostModalActive(true);
    bus.emit(events.POST_MODAL_OPENED);

    const focusInput = () => {
        const input = document.getElementById('post-modal-input-comment');
        if (input) input.focus();
    };

    requestAnimationFrame(focusInput);
}

async function onAuthLoggedIn() {
    isAuthenticated = true;
    const generation = ++sessionGeneration;
    stopPolling();
    await fetchPosts();
    if (generation !== sessionGeneration) return;
    startPolling();
}

function onAuthLoggedOut() {
    isAuthenticated = false;
    sessionGeneration += 1;
    queuedFetchGeneration = null;
    stopPolling();
    postManager.clearPosts();

    const homeWall = document.getElementById('home-wall');
    const profileWall = document.getElementById('profile-wall');
    if (homeWall) homeWall.dataset.hasMoreOlder = 'true';
    if (profileWall) profileWall.dataset.hasMoreOlder = 'true';
}

async function fetchPosts() {
    if (!isAuthenticated) return;

    if (isFetching) {
        if (activeFetchGeneration !== sessionGeneration) {
            queuedFetchGeneration = sessionGeneration;
        }
        return;
    }
    isFetching = true;
    activeFetchGeneration = sessionGeneration;
    const requestGeneration = sessionGeneration;

    try {
        const afterID = postManager.getHighestPostID();
        const payload = { limit: 30 };
        if (afterID !== null) {
            payload.after_id = afterID;
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
            if (requestGeneration === sessionGeneration) {
                console.error('[post] Failed to fetch posts');
            }
            return;
        }

        if (requestGeneration !== sessionGeneration) return;

        if (!body.ok) {
            console.error('[post] Failed to fetch posts:', body.error);
            return;
        }

        if (afterID === null) {
            postManager.loadPosts(body.data.posts);
        } else if (body.data.posts.length > 0) {
            postManager.addPosts(body.data.posts);
        }
    } finally {
        isFetching = false;
        activeFetchGeneration = null;

        const nextGeneration = queuedFetchGeneration;
        queuedFetchGeneration = null;
        if (isAuthenticated && nextGeneration === sessionGeneration) {
            void fetchPosts();
        }
    }
}

function startPolling() {
    stopPolling();
    pollIntervalId = setInterval(fetchPosts, POLL_INTERVAL_MS);
}

function stopPolling() {
    if (pollIntervalId !== null) {
        clearInterval(pollIntervalId);
        pollIntervalId = null;
    }
}
