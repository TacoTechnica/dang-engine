import { Logger } from "babylonjs";
import { inheritSerialization, autoserialize, autoserializeAs } from "cerialize";
import { RawPath } from "./RawPath";
import { Resource } from "./Resource";
import { StorageManager } from "./StorageManager";

/**
 * A resource that has a "raw" component to it.
 * Useful for one-file type resources such as sprites and audio clips.
 */
@inheritSerialization(Resource)
export abstract class ResourceWithRaw extends Resource {

    @autoserializeAs(RawPath, "resPath")
    protected _resPath : RawPath;

    constructor(path : string, resPath : RawPath = null) {
        super(path);
        if (resPath != null) {
            this._resPath = resPath;
        }
    }

    protected getRawPath() : RawPath {
        return this._resPath;
    }
}
