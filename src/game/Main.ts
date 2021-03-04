//import MyScene from './my-scene'


import Logger, {PopupType} from '../logger/Logger';
import { Game } from './Game';

import {DropZone} from '../resource/DropZone';
import { StorageManager } from '../resource/StorageManager';

import { ResourceManager } from '../resource/ResourceManager';

window.addEventListener('DOMContentLoaded', () => {

    Logger.init("alerts");

    // TODO: Later, this (or maybe an extra resource manager) can check if a project is
    // ALREADY loaded into storage (when we switch to using localStorage, not sessionStorage).
    // If that's the case, then we can skip creating the dropzone and have a popup or something.
    let storageManager : StorageManager = new StorageManager();
    let resourceManager : ResourceManager = new ResourceManager();

    // Create the game using the 'renderCanvas'.
    let game = new Game('view', storageManager, resourceManager);

    let needsToLoadNew = true;

    /* In progress, we need some more indexing.
    if (resourceManager.projectFileExists(storageManager)) {
        needsToLoadNew = false;
    }
    */

    if (needsToLoadNew) {
        // User will load a project from here.
        let dropzone = new DropZone("dropZone");

        dropzone.onfileopened = (file) => {
            game.loadProject(file,
                () => {
                    dropzone.destroy();
                    game.run();
                },
                (failMessage) => {
                    Logger.popup(failMessage, PopupType.Warning);
                }
            );
        };
    } else {
        // Project is already loaded. Run away!
        game.run();
    }

});