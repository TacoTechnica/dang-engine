
import * as Babylon from "babylonjs";
import { TransformNode } from "babylonjs";
import { Game } from "./Game";

// Pure data, our gameobject.
export abstract class GameObject {

    public instantiate(game : Game, scene : Babylon.Scene) : void {
        let carrier = new GameObjectCarrier("Carrier", scene, this);
        this.onInstantiate(game, scene, carrier);
    }

    abstract onInstantiate(game : Game, scene : Babylon.Scene, root : GameObjectCarrier) : void;

    abstract tick(game : Game, dt : Babylon.float) : void;

    abstract onRootDisposed() : void;
}

/**
 * This holds on to a GameObject inside of a DRScene.
 * 
 * Effectively "piggy backs" off of babylon's scene system
 * so we don't have to write our own haha
 */
export class GameObjectCarrier extends TransformNode {

    private _gameObject : GameObject;

    constructor(name : string, scene : Babylon.Scene, gameObject : GameObject) {
        super(name, scene);
        this._gameObject = gameObject;
    }

    tick(game : Game, dt : Babylon.float) : void {
        this._gameObject.tick(game, dt);
    }

    dispose(doNotRecurse?: boolean, disposeMaterialAndTextures?: boolean) : void {
        super.dispose(doNotRecurse, disposeMaterialAndTextures);
        this._gameObject.onRootDisposed();
    }   
}
