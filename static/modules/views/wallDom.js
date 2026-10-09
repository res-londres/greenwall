/**
 * wallDom — owns the wall's DOM structure and invariants.
 *
 * A wall element has the following structure:
 *
 *   wall
 *   ├── [placeholder]     (0 or 1, marked with data-role="wall-placeholder")
 *   ├── post card × N     (0..many)
 *   └── sentinel          (exactly 1, marked with data-role="scroll-sentinel")
 *       ├── spinner       (marked with data-role="scroll-spinner")
 *       └── end message   (marked with data-role="scroll-end")
 *
 * Invariants maintained by this module:
 * - The sentinel is always the last child of the wall.
 * - The sentinel is never removed, even during a full rebuild.
 * - Any placeholder is removed before posts are rendered or appended.
 * - The end-of-feed message is visible if and only if hasMoreOlder is
 *   false AND the wall has at least one post card.
 * - The spinner is visible only while setSentinelLoading(wall, true) is
 *   in effect.
 * - hasMoreOlder is read and written only through getHasMoreOlder and
 *   setHasMoreOlder.
 *
 * No module outside this one should directly manipulate the wall's
 * children or read/write its data-* attributes. Use these functions.
 */

import { createEmptyWallHTML, createFetchingWallHTML } from './wallView.js';

const SENTINEL_SELECTOR = '[data-role="scroll-sentinel"]';
const SPINNER_SELECTOR = '[data-role="scroll-spinner"]';
const END_SELECTOR = '[data-role="scroll-end"]';
const PLACEHOLDER_SELECTOR = '[data-role="wall-placeholder"]';

// ---------- QUERIES ---------- //

export function getSentinel(wall) {
    return wall.querySelector(SENTINEL_SELECTOR);
}

export function getAllSentinels() {
    return document.querySelectorAll(SENTINEL_SELECTOR);
}

export function getHasMoreOlder(wall) {
    return wall.dataset.hasMoreOlder !== 'false';
}

export function hasPosts(wall) {
    const sentinel = getSentinel(wall);
    return Array.from(wall.children).some(function(child) {
        return child !== sentinel && child.matches('[data-postid]');
    });
}

// ---------- POST OPERATIONS ---------- //

export function setPosts(wall, fragments) {
    clearChildrenExceptSentinel(wall);
    fragments.forEach(function(fragment) {
        insertBeforeSentinel(wall, fragment);
    });
}

export function appendPosts(wall, fragments) {
    fragments.forEach(function(fragment) {
        insertBeforeSentinel(wall, fragment);
    });
}

export function replacePost(wall, postID, fragment) {
    const existing = wall.querySelector(`[data-postid="${postID}"]`);
    if (!existing) return;
    existing.replaceWith(fragment);
}

// ---------- PLACEHOLDER OPERATIONS ---------- //

export function showPlaceholder(wall, kind) {
    clearPlaceholder(wall);
    const html = kind === 'empty' ? createEmptyWallHTML() : createFetchingWallHTML();
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    insertBeforeSentinel(wall, template.content);
}

export function clearPlaceholder(wall) {
    wall.querySelectorAll(PLACEHOLDER_SELECTOR).forEach(function(el) {
        el.remove();
    });
}

// ---------- SENTINEL OPERATIONS ---------- //

export function setSentinelLoading(wall, isLoading) {
    const spinner = wall.querySelector(SPINNER_SELECTOR);
    if (!spinner) return;
    if (isLoading) {
        spinner.classList.remove('opacity-0');
        spinner.classList.add('opacity-100');
    } else {
        spinner.classList.remove('opacity-100');
        spinner.classList.add('opacity-0');
    }
}

export function setHasMoreOlder(wall, hasMore) {
    wall.dataset.hasMoreOlder = hasMore ? 'true' : 'false';
}

// ---------- DERIVED STATE ---------- //

export function refreshWallState(wall) {
    refreshEndOfFeed(wall);
}

// ---------- INTERNAL ---------- //

function clearChildrenExceptSentinel(wall) {
    const sentinel = getSentinel(wall);
    Array.from(wall.children).forEach(function(child) {
        if (child !== sentinel) child.remove();
    });
}

function insertBeforeSentinel(wall, node) {
    const sentinel = getSentinel(wall);
    wall.insertBefore(node, sentinel);
}

function refreshEndOfFeed(wall) {
    const endMessage = wall.querySelector(END_SELECTOR);
    if (!endMessage) return;

    const hasMore = getHasMoreOlder(wall);
    const wallHasPosts = hasPosts(wall);

    if (!hasMore && wallHasPosts) {
        endMessage.classList.remove('hidden');
    } else {
        endMessage.classList.add('hidden');
    }
}
