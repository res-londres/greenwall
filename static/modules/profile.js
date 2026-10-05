import * as bus from './eventBus.js';
import * as events from './events.js';
import * as userManager from './managers/userManager.js';
import { changePage } from './managers/pageManager.js';
import { changeWall } from './managers/wallManager.js';

let isEditingBio = false;

export function init() {
    handleProfileEvents();
}

function handleProfileEvents() {
    const textareaBio = document.getElementById('textarea-bio');

    document.addEventListener('click', async function(event) {
        const actionElement = event.target.closest('[data-action]');

        if (actionElement) {
            event.preventDefault();
            event.stopPropagation();
            const action = actionElement.dataset.action;
            switch (action) {
                case 'editBio':
                    editBio(textareaBio);
                    break;
                case 'changeProfile': 
                    const changeProfileID = actionElement.dataset.profileid;
                    changeProfile(changeProfileID);
                    break;
                case 'logout':
                    await logout();
                    break;
                case 'copyProfileID':
                    await navigator.clipboard.writeText(document.getElementById('display-profileid').textContent);
                    break;
                case 'openAccountSettingsModal':
                    openAccountSettingsModal();
                    break;
                case 'openProfileSettingsModal':
                    openProfileSettingsModal();
                    break;
                case 'closeSettingsModal':
                    closeSettingsModal();
                    break;
                case 'createProfile':
                    showCreateProfileForm();
                    break;
                case 'confirmCreateProfile':
                    await submitCreateProfile();
                    break;
                case 'cancelCreateProfile':
                    hideCreateProfileForm();
                    break;
            }
        }
        else {
            stopEditBio(textareaBio);
        }
    })
    textareaBio.addEventListener('input', function() {
        const pos = this.selectionStart;
        if (this.value[pos - 1] === '\n' && this.value[pos - 2] === '\n') {
            this.value = this.value.slice(0, pos - 1) + this.value.slice(pos);
            this.selectionStart = this.selectionEnd = pos - 1;
        } else if (pos === 1 && this.value[0] === '\n') {
            this.value = this.value.slice(1);
            this.selectionStart = this.selectionEnd = 0;
        }

        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });
    document.addEventListener('input', function(event) {
        if (event.target.id !== 'create-profile-input') return;
        const confirm = document.getElementById('create-profile-confirm');
        confirm.disabled = event.target.value.trim().length === 0;
    });
}

function editBio(textareaBio) {
    isEditingBio = true;
    textareaBio.classList.remove('hidden');
    textareaBio.style.height = 'auto';
    textareaBio.style.height = textareaBio.scrollHeight + 'px';
    textareaBio.focus();
}

function stopEditBio(textareaBio) {
    if (!isEditingBio) return;
    isEditingBio = false;
    const bio = textareaBio.value.trim();
    if (bio === '') {
        textareaBio.classList.add('hidden');
        textareaBio.value = '';
    }
    textareaBio.style.height = 'auto';
    textareaBio.style.height = textareaBio.scrollHeight + 'px';
    userManager.setCurrentProfileBio(bio);
}

async function changeProfile(changeProfileID) {
    userManager.setCurrentProfileID(changeProfileID);
    userManager.setViewingProfileID(changeProfileID);
    bus.emit(events.PROFILE_SWITCHED);

    const response = await fetch('/api/set_active_profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_id: changeProfileID })
    });
    const body = await response.json();
    if (!body.ok) {
        throw new Error(body.error);
    }
}

function showCreateProfileForm() {
    document.querySelector('[data-action="createProfile"]').classList.add('hidden');
    const form = document.getElementById('create-profile-form');
    form.classList.remove('hidden');
    form.classList.add('flex');

    const input = document.getElementById('create-profile-input');
    input.value = '';
    input.disabled = false;
    input.focus();

    document.getElementById('create-profile-error').classList.add('hidden');
    document.getElementById('create-profile-confirm').disabled = true;
}

function hideCreateProfileForm() {
    document.querySelector('[data-action="createProfile"]').classList.remove('hidden');
    const form = document.getElementById('create-profile-form');
    form.classList.add('hidden');
    form.classList.remove('flex');

    document.getElementById('create-profile-input').value = '';
    document.getElementById('create-profile-error').classList.add('hidden');
}

async function submitCreateProfile() {
    const input = document.getElementById('create-profile-input');
    const profileName = input.value.trim();
    if (!profileName) return;

    bus.emit(events.PROFILE_CREATE_PENDING);

    let body;
    try {
        const response = await fetch('/api/create_profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profile_name: profileName })
        });
        body = await response.json();
    } catch {
        bus.emit(events.PROFILE_CREATE_ERROR, 'Network error. Please try again.');
        return;
    }

    if (!body.ok) {
        bus.emit(events.PROFILE_CREATE_ERROR, body.error);
        return;
    }

    const newProfile = body.data.profile;
    userManager.addAndSwitchToProfile(newProfile);
    closeSettingsModal();

    changePage('user-profile');
    changeWall('user-profile');
    bus.emit(events.PROFILE_SWITCHED);
}

function openAccountSettingsModal() {
    const settingsModal = document.getElementById('settings-modal');
    settingsModal.style.display = 'flex';
    bus.emit(events.SETTINGS_ACCOUNT_OPENED);
}

function openProfileSettingsModal() {
    const settingsModal = document.getElementById('settings-modal');
    settingsModal.style.display = 'flex';
    bus.emit(events.SETTINGS_PROFILE_OPENED);
}

function closeSettingsModal() {
    const settingsModal = document.getElementById('settings-modal');
    settingsModal.style.display = 'none';
}


async function logout() {
    const response = await fetch('/api/logout', {
        method: 'POST'
    });
    const body = await response.json();
    if (!body.ok) {
        throw new Error(body.error);
    }
    userManager.logout();
    bus.emit(events.AUTH_LOGGED_OUT);
}