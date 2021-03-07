import { autoserializeAs } from "cerialize";
import { VNScript } from "../../resource/resources/VNScript";
import { ITypeSerializable } from "../../resource/typeSerialization/ITypeSerializable";
import { Game } from "../Game";


export abstract class VNCommand implements ITypeSerializable {
    @autoserializeAs("@type")
    private _type : string;

    constructor(type : string) {
        this._type = type;
    }

    public abstract run(game : Game) : IterableIterator<any>;

    public onLoad(vnScript : VNScript, lineNumber : number) : void {}

    getTypeKey(): string {
        return this._type;
    }
}
