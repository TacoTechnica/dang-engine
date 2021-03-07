
import { inheritSerialization } from "cerialize";
import { Game } from "../../Game";
import { GlobalVNCommandRegistry } from "../GlobalVNCommandRegistry";
import { VNCommand } from "../VNCommand";


@inheritSerialization(VNCommand)
export class ReturnCommand extends VNCommand {

    constructor() {
        super(GlobalVNCommandRegistry.RETURN);
    }

    public *run(game : Game): IterableIterator<any> {

        // Return
        game.getVNRunner().stopCurrentScript();

        // WAIT ONE FRAME to let other script run?
        yield null;

        return;
    }

}
