// TODO: create post creator modal markup in future refactor

export function createPostCreatorModalHTML() {
    return `
        <div id="post-creator-modal" class="scrollbar-custom modal-screen">
            <div class="modal-blur-overlay" data-action="closePostCreatorModal"></div>
            <div class="modal-card">
                <div class="flex items-center justify-between border-b-2 border-divider pb-2">
                    <p class="text-[150%] font-bold">Create post</p>
                    <button class="modal-close" data-action="closePostCreatorModal">
                        <span class="icon-[material-symbols--close] text-xl"></span>
                    </button>
                </div>
                <div class="mt-4 flex flex-row gap-2">
                    <span class="icon-[boxicons--user] text-2xl"></span>
                    <span class="current-profile-name font-bold"></span>
                </div>
                <div class="mt-2">
                    <textarea id="post-creator-modal-textarea-subject" class="textarea min-h-5 w-full resize-none overflow-hidden text-[150%] font-bold outline-0" placeholder="Enter subject" rows="1" maxlength="150"></textarea>
                    <textarea id="post-creator-modal-textarea-content" class="textarea w-full resize-none overflow-hidden outline-0" placeholder="Enter content" rows="3" maxlength="2000"></textarea>
                </div>
                <div class="sticky bottom-0 border-t-2 border-divider bg-surface-card pb-4">
                    <button id="post-button" class="mt-4 w-full rounded-4xl bg-button-default p-1 font-bold transition-all duration-300 enabled:hover:bg-button-hovered enabled:active:scale-95 disabled:cursor-not-allowed disabled:bg-button-disabled disabled:opacity-50" disabled data-action="createPost">Post</button>
                </div>
            </div>
        </div>
    `;
}
