import { createLoadingScreenHTML, createMainScreenHTML, createPostModalHTML, createSettingsModalHTML } from './shellView.js';
import { createAuthScreenHTML } from './authView.js';
import { createPostCreatorModalHTML } from './postCreatorView.js';

export function bootstrapViews() {
    const loadingScreenMount = document.getElementById('loading-screen-mount');
    const authScreenMount = document.getElementById('auth-screen-mount');
    const mainScreenMount = document.getElementById('main-screen-mount');
    const postCreatorModalMount = document.getElementById('post-creator-modal-mount');
    const postModalMount = document.getElementById('post-modal-mount');
    const settingsModalMount = document.getElementById('settings-modal-mount');

    if (loadingScreenMount) loadingScreenMount.innerHTML = createLoadingScreenHTML();
    if (authScreenMount) authScreenMount.innerHTML = createAuthScreenHTML();
    if (mainScreenMount) mainScreenMount.innerHTML = createMainScreenHTML();
    if (postCreatorModalMount) postCreatorModalMount.innerHTML = createPostCreatorModalHTML();
    if (postModalMount) postModalMount.innerHTML = createPostModalHTML();
    if (settingsModalMount) settingsModalMount.innerHTML = createSettingsModalHTML();
}
