import * as bus from '../eventBus.js';
import * as events from '../events.js';

export function init() {
    bus.on(events.AUTH_SHOW_LOGIN, renderLoginScreen);
    bus.on(events.AUTH_SHOW_SIGNUP, renderSignupScreen);
    bus.on(events.AUTH_PENDING, renderAuthLoadingState);
    bus.on(events.AUTH_ERROR, renderAuthResponseError);
    bus.on(events.AUTH_LOGGED_OUT, renderLoginScreen);
}

function renderLoginScreen() {
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('main-screen').style.display = 'none';
    const authScreen = document.getElementById('auth-screen');
    authScreen.style.display = 'grid';
    authScreen.dataset.authactive = 'login';
    document.getElementById('auth-welcome-text').textContent = 'welcome back!';
    document.getElementById('auth-right-title').textContent = 'Log in to Greenwall';
    document.getElementById('auth-account-name-input').dataset.action = 'enterLoginAccountName';
    document.getElementById('auth-password-input').dataset.action = 'enterLoginPassword';
    document.getElementById('auth-profile-name-input-container').hidden = true;
    document.getElementById('auth-password-retype-container').hidden = true;
    const authButton = document.getElementById('auth-button');
    authButton.dataset.action = 'login';
    authButton.textContent = 'Log in';
    document.getElementById('auth-goto-text').textContent = 'Don\'t have an account? ';
    const authGoToLink = document.getElementById('auth-goto-link');
    authGoToLink.dataset.action = 'goToSignup';
    authGoToLink.textContent = 'Sign up';
}

function renderSignupScreen() {
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('main-screen').style.display = 'none';
    const authScreen = document.getElementById('auth-screen');
    authScreen.style.display = 'grid';
    authScreen.dataset.authactive = 'signup';
    document.getElementById('auth-welcome-text').textContent = 'welcome!';
    document.getElementById('auth-right-title').textContent = 'Sign up to Greenwall';
    document.getElementById('auth-account-name-input').dataset.action = 'enterSignupAccountName';
    document.getElementById('auth-password-input').dataset.action = 'enterSignupPassword';
    document.getElementById('auth-profile-name-input-container').hidden = false;
    document.getElementById('auth-password-retype-container').hidden = false;
    const authButton = document.getElementById('auth-button');
    authButton.dataset.action = 'signup';
    authButton.textContent = 'Sign up';
    document.getElementById('auth-goto-text').textContent = 'Already have an account? ';
    const authGoToLink = document.getElementById('auth-goto-link');
    authGoToLink.dataset.action = 'goToLogin';
    authGoToLink.textContent = 'Log in';
}

function renderAuthLoadingState() {
    const authButton = document.getElementById('auth-button');
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = '';
    authButton.disabled = true;
    authButton.innerHTML = '<span class="text-2xl text-accent icon-[svg-spinners--12-dots-scale-rotate]"></span>';
}

function renderAuthResponseError(error) {
    const authButton = document.getElementById('auth-button');
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = error;
    authButton.disabled = false;
    authButton.innerHTML = authButton.dataset.action === 'login' ? 'Log in' : 'Sign up';
}
