import * as bus from './eventBus.js';
import * as events from './events.js';
import * as commentManager from './managers/commentManager.js';
import { getCurrentPost, setPostModalActive } from './managers/postManager.js';

export function init() {
    handlePostModalEvents();
}

async function handlePostModalEvents() {
    const postModal = document.getElementById('post-modal');

    postModal.addEventListener('click', async function(event) {
        const actionElement = event.target.closest('[data-action]');
        if (actionElement) {
            const action = actionElement.dataset.action;
            const postID = actionElement.dataset.postid;
            const commentID = actionElement.dataset.commentid;

            event.stopPropagation();
            event.preventDefault();
            if (action === 'closePostModal') {
                closePostModal(postModal);
            } else if (action === 'createComment') {
                const inputContent = document.getElementById('post-modal-input-comment');
                await createComment(inputContent.value);
            } else if (action === 'likePost') {
                bus.emit(events.POST_LIKE_REQUESTED, postID);
            } else if (action === 'likeComment') {
                bus.emit(events.COMMENT_LIKE_REQUESTED, commentID);
            }
        }
    });
}

function closePostModal(postModal) {
    postModal.style.display = 'none';
    setPostModalActive(false);
}

async function createComment(content) {
    if (!content) return;
    const currentPost = getCurrentPost();
    if (!currentPost) return;

    const input = document.getElementById('post-modal-input-comment');
    const errorEl = document.getElementById('post-modal-comment-error');

    let body;
    try {
        const response = await fetch('/api/comment/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ post_id: currentPost.post_id, content: content })
        });
        body = await response.json();
    } catch {
        if (errorEl) {
            errorEl.textContent = 'Network error. Please try again.';
            errorEl.classList.remove('hidden');
        }
        return;
    }

    if (!body.ok) {
        if (errorEl) {
            errorEl.textContent = body.error;
            errorEl.classList.remove('hidden');
        }
        return;
    }

    if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.add('hidden');
    }

    const comment = body.data.comment;
    commentManager.addComment(comment, currentPost.post_id);

    clearInput(input);

    requestAnimationFrame(function() {
        const section = document.getElementById('post-modal-comment-section');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

// HELPERS //
function clearInput(inputContent) {
    inputContent.value = '';
}