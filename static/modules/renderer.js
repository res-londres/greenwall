import * as bus from './eventBus.js';
import * as postManager from './managers/postManager.js';
import * as commentManager from './managers/commentManager.js';
import { isCommentLiked, isPostLiked } from './managers/likeManager.js';
import { getCurrentWall } from './managers/wallManager.js';
import { getCurrentProfileID, getViewingProfile, getUserProfiles } from './managers/userManager.js';
import { createEmptyWallHTML, createPostHTML } from './views/wallView.js';
import { createCommentHTML, createPostModalHTML } from './views/postModalView.js';
import { createLogOutProfileOptionHTML, createProfileSettingsModalHTML, createUserProfileOptionHTML } from './views/profileView.js';
import { createAccountSettingsModalHTML } from './views/settingsView.js';

// INIT //
export function init() {
    bus.on('auth:awaitAuthResponse', renderAuthLoadingState);
    bus.on('auth:goToLogin', renderLoginScreen);
    bus.on('auth:goToSignup', renderSignupScreen);
    bus.on('auth:login', renderProfile);
    bus.on('auth:logout', renderLoginScreen);
    bus.on('auth:receiveAuthResponseError', renderAuthResponseError);
    bus.on('like:toggleCommentLike', renderPostComments);
    bus.on('like:togglePostLike', renderUpdateTargetPost);
    bus.on('like:togglePostLike', renderPostModal);
    bus.on('pageNavigator:navigate', renderPosts);
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
    if (!post || !post.post_id) {
        return;
    }

    const oldPostRender = document.getElementById(post.post_id);
    if (!oldPostRender) {
        return;
    }

    const fragment = createPostHTML(post, {
        isLiked: isPostLiked(post.post_id),
        likeCount: post.likes,
        commentCount: commentManager.getPostCommentsCount(post.post_id),
    });
    const newPost = fragment.firstElementChild;
    oldPostRender.replaceWith(newPost);
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
        currentWall.innerHTML = createEmptyWallHTML();
        return;
    }
    currentWall.replaceChildren();
    globalPosts.forEach(function(post) {
        const fragment = createPostHTML(post, {
            isLiked: isPostLiked(post.post_id),
            likeCount: post.likes,
            commentCount: commentManager.getPostCommentsCount(post.post_id),
        });
        currentWall.appendChild(fragment);
    });
}

function renderPostsByAccount(profileID = null, currentWall = null) {
    profileID = profileID === null ? getCurrentProfileID() : profileID;
    currentWall = currentWall === null ? getCurrentWall() : currentWall;
    const postsByUser = postManager.getPostsByProfileList(profileID);
    if (postsByUser.length === 0) {
        currentWall.innerHTML = createEmptyWallHTML();
        return;
    }
    currentWall.replaceChildren();
    postsByUser.forEach(function(post) {
        const fragment = createPostHTML(post, {
            isLiked: isPostLiked(post.post_id),
            likeCount: post.likes,
            commentCount: commentManager.getPostCommentsCount(post.post_id),
        });
        currentWall.appendChild(fragment);
    });
}

function renderPostComments() {
    const postModalCommentsList = document.getElementById('post-modal-comment-list');
    const postComments = commentManager.getPostCommentsList();
    postModalCommentsList.replaceChildren();
    postComments.forEach(function(comment) {
        const fragment = createCommentHTML(comment, postManager.getCurrentPostID(), {
            isLiked: isCommentLiked(comment.comment_id),
            likeCount: comment.likes,
        });
        postModalCommentsList.appendChild(fragment);
    });
}

function renderPostModal() {
    const postModalContent = document.getElementById('post-modal-content');
    const post = postManager.getCurrentPost();

    if (!post) {
        return;
    }

    postModalContent.innerHTML = createPostModalHTML(post);
    renderPostComments();
}

function renderUserProfilesSelection() {
    const userProfiles = getUserProfiles();
    const changeProfileContent = document.getElementById('hover-dropdown-content-profile-change');
    let html = '';
    Object.values(userProfiles).forEach(function(profile) {
        if (!(profile.profile_id === getCurrentProfileID())) {
            html += createUserProfileOptionHTML(profile);
        }
    });
    html += createLogOutProfileOptionHTML();
    changeProfileContent.innerHTML = html;
}

function renderProfile() {
    const currentProfile = getViewingProfile(); 
    if (!currentProfile) return;
    const {profile_id: profileID, profile_name: profileName, bio} = currentProfile;
    
    document.getElementById('display-profileid').textContent = profileID;
    document.querySelectorAll('.current-profile-name').forEach(function(element) {
        element.textContent = profileName;
    });
    renderBio(document.getElementById('textarea-bio'), bio);
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('main-screen').style.display = 'grid';
    document.getElementById('profile-wall').dataset.profileid = profileID;
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
    settingsModal.innerHTML = createAccountSettingsModalHTML();
}

function renderProfileSettingsModal() {
    const settingsModal = document.getElementById('settings-modal-content');
    settingsModal.innerHTML = createProfileSettingsModalHTML();
}

function renderLoginScreen() {
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