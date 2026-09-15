import * as bus from './eventBus.js';
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
                document.getElementById('post-modal-input-comment').focus();
            } else if (action === 'likePost') {
                bus.emit('post:#togglePostLike', postID);
            }
        }
    });
}

function openPostModal(postModal, postID) {
    setCurrentPostID(postID);
    postModal.style.display = 'flex';
    setPostModalActive(true);
    bus.emit('post:openPostModal');
}
