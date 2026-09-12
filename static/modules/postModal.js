import * as commentManager from './managers/commentManager.js';

export function init() {
    handlePostModalEvents();
}

function handlePostModalEvents() {
    const postModal = document.getElementById('post-modal');

    postModal.addEventListener('click', function(event) {
        const actionElement = event.target.closest('[data-action]');
        if (actionElement) {
            const action = actionElement.dataset.action;
            if (action === 'closePostModal') {
                closePostModal(postModal);
            } else if (action === 'createComment') {
                const inputContent = document.getElementById('post-modal-input-comment');
                createComment(inputContent.value);
                clearInput(inputContent);
            }
        }
    });
}

function closePostModal(postModal) {
    postModal.style.display = 'none';
}

function createComment(content) {
    if (!content) return;
    const tempID = crypto.randomUUID();
    const comment = {
        comment_id: tempID,
        attribution: 'user',
        content: content
    }
    commentManager.addPostComment(comment);
}

// HELPERS //
function clearInput(inputContent) {
    inputContent.value = '';
}