import { getPostCommentsCount } from './managers/commentManager.js';
import { isCommentLiked, isPostLiked } from './managers/likeManager.js';

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

export function createPostHTML(post) {
    const postID = post.post_id;
    const postAttribution = post.attribution;
    const postSubject = escapeHTML(post.subject);
    const postContentPreview = escapeHTML(post.content.length > 500 ? post.content.slice(0, 497) + '...' : post.content);
    const postTime = 'just now'; // TEMP
    const postLikeCount = post.likes;   
    const commentCount = getPostCommentsCount(postID);

    const isLiked = isPostLiked(postID);
    const likeIcon = isLiked ? '<span class="text-2xl text-accent icon-[ant-design--heart-filled]"></span>' : '<span class="text-2xl icon-[ant-design--heart-outlined]"></span>'

    return `
        <div
            id="${postID}"
            class="bg-white text-primary border-2 border-solid border-primary rounded-2xl my-2 px-6 py-[1rem_0.5rem]"
            data-action="openPostModal"
        >
            <div class="items-center flex justify-between mb-2">
                <span class="text-[0.95rem] font-bold">${postAttribution}</span>
                <span class="text-gray-500 text-[0.75rem]">${postTime}</span>
            </div>
            <div class="font-bold leading-6 mb-3 wrap-break-word">${postSubject}</div>
            <div class="text-[0.95rem] leading-6 mb-3 wrap-break-word">${postContentPreview}</div>
            <div class="items-center border-t border-solid border-muted flex gap-6 pt-2">
                <button class="post-action" data-action="likePost" data-postid="${postID}">
                    <span>
                        ${likeIcon}
                    </span>
                    <span>${postLikeCount}</span>
                </button>
                <button class="post-action" data-action="openPostModal" data-postid="${postID}">
                    <span>
                        <span class="text-2xl icon-[ant-design--comment-outlined]"></span>
                    </span>
                    <span>${commentCount}</span>
                </button>
            </div>
        </div>
    `;
}

export function createPostModalHTML(post) {
    const postID = post.post_id;
    const postAttribution = post.attribution;
    const postSubject = escapeHTML(post.subject);
    const postContent = escapeHTML(post.content);
    const postTime = 'just now'; // TEMP
    const postLikeCount = post.likes;   
    const commentCount = getPostCommentsCount(postID);

    const isLiked = isPostLiked(postID);
    const likeIcon = isLiked ? '<span class="text-2xl text-accent icon-[ant-design--heart-filled]"></span>' : '<span class="text-2xl icon-[ant-design--heart-outlined]"></span>'

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

// TODO: user postManager.getCurrentPostID, get rid of the param
export function createCommentHTML(comment, postID) {
    const commentID = comment.comment_id;
    const commentAttribution = comment.attribution;
    const commentContent = escapeHTML(comment.content);
    const commentTime = 'just now'  // TEMP
    const commentLikeCount = comment.likes;   // TEMP

    const isLiked = isCommentLiked(commentID);
    const likeIcon = isLiked ? '<span class="text-accent icon-[ant-design--heart-filled]"></span>' : '<span class="icon-[ant-design--heart-outlined]"></span>'

    return `
        <div 
            class="text-primary border-t border-solid border-muted flex flex-row gap-2 py-2 items-start"
            data-postid="${postID}" 
            data-commentid="${commentID}"
        >
            <div class="flex flex-1 flex-col min-w-0">
                <div class="flex gap-2 items-center">
                    <span class="font-bold whitespace-nowrap">${commentAttribution}</span>
                    <span class="text-gray-500 text-[0.9rem]">${commentTime}</span>
                </div>
                <div class="wrap-anywhere">${commentContent}</div>
            </div>
            <button 
                class="mt-2 shrink-0 self-start flex flex-col items-center gap-0.5 bg-none border-none rounded-sm text-gray-500 cursor-pointer text-[0.85rem] transition-all duration-300 origin-top hover:text-accent hover:scale-110 active:scale-100" 
                data-action="likeComment" 
                data-postid="${postID}" 
                data-commentid="${commentID}"
            >
                ${likeIcon}
                <span>${commentLikeCount}</span>
            </button>
        </div>
    `;
}

export function createUserAccountOptionHTML(account) {
    const accountID = account.account_id;
    const displayName = account.display_name;
    return `
        <div 
            class="hover-dropdown-item" 
            data-accountid="${accountID}" 
            data-action="changeAccount"
        >
            <span class="text-gray-500 icon-[boxicons--user]"></span>
            <span>${displayName}</span>
        </div>
    `;
}

export function createLogOutAccountOptionHTML() {
    return `
        <div 
            class="hover-dropdown-item border-t border-t-muted text-danger" data-action="logOut"
        >
            <span class="icon-[akar-icons--sign-out]"></span>
            <span>Log Out</span>
        </div>
    `;
}

// HELPERS //
function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}