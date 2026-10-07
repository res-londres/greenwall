import * as bus from './eventBus.js';
import * as events from './events.js';
import * as postManager from './managers/postManager.js';
import { setCurrentPostID, setPostModalActive } from './managers/postManager.js';

const POLL_INTERVAL_MS = 30000;
let pollIntervalId = null;
let isFetching = false;
let sessionGeneration = 0;
let activeFetchGeneration = null;
let queuedFetchGeneration = null;
let isAuthenticated = false;

export function init() {
    handlePostEvents();
    bus.on(events.AUTH_LOGGED_IN, onAuthLoggedIn);
    bus.on(events.AUTH_LOGGED_OUT, onAuthLoggedOut);
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
