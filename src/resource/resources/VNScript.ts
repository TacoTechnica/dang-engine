import { autoserializeAs, inheritSerialization } from "cerialize";
import Debug from "../../debug/Debug";
import { VNCommand } from "../../game/vn/VNCommand";
import { VNCommandSerializer } from "../../game/vn/VNCommandSerializer";
import { Resource } from "../Resource";


@inheritSerialization(Resource)
export class VNScript extends Resource {

    @autoserializeAs(new VNCommandSerializer(), "commands") private _commands = [];

    // Don't serialize, these are loaded in from the commands themselves and cached.
    private _labelMap = {};

    public getCommands() : VNCommand[] {return this._commands};

    public addLabel(label : string, commandNumber : number) : void {
        if (label in this._labelMap) {
            throw new Error("Duplicate VNScript label set attempted: " + label + " set to commandIndex=" + commandNumber + " when it already exists at commandIndex=" + this._labelMap[label]);
        }
        this._labelMap[label] = commandNumber;
    }

    public getLabelTargetIndex(label : string) : number {
        if (label in this._labelMap) {
            return this._labelMap[label];
        }
        Debug.popup("Attempted to access unidentified label in script: " + label + ", the script won't function properly.");
        return -1;
    }

    public labelExists(label : string) : boolean {
        return label in this._labelMap;
    }

    // After deserialized, each command might have a "script load" condition it may want to satisfy.
    public static OnDeserialized(instance : VNScript, json : any) : void {
        instance._labelMap = {};
        for (let i = 0; i < instance.getCommands().length; ++i) {
            let command : VNCommand = instance.getCommands()[i];
            command.onLoad(instance, i);
        }
    }
}
