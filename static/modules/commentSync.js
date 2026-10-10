import * as bus from './eventBus.js';
import * as events from './events.js';
import * as commentManager from './managers/commentManager.js';
import * as postManager from './managers/postManager.js';

export function init() {
    bus.on(events.POST_MODAL_OPENED, onPostModalOpened);
    bus.on(events.PROFILE_SWITCHED, onProfileSwitched);
    bus.on(events.AUTH_LOGGED_OUT, onAuthLoggedOut);
}

async function onPostModalOpened() {
    const postID = postManager.getCurrentPostID();
    if (postID == null) return;
    if (commentManager.hasCachedComments(postID)) return;

    commentManager.initPagination(postID);
    commentManager.setInitialFetching(postID, true);

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
        console.error('[commentSync] Failed to fetch comments');
        commentManager.setInitialFetching(postID, false);
        return;
    }

    if (!body.ok) {
        console.error('[commentSync] Failed to fetch comments:', body.error);
        commentManager.setInitialFetching(postID, false);
        return;
    }

    commentManager.addInitialComments(postID, body.data.comments, {
        hasMoreMine: body.data.has_more_mine,
        hasMoreOther: body.data.has_more_other
    });
}

function onProfileSwitched() {
    commentManager.clear();
}

function onAuthLoggedOut() {
    commentManager.clear();
}
