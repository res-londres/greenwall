import { socket } from './socket.js';

function handlePostCreatorEvents() {
    const postCreatorModal = document.getElementById('post-creator-modal');
    const textareaSubject = document.getElementById('textarea-subject');
    const textareaContent = document.getElementById('textarea-content');
    const postButton = document.getElementById('post-button');

    // POST CREATOR //
    document.querySelectorAll('.post-creator').forEach(function(postCreator) {
        postCreator.addEventListener('click', function(event) {
            const actionElement = event.target.closest('[data-action');
            if (actionElement) {
                const action = actionElement.dataset.action;
                if (action === 'openPostCreatorModal') {
                    openPostCreatorModal(postCreatorModal, postButton);
                }
            }
        });
    });

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

            if (this.id === 'textarea-subject') {
                postButton.disabled = this.value.length < 1;
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

function openPostCreatorModal(postCreatorModal, postButton) {
    postCreatorModal.style.display = 'flex';
    postButton.disabled = true;
}

function closePostCreatorModal(postCreatorModal) {
    postCreatorModal.style.display = 'none';
}

function createPost(subject, content) {
    // TODO: include user id and display name  when available
    socket.emit('create_post', {
        subject: subject,
        content: content
    });
}

// HELPERS //
function clearTextareas(textareaSubject, textareaContent) {
    textareaSubject.value = '';
    textareaContent.value = '';
}

// INIT //
handlePostCreatorEvents();