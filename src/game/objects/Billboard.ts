import * as BABYLON from 'babylonjs'
import { autoserializeAs, inheritSerialization } from "cerialize";
import Logger from "../../logger/Logger";
import { DRSprite } from "../../resource/resources/DRSprite";
import { ResourceSerializer } from "../../resource/ResourceSerializer";
import { Game } from "../Game";
import { GameObject, GameObjectCarrier } from "../GameObject";

import * as $ from 'jquery';
import { GlobalGameObjectRegistry } from '../GlobalGameObjectRegistry';
import { JsonHelper } from '../../resource/JsonHelper';

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
        let base = this;
        if (this._sprite != null) {
            this._plane.isVisible = false;
            let toLoad = 2;
            function onOneShaderLoaded() {
                toLoad--;
                if (toLoad == 0) {
                    //let material = new BABYLON.StandardMaterial("myMaterial", scene);
                    base._sprite.getHTMLImageUrl(game.getStorageManager(), imageUrl => {
                        base._material = new BABYLON.ShaderMaterial("shader", scene, {
                            vertex: "billboard",
                            fragment: "billboard",
                        },
                        {
                            attributes: ["position", "normal", "uv"],
                            uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"]
                        });
                        base._material.setTexture("textureSampler", new BABYLON.Texture(imageUrl, scene));
                        base._material.setInt("cylindrical", base._standStraight? 1 : 0);
                        base._plane.material = base._material;
                        base._plane.isVisible = true;
                    });
                }
            }
            function ensureShaderLoaded(name, url) {
                if (url in BABYLON.Effect.ShadersStore) {
                    onOneShaderLoaded();
                } else {
                    JsonHelper.readFromURL(url, data => {
                        BABYLON.Effect.ShadersStore[name] = data;
                        onOneShaderLoaded();
                    });
                }
            }

            ensureShaderLoaded("billboardVertexShader", "/shaders/billboard.vertex.glsl");
            ensureShaderLoaded("billboardFragmentShader", "/shaders/billboard.fragment.glsl");
        }
    }


    onRootDisposed(): void {
    }


    tick(game: Game, dt: number): void {
        // Do nothing
    }

}
