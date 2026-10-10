import * as bus from '../eventBus.js';
import * as events from '../events.js';
import * as postManager from '../managers/postManager.js';
import * as commentManager from '../managers/commentManager.js';
import * as listDom from '../views/listDom.js';
import { createCommentHTML, createPostModalHTML } from '../views/postModalView.js';

export function init() {
    bus.on(events.POST_MODAL_OPENED, renderPostModal);
    bus.on(events.POST_LIKED, renderPostModal);
    bus.on(events.COMMENTS_LOADED, renderPostModal);
    bus.on(events.COMMENTS_APPENDED, renderPostComments);
    bus.on(events.COMMENT_LIKED, renderPostComments);
    bus.on(events.COMMENT_CREATED, renderPostModal);
}

function renderPostComments() {
    if (!postManager.isPostModalActive()) return;
    const postModalCommentsList = document.getElementById('post-modal-comment-list');
    if (!postModalCommentsList) return;

    const postID = postManager.getCurrentPostID();
    const postComments = commentManager.getCommentsList(postID);
    const fragments = postComments.map(function(comment) {
        return createCommentHTML(comment, postID, {
            isLiked: false,
            likeCount: 0,
        });
    });

    listDom.setItems(postModalCommentsList, fragments);
    const meta = commentManager.getCommentsPagination(postID);
    listDom.refreshState(postModalCommentsList, meta.hasMoreMine || meta.hasMoreOther);
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
