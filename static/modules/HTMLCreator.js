export function createEmptyWallHTML() {
    return `
        <div class="text-[0.95rem] py-8 text-center">
            <div class>
                <i class="hgi hgi-stroke hgi-rounded hgi-leaf-01"></i>
            </div>
            <p>No posts yet..</p>
        </div>
    `;
}

export function createPostHTML(post) {
    const postAttribution = post.attribution;
    const postSubject = escapeHTML(post.subject);
    const postContentPreview = escapeHTML(post.content.length > 500 ? post.content.slice(0, 497) + '...' : post.content);
    const postTime = 'just now'; // TEMP
    const postLikeCount = '0';   // TEMP
    const commentCount = '0';

    return `
        <div
            class="bg-white text-primary border-2 border-solid border-primary rounded-2xl my-2 p-[1rem_1.5rem]"
        >
            <div class="items-center flex justify-between mb-2">
                <span class="text-[0.95rem] font-bold">${postAttribution}</span>
                <span class="text-gray-500 text-[0.75rem]">${postTime}</span>
            </div>
            <div class="font-bold leading-6 mb-3 wrap-break-word">${postSubject}</div>
            <div class="text-[0.95rem] leading-6 mb-3 wrap-break-word">${postContentPreview}</div>
            <div class="items-center border-t border-solid border-muted flex gap-6 pt-2">
                <button class="post-action" data-action="likePost">
                    <span class="">
                        <i class="mt-1 hgi hgi-stroke hgi-rounded hgi-heart"></i>
                    </span>
                    <span class="">${postLikeCount}</span>
                </button>
                <button class="post-action" data-action="openPostModal">
                    <span class="">
                        <i class="mt-1 hgi hgi-stroke hgi-rounded hgi-comment-03"></i>
                    </span>
                    <span class="">${commentCount}</span>
                </button>
            </div>
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