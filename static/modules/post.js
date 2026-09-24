import * as bus from './eventBus.js';
import * as postManager from './managers/postManager.js';
import { setCurrentPostID, setPostModalActive } from './managers/postManager.js';

export function init() {
    handlePostEvents();
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
                bus.emit('post:#togglePostLike', postID);
            }
        }
    });
}

function openPostModal(postModal, postID) {
    if (!postID || !postManager.getPostByID(postID)) return;
    setCurrentPostID(postID);
    postModal.style.display = 'flex';
    setPostModalActive(true);
    bus.emit('post:openPostModal');

    const focusInput = () => {
        const input = document.getElementById('post-modal-input-comment');
        if (input) input.focus();
    };

    requestAnimationFrame(focusInput);
}
