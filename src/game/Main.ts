//import MyScene from './my-scene'

import * as Babylon from 'babylonjs';
import { Mesh } from 'babylonjs';
import Logger, {PopupType} from '../logger/Logger'
import { Game } from './Game';
import { GameObject } from './GameObject';
import { Billboard } from './objects/Billboard';
import {DropZone} from '../resource/DropZone';
import { ProjectStorageManager } from '../resource/ProjectStorageManager';
import { Project } from '../resource/Project';

window.addEventListener('DOMContentLoaded', () => {

    Logger.init("alerts");

    // Create the game using the 'renderCanvas'.
    let game = new Game('view');

    // This can be used to load multiple projects,
    // but for now we will only load one.
    let projectManager : ProjectStorageManager = new ProjectStorageManager();


    let dropzone = new DropZone("dropZone");
    dropzone.onfileopened = (file) => {
        projectManager.tryLoadZipFile(file, (success, message) => {
            if (success) {
                dropzone.destroy();

                // Test project loading/saving/creation/the whole shebang.
                let p : Project = Project.load(projectManager, "project.json");
                Logger.logMessage("before");
                Logger.logMessage(p);
                p.name = "This is a new name now!";
                Logger.logMessage("after");
                Logger.logMessage(p);
                Project.save(projectManager, "project.json", p);

                projectManager.saveZipFile();

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