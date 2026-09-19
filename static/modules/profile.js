import * as bus from './eventBus.js';
import { setCurrentAccountBio } from './managers/profileManager.js';

let isEditingBio = false;

export function init() {
    handleProfileEvents();
}

function handleProfileEvents() {
    const profileCard = document.getElementById('profile-card');
    const textareaBio = document.getElementById('textarea-bio');

    document.addEventListener('click', function(event) {
        const actionElement = event.target.closest('[data-action]');

        event.preventDefault();
        event.stopPropagation();
        if (actionElement) {
            const action = actionElement.dataset.action;
            switch (action) {
                case 'editBio':
                    editBio(textareaBio);
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
    setCurrentAccountBio(bio);
}