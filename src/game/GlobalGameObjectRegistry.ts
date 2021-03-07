import { ISerializable } from "cerialize";
import Debug from "../debug/Debug";
import { AbstractTypeRegistry } from "../resource/typeSerialization/AbstractTypeRegistry";

import { Billboard } from "./objects/Billboard";


/**
 * We can't keep track of a game object's type
 * So we have a mapping of key => type
 * for serialization/deserialization.
 */
export class GlobalGameObjectRegistry extends AbstractTypeRegistry {

    public static instance : GlobalGameObjectRegistry = new GlobalGameObjectRegistry();

    public static register(type : Function | ISerializable, name : string) {
        return GlobalGameObjectRegistry.instance.register(type, name);
    }

    public static keyMapped(name : string) {
        return GlobalGameObjectRegistry.instance.keyMapped(name);
    }

    public static getTypeMapping(name : string) {
        return GlobalGameObjectRegistry.instance.getTypeMapping(name);
    }

    // REGISTRY ITEMS
    public static BILLBOARD = GlobalGameObjectRegistry.register(Billboard, "Billboard");
}