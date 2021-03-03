/**
 * Handles the loading + reading of resources.
 * 
 * Caches the resources so we don't have to reload them all the time.
 */
import { INewable, ISerializable } from "cerialize";
import Logger from "../logger/Logger";
import { JsonHelper } from "./JsonHelper";
import { RawResourceManager } from "./RawResourceManager";
import { Resource } from "./Resource";
import { StorageManager } from "./StorageManager";

export class ResourceManager {

    private _resourceCache = {};

    // Only in rare cases, mainly deserialization is this necessary
    public static current : ResourceManager = null;

    constructor() {
        // Singleton patter, avoid as much as possible.
        // It's unavoidable for custom serialization though, as that is static.
        ResourceManager.current = this;
    }

    public clear() {
        this._resourceCache = {};
    }

    public loadResource<T extends Resource>(storageManager : StorageManager, type: Function | INewable<T> | ISerializable, path : string) : T {
        if (!(path in this._resourceCache)) {
            this._resourceCache[path] = 
            {
                'data': this.loadNewResourceForce(storageManager, type, path),
                'used': 0
            };
        }
        this._resourceCache[path].used++;
        return this._resourceCache[path].data;
    }

    public saveResource<T>(storageManager : StorageManager, path : string, resource : T) : boolean {
        let jsonText = JsonHelper.serialize(resource);
        return storageManager.writeFile(path, btoa(jsonText));
    }

    public resourceExists<T>(storageManager : StorageManager, path : string) : boolean {
        return storageManager.fileExists(path);
    }

    public disposeResource<T>(storageManager : StorageManager, path : string) {
        if (path in this._resourceCache) {
            this._resourceCache[path].used--;
            if (this._resourceCache[path].used <= 0) {
                delete this._resourceCache[path];
            }
        }
    }

    /**
     * Searches through all resources and returns a list of paths to resources of a given type.
     * @param type a resource type. example: "sprite" "audio" "vn" "scene" etc...
     */
    public findResourcesOfType(storageManager : StorageManager, type : string) : string[] {
        if (type.startsWith(".")) type = type.substr(1);
        let result : string[] = [];

        function traverse(directory : string = "") {
            // Don't look at raw files
            if (directory == RawResourceManager.RAW_PATH) return;
            storageManager.getFilePathsInDirectory(directory).forEach(path => {
                if (path.endsWith("." + type)) {
                    result.push(path);
                }
            });
            storageManager.getDirectoryPathsInDirectory(directory).forEach(path => {
                traverse(path);
            });
        }

        traverse();

        return result;
    }

    private loadNewResourceForce<T extends Resource>(storageManager : StorageManager, type: Function | INewable<T> | ISerializable, path : string) : T {
        if (storageManager.fileExists(path)) {
            let data = atob(storageManager.readFile(path));
            let result = JsonHelper.deserialize(type, data);
            result.setPathOnLoad(path);
            return result;
        }
        return null;
    }
}
