export function createLoadingScreenHTML() {
    return `
        <div id="loading-screen" class="flex min-h-dvh items-center justify-center bg-surface-default p-8">
            <span class="icon-[svg-spinners--12-dots-scale-rotate] text-9xl text-button-default"></span>
        </div>
    `;
}

export function createMainScreenHTML() {
    return `
        <main id="main-screen" class="hidden h-dvh grid-cols-1 grid-rows-[3rem_1fr] lg:grid-cols-[20%_1fr_20%] max-lg:grid-rows-[3rem_1fr_3.5rem] overflow-hidden bg-surface-default">
            <section class="sticky top-0 col-span-full h-12 border-b-2 border-solid border-b-line-default bg-surface-emphasis">
                <h1 class="ml-6 font-heading text-fg-inverse select-none cursor-pointer" data-action="scrollToTop">greenwall</h1>
            </section>
            <section class="max-lg:hidden h-[calc(100dvh - 3rem)] sticky top-12 overflow-x-hidden overflow-y-auto">
                <nav class="page-navigator mt-8 flex flex-col select-none">
                    <a href="#" data-pagename="user-profile" data-action="navigate">
                        <span class="icon-[boxicons--user-circle] text-4xl text-icon-as-fg"></span>
                        <span class="mt-1.5">Your Profile</span>
                    </a>
                    <a class="selected" href="#" data-pagename="home-wall" data-action="navigate">
                        <span class="icon-[akar-icons--home] text-4xl text-icon-as-fg"></span>
                        <span class="mt-2">Home Wall</span>
                    </a>
                </nav>
            </section>
            <section id="scrollable-section" class="scrollbar-custom h-[calc(100dvh - 3rem)] max-lg:h-[calc(100dvh - 3rem - 3.5rem)] pt-8 max-lg:pt-0 overflow-y-auto">
                <div class="page hidden" data-pagename="user-profile" data-wallid="profile-wall">
                    <div id="profile-card" class="max-lg:border-divider mx-auto mb-2 max-lg:mb-0 rounded-2xl max-lg:rounded-none border-2 border-solid border-line-default max-lg:border-x-0 max-lg:border-t-0 bg-surface-card px-[1.25rem_2rem] py-4">
                        <div class="flex max-lg:items-center max-lg:flex-col lg:items-start lg:gap-4">
                            <div class="flex aspect-square h-24 w-24 shrink-0 items-center justify-center rounded-full">
                                <span class="icon-[boxicons--user-circle] text-8xl text-icon-as-fg"></span>
                            </div>
                            <div class="flex min-h-24 flex-col max-lg:items-center justify-center gap-1">
                                <h2 class="current-profile-name text-2xl font-bold"></h2>
                                <div class="flex items-center gap-1 text-sm text-fg-muted">
                                    <button class="simple-button" data-action="copyProfileID">
                                        <span class="icon-[basil--copy-outline] text-2xl"></span>
                                    </button>
                                    <span id="display-profileid" class="mr-3"></span>
                                </div>
                            </div>
                        </div>
                        <textarea id="textarea-bio" class="textarea pointer-events-none mt-4 hidden w-full resize-none overflow-hidden leading-relaxed outline-0" rows="1" maxlength="160"></textarea>
                        <div class="mt-4 flex items-center justify-between border-t-2 border-divider pt-4 text-fg-muted">
                            <div class="flex items-center gap-6">
                                <div class="hover-dropdown">
                                    <button class="simple-button">
                                        <span class="icon-[flowbite--user-edit-outline] text-2xl"></span>
                                    </button>
                                    <div class="hover-dropdown-content">
                                        <div class="hover-dropdown-item" data-action="editBio">
                                            <span class="icon-[lets-icons--edit-alt] text-icon-default"></span>
                                            <span>Edit Bio</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="hover-dropdown">
                                    <button class="simple-button">
                                        <span class="icon-[mdi--account-group-outline] text-2xl"></span>
                                    </button>
                                    <div id="hover-dropdown-content-profile-change" class="hover-dropdown-content">
                                    </div>
                                </div>
                                <div class="hover-dropdown">
                                    <button class="simple-button">
                                        <span class="icon-[akar-icons--gear] text-2xl"></span>
                                    </button>
                                    <div class="hover-dropdown-content">
                                        <div class="hover-dropdown-item" data-action="openAccountSettingsModal">
                                            <span class="icon-[hugeicons--user-settings-02] text-icon-default"></span>
                                            <span>Account Settings</span>
                                        </div>
                                        <div class="hover-dropdown-item" data-action="openProfileSettingsModal">
                                            <span class="icon-[hugeicons--user-settings-02] text-icon-default"></span>
                                            <span>Profile Settings</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <span>0 posts</span>
                        </div>
                    </div>
                    <div class="post-creator cursor-pointer max-lg:border-divider flex flex-row items-center gap-2 rounded-2xl max-lg:rounded-none border-2 border-solid border-line-default max-lg:border-x-0 max-lg:border-t-0 bg-surface-card px-[1.25rem_2rem] py-4">
                        <span class="mt-1.5 icon-[hugeicons--quill-write-02] text-4xl text-icon-as-fg"></span>
                        <span class="w-full rounded-4xl bg-misc-gray-default p-[0.75rem_1rem] transition-all duration-300 select-none hover:bg-misc-gray-hovered-light" data-action="openPostCreatorModal">Create post</span>
                    </div>
                    <div id="profile-wall" data-profileid="user">
                        <div data-role="scroll-sentinel" class="py-4 flex items-center justify-center">
                            <span data-role="scroll-spinner" class="text-2xl icon-[svg-spinners--12-dots-scale-rotate] opacity-0 transition-opacity duration-300"></span>
                            <div data-role="scroll-end" class="hidden text-[0.95rem] text-center">
                                <div>
                                    <span class="icon-[game-icons--tree-roots] text-2xl"></span>
                                </div>
                                <p>The End</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="page" data-pagename="home-wall" data-wallid="home-wall">
                    <div class="post-creator cursor-pointer max-lg:border-divider align-center flex flex-row gap-2 rounded-2xl max-lg:rounded-none border-2 border-solid border-line-default max-lg:border-x-0 max-lg:border-t-0 bg-surface-card px-[1.25rem_2rem] py-4">
                        <span class="mt-1.5 icon-[hugeicons--quill-write-02] text-4xl text-icon-as-fg"></span>
                        <span class="w-full rounded-4xl bg-misc-gray-default p-[0.75rem_1rem] transition-all duration-300 select-none hover:bg-misc-gray-hovered-light" data-action="openPostCreatorModal">Create post</span>
                    </div>
                    <div id="home-wall" data-profileid="null">
                        <div data-role="scroll-sentinel" class="py-4 flex items-center justify-center">
                            <span data-role="scroll-spinner" class="text-2xl icon-[svg-spinners--12-dots-scale-rotate] opacity-0 transition-opacity duration-300"></span>
                            <div data-role="scroll-end" class="hidden text-[0.95rem] text-center">
                                <div>
                                    <span class="icon-[game-icons--tree-roots] text-2xl"></span>
                                </div>
                                <p>The End</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="page hidden" data-pagename="search">search</div>
            </section>
            <section class="max-lg:hidden"></section>
            <!-- Mobile bottom nav (mobile only). Duplicates the desktop sidebar links above. Keep both in sync when adding new links. -->
            <nav class="page-navigator lg:hidden sticky bottom-0 col-span-full flex h-14 border-t-2 border-solid border-t-line-default bg-surface-card select-none">
                <a href="#" data-pagename="user-profile" data-action="navigate"
                   class="text-icon-as-fg p-0 flex-1 flex-col items-center justify-center gap-0.5">
                    <span class="icon-[boxicons--user-circle] text-3xl"></span>
                </a>
                <a class="selected text-icon-as-fg p-0 flex-1 flex-col items-center justify-center gap-0.5" href="#" data-pagename="home-wall" data-action="navigate">
                    <span class="icon-[akar-icons--home] text-3xl"></span>
                </a>
            </nav>
        </main>
    `;
}

export function createPostModalHTML() {
    return `
        <div id="post-modal" class="scrollbar-custom modal-screen">
            <div class="modal-blur-overlay" data-action="closePostModal"></div>
            <div class="modal-card">
                <div id="post-modal-content"></div>
            </div>
        </div>
    `;
}

export function createSettingsModalHTML() {
    return `
        <div id="settings-modal" class="scrollbar-custom modal-screen">
            <div class="modal-blur-overlay" data-action="closeSettingsModal"></div>
            <div class="modal-card">
                <div id="settings-modal-content"></div>
            </div>
        </div>
    `;
}
