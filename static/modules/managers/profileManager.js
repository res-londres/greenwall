// ALIAS: publicAccount => account

const userProfile = {
    user_id: 'user_id',    
    username: 'username'   
}

const publicAccounts = {
    account_id1: {
        account_id: 'account_id1',
        display_name: 'account1'
    },
    account_id2: {
        account_id: 'account_id2',
        display_name: 'account2'
    },
    account_id3: {
        account_id: 'account_id3',
        display_name: 'account3'
    }
}

let currentAccountID = 'account_id1';
let viewingAccountID = currentAccountID;    // ID of the account we're currently viewing; default is currentAccountID, never null (make sure of that)

export function getUserProfile() {
    return structuredClone(userProfile);
}

export function getPublicAccounts() {
    return structuredClone(publicAccounts);
}

export function getCurrentAccount() {
    return structuredClone(publicAccounts[currentAccountID]);
}

export function setCurrentAccountID(newAccountID) {
    currentAccountID = newAccountID;
}

export function getCurrentAccountID() {
    return currentAccountID;
}

export function setViewingAccountID(newViewingAccountID) {
    viewingAccountID = newViewingAccountID;
}

export function getViewingAccountID() {
    return viewingAccountID;
}