import * as bus from './eventBus.js';
import * as HTMLCreator from './HTMLCreator.js';
import * as postManager from './managers/postManager.js';
import * as commentManager from './managers/commentManager.js';
import { getCurrentWall } from './managers/wallManager.js';
import { getCurrentAccountID, getCurrentUserAccount, getUserPublicAccounts } from './managers/profileManager.js';

// INIT //
export function init() {
    renderProfile();
    bus.on('postManager:addPost', renderPosts);
    bus.on('postManager:addPostComment', renderPostComments);
    bus.on('post:openPostModal', renderPostModal);
    bus.on('post:openPostModal', renderPostComments);
    bus.on('like:togglePostLike', renderPosts);
    bus.on('like:togglePostLike:#renderPostModal', renderPostModal);
    bus.on('like:togglePostLike:#renderPostModal', renderPostComments);
    bus.on('like:toggleCommentLike', renderPostComments);
    bus.on('pageNavigator:#renderPosts', renderPosts);
    bus.on('profile:changeAccount', renderProfile);
}

function renderPosts() {
    const currentWall = getCurrentWall();
    const currentWallAccountID = currentWall.dataset.accountid;
    if (currentWallAccountID === 'null') {
        renderGlobalPosts(currentWall);
    } else if (currentWallAccountID === 'user') {
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

function renderPostsByAccount(accountID = null, currentWall = null) {
    accountID = accountID === null ? getCurrentAccountID() : accountID;
    currentWall = currentWall === null ? getCurrentWall() : currentWall;
    const postsByUser = postManager.getPostsByAccountList(accountID);
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
        html += HTMLCreator.createCommentHTML(comment, postManager.getCurrentPostID);
    });
    postModalCommentsList.innerHTML += html;
}

function renderPostModal() {
    const postModalContent = document.getElementById('post-modal-content');
    const post = postManager.getCurrentPost();
    postModalContent.innerHTML = HTMLCreator.createPostModalHTML(post);
}

function renderUserAccountsSelection() {
    const userAccounts = getUserPublicAccounts();
    const changeAccountContent = document.getElementById('hover-dropdown-content-account-change');
    let html = '';
    Object.values(userAccounts).forEach(function(account) {
        if (!(account.account_id === getCurrentAccountID())) {
            html += HTMLCreator.createUserAccountOptionHTML(account);
        }
    });
    html += HTMLCreator.createLogOutAccountOptionHTML();
    changeAccountContent.innerHTML = html;
}

function renderProfile() {
    const currentAccount = getCurrentUserAccount();
    Object.values(currentAccount).forEach(function(s) {
        console.log(s);
    });
    
    document.getElementById('display-account-id').textContent = currentAccount.account_id;
    document.getElementById('display-name').textContent = currentAccount.display_name;
    renderBio(document.getElementById('textarea-bio'), currentAccount.bio);
    renderPosts();
    renderUserAccountsSelection();
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