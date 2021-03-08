import * as BABYLON from 'babylonjs'
import { inheritSerialization, autoserializeAs } from "cerialize";
import { RawPath } from "../RawPath";
import { ResourceWithRaw } from "../ResourceWithRaw";
import { StorageManager } from "../StorageManager";

@inheritSerialization(ResourceWithRaw)
export class DRSprite extends ResourceWithRaw {

    @autoserializeAs("pivot")
    private _pivot : BABYLON.Vector2 = new BABYLON.Vector2(0.5, 1);

    @autoserializeAs("worldScale")
    private _worldScale : number = 1;

    constructor(path : string, resPath : RawPath = null) {
        super(path, resPath);

    }

    public getPivot() : BABYLON.Vector2 {return this._pivot;}

    public getHTMLImageUrl(storageManager : StorageManager, onLoad : (url : string) => void) : void {
        if (this.getRawPath().isURL()) {
            onLoad(this.getRawPath().getPath());
        } else {
            this.getRawPath().readRawBase64(storageManager, data => onLoad('data:image/png;base64,' + data));
        }
    }
    public getHTMLImage(storageManager : StorageManager, onLoad : (image : HTMLImageElement) => void) : void {
        this.getHTMLImageUrl(storageManager, url => {
            var i = new Image();
            i.onload = function(){
                onLoad(i);
            };
            i.src = url;
        });
    }

    public getActualWorldScale() : number {
        return this._worldScale / 100.0;
    }

}

