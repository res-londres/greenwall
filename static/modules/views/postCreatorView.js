// TODO: create post creator modal markup in future refactor

export function renderPostCreatorModal() {
    return `
        <div id="post-creator-modal" class="scrollbar-custom modal-screen">
            <div class="modal-blur-overlay" data-action="closePostCreatorModal"></div>
            <div class="modal-card">
                <div class="border-b-2 border-muted">
                    <p class="text-[150%] font-bold">Create post</p>
                </div>
                <div class="mt-4 flex flex-row gap-2">
                    <span class="icon-[boxicons--user] text-2xl"></span>
                    <span class="current-profile-name font-bold"></span>
                </div>
                <div class="mt-2">
                    <textarea id="post-creator-modal-textarea-subject" class="textarea min-h-5 w-full resize-none overflow-hidden text-[150%] font-bold outline-0" placeholder="Enter subject" rows="1" maxlength="150"></textarea>
                    <textarea id="post-creator-modal-textarea-content" class="textarea w-full resize-none overflow-hidden outline-0" placeholder="Enter content" rows="3" maxlength="2000"></textarea>
                </div>
                <div class="sticky bottom-0 border-t-2 border-muted bg-white pb-4">
                    <button id="post-button" class="mt-4 w-full rounded-4xl bg-accent p-1 font-bold transition-all duration-300 enabled:hover:bg-accent-hovered enabled:hover:text-muted enabled:active:scale-95 disabled:cursor-not-allowed disabled:bg-muted" disabled data-action="createPost">Post</button>
                </div>
            </div>
        </div>
    `;
}
