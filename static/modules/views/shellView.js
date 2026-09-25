export function renderLoadingScreen() {
    return `
        <div id="loading-screen" class="flex min-h-dvh items-center justify-center bg-surface p-8">
            <span class="icon-[svg-spinners--pulse-rings-multiple] text-9xl text-accent"></span>
        </div>
    `;
}

export function renderMainScreen() {
    return `
        <main id="main-screen" class="grid h-dvh grid-cols-[20%_1fr_20%] grid-rows-[3rem_1fr] overflow-hidden bg-surface">
            <section class="sticky top-0 col-span-full h-12 border-b-2 border-solid border-b-primary bg-accent">
                <h1 class="ml-6 font-heading text-white">greenwall</h1>
            </section>
            <section class="h-[calc(100dvh - 3rem)] sticky top-12 overflow-x-hidden overflow-y-auto">
                <nav id="page-navigator" class="mt-8 flex flex-col select-none">
                    <a href="#" data-pagename="user-profile" data-action="navigate">
                        <span class="icon-[boxicons--user-circle] text-4xl"></span>
                        <span class="mt-1.5">Your Profile</span>
                    </a>
                    <a class="selected" href="#" data-pagename="home-wall" data-action="navigate">
                        <span class="icon-[akar-icons--home] text-4xl"></span>
                        <span class="mt-2">Home Wall</span>
                    </a>
                </nav>
            </section>
            <section class="scrollbar-custom h-[calc(100dvh - 3rem)] mt-8 overflow-y-auto">
                <div class="page hidden" data-pagename="user-profile" data-wallid="profile-wall">
                    <div id="profile-card" class="mx-auto mb-2 rounded-2xl border-2 border-solid border-primary bg-white px-[1.25rem_2rem] py-4">
                        <div class="flex items-start gap-4">
                            <div class="bg-light/10 flex aspect-square h-24 w-24 shrink-0 items-center justify-center rounded-full">
                                <span class="icon-[boxicons--user-circle] text-8xl"></span>
                            </div>
                            <div class="flex min-h-24 flex-col justify-center gap-1">
                                <h2 class="current-profile-name text-2xl font-bold"></h2>
                                <div class="flex items-center gap-1 text-sm text-gray-500">
                                    <button class="simple-button" data-action="copyProfileID">
                                        <span class="icon-[basil--copy-outline] text-2xl"></span>
                                    </button>
                                    <span id="display-profileid" class="mr-3"></span>
                                </div>
                            </div>
                        </div>
                        <textarea id="textarea-bio" class="textarea pointer-events-none mt-4 hidden w-full resize-none overflow-hidden leading-relaxed outline-0" rows="1" maxlength="160"></textarea>
                        <div class="mt-4 flex items-center justify-between border-t-2 border-muted pt-4 text-gray-500">
                            <div class="flex items-center gap-6">
                                <div class="hover-dropdown">
                                    <button class="simple-button">
                                        <span class="icon-[flowbite--user-edit-outline] text-2xl"></span>
                                    </button>
                                    <div class="hover-dropdown-content">
                                        <div class="hover-dropdown-item" data-action="editBio">
                                            <span class="icon-[lets-icons--edit-alt] text-gray-500"></span>
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
                                            <span class="icon-[hugeicons--user-settings-02] text-gray-500"></span>
                                            <span>Account Settings</span>
                                        </div>
                                        <div class="hover-dropdown-item" data-action="openProfileSettingsModal">
                                            <span class="icon-[hugeicons--user-settings-02] text-gray-500"></span>
                                            <span>Profile Settings</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <span>0 posts</span>
                        </div>
                    </div>
                    <div class="post-creator flex flex-row items-center gap-2 rounded-2xl border-2 border-solid border-primary bg-white px-[1.25rem_2rem] py-4">
                        <span class="mt-1.5 icon-[hugeicons--quill-write-02] text-4xl"></span>
                        <span class="w-full rounded-4xl bg-muted p-[0.75rem_1rem] transition-all duration-300 select-none hover:bg-muted-hovered" data-action="openPostCreatorModal">Create post</span>
                    </div>
                    <div id="profile-wall" data-profileid="user"></div>
                </div>
                <div class="page" data-pagename="home-wall" data-wallid="home-wall">
                    <div class="post-creator align-center flex flex-row gap-2 rounded-2xl border-2 border-solid border-primary bg-white px-[1.25rem_2rem] py-4">
                        <span class="mt-1.5 icon-[hugeicons--quill-write-02] text-4xl"></span>
                        <span class="w-full rounded-4xl bg-muted p-[0.75rem_1rem] transition-all duration-300 select-none hover:bg-muted-hovered" data-action="openPostCreatorModal">Create post</span>
                    </div>
                    <div id="home-wall" data-profileid="null"></div>
                </div>
                <div class="page hidden" data-pagename="search">search</div>
            </section>
            <section></section>
        </main>
    `;
}

export function renderPostModal() {
    return `
        <div id="post-modal" class="scrollbar-custom modal-screen">
            <div class="modal-blur-overlay" data-action="closePostModal"></div>
            <div class="modal-card">
                <div id="post-modal-content"></div>
            </div>
        </div>
    `;
}

export function renderSettingsModal() {
    return `
        <div id="settings-modal" class="scrollbar-custom modal-screen">
            <div class="modal-blur-overlay" data-action="closeSettingsModal"></div>
            <div class="modal-card">
                <div id="settings-modal-content"></div>
            </div>
        </div>
    `;
}
