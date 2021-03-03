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

    public getBase64SpriteUrl(storageManager : StorageManager) {
        return 'data:image/png;base64,' + this.getRawBase64(storageManager);
    }

}

