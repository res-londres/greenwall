// Central registry of all bus events.
// Naming: SCREAMING_SNAKE_CASE constant, 'feature:event' string value.
// Never name events after modules.

export const AUTH_PENDING              = 'auth:pending';
export const AUTH_ERROR                = 'auth:error';
export const AUTH_LOGGED_IN            = 'auth:loggedIn';
export const AUTH_LOGGED_OUT           = 'auth:loggedOut';
export const AUTH_SHOW_LOGIN           = 'auth:showLogin';
export const AUTH_SHOW_SIGNUP          = 'auth:showSignup';

export const NAV_CHANGED               = 'nav:changed';

export const POST_CREATED              = 'post:created';
export const POST_LIKED                = 'post:liked';
export const POST_MODAL_OPENED         = 'post:modalOpened';

export const COMMENT_CREATED           = 'comment:created';
export const COMMENT_LIKED             = 'comment:liked';

export const PROFILE_SWITCHED          = 'profile:switched';

export const SETTINGS_ACCOUNT_OPENED   = 'settings:accountOpened';
export const SETTINGS_PROFILE_OPENED   = 'settings:profileOpened';

// User input requests: controllers emit these when the user clicks a like button.
// like.js consumes them. Unlike state-change events, these are imperatives.
export const POST_LIKE_REQUESTED = 'post:likeRequested';
export const COMMENT_LIKE_REQUESTED = 'comment:likeRequested';

// Profile creation
export const PROFILE_CREATE_PENDING = 'profile:createPending';
export const PROFILE_CREATE_ERROR   = 'profile:createError';

// Profile deletion
export const PROFILE_DELETE_REQUESTED = 'profile:deleteRequested';
export const PROFILE_DELETE_PENDING   = 'profile:deletePending';
export const PROFILE_DELETE_ERROR     = 'profile:deleteError';

// Account deletion
export const ACCOUNT_DELETE_REQUESTED = 'account:deleteRequested';
export const ACCOUNT_DELETE_PENDING   = 'account:deletePending';
export const ACCOUNT_DELETE_ERROR     = 'account:deleteError';

// Post creation
export const POST_CREATE_PENDING = 'post:createPending';
export const POST_CREATE_ERROR   = 'post:createError';

// Post fetching
export const POSTS_LOADED    = 'posts:loaded';       // initial batch (re-renders the wall)
export const POSTS_PREPENDED = 'posts:prepended';    // polled new posts (top of wall, silent)
export const POSTS_APPENDED  = 'posts:appended';     // older posts (bottom of wall, appends in place)

export const WALL_REFRESH_REQUESTED = 'wall:refreshRequested';
