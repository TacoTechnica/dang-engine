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

    // Create the game using the 'renderCanvas'.
    let game = new Game('view');

    // This can be used to load multiple projects,
    // but for now we will only load one.
    let storageManager : StorageManager = new StorageManager();
    let rawResourceManager : RawResourceManager = new RawResourceManager();
    let resourceManager : ResourceManager = new ResourceManager();


    let dropzone = new DropZone("dropZone");
    dropzone.onfileopened = (file) => {
        storageManager.tryLoadZipFile(file, (success, message) => {
            if (success) {
                dropzone.destroy();

                // TEST: Create + Load sprite resource, assuming raw png file is in .raw/

                let testSpritePath = "Sprites/boof.sprite";

                if (resourceManager.resourceExists(storageManager, testSpritePath)) {
                    // Load the sprite resource that was added
                    let testSprite : DRSprite = resourceManager.loadResource(storageManager, DRSprite, testSpritePath);

                    Logger.logMessage("GOT: (finally)");
                    Logger.logMessage(testSprite);

                    let raw = testSprite.getResPath().readRawBase64(storageManager);

                    var image = new Image();
                    image.src = 'data:image/png;base64,' + raw;
                    document.body.appendChild(image);    
                    Logger.logMessage("LOADED SPRITE!");
                } else {
                    // Make new sprite resource from an imported raw resource
                    let testSprite : DRSprite = new DRSprite(new RawPath(".raw/icon.png"));
                    resourceManager.saveResource(storageManager, testSpritePath, testSprite);
                    Logger.logMessage("NEW SPRITE!");
                }

                storageManager.saveZipFile();

            } else {
                Logger.popup(message, PopupType.Warning);
            }

        });
    };

});


class TestObject extends GameObject {

    private _sphere : Mesh;

    constructor(scene : Babylon.Scene) {
        super("Test", scene);
        this._sphere = Babylon.MeshBuilder.CreateSphere('sphere1',
                            {segments: 16, diameter: 2}, scene);
        this._sphere.setParent(this);
        // Move the sphere upward 1/2 of its height.
        this._sphere.position.y = 1;

    }
    tick(game: Game, dt: number): void {
        this._sphere.position = this._sphere.position.add(Babylon.Vector3.Right().scale(dt));
    }
}

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

    new TestObject(scene);
    new Billboard(scene, 10, 10, "file:///G:/Pictures/b o i.PNG");

    return scene;
}
