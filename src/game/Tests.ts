
import { GamepadManager } from "babylonjs";
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

    private test(e) : void {
        Debug.logMessage("UH OH THIS SHOULD NOT RUN");
    }

    public GLOBAL_TEST(game : Game) : void{

        game.onGameStart.addListener(this.test);

        game.onGameStart.addListener(e => {
            let game = e.detail;
            let path = "Scripts/TEST_SIMPLE.vn";
            Debug.logMessage("Running Simple VN Script System Test");

            if (game.getResourceManager().resourceExists(game.getStorageManager(), path)) {
                game.getVNRunner().callScript(game, path);
            }
        });

        game.onGameStart.removeListener(this.test);
    }
}
