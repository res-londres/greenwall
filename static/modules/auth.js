import * as bus from './eventBus.js';

export function init() {
    handleAuthEvents();
}

function handleAuthEvents() {
    const authScreen = document.getElementById('auth-screen');

    authScreen.addEventListener('click', function(event) {
        const actionElement = event.target.closest('[data-action]');

        if (actionElement) {
            const action = actionElement.dataset.action;

            switch (action) {
                case 'goToLogin':
                    goToLogin();
                    break;
                case 'goToSignup':
                    goToSignup();
                    break;
            }
        }
    });
}

function goToLogin() {
    bus.emit('auth:#renderLoginScreen');
}

function goToSignup() {
    bus.emit('auth:#renderSignupScreen');
}