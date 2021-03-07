import { autoserialize, autoserializeAs, inheritSerialization } from "cerialize";
import { VNScript } from "../../../resource/resources/VNScript";
import { Game } from "../../Game";
import { GlobalVNCommandRegistry } from "../GlobalVNCommandRegistry";
import { VNCommand } from "../VNCommand";


@inheritSerialization(VNCommand)
export class CallCommand extends VNCommand {

    @autoserialize public scriptTarget : string = null;
    @autoserialize public labelTarget : string = null;

    constructor() {
        super(GlobalVNCommandRegistry.CALL, false);
    }

    public *run(game : Game): IterableIterator<any> {

        // By default, assume we're dealing with our own script.
        let script = this.scriptTarget;
        if (script == null) {
            script = game.getVNRunner().currentState().scriptPath;
        }
        let line = 0;
        if (this.labelTarget != null) {
            line = game.getResourceManager().loadResource(game.getStorageManager(), VNScript, script).getLabelTargetIndex(this.labelTarget);
        }

        // Call
        game.getVNRunner().callScript(game, script, line);


        return;
    }

}
