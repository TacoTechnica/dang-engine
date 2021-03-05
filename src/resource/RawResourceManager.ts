
/**
 * 
 * Each project has a series of raw resources stored in .raw
 * 
 * This class manages them.
 * 
 */

import Debug from "../debug/Debug";
import { StorageManager } from "./StorageManager";

export class RawResourceManager {

    public static readonly RAW_PATH : string = ".raw";

    private _resourceCounter : number = 0;

    public reload(storageManager : StorageManager) : void {
        this._resourceCounter = 0;
        if (storageManager.directoryExists(RawResourceManager.RAW_PATH)) {
            storageManager.getFilePathsInDirectory(RawResourceManager.RAW_PATH).forEach(path => {
                let preIndex = path;
                let extensionIndex = path.lastIndexOf(".");
                if (extensionIndex != -1) {
                    preIndex = path.substr(extensionIndex);
                }
                let number = this.pathToCounter(preIndex);
                if (number > this._resourceCounter) {
                    this._resourceCounter = number;
                }
            });
        }
    }

    /**
     * Given some data, register it as a new raw resource
     * and return its location.
     * 
     * @param dataB64 The data to save
     * @returns The path to the raw resource
     */
    public createNewRawResource(storageManager : StorageManager, dataBase64 : string, extension : string) : string {
        if (extension.startsWith(".")) extension = extension.substr(1);
        if (!storageManager.directoryExists(RawResourceManager.RAW_PATH)) {
            Debug.logMessage("Creating new project raw directory");
            storageManager.createDirectory(RawResourceManager.RAW_PATH);
        }

        let newPath = RawResourceManager.RAW_PATH + "/" + this.counterToPath(this._resourceCounter) + "." + extension;

        if (storageManager.writeFile(newPath, dataBase64)) {
            this._resourceCounter++;
            Debug.logError("Failed to create + register new raw resource at ", newPath, ", extension=", extension);
            return newPath;
        } else {
            return null;
        }
    }

    public rawResourceExists(storageManager : StorageManager, path : string) : boolean{
        if (!path.startsWith(RawResourceManager.RAW_PATH + "/")) {
            path = RawResourceManager.RAW_PATH + "/" + path;
        }
        return storageManager.fileExists(path);
    }
    public readRawResourceData(storageManager : StorageManager, path : string) {
        if (!path.startsWith(RawResourceManager.RAW_PATH + "/")) {
            path = RawResourceManager.RAW_PATH + "/" + path;
        }
        if (this.rawResourceExists(storageManager, path)) {
            return storageManager.readFile(path);
        } else {
            Debug.logError("Invalid raw resource path, does not exist: ", path);
            return null;
        }
    }

    public findRawResourcesMatching(storageManager : StorageManager, regex : RegExp) : string[] {
        let result : string[] = [];

        if (storageManager.directoryExists(RawResourceManager.RAW_PATH)) {
            storageManager.getFilePathsInDirectory(RawResourceManager.RAW_PATH).forEach(path => {
                if (regex.test(path)) result.push(path);
            })
        }
        return result;
    }
    public findRawResourcesWithExtensions(storageManager : StorageManager, ...extensions : string[]) : string[] {
        extensions.forEach((extension, i) => {
            if (extension.startsWith(".")) extension = extension.substr(1);
            extensions[i] = '.*\.' + extension;
        });
        let regstr : string = extensions.join('|');
        return this.findRawResourcesMatching(storageManager, new RegExp(regstr));
    }

    private pathToCounter(path : string) : number {
        return parseInt(path, 36);
    }
    private counterToPath(counter : number) : string {
        return counter.toString(36);
    }

    // TO ADD:
    /**
     * 
     * 
     * findRawResourcesMatching(regex)
     * 
     * Later on figure out how to parse sprites and audio and stuff from here, whatever format we want to use.
     * 
     */
}
