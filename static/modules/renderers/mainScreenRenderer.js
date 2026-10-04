import * as bus from '../eventBus.js';
import * as events from '../events.js';
import { getCurrentProfileID, getViewingProfile, getUserProfiles } from '../managers/userManager.js';
import * as wallRenderer from './wallRenderer.js';
import { createLogOutProfileOptionHTML, createUserProfileOptionHTML } from '../views/profileView.js';

export function init() {
    bus.on(events.AUTH_LOGGED_IN, renderProfile);
    bus.on(events.PROFILE_SWITCHED, renderProfile);
}

function renderProfile() {
    const currentProfile = getViewingProfile();
    if (!currentProfile) return;
    renderProfileCard();
    renderBio();
    renderUserProfilesSelection();
    showMainScreen();
    renderProfileWallIdentity();
    wallRenderer.renderPosts();
}

function renderProfileCard() {
    const currentProfile = getViewingProfile();
    const {profile_id: profileID, profile_name: profileName} = currentProfile;
    document.getElementById('display-profileid').textContent = profileID;
    document.querySelectorAll('.current-profile-name').forEach(function(element) {
        element.textContent = profileName;
    });
}

function renderBio() {
    const currentProfile = getViewingProfile();
    const textareaBio = document.getElementById('textarea-bio');
    const bio = currentProfile.bio;
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

function showMainScreen() {
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('main-screen').style.display = 'grid';
}

function renderProfileWallIdentity() {
    const currentProfile = getViewingProfile();
    document.getElementById('profile-wall').dataset.profileid = currentProfile.profile_id;
}
