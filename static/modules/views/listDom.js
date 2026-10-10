/**
 * listDom — owns the DOM structure and invariants of a "list" container.
 *
 * A list container has the following structure:
 *
 *   container
 *   ├── [placeholder]     (0 or 1, marked with data-role="list-placeholder")
 *   ├── item × N          (0..many, each with data-item-id)
 *   └── sentinel          (exactly 1, marked with data-role="scroll-sentinel")
 *       ├── spinner       (marked with data-role="scroll-spinner")
 *       └── end message   (marked with data-role="scroll-end")
 *
 * Invariants maintained by this module:
 * - The sentinel is always the last child of the container.
 * - The sentinel is never removed, even during a full rebuild.
 * - Any placeholder is removed before items are rendered or appended.
 * - The end-of-feed message is visible if and only if hasMore is false
 *   AND the container has at least one item.
 * - The spinner is visible only while setSentinelLoading(container, true)
 *   is in effect.
 * - The hasMore flag is passed in by the caller. This module does not
 *   read or write it.
 *
 * No module outside this one should directly manipulate a list
 * container's children or read/write its data-* attributes. Use these
 * functions.
 */

const SENTINEL_SELECTOR = '[data-role="scroll-sentinel"]';
const SPINNER_SELECTOR = '[data-role="scroll-spinner"]';
const END_SELECTOR = '[data-role="scroll-end"]';
const PLACEHOLDER_SELECTOR = '[data-role="list-placeholder"]';

// ---------- QUERIES ---------- //

export function getSentinel(container) {
    return container.querySelector(SENTINEL_SELECTOR);
}

export function getAllSentinels() {
    return document.querySelectorAll(SENTINEL_SELECTOR);
}

export function hasItems(container) {
    const sentinel = getSentinel(container);
    return Array.from(container.children).some(function(child) {
        return child !== sentinel && !child.matches(PLACEHOLDER_SELECTOR);
    });
}

// ---------- ITEM OPERATIONS ---------- //

export function setItems(container, fragments) {
    clearChildrenExceptSentinel(container);
    fragments.forEach(function(fragment) {
        insertBeforeSentinel(container, fragment);
    });
}

export function appendItems(container, fragments) {
    fragments.forEach(function(fragment) {
        insertBeforeSentinel(container, fragment);
    });
}

export function replaceItem(container, itemID, fragment) {
    const existing = container.querySelector(`[data-postid="${itemID}"], [data-commentid="${itemID}"]`);
    if (!existing) return;
    existing.replaceWith(fragment);
}

// ---------- PLACEHOLDER OPERATIONS ---------- //

export function showPlaceholder(container, html) {
    clearPlaceholder(container);
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    insertBeforeSentinel(container, template.content);
}

export function clearPlaceholder(container) {
    container.querySelectorAll(PLACEHOLDER_SELECTOR).forEach(function(el) {
        el.remove();
    });
}

// ---------- SENTINEL OPERATIONS ---------- //

export function setSentinelLoading(container, isLoading) {
    const spinner = container.querySelector(SPINNER_SELECTOR);
    if (!spinner) return;
    if (isLoading) {
        spinner.classList.remove('opacity-0');
        spinner.classList.add('opacity-100');
    } else {
        spinner.classList.remove('opacity-100');
        spinner.classList.add('opacity-0');
    }
}

// ---------- DERIVED STATE ---------- //

export function refreshState(container, hasMore) {
    refreshEndOfFeed(container, hasMore);
}

// ---------- INTERNAL ---------- //

function clearChildrenExceptSentinel(container) {
    const sentinel = getSentinel(container);
    Array.from(container.children).forEach(function(child) {
        if (child !== sentinel) child.remove();
    });
}

function insertBeforeSentinel(container, node) {
    const sentinel = getSentinel(container);
    container.insertBefore(node, sentinel);
}

function refreshEndOfFeed(container, hasMore) {
    const endMessage = container.querySelector(END_SELECTOR);
    if (!endMessage) return;

    const hasItemsNow = hasItems(container);

    if (!hasMore && hasItemsNow) {
        endMessage.classList.remove('hidden');
    } else {
        endMessage.classList.add('hidden');
    }
}
