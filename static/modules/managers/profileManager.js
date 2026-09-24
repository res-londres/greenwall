// RENAME EVERYTHING
// user account = the private account
// user profile = the public profile

const userAccount = {
    account_id: 'babou#12345',
    account_name: 'babou'
}

const userProfiles = {
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
}

let currentProfileID = userProfiles["foo#12345"].profile_id;
let viewingProfileID = currentProfileID;   // ID of the account we're currently viewing; default is currentAccountID, never null (make sure of that)

export function getUserAccount() {
    return structuredClone(userAccount);
}

export function getUserProfiles() {
    return structuredClone(userProfiles);
}

export function getCurrentProfile() {
    Object.values(userProfiles[currentProfileID]).forEach(function(el) {
        console.log(el);
    });
    return structuredClone(userProfiles[currentProfileID]);
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
    userProfiles[currentProfileID].bio = newBio;
    // send to database via bus
}

export function getCurrentProfileName() {
    return userProfiles[currentProfileID].profile_name;
}

