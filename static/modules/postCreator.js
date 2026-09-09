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

    // POST CREATOR MODAL //
    postCreatorModal.addEventListener('click', function(event) {
        const actionElement = event.target.closest('[data-action]');
        if (actionElement) {
            const action = actionElement.dataset.action;
            if (action === 'closePostCreatorModal') {
                closePostCreatorModal(postCreatorModal);
            }
        }
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