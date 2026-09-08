document.addEventListener('click', function(event) {
    const actionElement = event.target.closest('[data-action');
    if (actionElement) {
        const action = actionElement.dataset.action;
        if (action === "navigate") {
            const pageName = actionElement.dataset.pagename;
            showPage(pageName);
        }
    }
});

function showPage(pageName) {
    document.querySelectorAll('.page').forEach(function(page) {
        page.style.display = 'none';
    });

    const targetPage = document.querySelector(`.page[data-pagename="${pageName}"]`);
    targetPage.style.display = 'block';

    document.querySelectorAll('nav a').forEach(function(page) {
        page.classList.remove('selected');
    });

    document.querySelector(`nav a[data-pagename="${pageName}"]`).classList.add('selected');
}