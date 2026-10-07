import * as bus from '../eventBus.js';
import * as events from '../events.js';

export function init() {
    bus.on(events.POST_CREATE_PENDING, renderPostCreatePending);
    bus.on(events.POST_CREATE_ERROR, renderPostCreateError);
}

function renderPostCreatePending() {
    const button = document.getElementById('post-button');
    const error = document.getElementById('post-creator-error');

    error.classList.add('hidden');
    error.textContent = '';

    button.disabled = true;
    button.innerHTML = '<span class="text-xl text-fg-inverse icon-[svg-spinners--12-dots-scale-rotate]"></span>';
}

function renderPostCreateError(errorMessage) {
    const button = document.getElementById('post-button');
    const error = document.getElementById('post-creator-error');

    error.textContent = errorMessage;
    error.classList.remove('hidden');

    button.disabled = false;
    button.textContent = 'Post';
}
