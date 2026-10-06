import * as bus from '../eventBus.js';
import * as events from '../events.js';
import { createProfileSettingsModalHTML, createDeleteProfileConfirmHTML } from '../views/profileView.js';
import { createAccountSettingsModalHTML, createDeleteAccountConfirmHTML } from '../views/settingsView.js';

export function init() {
    bus.on(events.SETTINGS_ACCOUNT_OPENED, renderAccountSettingsModal);
    bus.on(events.SETTINGS_PROFILE_OPENED, renderProfileSettingsModal);
    bus.on(events.PROFILE_CREATE_PENDING, renderProfileCreatePending);
    bus.on(events.PROFILE_CREATE_ERROR, renderProfileCreateError);
    bus.on(events.PROFILE_DELETE_REQUESTED, renderDeleteProfileConfirm);
    bus.on(events.ACCOUNT_DELETE_REQUESTED, renderDeleteAccountConfirm);
    bus.on(events.PROFILE_DELETE_PENDING, renderDeletePending);
    bus.on(events.ACCOUNT_DELETE_PENDING, renderDeletePending);
    bus.on(events.PROFILE_DELETE_ERROR, renderDeleteError);
    bus.on(events.ACCOUNT_DELETE_ERROR, renderDeleteError);
}

function renderAccountSettingsModal() {
    const settingsModal = document.getElementById('settings-modal-content');
    settingsModal.innerHTML = createAccountSettingsModalHTML();
}

function renderProfileSettingsModal() {
    const settingsModal = document.getElementById('settings-modal-content');
    settingsModal.innerHTML = createProfileSettingsModalHTML();
}

function renderProfileCreatePending() {
    const input = document.getElementById('create-profile-input');
    const confirm = document.getElementById('create-profile-confirm');
    const cancel = document.querySelector('[data-action="cancelCreateProfile"]');
    const error = document.getElementById('create-profile-error');

    error.classList.add('hidden');
    error.textContent = '';

    input.disabled = true;
    cancel.disabled = true;
    confirm.disabled = true;
    confirm.innerHTML = '<span class="text-xl text-fg-inverse icon-[svg-spinners--12-dots-scale-rotate]"></span>';
}

function renderProfileCreateError(errorMessage) {
    const input = document.getElementById('create-profile-input');
    const confirm = document.getElementById('create-profile-confirm');
    const cancel = document.querySelector('[data-action="cancelCreateProfile"]');
    const error = document.getElementById('create-profile-error');

    error.textContent = errorMessage;
    error.classList.remove('hidden');

    input.disabled = false;
    cancel.disabled = false;
    confirm.innerHTML = 'Create';
    confirm.disabled = input.value.trim().length === 0;
}

function renderDeleteProfileConfirm() {
    const settingsModal = document.getElementById('settings-modal-content');
    settingsModal.innerHTML = createDeleteProfileConfirmHTML();
}

function renderDeleteAccountConfirm() {
    const settingsModal = document.getElementById('settings-modal-content');
    settingsModal.innerHTML = createDeleteAccountConfirmHTML();
}

function renderDeletePending() {
    const confirm = document.getElementById('delete-confirm-button');
    const cancel = document.getElementById('delete-cancel-button');
    const error = document.getElementById('delete-confirm-error');

    if (!confirm || !cancel || !error) return;

    error.classList.add('hidden');
    error.textContent = '';

    cancel.disabled = true;
    confirm.disabled = true;
    confirm.innerHTML = '<span class="text-xl text-fg-inverse icon-[svg-spinners--12-dots-scale-rotate]"></span>';
}

function renderDeleteError(errorMessage) {
    const confirm = document.getElementById('delete-confirm-button');
    const cancel = document.getElementById('delete-cancel-button');
    const error = document.getElementById('delete-confirm-error');

    if (!confirm || !cancel || !error) return;

    error.textContent = errorMessage;
    error.classList.remove('hidden');

    cancel.disabled = false;
    confirm.disabled = false;
    confirm.textContent = confirm.dataset.action === 'confirmDeleteProfile' ? 'Delete profile' : 'Delete account';
}
