import { changePage } from './pageManager.js';

function handlePageNavigatorEvents() {
    document.getElementById('page-navigator').addEventListener('click', function(event) {
        const actionElement = event.target.closest('[data-action');
        if (actionElement) {
            const action = actionElement.dataset.action;
            if (action === 'navigate') {
                const pageName = actionElement.dataset.pagename;
                changePage(pageName);
            }
        }
    });
}

// INIT //
handlePageNavigatorEvents();
