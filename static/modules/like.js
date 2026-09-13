import * as bus from './eventBus.js';
import * as likeManager from './managers/likeManager.js';
import * as postManager from './managers/postManager.js';
import * as commentManager from './managers/commentManager.js';

export function init() {
    bus.on('post:#togglePostLike', togglePostLike);
    bus.on('postModal:#togglePostLike', togglePostLike);
    bus.on('postModal:#toggleCommentLike', toggleCommentLike);
}

function togglePostLike(postID) { 
    const isPostLiked = likeManager.isPostLiked(postID);
    const newLikedState = !isPostLiked;
    if (newLikedState) {
        likeManager.addLikedPost(postID);
        postManager.incrementPostLikes(postID);
    } else {
        likeManager.removeLikedPost(postID);
        postManager.decrementPostLikes(postID);
    }
    bus.emit('like:togglePostLike');
    if (postManager.isPostModalActive()) {
        bus.emit('like:togglePostLike:#renderPostModal');
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