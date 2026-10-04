import * as bus from '../eventBus.js';
import * as events from '../events.js';
import { createProfileSettingsModalHTML } from '../views/profileView.js';
import { createAccountSettingsModalHTML } from '../views/settingsView.js';

export function init() {
    bus.on(events.SETTINGS_ACCOUNT_OPENED, renderAccountSettingsModal);
    bus.on(events.SETTINGS_PROFILE_OPENED, renderProfileSettingsModal);
}

function renderAccountSettingsModal() {
    const settingsModal = document.getElementById('settings-modal-content');
    settingsModal.innerHTML = createAccountSettingsModalHTML();
}

function renderProfileSettingsModal() {
    const settingsModal = document.getElementById('settings-modal-content');
    settingsModal.innerHTML = createProfileSettingsModalHTML();
}
