import { ISerializable } from "cerialize";


export abstract class AbstractTypeRegistry {
    // Data
    private _map = {};

    // Registry hard coded in.
    // If you want though you can hard code this anywhere, make your own custom class that has custom
    // gameobject types defined. So while I dislike this centralization, it's still open
    // to modding in the future.

    public register(type : Function | ISerializable, name : string) {
        if (name in this._map) {
            throw new Error("Duplicate object type registration detected: " + name);
        }
        this._map[name] = type;
        return name;
    }

    public keyMapped(name : string) {
        return name in this._map;
    }

    public getTypeMapping(name : string) {
        return this._map[name];
    }
}