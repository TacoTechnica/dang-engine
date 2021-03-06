
import Debug from "../debug/Debug";
import { CoroutineRunner } from "./coroutines/CoroutineRunner";
import { Game } from "./Game";

/**
 * I want Main to remain unchanged so we keep it consistent.
 * This file will contain all of the rapid testing stuff
 * that we WILL push because it might be useful to go back and look
 * at examples of how to do crap.
 */
export class Test {
    
    public GLOBAL_TEST(game : Game) : void{

        let coroutineRunner : CoroutineRunner = new CoroutineRunner();

        function loop() {
            coroutineRunner.onTick();
        }

        function run() {
            Debug.logMessage("RUNNING!");
            let testText = 'A train is a form of rail transport consisting of a series of connected vehicles that generally run along a railroad track to transport passengers or cargo. The word "train" comes from the Old French trahiner, derived from the Latin trahere........';
            coroutineRunner.run(game.getGUIManager().dialogueBox.runDialogue("Name", testText));

            window.setInterval(loop, 10);
        }

        window.setTimeout(run, 2000);
    }
}
