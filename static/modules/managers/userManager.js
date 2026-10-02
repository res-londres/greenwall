// user account = the private account
// user profile = the public profile

const userAccount = {
    account_id: null,
    account_name: null,
}

const profiles = {
    user: {},
    other: {}
}

let currentProfileID = null;
let viewingProfileID = null;   // ID of the account we're currently viewing; default is currentAccountID, never null (make sure of that)

export function getUserAccount() {
    return structuredClone(userAccount);
}

export function getUserProfiles() {
    return structuredClone(profiles.user);
}

export function getCurrentProfile() {
    return structuredClone(profiles.user[currentProfileID]);
}

export function getViewingProfile() {
    if (viewingProfileID in profiles.user) {
        return structuredClone(profiles.user[viewingProfileID]);
    }
    return structuredClone(profiles.other[viewingProfileID]);
}

export function setCurrentProfileID(newProfileID) {
    currentProfileID = newProfileID;
}

export function getCurrentProfileID() {
    return currentProfileID;
}

export function setViewingProfileID(newViewingProfileID) {
    viewingProfileID = newViewingProfileID;
}

export function getViewingProfileID() {
    return viewingProfileID;
}

export function setCurrentProfileBio(newBio) {
    profiles.user[currentProfileID].bio = newBio;
    // send to database via bus
}

export function getCurrentProfileName() {
    return profiles.user[currentProfileID].profile_name;
}

export function addUserProfile(profile) {
    profiles.user[profile.profile_id] = profile;
}

export function addOtherProfile(profile) {
    profiles.other[profile.profile_id] = profile;
}

export function setupNewSignup(accountID, accountName, newProfiles) {
    userAccount.account_id = accountID;
    userAccount.account_name = accountName;
    Object.values(newProfiles).forEach((profile) => {
        profiles.user[profile.profile_id] = profile;
    });
    currentProfileID = newProfiles[0].profile_id;
    viewingProfileID = newProfiles[0].profile_id;
}