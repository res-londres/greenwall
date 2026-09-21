import * as bus from './eventBus.js';
import * as profileManager from './managers/profileManager.js';

let isEditingBio = false;

export function init() {
    handleProfileEvents();
}

function handleProfileEvents() {
    const profileCard = document.getElementById('profile-card');
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
                case 'changeAccount': 
                    const changeAccountID = actionElement.dataset.accountid;
                    changeAccount(changeAccountID);
                    break;
                case 'logOut':
                    /* soon */
                    break;
                case 'copyAccountID':
                    await navigator.clipboard.writeText(document.getElementById('display-account-id').textContent);
                    break;
                case 'openUserSettingsModal':
                    openUserSettingsModal();
                    break;
                case 'openAccountSettingsModal':
                    openAccountSettingsModal();
                    break;
                case 'closeSettingsModal':
                    closeSettingsModal();
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
}

function editBio(textareaBio) {
    isEditingBio = true;
    textareaBio.classList.remove('hidden');
    textareaBio.style.height = 'auto';
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
    profileManager.setCurrentAccountBio(bio);
}

function changeAccount(changeAccountID) {
    profileManager.setCurrentAccountID(changeAccountID);
    profileManager.setViewingAccountID(changeAccountID);
    bus.emit('profile:changeAccount');
}

function openUserSettingsModal() {
    const settingsModal = document.getElementById('settings-modal');
    settingsModal.style.display = 'flex';
    bus.emit('profile:openUserSettingsModal');
}

function openAccountSettingsModal() {
    const settingsModal = document.getElementById('settings-modal');
    settingsModal.style.display = 'flex';
    bus.emit('profile:openAccountSettingsModal');
}

function closeSettingsModal() {
    const settingsModal = document.getElementById('settings-modal');
    settingsModal.style.display = 'none';
}