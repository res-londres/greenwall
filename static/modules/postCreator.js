// INIT //
export function init() {
    handlePostCreatorEvents();
}

// EVENT HANDLER //
function handlePostCreatorEvents() {
    const postCreatorModal = document.getElementById('post-creator-modal');
    const textareaSubject = document.getElementById('textarea-subject');
    const postButton = document.getElementById('post-button');

    // POST CREATOR : click events //
    // TODO: make a currentPostCreator
    document.querySelectorAll('.post-creator').forEach(function(postCreator) {
        postCreator.addEventListener('click', function(event) {
            const actionElement = event.target.closest('[data-action');
            if (actionElement) {
                const action = actionElement.dataset.action;
                if (action === 'openPostCreatorModal') {
                    setPostButtonState(textareaSubject.value.length, postButton);
                    openPostCreatorModal(postCreatorModal);
                    textareaSubject.focus();
                }
            }
        });
    });
}

function openPostCreatorModal(postCreatorModal) {
    postCreatorModal.style.display = 'flex';
}

// HELPERS //
export function setPostButtonState(subjectLength, postButton) {
    postButton.disabled = subjectLength < 1;
}