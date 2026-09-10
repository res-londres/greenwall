export function changePage(pageName) {
    hideAllPages();
    showTargetPage(pageName);
    updateSelectedNav(pageName);
}

function hideAllPages() {
    document.querySelectorAll('.page').forEach(function(page) {
        page.style.display = 'none';
    });
}

function showTargetPage(pageName) {
    const targetPage = document.querySelector(`.page[data-pagename="${pageName}"]`);
    targetPage.style.display = 'block';
}

function updateSelectedNav(pageName) {
    const nav = document.getElementById('page-navigator');
    nav.querySelectorAll('a').forEach(function(page) {
        page.classList.remove('selected');
    });
    nav.querySelector(`a[data-pagename="${pageName}"]`).classList.add('selected');
}