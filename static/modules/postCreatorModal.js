import { setPostButtonState } from './postCreator.js';
import * as postManager from './managers/postManager.js';
import * as bus from './eventBus.js';
import * as events from './events.js';

export function init() {
    handlePostCreatorModalEvents();
}

function handlePostCreatorModalEvents() {
    const postCreatorModal = document.getElementById('post-creator-modal');
    const textareaSubject = document.getElementById('post-creator-modal-textarea-subject');
    const textareaContent = document.getElementById('post-creator-modal-textarea-content');
    const postButton = document.getElementById('post-button');

    // POST CREATOR MODAL : click events //
    postCreatorModal.addEventListener('click', async function(event) {
        const actionElement = event.target.closest('[data-action]');
        if (actionElement) {
            const action = actionElement.dataset.action;
            if (action === 'closePostCreatorModal') {
                closePostCreatorModal(postCreatorModal);
            } else if (action === 'createPost') {
                await submitPost(postCreatorModal, textareaSubject, textareaContent);
            }
        }
    });

    // POST CREATOR MODAL : input events //
    postCreatorModal.querySelectorAll('.textarea').forEach(function(textarea) {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';

            if (this.id === 'post-creator-modal-textarea-subject') {
                setPostButtonState(this.value.length, postButton);
            }
        });
    });

    // POST CREATOR MODAL : keydown events //
    textareaSubject.addEventListener('keydown', function(event) {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        textareaContent.focus();
    });
    textareaContent.addEventListener('keydown', function(event) {
        if (event.key !== 'Backspace') return;
        if (textareaContent.value.length > 0) return;
        event.preventDefault();
        textareaSubject.focus();
    });
}

function closePostCreatorModal(postCreatorModal) {
    postCreatorModal.style.display = 'none';
}

async function submitPost(postCreatorModal, textareaSubject, textareaContent) {
    const subject = textareaSubject.value.trim();
    const content = textareaContent.value;

    if (!subject) return;

    bus.emit(events.POST_CREATE_PENDING);

    let body;
    try {
        const response = await fetch('/api/post/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subject, content })
        });
        body = await response.json();
    } catch {
        bus.emit(events.POST_CREATE_ERROR, 'Network error. Please try again.');
        return;
    }

    if (!body.ok) {
        bus.emit(events.POST_CREATE_ERROR, body.error);
        return;
    }

    const post = body.data.post;
    postManager.addPost(post);

    closePostCreatorModal(postCreatorModal);
    clearTextareas(textareaSubject, textareaContent);
}

// HELPERS //
function clearTextareas(textareaSubject, textareaContent) {
    textareaSubject.value = '';
    textareaContent.value = '';
    textareaSubject.style.height = 'auto';
    textareaContent.style.height = 'auto';
}