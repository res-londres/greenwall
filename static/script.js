import * as pageNavigator from './modules/pageNavigator.js';
import * as postCreator from './modules/postCreator.js';
import * as postRenderer from './modules/postRenderer.js';

// order doesnt matter //
pageNavigator.init();

// order matters //
postRenderer.init();
postCreator.init();