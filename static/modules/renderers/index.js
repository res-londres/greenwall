import * as authRenderer from './authRenderer.js';
import * as mainScreenRenderer from './mainScreenRenderer.js';
import * as wallRenderer from './wallRenderer.js';
import * as postModalRenderer from './postModalRenderer.js';
import * as settingsRenderer from './settingsRenderer.js';
import * as postCreatorRenderer from './postCreatorRenderer.js';

// INIT //
export function init() {
    authRenderer.init();
    mainScreenRenderer.init();
    wallRenderer.init();
    postModalRenderer.init();
    settingsRenderer.init();
    postCreatorRenderer.init();
}
