// TODO: decouple from managers (view-model pattern)
import { getPostsByProfileList } from '../managers/postManager.js';
import { getCurrentProfileID, getCurrentProfileName, getUserProfiles } from '../managers/profileManager.js';
import { escapeHTML } from './shared.js';

export function createUserProfileOptionHTML(profile) {
    const profileID = profile.profile_id;
    const profileName = profile.profile_name;
    return `
        <div
            class="hover-dropdown-item"
            data-profileid="${profileID}"
            data-action="changeProfile"
        >
            <span class="text-gray-500 icon-[boxicons--user]"></span>
            <span>${profileName}</span>
        </div>
    `;
}

export function createLogOutProfileOptionHTML() {
    return `
        <div
            class="hover-dropdown-item border-t border-t-muted text-danger" data-action="logOut"
        >
            <span class="icon-[akar-icons--sign-out]"></span>
            <span>Log Out</span>
        </div>
    `;
}

export function createProfileSettingsModalHTML() {
    const profileName = getCurrentProfileName();
    const profileID = getCurrentProfileID();

    return `
        <div class="border-b-2 border-muted">
            <p class="text-[150%] font-bold">Profile settings</p>
        </div>
        <div class="flex flex-col gap-1 border-b-2 border-muted py-4">
            <h2 class="text-xl font-bold text-primary mb-3">Profile</h2>
            <div class="flex flex-row content-center gap-2">
                <span class="icon-[boxicons--user] text-2xl"></span>
                <span class="font-bold">${escapeHTML(profileName)}</span>
            </div>
            <div class="flex flex-row content-center gap-2">
                <span class="icon-[reicon--user-id] text-2xl"></span>
                <span class="text-gray-500">${escapeHTML(profileID)}</span>
            </div>
        </div>
        <section class="pt-4 pb-8">
            <h2 class="mb-3 text-xl font-bold">Danger Zone</h2>
            <button class="flex items-center gap-2 text-danger transition-all duration-300 hover:scale-110 active:scale-100">
                <span class="icon-[ant-design--delete-outlined] text-2xl"></span>
                <span>Delete profile</span>
            </button>
        </section>
    `;
}

export function createUserProfileCardHTML(profile) {
    const profileID = profile.profile_id;
    const profileName = profile.profile_name;
    const postCount = getPostsByProfileList(profileID).length;

    return `
        <div class="rounded-xl border-2 border-solid border-muted py-2 px-4">
            <div class="min-w-0 text-sm text-gray-500 flex flex-col gap-0.5">
                <div class="font-bold text-primary wrap-anywhere">${escapeHTML(profileName)}</div>
                <div class="wrap-anywhere">${escapeHTML(profileID)}</div>
                <div>${postCount} posts</div>
            </div>
        </div>
    `;
}

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
