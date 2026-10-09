import * as bus from './eventBus.js';
import * as events from './events.js';
import { changePage } from './managers/pageManager.js';
import { changeWall } from './managers/wallManager.js';

// INIT //
export function init() {
    handlePageNavigatorEvents();
}

// EVENT HANDLER //
function handlePageNavigatorEvents() {
    document.querySelectorAll('.page-navigator').forEach(function(nav) {
        nav.addEventListener('click', function(event) {
            const actionElement = event.target.closest('[data-action');
            if (actionElement) {
                const action = actionElement.dataset.action;
                if (action === 'navigate') {
                    const pageName = actionElement.dataset.pagename;
                    changePage(pageName);
                    changeWall(pageName);
                    bus.emit(events.NAV_CHANGED);
                }
            }
        });
    });

    // TODO: why here? cuz idk where else to place it and i dont want to make a whole new file just for it
    document.querySelector('[data-action="scrollToTop"').addEventListener('click', function() {
        document.getElementById('scrollable-section').scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
