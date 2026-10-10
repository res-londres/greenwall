import * as bus from './eventBus.js';
import * as events from './events.js';
import * as commentManager from './managers/commentManager.js';
import * as postManager from './managers/postManager.js';
import * as listDom from './views/listDom.js';

let isFetchingOlder = false;
let sentinelObserver = null;

export function init() {
    bus.on(events.POST_MODAL_OPENED, setupSentinelObserver);
    bus.on(events.COMMENTS_LOADED, scheduleSentinelCheck);
    bus.on(events.COMMENTS_APPENDED, scheduleSentinelCheck);
}

function setupSentinelObserver() {
    if (sentinelObserver) {
        sentinelObserver.disconnect();
        sentinelObserver = null;
    }

    requestAnimationFrame(function() {
        const container = document.getElementById('post-modal-comment-list');
        if (!container) return;

        const sentinel = listDom.getSentinel(container);
        if (!sentinel) return;

        sentinelObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    maybeFetchOlder();
                }
            });
        }, { threshold: 0 });

        sentinelObserver.observe(sentinel);
    });
}

function scheduleSentinelCheck() {
    requestAnimationFrame(maybeFetchOlder);
}

function maybeFetchOlder() {
    if (!postManager.isPostModalActive()) return;
    if (isFetchingOlder) return;

    const postID = postManager.getCurrentPostID();
    if (postID == null) return;

    const meta = commentManager.getCommentsPagination(postID);
    if (meta.isInitialFetching) return;
    if (!meta.hasMoreMine && !meta.hasMoreOther) return;

    const list = document.getElementById('post-modal-comment-list');
    if (!list) return;

    const sentinel = listDom.getSentinel(list);
    if (!sentinel) return;
    if (!isSentinelInViewport(sentinel, list)) return;

    void fetchOlderComments(postID);
}

function isSentinelInViewport(sentinel, container) {
    const containerRect = container.getBoundingClientRect();
    const sentinelRect = sentinel.getBoundingClientRect();
    return sentinelRect.top < containerRect.bottom && sentinelRect.bottom > containerRect.top;
}

async function fetchOlderComments(postID) {
    isFetchingOlder = true;
    const list = document.getElementById('post-modal-comment-list');
    listDom.setSentinelLoading(list, true);

    try {
        const p = commentManager.getCommentsPagination(postID);
        const payload = {
            post_id: postID,
            before_mine_id: p.oldestMineID,
            before_other_id: p.oldestOtherID,
            has_more_mine: p.hasMoreMine,
            has_more_other: p.hasMoreOther,
            limit: 30
        };

        let body;
        try {
            const response = await fetch('/api/comment/list', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            body = await response.json();
        } catch {
            console.error('[commentPagination] Failed to fetch older comments');
            return;
        }

        if (!body.ok) {
            console.error('[commentPagination] Failed to fetch older comments:', body.error);
            return;
        }

        commentManager.addPaginatedComments(postID, body.data.comments, {
            hasMoreMine: body.data.has_more_mine,
            hasMoreOther: body.data.has_more_other
        });
    } finally {
        isFetchingOlder = false;
        listDom.setSentinelLoading(list, false);
        requestAnimationFrame(maybeFetchOlder);
    }
}

