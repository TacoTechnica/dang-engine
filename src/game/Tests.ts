
import Debug from "../debug/Debug";
import { VNScript } from "../resource/resources/VNScript";
import { CoroutineRunner } from "./coroutines/CoroutineRunner";
import { Game } from "./Game";
import { CallCommand } from "./vn/commands/CallCommand";
import { DialogueCommand } from "./vn/commands/DialogueCommand";
import { LabelCommand } from "./vn/commands/LabelCommand";
import { ReturnCommand } from "./vn/commands/ReturnCommand";

/**
 * I want Main to remain unchanged so we keep it consistent.
 * This file will contain all of the rapid testing stuff
 * that we WILL push because it might be useful to go back and look
 * at examples of how to do crap.
 */
export class Test {
    
    public GLOBAL_TEST(game : Game) : void{


        window.setTimeout(() => {

            Debug.logMessage("Creating VN script...")

            let path = "Scripts/TEST_SIMPLE.vn";

            let testScript : VNScript = new VNScript(path);
            
            function dialogue(text) {
                let r = new DialogueCommand();
                r.name = "Name";
                r.text = text;
                testScript.getCommands().push(r);
            }
            function label(label) {
                let r = new LabelCommand();
                r.name = label;
                testScript.getCommands().push(r);
            }
            function call(label) {
                let r = new CallCommand();
                r.labelTarget = label;
                testScript.getCommands().push(r);
            }
            function ret() {
                testScript.getCommands().push(new ReturnCommand());
            }

            // Build the script

            dialogue("A");
            dialogue("B");
            call("function");
            dialogue("F");
            ret();
            dialogue("2) Should never happen");
            label("function");
                dialogue("C");
                call("otherFunction");
                dialogue("E");
                ret();
            label("otherFunction");
                dialogue("D");
                ret();
            dialogue("1) Should never happen");

            Debug.logMessage("Running Simple VN Script System Test");

            if (!game.getStorageManager().directoryExists("Scripts")) {
                game.getStorageManager().createDirectory("Scripts");
            }

            if (game.getResourceManager().saveResource(game.getStorageManager(), testScript, path)) {
                game.getVNRunner().callScript(game, path);

                game.getStorageManager().saveZipFile();
            } else {
                Debug.logError("Failed to save resource at ", path);
            }
        }, 5000);
    }
}
