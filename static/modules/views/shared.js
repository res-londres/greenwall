export function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

export function createLikeIcon(isLiked, size = 'text-2xl') {
    const classes = [size, isLiked ? 'text-accent icon-[ant-design--heart-filled]' : 'icon-[ant-design--heart-outlined]']
        .filter(Boolean)
        .join(' ');

    return `<span class="${classes}"></span>`;
}
