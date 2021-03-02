import * as Babylon from "babylonjs"
import { Mesh } from "babylonjs";
import { Game } from "../Game";
import { GameObject } from "../GameObject";

export class Billboard extends GameObject {

    private _standStraight : boolean = true;
    private _plane : Mesh;

    constructor(scene : Babylon.Scene, width : number, height : number, imagePath : string = null, standStraight : boolean = true) {
        super("Billboard", scene);
        this._plane = Babylon.MeshBuilder.CreatePlane("Billboard", {width: width, height: height}, scene);
        this._plane.setParent(this);
         if (imagePath != null) {
            let material = new Babylon.StandardMaterial("myMaterial", scene);
            material.diffuseTexture = new Babylon.Texture(imagePath, scene);
            this._plane.material = material;
        }
    }

    tick(game: Game, dt: number): void {
        // Do nothing
        // TODO: Always face camera. Make this billboard an actual billboard.
    }

}