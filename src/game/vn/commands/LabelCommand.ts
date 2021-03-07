import { autoserialize, autoserializeAs, inheritSerialization } from "cerialize";
import { VNScript } from "../../../resource/resources/VNScript";
import { Game } from "../../Game";
import { GlobalVNCommandRegistry } from "../GlobalVNCommandRegistry";
import { VNCommand } from "../VNCommand";


@inheritSerialization(VNCommand)
export class LabelCommand extends VNCommand {

    @autoserialize public name : string;

    constructor() {
        super(GlobalVNCommandRegistry.LABEL);
    }

    public *run(game : Game): IterableIterator<any> {
        // Do nothing, labels are instant.
        return;
    }

    // Override
    public onLoad(vnScript : VNScript, lineNumber : number) : void {
        vnScript.addLabel(this.name, lineNumber);
    }
}
