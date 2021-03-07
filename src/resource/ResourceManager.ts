/**
 * Handles the loading + reading of resources.
 * 
 * Caches the resources so we don't have to reload them all the time.
 */
import { INewable, ISerializable } from "cerialize";
import Debug from "../debug/Debug";
import { JsonHelper } from "./JsonHelper";
import { ProjectInfo } from "./resources/ProjectInfo";
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

    public saveResource<T>(storageManager : StorageManager, resource : T, path : string) : boolean {
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

    public projectFileExists(storageManager : StorageManager) : boolean {
        return this.resourceExists(storageManager, "project.json");
    }

    public loadProjectFile(storageManager : StorageManager) : ProjectInfo {
        return this.loadResource(storageManager, ProjectInfo, "project.json");
    }

    public loadResourceFromURL<T extends Resource>(storageManager : StorageManager, type: Function | INewable<T> | ISerializable, path : string, onLoad : (resource :T) => void) : void {
        let key = "#URL//" + path;
        if (!(key in this._resourceCache)) {
            JsonHelper.readFromURL(path, data => {
                data = data;
                let result = JsonHelper.deserialize(type, data);
                this._resourceCache[key] = 
                {
                    'data': result,
                    'used': 0
                };
                onLoad(result);
            })
        } else {
            onLoad(this._resourceCache[key].data);
        }
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
