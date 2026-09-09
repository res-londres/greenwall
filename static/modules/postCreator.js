document.addEventListener('click', function(event) {
    const actionElement = event.target.closest('[data-action');
    if (actionElement) {
        const action = actionElement.dataset.action;
        if (action === 'openPostCreatorModal') {
            openPostCreatorModal();
        } else if (action == 'closePostCreatorModal') {
            closePostCreatorModal();
        }
    }
});

function openPostCreatorModal() {
    document.getElementById('post-creator-modal').style.display = 'flex';
}

function closePostCreatorModal() {
    document.getElementById('post-creator-modal').style.display = 'none';
}