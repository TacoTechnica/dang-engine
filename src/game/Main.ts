
import Debug, {PopupType} from '../debug/Debug';
import { Game } from './Game';

import {DropZone} from '../resource/DropZone';
import { StorageManager } from '../resource/StorageManager';

import { ResourceManager } from '../resource/ResourceManager';
import { Test } from './Tests';

window.addEventListener('DOMContentLoaded', () => {

    Debug.init("alerts");

    // TODO: Later, this (or maybe an extra resource manager) can check if a project is
    // ALREADY loaded into storage (when we switch to using localStorage, not sessionStorage).
    // If that's the case, then we can skip creating the dropzone and have a popup or something.
    let storageManager : StorageManager = new StorageManager();
    let resourceManager : ResourceManager = new ResourceManager();

    let fileSystemExists = storageManager.tryLoadPresentDirectories();

    // Create the game using the 'renderCanvas'.
    let game = new Game('view', storageManager, resourceManager);

    // Run any tests we may want to run, to prevent clutter in Main.
    new Test().GLOBAL_TEST(game);

    let canReloadOldProject = false;

    // If a file system is already loaded and a project file exists, we can try reloading an old project.
    if (fileSystemExists && resourceManager.projectFileExists(storageManager)) {
        canReloadOldProject = true;
    }

    // The user might not want to reload an old project though, so give them a prompt.
    // This should be replaced with something cooler but this is fine for now.
    if (canReloadOldProject) {
        if (!confirm("Project previously loaded, use already loaded project?")) {
            canReloadOldProject = false;
        }
    }

    if (canReloadOldProject) {
        // Project is already loaded in storage, so have the game load it.
        game.openProject(
            () => {
                game.run();
            },
            (failMessage) => {
                // Something failed, we'll have to reload.
                Debug.popup(failMessage, PopupType.Warning);
            }
        );
    } else {
        // Have the user pick a project to load.
        let dropzone = new DropZone("Drag+Drop Project here");

        dropzone.onfileopened = (file) => {
            storageManager.tryLoadZipFile(file, (success, error) => {
                if (success) {
                    game.openProject(
                        () => {
                            dropzone.destroy();
                            game.run();
                        },
                        (failMessage) => {
                            Debug.popup(failMessage, PopupType.Warning);
                        }
                    );
                } else {
                    Debug.popup(error, PopupType.Warning);
                }
            })
        };
    }
});