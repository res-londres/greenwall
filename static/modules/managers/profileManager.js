// user account = the private account
// user profile = the public profile

const userAccount = {
    account_id: 'babou#12345',
    account_name: 'babou'
}

const profiles = {
    user: {
        'foo#12345': {
            profile_id: 'foo#12345',
            profile_name: 'foo',
            bio: ''
        },
        'tang#12345': {
            profile_id: 'tang#12345',
            profile_name: 'tang',
            bio: ''
        },
        'inamo#12345': {
            profile_id: 'inamo#12345',
            profile_name: 'inamo',
            bio: ''
        }
    },
    other: {}
}

let currentProfileID = profiles.user["foo#12345"].profile_id;
let viewingProfileID = currentProfileID;   // ID of the account we're currently viewing; default is currentAccountID, never null (make sure of that)

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