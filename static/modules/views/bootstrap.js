import { renderAuthScreen, renderLoadingScreen, renderMainScreen, renderPostCreatorModal, renderPostModal, renderSettingsModal } from './shellView.js';

export function bootstrapViews() {
    const loadingScreenMount = document.getElementById('loading-screen-mount');
    const authScreenMount = document.getElementById('auth-screen-mount');
    const mainScreenMount = document.getElementById('main-screen-mount');
    const postCreatorModalMount = document.getElementById('post-creator-modal-mount');
    const postModalMount = document.getElementById('post-modal-mount');
    const settingsModalMount = document.getElementById('settings-modal-mount');

    if (loadingScreenMount) loadingScreenMount.innerHTML = renderLoadingScreen();
    if (authScreenMount) authScreenMount.innerHTML = renderAuthScreen();
    if (mainScreenMount) mainScreenMount.innerHTML = renderMainScreen();
    if (postCreatorModalMount) postCreatorModalMount.innerHTML = renderPostCreatorModal();
    if (postModalMount) postModalMount.innerHTML = renderPostModal();
    if (settingsModalMount) settingsModalMount.innerHTML = renderSettingsModal();
}
