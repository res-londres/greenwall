import * as bus from './eventBus.js';
import { setCurrentPostID } from './managers/postManager.js';
import { getCurrentWall } from './managers/wallManager.js';

export function init() {
    handlePostEvents();
}

function handlePostEvents() {
    const postModal = document.getElementById('post-modal');
    const currentWall = getCurrentWall();

    currentWall.addEventListener('click', function(event) {
        const actionElement = event.target.closest('[data-action]');
        if (actionElement) {
            const action = actionElement.dataset.action;
            const postID = actionElement.dataset.postid;

            event.stopPropagation();
            event.preventDefault();
            if (action === 'openPostModal') {
                openPostModal(postModal, postID);
                document.getElementById('post-modal-input-comment').focus();
            } else if (action === 'likePost') {
                console.log('like button clickd');
                bus.emit('post:#toggleLike', postID);
            }
        }
    });
}

function openPostModal(postModal, postID) {
    setCurrentPostID(postID);
    postModal.style.display = 'flex';
    bus.emit('post:openPostModal');
}
