//import MyScene from './my-scene'

import * as BABYLON from 'babylonjs';
import Logger, {PopupType} from '../logger/Logger';
import { Game } from './Game';
import { GameObject } from './GameObject';
import { Billboard } from './objects/Billboard';
import {DropZone} from '../resource/DropZone';
import { StorageManager } from '../resource/StorageManager';
import { RawResourceManager } from '../resource/RawResourceManager';
import { RawPath } from '../resource/RawPath';
import { DRSprite } from '../resource/resources/DRSprite';
import { ResourceManager } from '../resource/ResourceManager';
import { DRScene } from '../resource/resources/DRScene';

window.addEventListener('DOMContentLoaded', () => {

    Logger.init("alerts");

    // This can be used to load multiple projects,
    // but for now we will only load one.
    let storageManager : StorageManager = new StorageManager();

    // Create the game using the 'renderCanvas'.
    let game = new Game('view', storageManager);

    let dropzone = new DropZone("dropZone");
    dropzone.onfileopened = (file) => {
        storageManager.tryLoadZipFile(file, (success, message) => {
            if (success) {
                dropzone.destroy();

                game.loadScene(testCreateScene(game));
                game.run();
                // TEST: Create + Load sprite resource, assuming raw png file is in .raw/

            } else {
                Logger.popup(message, PopupType.Warning);
            }
        });
    };

});



function testCreateScene(game : Game) : DRScene {
    let scene : DRScene = new DRScene("whatever");

    let sprite : DRSprite = game.getResourceManager().loadResource(game.getStorageManager(), DRSprite, "Sprites/icon.sprite");
    let sprit2 : DRSprite = game.getResourceManager().loadResource(game.getStorageManager(), DRSprite, "Sprites/aa.sprite");
    scene.addObject(new Billboard(new BABYLON.Vector3(0, 0, 0), 10, 10, sprite));
    scene.addObject(new Billboard(new BABYLON.Vector3(10, -1, 1), 5, 10, sprit2));

    return scene;
}
