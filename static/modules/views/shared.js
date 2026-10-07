export function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

export function createLikeIcon(isLiked, size = 'text-2xl') {
    const icon = isLiked
        ? 'text-icon-hovered icon-[ant-design--heart-filled]'
        : 'icon-[ant-design--heart-outlined]';
    const classes = size ? `${size} ${icon}` : icon;

    return `<span class="${classes}"></span>`;
}

export function formatRelativeTime(isoString) {
    const then = new Date(isoString);
    const now = new Date();
    const seconds = Math.floor((now - then) / 1000);

    if (seconds < 60) return 'just now';

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours === 1 ? '1 hour ago' : `${hours} hours ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return days === 1 ? '1 day ago' : `${days} days ago`;

    const weeks = Math.floor(days / 7);
    if (weeks < 4) return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return months === 1 ? '1 month ago' : `${months} months ago`;

    const years = Math.floor(days / 365);
    return years === 1 ? '1 year ago' : `${years} years ago`;
}

export function formatAttribution(profileId, profileName) {
    if (!profileName) {
        return '<span class="italic text-fg-muted">[deleted]</span>';
    }

    const suffix = profileId && profileId.includes('#')
        ? '#' + profileId.split('#')[1]
        : '';

    const safeName = escapeHTML(profileName);
    const safeSuffix = escapeHTML(suffix);

    return `<span class="font-bold">${safeName}</span><span class="ml-1 text-fg-muted text-[0.85em] font-normal">${safeSuffix}</span>`;
}
