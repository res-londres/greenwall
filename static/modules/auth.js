import * as bus from './eventBus.js';
import * as events from './events.js';
import * as userManager from './managers/userManager.js';

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

    authScreen.addEventListener('click', async function(event) {
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
                case 'signup':
                    const signupSuccess = await signup(
                        inputAccountName.value,
                        inputPassword.value,
                        inputProfileName.value
                    );
                    if (signupSuccess) {
                        clearAuthInputs([inputAccountName, inputPassword, inputPasswordRetype, inputProfileName]);
                    } else {
                        clearAuthInputs([inputPassword, inputPasswordRetype]);
                    }
                    break;
                case 'login':
                    const loginSuccess = await login(inputAccountName.value, inputPassword.value);
                    if (loginSuccess) {
                        clearAuthInputs([inputAccountName, inputPassword, inputPasswordRetype, inputProfileName]);
                    } else {
                        clearAuthInputs([inputPassword, inputPasswordRetype]);
                    }
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

async function signup(accountName, password, profileName) {
    bus.emit(events.AUTH_PENDING);
    const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            account_name: accountName,
            password: password,
            profile_name: profileName
        })
    });
    const body = await response.json();
    if (!body.ok) {
        bus.emit(events.AUTH_ERROR, body.error);
        return false;
    };
    const data = body.data;
    userManager.login(data.account_id, data.account_name, data.profiles);
    bus.emit(events.AUTH_LOGGED_IN);
    return true;
}

async function login(accountName, password) {
    bus.emit(events.AUTH_PENDING);
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            account_name: accountName,
            password: password
        })
    });
    const body = await response.json();
    if (!body.ok) {
        bus.emit(events.AUTH_ERROR, body.error);
        return false;
    }
    const data = body.data;
    userManager.login(data.account_id, data.account_name, data.profiles);
    bus.emit(events.AUTH_LOGGED_IN);
    return true;
}

let isSwapping = false;
function swapAuthScreen(renderFn) {
    document.getElementById('error-message').textContent = '';
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
    swapAuthScreen(() => bus.emit(events.AUTH_SHOW_LOGIN));
}

function goToSignup() {
    swapAuthScreen(() => bus.emit(events.AUTH_SHOW_SIGNUP));
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

function clearAuthInputs(authInputs) {
    authInputs.forEach(input => input.value = '');
}