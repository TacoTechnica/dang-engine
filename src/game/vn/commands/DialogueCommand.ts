import { autoserialize, autoserializeAs, inheritSerialization } from "cerialize";
import { Game } from "../../Game";
import { GlobalVNCommandRegistry } from "../GlobalVNCommandRegistry";
import { VNCommand } from "../VNCommand";


@inheritSerialization(VNCommand)
export class DialogueCommand extends VNCommand {

    @autoserialize public name : string;
    @autoserialize public text : string;

    constructor() {
        super(GlobalVNCommandRegistry.DIALOGUE);
    }

    public *run(game : Game): IterableIterator<any> {
        // TODO: Handle "observer" view for characters and observable objects, given "this.name"
        yield game.getGUIManager().dialogueBox.runDialogue(this.name, this.text);
    }
}
