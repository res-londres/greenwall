import * as bus from './eventBus.js';
import * as profileManager from './managers/profileManager.js';

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
                case 'logOut':
                    /* soon */
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
    profileManager.setCurrentProfileBio(bio);
}

function changeProfile(changeProfileID) {
    profileManager.setCurrentProfileID(changeProfileID);
    profileManager.setViewingProfileID(changeProfileID);
    bus.emit('profile:changeProfile');
}

function openAccountSettingsModal() {
    const settingsModal = document.getElementById('settings-modal');
    settingsModal.style.display = 'flex';
    bus.emit('profile:openAccountSettingsModal');
}

function openProfileSettingsModal() {
    const settingsModal = document.getElementById('settings-modal');
    settingsModal.style.display = 'flex';
    bus.emit('profile:openProfileSettingsModal');
}

function closeSettingsModal() {
    const settingsModal = document.getElementById('settings-modal');
    settingsModal.style.display = 'none';
}