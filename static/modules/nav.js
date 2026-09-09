import { changePage } from './helpers/pageManager.js';

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
