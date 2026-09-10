let currentWallID = 'home-wall'; // DEFAULT or TEMP

export function changeWall(currentPageName) {
    const currentPage = document.querySelector(`.page[data-pagename="${currentPageName}"]`);
    if (Object.hasOwn(currentPage.dataset, 'wallid')) {
        const wallID = currentPage.dataset.wallid;
        currentWallID = wallID;
    }
}

export function setCurrentWallID(newWallID) {
    currentWallID = newWallID;
}

export function getCurrentWallID() {
    return currentWallID;
}

export function getCurrentWall() {
    return document.getElementById(currentWallID);
}

