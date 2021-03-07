
import { GamepadManager } from "babylonjs";
import Debug from "../debug/Debug";
import { VNScript } from "../resource/resources/VNScript";
import { SaveFileManager } from "../resource/SaveFileManager";
import { CoroutineRunner } from "./coroutines/CoroutineRunner";
import { Game } from "./Game";
import { RawInput } from "./input/RawInput";
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

        game.onGameTick.addListener(e => {
            if (RawInput.isKeyPressed('p')) {
                Debug.logDebug("SAVING");
                let state = game.saveState();
                game.getSaveFileManager().save(state);
            } else if (RawInput.isKeyPressed('l')) {
                Debug.logDebug("LOADING");
                game.getSaveFileManager().promptForLoad(data => {
                    Debug.logDebug("(Running from save.)");
                    game.run(data);
                });
            }
        });
    }
}
