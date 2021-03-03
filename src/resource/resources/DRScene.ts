
import * as BABYLON from 'babylonjs'
import { Game } from "../../game/Game";
import { GameObject } from "../../game/GameObject";
import { Resource } from "../Resource";

/**
 * Pure data that holds all information about a DR Scene.
 * 
 * Includes a list of gameobjects and other properties we may care about.
 */
export class DRScene extends Resource {

    private _gameObjects : GameObject[] = [];
    private _backgroundColor : BABYLON.Color3 = BABYLON.Color3.Black();

    public getGameObjects() : GameObject[] {
        return this._gameObjects;
    }
    public getBackgroundColor() : BABYLON.Color3 {
        return this._backgroundColor;
    }

    public addObject(newGameObject : GameObject) : void {
        this._gameObjects.push(newGameObject);
    }

    public onSceneLoad(game : Game, bscene : BABYLON.Scene) : void {
        // TODO: Make abstract and remove this test code.

        // Create a FreeCamera, and set its position to (x:0, y:5, z:-10).
        let camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5,-10), bscene);
        // Target the camera to scene origin.
        camera.setTarget(BABYLON.Vector3.Zero());
        // Attach the camera to the canvas.
        camera.attachControl(game.getCanvas(), true);

        // Create a basic light, aiming 0,1,0 - meaning, to the sky.
        new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), bscene);
    }

}
