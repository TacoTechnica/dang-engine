
import * as BABYLON from 'babylonjs'
import { autoserializeAs, inheritSerialization, serializeAs } from 'cerialize';
import { Game } from "../../game/Game";
import { GameObject } from "../../game/GameObject";
import { GameObjectsSerializer } from '../../game/GameObjectsSerializer';
import { Resource } from "../Resource";

/**
 * Pure data that holds all information about a DR Scene.
 * 
 * Includes a list of gameobjects and other properties we may care about.
 */
@inheritSerialization(Resource)
export class DRScene extends Resource {

    @autoserializeAs(new GameObjectsSerializer(), "gameObjects") private _gameObjects : GameObject[] = [];
    @autoserializeAs("backgroundColor") private _backgroundColor : BABYLON.Color3 = BABYLON.Color3.Black();

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
        let light : BABYLON.HemisphericLight = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1,1,1), bscene);
        light.shadowEnabled = true;

        // TODO: Delete the following
        let box = BABYLON.MeshBuilder.CreateBox("test box", {size : 2}, bscene);
        box.position = new BABYLON.Vector3(2, 1.5, 2);

        BABYLON.MeshBuilder.CreateGround("ground", {width: 10, height: 10}, bscene);
    }

}
