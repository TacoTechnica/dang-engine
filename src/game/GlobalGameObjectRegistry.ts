import { ISerializable } from "cerialize";


/**
 * We can't keep track of a game object's type
 * So we have a mapping of key => type
 * for serialization/deserialization.
 */
export class GlobalGameObjectRegistry {

    private static _map = {};

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