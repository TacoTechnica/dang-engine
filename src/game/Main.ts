//import MyScene from './my-scene'

import * as Babylon from 'babylonjs';
import { Mesh } from 'babylonjs';
import Logger, {PopupType} from '../logger/Logger'
import { Game } from './Game';
import { GameObject } from './GameObject';
import { Billboard } from './objects/Billboard';
import {DropZone} from '../resource/DropZone';
import { StorageManager } from '../resource/StorageManager';
import { RawResourceManager } from '../resource/RawResourceManager';
import { RawPath } from '../resource/RawPath';
import { DRSprite } from '../resource/resources/DRSprite';
import { ResourceManager } from '../resource/ResourceManager';

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



function testCreateScene(game : Game) : Babylon.Scene {
    let scene = new Babylon.Scene(game.getBabylon());

    // Create a FreeCamera, and set its position to (x:0, y:5, z:-10).
    let camera = new Babylon.FreeCamera('camera1', new Babylon.Vector3(0, 5,-10), scene);

    // Target the camera to scene origin.
    camera.setTarget(Babylon.Vector3.Zero());

    // Attach the camera to the canvas.
    camera.attachControl(game.getCanvas(), true);

    // Create a basic light, aiming 0,1,0 - meaning, to the sky.
    new Babylon.HemisphericLight('light1', new Babylon.Vector3(0,1,0), scene);


    // Create a built-in "ground" shape.
    Babylon.MeshBuilder.CreateGround('ground1',
                            {width: 6, height: 6, subdivisions: 2}, scene);

    let sprite : DRSprite = game.getResourceManager().loadResource(game.getStorageManager(), DRSprite, "Sprites/icon.sprite");
    new Billboard(10, 10, sprite).instantiate(game, scene);

    return scene;
}
