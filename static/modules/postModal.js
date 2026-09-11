export function init() {
    handlePostModalEvents();
}

function handlePostModalEvents() {
    const postModal = document.getElementById('post-modal');

    postModal.addEventListener('click', function(event) {
        const actionElement = event.target.closest('[data-action]');
        if (actionElement) {
            const action = actionElement.dataset.action;
            if (action === 'closePostModal') {
                closePostModal(postModal);
            } 
        }
    });
}

function closePostModal(postModal) {
    postModal.style.display = 'none';
}