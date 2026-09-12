import { socket } from './socket.js';
import { setPostButtonState } from './postCreator.js';
import * as postManager from './managers/postManager.js';

export function init() {
    handlePostCreatorModalEvents();
}

function handlePostCreatorModalEvents() {
    const postCreatorModal = document.getElementById('post-creator-modal');
    const textareaSubject = document.getElementById('post-creator-modal-textarea-subject');
    const textareaContent = document.getElementById('post-creator-modal-textarea-content');
    const postButton = document.getElementById('post-button');

    // POST CREATOR MODAL : click events //
    postCreatorModal.addEventListener('click', function(event) {
        const actionElement = event.target.closest('[data-action]');
        if (actionElement) {
            const action = actionElement.dataset.action;
            if (action === 'closePostCreatorModal') {
                closePostCreatorModal(postCreatorModal);
            } else if (action === 'createPost') {
                createPost(textareaSubject.value, textareaContent.value);
                closePostCreatorModal(postCreatorModal);
                clearTextareas(textareaSubject, textareaContent);
            }
        }
    });

    // POST CREATOR MODAL : input events //
    document.querySelectorAll('.textarea').forEach(function(textarea) {
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

function createPost(subject, content) {
    if (!subject) return;
    const tempID = crypto.randomUUID();
    // how about post id? temp id?
    const post = {
        post_id: tempID,
        attribution: 'user',
        subject: subject,
        content: content
    }
    postManager.addPost(post);
    // TODO: include user id and display name  when available
    socket.emit('create_post', post);
}

// HELPERS //
function clearTextareas(textareaSubject, textareaContent) {
    textareaSubject.value = '';
    textareaContent.value = '';
    textareaSubject.style.height = 'auto';
    textareaContent.style.height = 'auto';
}