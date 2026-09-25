import { getPostCommentsCount } from '../managers/commentManager.js';
import { isPostLiked } from '../managers/likeManager.js';
import { createLikeIcon } from './shared.js';

export function createEmptyWallHTML() {
    return `
        <div class="text-[0.95rem] py-8 text-center">
            <div class>
                <span class="text-2xl icon-[meteor-icons--leaf]"></span>
            </div>
            <p>No posts yet..</p>
        </div>
    `;
}

export function createPostHTML(post, view = {}) {
    const template = document.getElementById('tpl-post-card');
    const fragment = template.content.cloneNode(true);
    const root = fragment.firstElementChild;
    root.dataset.postid = String(post.post_id);

    const resolvedView = {
        isLiked: view.isLiked ?? isPostLiked(post.post_id),
        likeCount: view.likeCount ?? post.likes,
        commentCount: view.commentCount ?? getPostCommentsCount(post.post_id),
    };

    root.id = post.post_id;
    root.dataset.postid = String(post.post_id);
    root.querySelectorAll('[data-postid]').forEach((element) => {
        element.dataset.postid = String(post.post_id);
    });

    const slots = {
        attribution: root.querySelector('[data-slot="attribution"]'),
        time: root.querySelector('[data-slot="time"]'),
        subject: root.querySelector('[data-slot="subject"]'),
        contentPreview: root.querySelector('[data-slot="content-preview"]'),
        likeIcon: root.querySelector('[data-slot="like-icon"]'),
        likeCount: root.querySelector('[data-slot="like-count"]'),
        commentCount: root.querySelector('[data-slot="comment-count"]'),
    };

    slots.attribution.textContent = post.attribution;
    slots.time.textContent = 'just now';
    slots.subject.textContent = post.subject;
    slots.contentPreview.textContent = post.content.length > 500 ? post.content.slice(0, 497) + '...' : post.content;
    slots.likeIcon.innerHTML = createLikeIcon(resolvedView.isLiked);
    slots.likeCount.textContent = String(resolvedView.likeCount);
    slots.commentCount.textContent = String(resolvedView.commentCount);

    return fragment;
}
