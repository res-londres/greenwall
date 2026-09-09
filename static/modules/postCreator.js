function handlePostCreatorEvents() {
    const postCreatorModal = document.getElementById('post-creator-modal');

    // POST CREATOR //
    document.querySelectorAll('.post-creator').forEach(function(postCreator) {
        postCreator.addEventListener('click', function(event) {
            const actionElement = event.target.closest('[data-action');
            if (actionElement) {
                const action = actionElement.dataset.action;
                if (action === 'openPostCreatorModal') {
                    openPostCreatorModal(postCreatorModal);
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
            }
        }
    });

    // POST CREATOR MODAL : input events //
    document.querySelectorAll('.textarea').forEach(function(textarea) {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';

            if (this.id === 'textarea-subject') {
                const postButton = document.getElementById('post-button');
                postButton.disabled = this.value.length < 1;
            }
        });
    });

    // POST CREATOR MODAL : keydown events //
    const textareaSubject = document.getElementById('textarea-subject');
    const textareaContent = document.getElementById('textarea-content');
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


function openPostCreatorModal(postCreatorModal) {
    postCreatorModal.style.display = 'flex';
}

function closePostCreatorModal(postCreatorModal) {
    postCreatorModal.style.display = 'none';
}

// INIT //
handlePostCreatorEvents();