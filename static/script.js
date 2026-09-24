import { bootstrapViews } from './modules/views/bootstrap.js';
import * as auth from './modules/auth.js';
import * as like from './modules/like.js';
import * as pageNavigator from './modules/pageNavigator.js';
import * as post from './modules/post.js';
import * as postModal from './modules/postModal.js';
import * as postCreator from './modules/postCreator.js';
import * as postCreatorModal from './modules/postCreatorModal.js';
import * as profile from './modules/profile.js';
import * as renderer from './modules/renderer.js';

// INIT //
bootstrapViews();
auth.init();
like.init();
pageNavigator.init();
post.init();
postModal.init();
postCreator.init();
postCreatorModal.init();
profile.init();
renderer.init();