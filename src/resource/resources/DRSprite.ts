import { inheritSerialization, autoserializeAs } from "cerialize";
import { Vector2 } from "babylonjs";
import { RawPath } from "../RawPath";
import { Resource } from "../Resource";
import { ResourceWithRaw } from "../ResourceWithRaw";

@inheritSerialization(ResourceWithRaw)
export class DRSprite extends ResourceWithRaw {

    @autoserializeAs("pivot")
    private _pivot : Vector2 = Vector2.Zero();

    constructor(resPath : RawPath = null) {
        super(resPath);
    }

    public getPivot() {return this._pivot;}
}
function autoSerializeAs(arg0: string) {
    throw new Error("Function not implemented.");
}

