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
    document.querySelectorAll('.textarea').forEach(function(textArea) {
    textArea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });

    // POST CREATOR MODAL : keydown events //
    document.getElementById('textarea-subject').addEventListener('keydown', function(event) {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        document.getElementById('textarea-content').focus();
    });
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