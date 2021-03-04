import { INewable, ISerializable } from "cerialize";
import Logger from "../logger/Logger";
import { Resource } from "./Resource";
import { ResourceManager } from "./ResourceManager";
import { StorageManager } from "./StorageManager";

/**
 * GameObjects have references to resources.
 * Instead of serializing the entire resource and all of its data
 * (which defeats the point of having resources in the first place),
 * it serializes/deserializes by the resource path.
 * 
 * For instance:
 * 
 * image = new DRSprite("Sprites/test.png")
 * 
 * gets serialized to
 * 
 * image: "Sprites/test.png"
 * 
 * and deserialized to
 * 
 * image = load("Sprites/test.png")
 */
export class ResourceSerializer<T> {

    private _type: Function | INewable<T> | ISerializable;

    constructor(type : Function | INewable<T> | ISerializable) {
        this._type = type;
    }

    public Serialize(resource : Resource) : any { 
        return resource.getPath();
    }
    public Deserialize(path : string) : any {
        if (!ResourceManager.current.resourceExists(StorageManager.current, path)) {
            Logger.logError("Attempted to load resource at ", path, " but that resource does not exist! Things will break at least a little.");
            return null;
        }
        return ResourceManager.current.loadResource(StorageManager.current, this._type, path);
    }
};
