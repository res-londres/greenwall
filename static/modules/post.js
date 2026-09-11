import * as bus from './eventBus.js';
import { setCurrentPostID } from './postManager.js';
import { getCurrentWall } from './wallManager.js';

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

            if (action === 'openPostModal') {
                openPostModal(postModal, postID);
            }
        }
    });
}

function openPostModal(postModal, postID) {
    setCurrentPostID(postID);
    postModal.style.display = 'flex';
    bus.emit('post:openPostModal');
}
