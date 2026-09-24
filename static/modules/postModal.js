import * as bus from './eventBus.js';
import * as commentManager from './managers/commentManager.js';
import { getCurrentPost, setPostModalActive } from './managers/postManager.js';
import { getCurrentProfileName, getCurrentProfileID } from './managers/profileManager.js';

export function init() {
    handlePostModalEvents();
}

function handlePostModalEvents() {
    const postModal = document.getElementById('post-modal');

    postModal.addEventListener('click', function(event) {
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
                createComment(inputContent.value);
                clearInput(inputContent);
            } else if (action === 'likePost') {
                bus.emit('postModal:#togglePostLike', postID);
            } else if (action === 'likeComment') {
                bus.emit('postModal:#toggleCommentLike', commentID);
            }
        }
    });
}

function closePostModal(postModal) {
    postModal.style.display = 'none';
    setPostModalActive(false);
}

function createComment(content) {
    if (!content) return;

    const currentPost = getCurrentPost();
    if (!currentPost) {
        return;
    }

    const tempID = crypto.randomUUID();
    const comment = {
        comment_id: tempID,
        profile_id: getCurrentProfileID(),
        attribution: getCurrentProfileName(),
        content: content,
        likes: 0
    }
    commentManager.addPostComment(comment);
    bus.emit('postModal:createComment', currentPost);
}

// HELPERS //
function clearInput(inputContent) {
    inputContent.value = '';
}