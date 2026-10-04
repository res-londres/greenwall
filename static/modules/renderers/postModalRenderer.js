import * as bus from '../eventBus.js';
import * as events from '../events.js';
import * as postManager from '../managers/postManager.js';
import * as commentManager from '../managers/commentManager.js';
import { isCommentLiked } from '../managers/likeManager.js';
import { createCommentHTML, createPostModalHTML } from '../views/postModalView.js';

export function init() {
    bus.on(events.POST_MODAL_OPENED, renderPostModal);
    bus.on(events.POST_LIKED, renderPostModal);
    bus.on(events.COMMENT_LIKED, renderPostComments);
    bus.on(events.COMMENT_CREATED, renderPostModal);
}

function renderPostComments() {
    if (!postManager.isPostModalActive()) return;
    const postModalCommentsList = document.getElementById('post-modal-comment-list');
    const postComments = commentManager.getPostCommentsList();
    postModalCommentsList.replaceChildren();
    postComments.forEach(function(comment) {
        const fragment = createCommentHTML(comment, postManager.getCurrentPostID(), {
            isLiked: isCommentLiked(comment.comment_id),
            likeCount: comment.likes,
        });
        postModalCommentsList.appendChild(fragment);
    });
}

function renderPostModal() {
    if (!postManager.isPostModalActive()) return;
    const postModalContent = document.getElementById('post-modal-content');
    const post = postManager.getCurrentPost();

    if (!post) {
        return;
    }

    postModalContent.innerHTML = createPostModalHTML(post);
    renderPostComments();
}
