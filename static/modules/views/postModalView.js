// TODO: decouple from managers (view-model pattern)
import { getPostCommentsCount } from '../managers/commentManager.js';
import { isCommentLiked, isPostLiked } from '../managers/likeManager.js';
import { createLikeIcon, escapeHTML } from './shared.js';

// Returns an HTML string. Uses innerHTML at the call site.
// TODO: convert to a <template> clone like createCommentHTML.
export function createPostModalHTML(post) {
    const postID = post.post_id;
    const postAttribution = escapeHTML(post.attribution);
    const postSubject = escapeHTML(post.subject);
    const postContent = escapeHTML(post.content);
    const postTime = 'just now';
    const postLikeCount = post.likes;
    const commentCount = getPostCommentsCount(postID);
    const isLiked = isPostLiked(postID);
    const likeIcon = createLikeIcon(isLiked);

    return `
        <div class="bg-white text-primary border-b-2 border-solid border-muted mb-4 pb-2">
            <div class="items-center flex justify-between mb-2">
                <span class="font-bold">${postAttribution}</span>
                <span class="text-gray-500 text-[0.8rem]">${postTime}</span>
            </div>
            <div class="font-bold leading-6 mb-3 wrap-break-word">${postSubject}</div>
            <div class="text-[0.95rem] leading-6 mb-3 wrap-break-word">${postContent}</div>
            <div class="border-t border-solid border-muted flex gap-6 mt-3 pt-3">
                <button class="post-action" data-action="likePost" data-postid="${postID}">
                    <span>
                        ${likeIcon}
                    </span>
                    <span>${postLikeCount}</span>
                </button>
                <button class="post-action" data-action="closePostModal">
                    <span>
                        <span class="text-2xl icon-[ant-design--comment-outlined]"></span>
                    </span>
                    <span>${commentCount}</span>
                </button>
            </div>
        </div>

        <div class="text-primary">
            <div class="font-bold mb-3">Comments (${commentCount})</div>
            <div id="post-modal-comment-list" class="flex flex-col">
                <!-- commentsHTML goes here -->
            </div>
            <div class="bg-white border-t border-solid border-muted flex gap-2 py-4 sticky bottom-0 z-30">
                <input
                    type="text"
                    id="post-modal-input-comment"
                    class="bg-muted border-2 border-solid border-muted rounded-4xl flex-1 font-[inherit] p-[0.5rem_0.75rem] focus:outline-none text-[0.9rem]"
                    placeholder="Write a comment.."
                    maxlength="1000"
                >
                <button id="comment-button" class="post-action" data-action="createComment" data-postid="${postID}">
                    <span class="text-2xl icon-[griddy-icons--send]"></span>
                </button>
            </div>
        </div>
    `;
}

// Returns a DocumentFragment cloned from #tpl-comment.
export function createCommentHTML(comment, postID, view = {}) {
    const template = document.getElementById('tpl-comment');
    const fragment = template.content.cloneNode(true);
    const root = fragment.firstElementChild;

    const resolvedView = {
        isLiked: view.isLiked ?? isCommentLiked(comment.comment_id),
        likeCount: view.likeCount ?? comment.likes,
    };

    root.dataset.postid = String(postID);
    root.dataset.commentid = String(comment.comment_id);
    root.querySelector('[data-action="likeComment"]').dataset.postid = String(postID);
    root.querySelector('[data-action="likeComment"]').dataset.commentid = String(comment.comment_id);

    const slots = {
        attribution: root.querySelector('[data-slot="attribution"]'),
        time: root.querySelector('[data-slot="time"]'),
        content: root.querySelector('[data-slot="content"]'),
        likeIcon: root.querySelector('[data-slot="like-icon"]'),
        likeCount: root.querySelector('[data-slot="like-count"]'),
    };

    slots.attribution.textContent = comment.attribution;
    slots.time.textContent = 'just now';
    slots.content.textContent = comment.content;
    slots.likeIcon.innerHTML = createLikeIcon(resolvedView.isLiked, '');
    slots.likeCount.textContent = String(resolvedView.likeCount);

    return fragment;
}
