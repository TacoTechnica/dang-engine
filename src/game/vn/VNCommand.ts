import { autoserializeAs } from "cerialize";
import { VNScript } from "../../resource/resources/VNScript";
import { ITypeSerializable } from "../../resource/typeSerialization/ITypeSerializable";
import { Game } from "../Game";


export abstract class VNCommand implements ITypeSerializable {
    @autoserializeAs("@type")
    private _type : string;

    private _repeatOnLoad : boolean;

    constructor(type : string, repeatOnLoad : boolean) {
        this._type = type;
        this._repeatOnLoad = repeatOnLoad;
    }

    public abstract run(game : Game) : IterableIterator<any>;

    public onLoad(vnScript : VNScript, lineNumber : number) : void {}

    // Some commands should REPEAT when they are loaded like dialogue,
    // but others MUST ONLY FIRE ONCE, like calling a script.
    // (If we're calling a script and we repeat the call command
    // after loading, we will call the script TWICE.)
    public shouldRepeatOnLoad() : boolean {
        return this._repeatOnLoad;
    }

    getTypeKey(): string {
        return this._type;
    }
}
