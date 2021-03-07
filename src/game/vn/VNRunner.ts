/**
 * TODO: Check notion.
 * You wanna make this da runner
 * and keep the serialization + running
 * 
 * EL MUY SIMPLE
 * 
 * live Stack + serialization stack
 * 
 * easy deserialization of serialization stack
 * then conversion of deserialized serialization stack => a new Live stack.
 * (this new live stack is NOT identical to the pre-serialized one, and that's OK. it will rerun the last command)
 * 
 */

import { VNScript } from "../../resource/resources/VNScript";
import { autoserializeAs } from "cerialize";
import { VNCommand } from "./VNCommand";
import { Game } from "../Game";
import { CoroutineRunner } from "../coroutines/CoroutineRunner";
import Debug, { PopupType } from "../../debug/Debug";
import { Coroutine } from "../coroutines/Coroutine";


class StackFrame {
    public scriptPath : string;
    public lineNumber : number;
    constructor(scriptPath : string, lineNumber : number) {this.scriptPath = scriptPath; this.lineNumber = lineNumber;}
}

export class VNRunner {

    // Stack of {script_path, command_index} objects
    @autoserializeAs(StackFrame) private _serializeStack = [];
    // Stack of live generators that are running.
    private _liveStack = [];

    private _running : boolean = false;

    // Run a script, adding to the current stack and starting up the coroutine runner if it hasn't been started already.
    public callScript(game : Game, scriptPath : string, commandIndex : number = 0) {
        // Push a new script to the live stack.
        this._liveStack.push(new Coroutine(this.runScriptGenerator(game, scriptPath, commandIndex)));
        // We've started running the script.
        this._serializeStack.push(new StackFrame(scriptPath, commandIndex));

        //Debug.logDebug("CALL:     ", this._liveStack.length, JSON.stringify(this._serializeStack));

        this._running = true;
    }

    public stopCurrentScript() {
        this._liveStack.pop();
        this._serializeStack.pop();
    }

    public onTick() {
        if (this._running) {
            // Select new coroutine
            if (this._liveStack.length == 0) {
                Debug.logMessage("VN Stack depleted, no longer running.");
                this.stop();
                return;
            }
            let currentRoutine : Coroutine = this._liveStack[this._liveStack.length - 1];
            currentRoutine.tick();
        }
    }

    public stop() {
        this._running = false;
        this._liveStack = [];
        this._serializeStack = [];
    }

    public currentState() : StackFrame {
        if (this._serializeStack.length == 0) return null;
        return this._serializeStack[this._serializeStack.length - 1];
    }

    private *runScriptGenerator(game : Game, scriptPath : string, commandIndex : number) {
        if (!game.getResourceManager().resourceExists(game.getStorageManager(), scriptPath)) {
            Debug.popup("Failed to run script at path " + scriptPath + " as it does not exist.", PopupType.Warning);
            return;
        }
        let scriptToRun : VNScript = game.getResourceManager().loadResource(game.getStorageManager(), VNScript, scriptPath);

        let stackIndex = this._liveStack.length - 1;
        let stack = this._serializeStack[stackIndex];


        // Scroll through commands and update their stack.
        for (let index = commandIndex; index < scriptToRun.getCommands().length; ++index) {
            let command : VNCommand = scriptToRun.getCommands()[index];
            stack.lineNumber = index;
            //Debug.logDebug("Run", JSON.stringify(this._serializeStack));
            yield command.run(game);
        }

        //Debug.logDebug("Stopped script stack");
        // Delete the item from the stack position we used to be in.
        // This is here to solve a race condition where an extra stack frame is added BEFORE we get here.
        this._liveStack.splice(stackIndex, 1);
        this._serializeStack.splice(stackIndex, 1);
        // We're done
        //this._serializeStack.pop();
    }
}
