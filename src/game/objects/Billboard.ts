import * as BABYLON from 'babylonjs'
import { autoserializeAs, inheritSerialization } from "cerialize";
import Debug from "../../debug/Debug";
import { DRSprite } from "../../resource/resources/DRSprite";
import { ResourceSerializer } from "../../resource/ResourceSerializer";
import { Game } from "../Game";
import { GameObject, GameObjectCarrier } from "../GameObject";


import { GlobalGameObjectRegistry } from '../GlobalGameObjectRegistry';
import { JsonHelper } from '../../resource/JsonHelper';

@inheritSerialization(GameObject)
export class Billboard extends GameObject {

    @autoserializeAs('standStraight') private _standStraight : boolean = true;

    @autoserializeAs(new ResourceSerializer(DRSprite), 'sprite') private _sprite : DRSprite;

    private _plane : BABYLON.Mesh;

    private _material : BABYLON.ShaderMaterial;

    constructor(position : BABYLON.Vector3, sprite : DRSprite, standStraight : boolean = true) {
        super(GlobalGameObjectRegistry.BILLBOARD, position);
        this._sprite = sprite;
        this._standStraight = standStraight;
    }

    onInstantiate(game: Game, scene: BABYLON.Scene, root: GameObjectCarrier): void {
        let base = this;
        if (this._sprite != null) {
            let toLoad = 2;
            function onOneShaderLoaded() {
                toLoad--;
                if (toLoad == 0) {
                    //let material = new BABYLON.StandardMaterial("myMaterial", scene);
                    base._sprite.getHTMLImage(game.getStorageManager(), htmlImg => {
                        let scale = base._sprite.getActualWorldScale();
                        let w = htmlImg.width*scale,
                            h = htmlImg.height*scale;
                        let pivot = base._sprite.getPivot();
                        base._plane = Billboard.createPlane(scene, w, h, w*pivot.x, h - h*pivot.y);
                        base._plane.setParent(root);
                        // Make the top left the pivot, then offset.
                        base._plane.position = new BABYLON.Vector3(0, 0, 0);

                        base._material = new BABYLON.ShaderMaterial("shader", scene, {
                            vertex: "billboard",
                            fragment: "billboard",
                        },
                        {
                            attributes: ["position", "normal", "uv"],
                            uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"]
                        });
                        base._material.setTexture("textureSampler", new BABYLON.Texture(htmlImg.src, scene));
                        base._material.setInt("cylindrical", base._standStraight? 1 : 0);
                        base._plane.material = base._material;
                        base._plane.isVisible = true;

                        let tempSphere = BABYLON.MeshBuilder.CreateSphere("temp", {diameter: 0.1}, scene);
                        tempSphere.setParent(root);
                        tempSphere.position = BABYLON.Vector3.Zero();
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

    private static createPlane(scene : BABYLON.Scene, width : number, height : number, pivotX : number, pivotY : number) : BABYLON.Mesh {
        var indices = [];
        var positions = [];
        var normals = [];
        var uvs = [];
        // Vertices

        positions.push(-pivotX, -pivotY, 0);
        normals.push(0, 0, -1.0);
        uvs.push(0.0, 0.0);
        positions.push(-pivotX + width, -pivotY, 0);
        normals.push(0, 0, -1.0);
        uvs.push(1.0, 0.0);
        positions.push(-pivotX + width, -pivotY + height, 0);
        normals.push(0, 0, -1.0);
        uvs.push(1.0, 1.0);
        positions.push(-pivotX, -pivotY + height, 0);
        normals.push(0, 0, -1.0);
        uvs.push(0.0, 1.0);
        // Indices
        indices.push(0);
        indices.push(1);
        indices.push(2);
        indices.push(0);
        indices.push(2);
        indices.push(3);
        // Sides
        // Result
        var vertexData = new BABYLON.VertexData();
        vertexData.indices = indices;
        vertexData.positions = positions;
        vertexData.normals = normals;
        vertexData.uvs = uvs;

        let result = new BABYLON.Mesh("billboard plane", scene);
        vertexData.applyToMesh(result);

        return result;
    }

}
