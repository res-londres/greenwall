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
    setCurrentAccountBio(bio);
}