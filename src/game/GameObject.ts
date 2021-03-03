import * as BABYLON from 'babylonjs'
import { Game } from "./Game";

// Pure data, our gameobject.
export abstract class GameObject {

    public instantiate(game : Game, scene : BABYLON.Scene) : void {
        let carrier = new GameObjectCarrier("Carrier", scene, this);
        this.onInstantiate(game, scene, carrier);
    }

    abstract onInstantiate(game : Game, scene : BABYLON.Scene, root : GameObjectCarrier) : void;

    abstract tick(game : Game, dt : number) : void;

    abstract onRootDisposed() : void;
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
