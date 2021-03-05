import { inheritSerialization, autoserializeAs } from "cerialize";
import { Vector2 } from "babylonjs";
import { RawPath } from "../RawPath";
import { ResourceWithRaw } from "../ResourceWithRaw";
import { StorageManager } from "../StorageManager";

@inheritSerialization(ResourceWithRaw)
export class DRSprite extends ResourceWithRaw {

    @autoserializeAs("pivot")
    private _pivot : Vector2 = Vector2.Zero();

    constructor(path : string, resPath : RawPath = null) {
        super(path, resPath);
    }

    public getPivot() {return this._pivot;}

    public getHTMLImageUrl(storageManager : StorageManager, onLoad : (url : string) => void) : void {
        if (this.getRawPath().isURL()) {
            onLoad(this.getRawPath().getPath());
        } else {
            this.getRawPath().readRawBase64(storageManager, data => onLoad('data:image/png;base64,' + data));
        }
    }

}

