
/**
 * Represents a raw path that points to either a raw resource or a web URL
 */

import Logger from "../logger/Logger";
import { StorageManager } from "./StorageManager";

import { autoserialize } from "cerialize";
import { JsonHelper } from "./JsonHelper";

export class RawPath {

    @autoserialize private path : string;

    constructor(path : string) {
        this.path = path;
    }

    public isURL() : boolean {
        return !this.path.startsWith(".raw/");
    }

    public getPath() : string {return this.path;}

    public readRawBase64(storageManager : StorageManager, onLoad : (data : string) => void) : void {
        if (this.isURL()) {
            // Assume we're reading from the web then.
            JsonHelper.readFromURL(this.path, data => onLoad(btoa(data)));
        } else {
            onLoad(storageManager.readFile(this.path));
        }
    }
}