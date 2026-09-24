import * as bus from './eventBus.js';
import * as HTMLCreator from './HTMLCreator.js';
import * as postManager from './managers/postManager.js';
import * as commentManager from './managers/commentManager.js';
import { getCurrentWall } from './managers/wallManager.js';
import { getCurrentProfileID, getViewingProfile, getUserProfiles } from './managers/profileManager.js';

// INIT //
export function init() {
    renderProfile();
    bus.on('auth:#renderLoginScreen', renderLoginScreen);
    bus.on('auth:#renderSignupScreen', renderSignupScreen);
    bus.on('like:toggleCommentLike', renderPostComments);
    bus.on('like:togglePostLike', renderUpdateTargetPost);
    bus.on('like:togglePostLike:#renderPostModal', renderPostModal);
    bus.on('pageNavigator:#renderPosts', renderPosts);
    bus.on('post:openPostModal', renderPostModal);
    // TODO: adding post shouldnt render all posts, only insert the new post on top
    bus.on('postManager:addPost', renderPosts);
    bus.on('postManager:addPostComment', renderPostComments);
    bus.on('postModal:createComment', renderPostModal);
    bus.on('postModal:createComment', renderUpdateTargetPost);
    bus.on('profile:changeProfile', renderProfile);
    bus.on('profile:openProfileSettingsModal', renderProfileSettingsModal);
    bus.on('profile:openAccountSettingsModal', renderAccountSettingsModal);
}

function renderUpdateTargetPost(post) {
    const oldPostRender = document.getElementById(post.post_id);
    oldPostRender.outerHTML = HTMLCreator.createPostHTML(post);
}

function renderPosts() {
    const currentWall = getCurrentWall();
    const currentWallProfileID = currentWall.dataset.profileid;
    if (currentWallProfileID === 'null') {
        renderGlobalPosts(currentWall);
    } else if (currentWallProfileID === 'user') {
        renderPostsByAccount(null, currentWall);
    } else {
        // for when we open another account profile
    }
}

function renderGlobalPosts(currentWall = null) {
    // TODO: render global posts latest on top, when u get to postTime
    currentWall = currentWall === null ? getCurrentWall() : currentWall;
    const globalPosts = postManager.getGlobalPostsList();
    if (globalPosts.length === 0) {
        currentWall.innerHTML = HTMLCreator.createEmptyWallHTML();
        return;
    }
    currentWall.innerHTML = '';
    let html = '';

    globalPosts.forEach(function(post) {
        html += HTMLCreator.createPostHTML(post);
    });
    currentWall.innerHTML += html;
}

function renderPostsByAccount(profileID = null, currentWall = null) {
    profileID = profileID === null ? getCurrentProfileID() : profileID;
    currentWall = currentWall === null ? getCurrentWall() : currentWall;
    const postsByUser = postManager.getPostsByProfileList(profileID);
    if (postsByUser.length === 0) {
        currentWall.innerHTML = HTMLCreator.createEmptyWallHTML();
        return;
    }
    currentWall.innerHTML = '';
    let html = '';

    postsByUser.forEach(function(post) {
        html += HTMLCreator.createPostHTML(post);
    });
    currentWall.innerHTML += html;
}

function renderPostComments() {
    const postModalCommentsList = document.getElementById('post-modal-comment-list');
    const postComments = commentManager.getPostCommentsList();
    // empty comments html
    postModalCommentsList.innerHTML = '';
    let html = '';

    postComments.forEach(function(comment) {
        html += HTMLCreator.createCommentHTML(comment, postManager.getCurrentPostID());
    });
    postModalCommentsList.innerHTML += html;
}

function renderPostModal() {
    const postModalContent = document.getElementById('post-modal-content');
    const post = postManager.getCurrentPost();
    postModalContent.innerHTML = HTMLCreator.createPostModalHTML(post);
    renderPostComments();
}

function renderUserProfilesSelection() {
    const userProfiles = getUserProfiles();
    const changeProfileContent = document.getElementById('hover-dropdown-content-profile-change');
    let html = '';
    Object.values(userProfiles).forEach(function(profile) {
        if (!(profile.profile_id === getCurrentProfileID())) {
            html += HTMLCreator.createUserProfileOptionHTML(profile);
        }
    });
    html += HTMLCreator.createLogOutProfileOptionHTML();
    changeProfileContent.innerHTML = html;
}

function renderProfile() {
    const currentProfile = getViewingProfile(); 
    const {profile_id: profileID, profile_name: profileName, bio} = currentProfile;
    
    document.getElementById('display-profileid').textContent = profileID;
    document.querySelectorAll('.current-profile-name').forEach(function(element) {
        element.textContent = profileName;
    });
    renderBio(document.getElementById('textarea-bio'), bio);
    renderPosts();
    renderUserProfilesSelection();
}

function renderBio(textareaBio, bio) {
    if (bio === '') {
        textareaBio.classList.add('hidden');
        textareaBio.value = '';
    } else {
        textareaBio.classList.remove('hidden');
        textareaBio.value = bio;
    }
    textareaBio.style.height = 'auto';
    textareaBio.style.height = textareaBio.scrollHeight + 'px';
}

function renderAccountSettingsModal() {
    const settingsModal = document.getElementById('settings-modal-content');
    settingsModal.innerHTML = HTMLCreator.createAccountSettingsModalHTML();
}

function renderProfileSettingsModal() {
    const settingsModal = document.getElementById('settings-modal-content');
    settingsModal.innerHTML = HTMLCreator.createProfileSettingsModalHTML();
}

function renderLoginScreen() {
    document.getElementById('auth-welcome-text').textContent = 'welcome back!';
    document.getElementById('auth-right-title').textContent = 'Log in to Greenwall';
    document.getElementById('auth-username-input').dataset.action = 'enterLoginUsername';
    document.getElementById('auth-password-input').dataset.action = 'enterLoginPassword';
    const authButton = document.getElementById('auth-button');
    authButton.dataset.action = 'login';
    authButton.textContent = 'Log in';
    document.getElementById('auth-goto-text').textContent = 'Don\'t have an account? ';
    const authGoToLink = document.getElementById('auth-goto-link');
    authGoToLink.dataset.action = 'goToSignup';
    authGoToLink.textContent = 'Sign up';
}

function renderSignupScreen() {
    document.getElementById('auth-welcome-text').textContent = 'welcome!';
    document.getElementById('auth-right-title').textContent = 'Sign up to Greenwall';
    document.getElementById('auth-username-input').dataset.action = 'enterSignupUsername';
    document.getElementById('auth-password-input').dataset.action = 'enterSignupPassword';
    const authButton = document.getElementById('auth-button');
    authButton.dataset.action = 'signup';
    authButton.textContent = 'Sign up';
    document.getElementById('auth-goto-text').textContent = 'Already have an account? ';
    const authGoToLink = document.getElementById('auth-goto-link');
    authGoToLink.dataset.action = 'goToLogin';
    authGoToLink.textContent = 'Log in';
}