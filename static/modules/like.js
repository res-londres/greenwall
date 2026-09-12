import * as bus from './eventBus.js';
import * as likeManager from './managers/likeManager.js';
import * as postManager from './managers/postManager.js';
import * as commentManager from './managers/commentManager.js';

export function init() {
    bus.on('post:#toggleLike', toggleLike);
    bus.on('postModal:#toggleLike', toggleLike);
    bus.on('postModal:#toggleCommentLike', toggleCommentLike);
}

// TODO: rename toggleLike => togglePostLike
// TODO: also, what do we need postID param for? we have postManager.getCurrentPostID()
function toggleLike(postID) {
    const userID = 'user_id';      // TEMP
    // TODO: rename isLiked => isPostLiked
    const isLiked = likeManager.isLikedByUser(userID, postID) 
    const newLikedState = !isLiked;
    if (newLikedState) {
        likeManager.addlikedPostByUser(userID, postID);
        postManager.incrementPostLikes(postID);
    } else {
        likeManager.removeLikedPostByUser(userID, postID);
        postManager.decrementPostLikes(postID);
    }
    bus.emit('like:toggleLike');
    if (postManager.isPostModalActive()) {
        bus.emit('like:toggleLike:#renderPostModal');
    }
}

function toggleCommentLike(commentID) {
    const isCommentLiked = likeManager.isCommentLiked(commentID);
    const newLikedState = !isCommentLiked;
    if (newLikedState) {
        likeManager.addCommentLike(commentID);
        commentManager.incrementCommentLikes(commentID);
    } else {
        likeManager.removeCommentLike(commentID);
        commentManager.decrementCommentLikes(commentID);
    }
    bus.emit('like:toggleCommentLike');
}