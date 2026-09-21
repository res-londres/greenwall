// INIT //
export function init() {
    handlePostCreatorEvents();
}

// EVENT HANDLER //
function handlePostCreatorEvents() {
    const textareaSubject = document.getElementById('post-creator-modal-textarea-subject');
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
                    openPostCreatorModal();
                    textareaSubject.focus();
                }
            }
        });
    });
}

function openPostCreatorModal() {
    const postCreatorModal = document.getElementById('post-creator-modal');
    postCreatorModal.style.display = 'flex';
}

// HELPERS //
export function setPostButtonState(subjectLength, postButton) {
    postButton.disabled = subjectLength < 1;
}