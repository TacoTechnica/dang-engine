import { autoserialize, autoserializeAs, INewable, ISerializable } from "cerialize";
import Debug from "../debug/Debug";
import { JsonHelper } from "./JsonHelper";
import { Resource } from "./Resource";
import { ResourceManager } from "./ResourceManager";
import { DRSprite } from "./resources/DRSprite";
import { StorageManager } from "./StorageManager";


let DEFAULT_URL_FOLDER = ".defaultResources"

function defaultURL(pathToDefaultTo : string) {
    pathToDefaultTo = DEFAULT_URL_FOLDER + "/" + pathToDefaultTo;
    return function(target: Object, propertyKey: string) { 
        let value : any;
        const getter = function() {
            if (value == null) {
                return pathToDefaultTo;
            }
            return value;
        };
        const setter = function(newVal: string) {
            value = newVal;
        }; 
        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: setter
        }); 
    }
}

export class DefaultResources {

    // The resources
    @autoserialize
    @defaultURL("Sprites/DialogueBox.sprite")
    public dialogueBox : string;


    public loadDefaultResource<T extends Resource>(storageManager : StorageManager, resourceManager : ResourceManager, type: Function | INewable<T> | ISerializable, defaultURL : string, onLoad : (resource : T) => void) : void {
        if (defaultURL == null) {
            Debug.logError("Tried loading resource but default URL was given as null, please use DefaultResource.<url name here> as the url!");
            return;
        }
        if (defaultURL.startsWith(DEFAULT_URL_FOLDER + "/")) {
            // We're a default URL, load it asynchronously.
            resourceManager.loadResourceFromURL(storageManager, type, defaultURL, onLoad);
        } else {
            onLoad(resourceManager.loadResource<T>(storageManager, type, defaultURL));
        }
    }
}

