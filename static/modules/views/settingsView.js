// TODO: decouple from managers (view-model pattern)
import { getUserProfiles } from '../managers/profileManager.js';
import { createUserProfileCardHTML } from './profileView.js';

export function createAccountSettingsModalHTML() {
    const userProfiles = Object.values(getUserProfiles());
    const profileCards = userProfiles.map(createUserProfileCardHTML).join('');
    const createProfileButton = userProfiles.length < 3 ? `
        <button class="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted p-3 text-gray-500 transition-all duration-300 hover:border-primary hover:text-primary" data-action="createProfile">
            <span class="icon-[carbon--add]"></span>
            <span>Create new profile</span>
        </button>
    ` : '';

    return `
        <div class="border-b-2 border-muted">
            <p class="text-[150%] font-bold">User settings</p>
        </div>
        <div class="border-b-2 border-muted py-4 text-gray-500">
            <h2 class="text-xl font-bold text-primary mb-3">User</h2>
            <div class="flex content-center gap-2">
                <button class="simple-button">
                    <span class="icon-[ant-design--eye-invisible-outlined] text-2xl"></span>
                </button>
                <span>[USERNAME HIDDEN]</span>
            </div>
            <div class="flex content-center gap-2">
                <button class="simple-button">
                    <span class="icon-[ant-design--eye-invisible-outlined] text-2xl"></span>
                </button>
                <span>[USER ID HIDDEN]</span>
            </div>
        </div>
        <section class="py-4">
            <h2 class="mb-3 text-xl font-bold">Manage profiles</h2>
            <div class="flex flex-col gap-3">
                ${profileCards}
            </div>
            ${createProfileButton}
        </section>
        <section class="border-t-2 border-muted pt-4 pb-8">
            <h2 class="mb-3 text-xl font-bold">Danger Zone</h2>
            <button class="flex items-center gap-2 text-danger active:scale-100 transition-all duration-300 hover:scale-110">
                <span class="icon-[ant-design--delete-outlined] text-2xl"></span>
                <span>Delete user</span>
            </button>
        </section>
    `;
}
