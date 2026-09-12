import * as bus from './eventBus.js';
import * as likeManager from './managers/likeManager.js';
import { incrementPostLikes, decrementPostLikes, isPostModalActive } from './managers/postManager.js';

export function init() {
    bus.on('post:#toggleLike', toggleLike);
    bus.on('postModal:#toggleLike', toggleLike);
}

function toggleLike(postID) {
    const userID = 'user_id';      // TEMP
    const isLiked = likeManager.isLikedByUser(userID, postID) 
    const newLikedState = !isLiked;
    if (newLikedState) {
        likeManager.addlikedPostByUser(userID, postID);
        incrementPostLikes(postID);
    } else {
        likeManager.removeLikedPostByUser(userID, postID);
        decrementPostLikes(postID);
    }
    bus.emit('like:toggleLike');
    if (isPostModalActive()) {
        bus.emit('like:toggleLike:#renderPostModal');
    }
}