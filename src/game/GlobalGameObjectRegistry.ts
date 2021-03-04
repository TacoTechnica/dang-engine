import { ISerializable } from "cerialize";
import Logger from "../logger/Logger";
import { Billboard } from "./objects/Billboard";


/**
 * We can't keep track of a game object's type
 * So we have a mapping of key => type
 * for serialization/deserialization.
 */
export class GlobalGameObjectRegistry {
    
    // Data
    private static _map = {};

    // Registry hard coded in.
    // If you want though you can hard code this anywhere, make your own custom class that has custom
    // gameobject types defined. So while I dislike this centralization, it's still open
    // to modding in the future.

    // REGISTRY ITEMS
    public static BILLBOARD = GlobalGameObjectRegistry.register(Billboard, "Billboard");

    public static register(type : Function | ISerializable, name : string) {
        if (name in this._map) {
            throw new Error("Duplicate object type registration detected: " + name);
        }
        this._map[name] = type;
        return name;
    }

    public static keyMapped(name : string) {
        return name in this._map;
    }

    public static getTypeMapping(name : string) {
        return this._map[name];
    }
}