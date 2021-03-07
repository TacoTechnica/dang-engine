import Debug from "../../debug/Debug";
import { AbstractTypeRegistry } from "./AbstractTypeRegistry";
import { JsonHelper } from "../JsonHelper";
import { ITypeSerializable } from "./ITypeSerializable";


/**
 * Sometimes you have an array of abstract objects with varied types.
 * This is a one size fits all solution that lets us deserialize into different types,
 * expecting each object to have a serializable property named "@type" and using that
 * to determine what class to deserialize into.
 * 
 * This uses a Type Registry which basically maps type string to type class, and each
 * object must register their type in a class that is GUARANTEED to load.
 */
export abstract class AbstractTypedSerializer<T extends ITypeSerializable> {

    private _registry : AbstractTypeRegistry;

    constructor(registry : AbstractTypeRegistry) {
        this._registry = registry;
    }

    public Serialize(gameObject : T) : any {
        let key : string = gameObject.getTypeKey();
        if (this._registry.keyMapped(key)) {
            return JsonHelper.serialize(gameObject, this._registry.getTypeMapping(key));
        } else {
            Debug.logError("Type ", key ," is not registered, found when serializing gameObject: ", gameObject, ". Most likely a programming mistake.");
        }
        return JsonHelper.serialize(gameObject);
    }
    public Deserialize(data : any[]) : any {

        let result :T[] = [];

        data.forEach(objectRaw => {
            if ("@type" in objectRaw) {
                let key : string = objectRaw["@type"];
                if (this._registry.keyMapped(key)) {
                    result.push(JsonHelper.deserializeObj(this._registry.getTypeMapping(key), objectRaw));
                } else {
                    Debug.logError("Type ", key ," is not registered, found when deserializing data: ", data, ". Most likely the scene file you've loaded is not formatted properly.");
                }
            } else {
                Debug.logError("@type key not found after deserializing gameObject with data: ", data, ". Most likely the scene file you've loaded is not formatted properly.");
            }    
        });
        return result;
    }

}