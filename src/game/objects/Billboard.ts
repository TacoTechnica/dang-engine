import * as BABYLON from 'babylonjs'
import { autoserializeAs, inheritSerialization } from "cerialize";
import Logger from "../../logger/Logger";
import { DRSprite } from "../../resource/resources/DRSprite";
import { ResourceSerializer } from "../../resource/ResourceSerializer";
import { Game } from "../Game";
import { GameObject, GameObjectCarrier } from "../GameObject";

import * as $ from 'jquery';
import { GlobalGameObjectRegistry } from '../GlobalGameObjectRegistry';

BABYLON.Effect.ShadersStore["billboardVertexShader"] = loadShaderText("/shaders/billboard.vertex.glsl");
BABYLON.Effect.ShadersStore["billboardFragmentShader"] = loadShaderText("/shaders/billboard.fragment.glsl");


function loadShaderText(path : string) : string {
    let error = null;
    let result = null;
    $.ajax({
        url : path,
        dataType: "text",
        success : function(data){
            result = data;
        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
            error = errorThrown;
        },
        xhrFields: {
            withCredentials: true
        },
        async: false
    });
    if (error != null) {
        Logger.logError(error);
    }
    return result;
}

@inheritSerialization(GameObject)
export class Billboard extends GameObject {

    @autoserializeAs('standStraight') private _standStraight : boolean = true;

    @autoserializeAs('width') private _width : number;
    @autoserializeAs('height') private _height : number;

    @autoserializeAs(new ResourceSerializer(DRSprite), 'sprite') private _sprite : DRSprite;

    private _plane : BABYLON.Mesh;

    private _material : BABYLON.ShaderMaterial;

    constructor(position : BABYLON.Vector3, width : number, height : number, sprite : DRSprite, standStraight : boolean = true) {
        super(GlobalGameObjectRegistry.BILLBOARD, position);
        this._width = width;
        this._height = height;
        this._sprite = sprite;
        this._standStraight = standStraight;
    }

    onInstantiate(game: Game, scene: BABYLON.Scene, root: GameObjectCarrier): void {
        this._plane = BABYLON.MeshBuilder.CreatePlane("Billboard", {width: this._width, height: this._height}, scene);
        this._plane.setParent(root);
         if (this._sprite != null) {
            //let material = new BABYLON.StandardMaterial("myMaterial", scene);
            let imgUrl = this._sprite.getBase64SpriteUrl(game.getStorageManager());
            this._material = new BABYLON.ShaderMaterial("shader", scene, {
                vertex: "billboard",
                fragment: "billboard",
            },
            {
                attributes: ["position", "normal", "uv"],
                uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"]
            });
            this._material.setTexture("textureSampler", new BABYLON.Texture(imgUrl, scene));
            this._material.setInt("cylindrical", this._standStraight? 1 : 0);
            this._plane.material = this._material;
        }
    }

    onRootDisposed(): void {
    }


    tick(game: Game, dt: number): void {
        // Do nothing
    }

}
