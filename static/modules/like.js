import * as bus from './eventBus.js';
import * as events from './events.js';
import * as likeManager from './managers/likeManager.js';
import * as postManager from './managers/postManager.js';
import * as commentManager from './managers/commentManager.js';

export function init() {
    bus.on(events.POST_LIKE_REQUESTED, togglePostLike);
    bus.on(events.COMMENT_LIKE_REQUESTED, toggleCommentLike);
}

function togglePostLike(postID) {
    const existingPost = postManager.getPostByID(postID);
    if (!existingPost) {
        return;
    }

    const isPostLiked = likeManager.isPostLiked(postID);
    const newLikedState = !isPostLiked;
    if (newLikedState) {
        likeManager.addLikedPost(postID);
        postManager.incrementPostLikes(postID);
    } else {
        likeManager.removeLikedPost(postID);
        postManager.decrementPostLikes(postID);
    }

    const updatedPost = postManager.getPostByID(postID);
    bus.emit(events.POST_LIKED, updatedPost);
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
    bus.emit(events.COMMENT_LIKED);
}