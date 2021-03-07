import { autoserialize, autoserializeAs, inheritSerialization } from "cerialize";
import { TextXSS } from "../../../util/TextXSS";
import { Game } from "../../Game";
import { GlobalVNCommandRegistry } from "../GlobalVNCommandRegistry";
import { VNCommand } from "../VNCommand";


@inheritSerialization(VNCommand)
export class DialogueCommand extends VNCommand {

    @autoserialize public name : string;
    @autoserialize public text : string;

    constructor() {
        super(GlobalVNCommandRegistry.DIALOGUE, true);
    }

    public *run(game : Game): IterableIterator<any> {
        // TODO: Handle "observer" view for characters and observable objects, given "this.name"

        // XSS protection
        let htmlName = TextXSS.filterXSSDisplayText(this.name);
        let htmlText = TextXSS.filterXSSDisplayText(this.text);

        yield game.getGUIManager().dialogueBox.runDialogue(htmlName, htmlText);
    }
}
