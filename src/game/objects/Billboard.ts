import * as Babylon from "babylonjs"
import { Mesh } from "babylonjs";
import { autoserializeAs } from "cerialize";
import Logger from "../../logger/Logger";
import { DRSprite } from "../../resource/resources/DRSprite";
import { ResourceSerializer } from "../../resource/ResourceSerializer";
import { Game } from "../Game";
import { GameObject, GameObjectCarrier } from "../GameObject";

export class Billboard extends GameObject {
    
    @autoserializeAs('standStraight') private _standStraight : boolean = true;

    @autoserializeAs('width') private _width : number;
    @autoserializeAs('height') private _height : number;

    @autoserializeAs(new ResourceSerializer(DRSprite), 'sprite') private _sprite : DRSprite;

    private _plane : Mesh;

    constructor(width : number, height : number, sprite : DRSprite, standStraight : boolean = true) {
        super();
        this._width = width;
        this._height = height;
        this._sprite = sprite;
        this._standStraight = standStraight;
    }

    onInstantiate(game: Game, scene: Babylon.Scene, root: GameObjectCarrier): void {
        this._plane = Babylon.MeshBuilder.CreatePlane("Billboard", {width: this._width, height: this._height}, scene);
        this._plane.setParent(root);
         if (this._sprite != null) {
            let material = new Babylon.StandardMaterial("myMaterial", scene);
            let imgUrl = this._sprite.getBase64SpriteUrl(game.getStorageManager());
            material.diffuseTexture = new Babylon.Texture(imgUrl, scene);
            this._plane.material = material;
        }
    }

    onRootDisposed(): void {
    }


    tick(game: Game, dt: number): void {
        // Do nothing
        // TODO: Always face camera. Make this billboard an actual billboard.
    }

}
