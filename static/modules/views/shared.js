export function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

export function createLikeIcon(isLiked, size = 'text-2xl') {
    const icon = isLiked
        ? 'text-accent icon-[ant-design--heart-filled]'
        : 'icon-[ant-design--heart-outlined]';
    const classes = size ? `${size} ${icon}` : icon;

    return `<span class="${classes}"></span>`;
}
