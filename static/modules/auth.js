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

            event.stopPropagation();
            event.preventDefault();
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

let isSwapping = false;

function swapAuthScreen(renderFn) {
    const card = document.getElementById('auth-card');
    if (!card) return;

    if (isSwapping) return;
    isSwapping = true;

    card.classList.add('auth-card-fading');

    card.addEventListener('transitionend', function onOut(event) {
        if (event.propertyName !== 'opacity') return;
        card.removeEventListener('transitionend', onOut);

        renderFn(); 

        card.classList.remove('auth-card-fading');
        card.classList.add('auth-card-animating');

        card.addEventListener('animationend', function onIn() {
            card.removeEventListener('animationend', onIn);
            card.classList.remove('auth-card-animating');
            isSwapping = false; 
        });
    });
}

function goToLogin() {
    swapAuthScreen(() => bus.emit('auth:#renderLoginScreen'));
}

function goToSignup() {
    swapAuthScreen(() => bus.emit('auth:#renderSignupScreen'));
}