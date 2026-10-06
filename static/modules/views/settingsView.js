// TODO: decouple from managers (view-model pattern)
import { getUserProfiles, getUserAccount } from '../managers/userManager.js';
import { createUserProfileCardHTML } from './profileView.js';
import { escapeHTML } from './shared.js';

export function createAccountSettingsModalHTML() {
    const userProfiles = Object.values(getUserProfiles());
    const profileCards = userProfiles.map(createUserProfileCardHTML).join('');
    const createProfileButton = userProfiles.length < 3 ? `
        <button class="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-divider p-3 text-fg-muted transition-all duration-300 hover:border-line-default hover:text-fg-default" data-action="createProfile">
            <span class="icon-[carbon--add]"></span>
            <span>Create new profile</span>
        </button>
    ` : '';

    return `
        <div class="flex items-center justify-between border-b-2 border-divider pb-2">
            <p class="text-[150%] font-bold">User settings</p>
            <button class="modal-close" data-action="closeSettingsModal">
                <span class="icon-[material-symbols--close] text-xl"></span>
            </button>
        </div>
        <div class="border-b-2 border-divider py-4 text-fg-muted">
            <h2 class="text-xl font-bold text-fg-default mb-3">User</h2>
            <div class="flex content-center gap-2">
                <button class="simple-button">
                    <span class="icon-[ant-design--eye-invisible-outlined] text-2xl"></span>
                </button>
                <span>[ACCOUNT NAME HIDDEN]</span>
            </div>
            <div class="flex content-center gap-2">
                <button class="simple-button">
                    <span class="icon-[ant-design--eye-invisible-outlined] text-2xl"></span>
                </button>
                <span>[ACCOUNT ID HIDDEN]</span>
            </div>
        </div>
        <section class="py-4">
            <h2 class="mb-3 text-xl font-bold">Manage profiles</h2>
            <div class="flex flex-col gap-3">
                ${profileCards}
            </div>
            ${createProfileButton}
            <div id="create-profile-form" class="mt-3 hidden flex-col gap-2">
                <input
                    type="text"
                    id="create-profile-input"
                    class="w-full rounded-xl border-2 border-solid border-divider bg-surface-card px-4 py-2 text-fg-default placeholder-fg-muted focus:outline-none focus:border-line-default disabled:opacity-60 disabled:cursor-not-allowed"
                    placeholder="New profile name"
                    maxlength="19"
                >
                <p id="create-profile-error" class="text-fg-danger text-sm hidden"></p>
                <div class="flex gap-2">
                    <button
                        id="create-profile-confirm"
                        class="flex-1 rounded-xl bg-button-default p-2 font-bold transition-all duration-300 enabled:hover:bg-button-hovered enabled:active:scale-95 disabled:cursor-not-allowed disabled:bg-button-disabled disabled:opacity-50"
                        disabled
                        data-action="confirmCreateProfile"
                    >Create</button>
                    <button
                        class="flex-1 rounded-xl border-2 border-solid border-divider bg-surface-card p-2 font-bold text-fg-muted transition-all duration-300 hover:border-line-default hover:text-fg-default active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        data-action="cancelCreateProfile"
                    >Cancel</button>
                </div>
            </div>
        </section>
        <section class="border-t-2 border-divider pt-4 pb-8">
            <h2 class="mb-3 text-xl font-bold">Danger Zone</h2>
            <button class="flex items-center gap-2 text-fg-danger active:scale-100 transition-all duration-300 hover:scale-105" data-action="deleteAccount">
                <span class="icon-[ant-design--delete-outlined] text-2xl"></span>
                <span>Delete user</span>
            </button>
        </section>
    `;
}

export function createDeleteAccountConfirmHTML() {
    const { account_name: accountName } = getUserAccount();

    return `
        <div class="flex items-center justify-between border-b-2 border-divider pb-2">
            <p class="text-[150%] font-bold text-fg-danger">Delete account?</p>
        </div>
        <div class="py-4">
            <p class="mb-3 font-bold">You are about to delete "${escapeHTML(accountName)}".</p>
            <ul class="list-disc pl-5 text-sm text-fg-muted flex flex-col gap-1">
                <li>All your profiles will be marked as deleted.</li>
                <li>Your posts will remain visible, but your name will show as [deleted].</li>
                <li>You will be logged out and cannot log back in.</li>
                <li>This cannot be undone.</li>
            </ul>
        </div>
        <p id="delete-confirm-error" class="text-fg-danger text-sm mb-3 hidden"></p>
        <div class="flex gap-2 pb-4">
            <button id="delete-confirm-button"
                class="flex-1 rounded-xl bg-button-danger p-2 font-bold text-fg-inverse transition-all duration-300 enabled:hover:opacity-90 enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                data-action="confirmDeleteAccount"
            >Delete account</button>
            <button id="delete-cancel-button"
                class="flex-1 rounded-xl border-2 border-solid border-divider bg-surface-card p-2 font-bold text-fg-muted transition-all duration-300 hover:border-line-default hover:text-fg-default enabled:active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                data-action="cancelDelete"
                data-origin="account"
            >Cancel</button>
        </div>
    `;
}
