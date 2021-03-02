
import * as Babylon from "babylonjs";
import { Game } from "./Game";

/**
 * TODO: Is this abstraction necessary? At all?
 */
export abstract class GameObject extends Babylon.TransformNode {

    // CONSIDER:
    // - Constructor does NOT place the object in the scene. Object must be instantiated manually.
    // OR:
    // - Constructor DOES place object in scene (what we had before).
    //
    //
    // CAREFULLY CONSIDER the consequences for SCENE LOADING.
    //
    //

    constructor(name : string, scene : Babylon.Scene) {
        super(name, scene);
    }

    abstract tick(game : Game, dt : Babylon.float) : void;
}
