
import Debug from "../debug/Debug";
import { JsonHelper } from "../resource/JsonHelper";
import { GameObject } from "./GameObject";
import { GlobalGameObjectRegistry } from "./GlobalGameObjectRegistry";

export class GameObjectsSerializer {
    public Serialize(gameObject : GameObject) : any {
        let key : string = gameObject.getTypeKey();
        if (GlobalGameObjectRegistry.keyMapped(key)) {
            return JsonHelper.serialize(gameObject, GlobalGameObjectRegistry.getTypeMapping(key));
        } else {
            Debug.logError("Type ", key ," is not registered, found when serializing gameObject: ", gameObject, ". Most likely a programming mistake.");
        }
        return JsonHelper.serialize(gameObject);
    }
    public Deserialize(data : any[]) : any {

        let result :GameObject[] = [];

        data.forEach(objectRaw => {
            if ("@type" in objectRaw) {
                let key : string = objectRaw["@type"];
                if (GlobalGameObjectRegistry.keyMapped(key)) {
                    result.push(JsonHelper.deserializeObj(GlobalGameObjectRegistry.getTypeMapping(key), objectRaw));
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