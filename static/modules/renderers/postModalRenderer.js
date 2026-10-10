import * as bus from '../eventBus.js';
import * as events from '../events.js';
import * as postManager from '../managers/postManager.js';
import * as commentManager from '../managers/commentManager.js';
import * as listDom from '../views/listDom.js';
import { isPostLiked } from '../managers/likeManager.js';
import { createLikeIcon } from '../views/shared.js';
import {
    createCommentHTML,
    createPostModalHTML,
    createEmptyCommentsHTML,
    createFetchingCommentsHTML,
} from '../views/postModalView.js';

export function init() {
    bus.on(events.POST_MODAL_OPENED, renderFullPostModal);
    bus.on(events.POST_LIKED, renderPostModalLikeState);
    bus.on(events.COMMENTS_LOADED, renderFullPostModal);
    bus.on(events.COMMENTS_APPENDED, renderPostComments);
    bus.on(events.COMMENT_LIKED, renderPostComments);
    bus.on(events.COMMENT_CREATED, renderFullPostModal);
}

function renderPostComments() {
    if (!postManager.isPostModalActive()) return;
    const postModalCommentsList = document.getElementById('post-modal-comment-list');
    if (!postModalCommentsList) return;

    const postID = postManager.getCurrentPostID();
    const postComments = commentManager.getCommentsList(postID);
    const meta = commentManager.getCommentsPagination(postID);

    if (postComments.length === 0) {
        listDom.setItems(postModalCommentsList, []);
        listDom.showPlaceholder(postModalCommentsList, meta.isInitialFetching
            ? createFetchingCommentsHTML()
            : createEmptyCommentsHTML());
        listDom.refreshState(postModalCommentsList, false);
        return;
    }

    listDom.setItems(postModalCommentsList, postComments.map(function(comment) {
        return createCommentHTML(comment, postID, {
            isLiked: false,
            likeCount: 0,
        });
    }));
    listDom.refreshState(postModalCommentsList, meta.hasMoreMine || meta.hasMoreOther);
}

function renderFullPostModal() {
    if (!postManager.isPostModalActive()) return;
    const postModalContent = document.getElementById('post-modal-content');
    const post = postManager.getCurrentPost();

    if (!post) {
        return;
    }

    postModalContent.innerHTML = createPostModalHTML(post);
    renderPostComments();
}

function renderPostModalLikeState() {
    if (!postManager.isPostModalActive()) return;
    const post = postManager.getCurrentPost();
    if (!post) return;

    const likeButton = document.querySelector('#post-modal-content [data-action="likePost"]');
    if (!likeButton) return;

    const [iconContainer, likeCount] = likeButton.children;
    if (!iconContainer || !likeCount) return;

    iconContainer.innerHTML = createLikeIcon(isPostLiked(post.post_id));
    likeCount.textContent = String(post.likes);
}
