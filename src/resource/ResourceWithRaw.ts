import { Logger } from "babylonjs";
import { inheritSerialization, autoserialize, autoserializeAs } from "cerialize";
import { RawPath } from "./RawPath";
import { Resource } from "./Resource";

/**
 * A resource that has a "raw" component to it.
 * Useful for one-file type resources such as sprites and audio clips.
 */
@inheritSerialization(Resource)
export abstract class ResourceWithRaw extends Resource {

    @autoserializeAs(RawPath)
    protected resPath : RawPath;

    constructor(resPath : RawPath = null) {
        super();
        if (resPath != null) {
            this.resPath = resPath;
        }
    }

    public getResPath() : RawPath {return this.resPath;}
}
