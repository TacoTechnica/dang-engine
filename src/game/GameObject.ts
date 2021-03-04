import * as BABYLON from 'babylonjs'
import { autoserializeAs, serializeAs } from 'cerialize';
import { Game } from "./Game";

// Pure data, our gameobject.
export abstract class GameObject {

    @autoserializeAs("@type")
    private _type : string;

    @autoserializeAs("position")
    private _startPosition : BABYLON.Vector3;

    private _carrier : GameObjectCarrier;

    constructor(type : string, position : BABYLON.Vector3) {
        this._type = type;
        this._startPosition = position;
    }

    public instantiate(game : Game, scene : BABYLON.Scene) : void {
        this._carrier = new GameObjectCarrier("Carrier", scene, this);
        this.onInstantiate(game, scene, this._carrier);
        this._carrier.position = this._startPosition;
    }

    abstract onInstantiate(game : Game, scene : BABYLON.Scene, root : GameObjectCarrier) : void;

    abstract tick(game : Game, dt : number) : void;

    abstract onRootDisposed() : void;

    public getPosition() : BABYLON.Vector3 {return this._carrier.position;}
    public setPosition(position : BABYLON.Vector3) : void {this._carrier.position = position;}

    public getTypeKey() : string {return this._type;}
}

/**
 * This holds on to a GameObject inside of a DRScene.
 * 
 * Effectively "piggy backs" off of babylon's scene system
 * so we don't have to write our own haha
 */
export class GameObjectCarrier extends BABYLON.TransformNode {

    private _gameObject : GameObject;

    constructor(name : string, scene : BABYLON.Scene, gameObject : GameObject) {
        super(name, scene);
        this._gameObject = gameObject;
    }

    tick(game : Game, dt : number) : void {
        this._gameObject.tick(game, dt);
    }

    dispose(doNotRecurse?: boolean, disposeMaterialAndTextures?: boolean) : void {
        super.dispose(doNotRecurse, disposeMaterialAndTextures);
        this._gameObject.onRootDisposed();
    }   
}
