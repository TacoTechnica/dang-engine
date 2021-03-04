import { Coroutine } from "./coroutines/Coroutine";
import { CoroutineRunner } from "./coroutines/CoroutineRunner";
import { Game } from "./Game";

/**
 * I want Main to remain unchanged so we keep it consistent.
 * This file will contain all of the rapid testing stuff
 * that we WILL push because it might be useful to go back and look
 * at examples of how to do crap.
 */
export class Test {

    private *inner() {
        console.log("    INNER: a");
        yield null;
        console.log("    INNER: b");
        yield null;
    }

    private *outer() {
        console.log("A");
        yield null;
        console.log("B");
        yield this.inner();
        console.log("C");
        yield null;
    }

    public GLOBAL_TEST(game : Game) : void{

        let runner : CoroutineRunner = new CoroutineRunner();

        let routine : Coroutine = runner.run(this.outer());

        let counter = 0;
        console.log("running coroutine test...");
        while (routine.isRunning()) {
            console.log("iter ", counter++);
            routine.tick();
        }
        console.log("done");
    }
}