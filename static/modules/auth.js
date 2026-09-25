import * as bus from './eventBus.js';

export function init() {
    handleAuthEvents();
}

function handleAuthEvents() {
    const authScreen = document.getElementById('auth-screen');
    const authButton = document.getElementById('auth-button');
    const inputAccountName = document.getElementById('auth-account-name-input');
    const inputPassword = document.getElementById('auth-password-input');
    const inputPasswordRetype = document.getElementById('auth-password-retype');
    const inputProfileName = document.getElementById('auth-profile-name-input');

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

    authScreen.addEventListener('input', function() {
        const authActive = authScreen.dataset.authactive;
        const inputLengths = [
            inputAccountName.value.length, 
            inputPassword.value.length,
            inputPasswordRetype.value.length,
            inputProfileName.value.length
        ]
        setAuthButtonState(inputLengths, authActive, authButton);
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

function setAuthButtonState(inputLengths, authActive, authButton) {
    let isDisabled = false;
    for (let i = 0; i < inputLengths.length; i++) {
        if (i > 1 && authActive == 'login') break;
        if (inputLengths[i] == 0) {
            isDisabled = true;
            break;
        }
    }
    authButton.disabled = isDisabled;
}
