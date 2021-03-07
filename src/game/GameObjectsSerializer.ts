
import { AbstractTypedSerializer } from "../resource/typeSerialization/AbstractTypedSerializer";
import { GameObject } from "./GameObject";
import { GlobalGameObjectRegistry } from "./GlobalGameObjectRegistry";

export class GameObjectsSerializer extends AbstractTypedSerializer<GameObject> {
    constructor() {
        super(GlobalGameObjectRegistry.instance);
    }
}
