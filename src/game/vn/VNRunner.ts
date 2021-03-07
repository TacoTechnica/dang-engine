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
import { autoserialize, autoserializeAs } from "cerialize";
import { VNCommand } from "./VNCommand";
import { Game } from "../Game";
import { CoroutineRunner } from "../coroutines/CoroutineRunner";
import Debug, { PopupType } from "../../debug/Debug";
import { Coroutine } from "../coroutines/Coroutine";
import { ResourceManager } from "../../resource/ResourceManager";
import { StorageManager } from "../../resource/StorageManager";
import { Action } from "../../util/Action";


class StackFrame {
    @autoserialize public scriptPath : string;
    @autoserialize public lineNumber : number;
    constructor(scriptPath : string, lineNumber : number) {this.scriptPath = scriptPath; this.lineNumber = lineNumber;}
}

export class VNRunner {

    public onStopRunning : Action = new Action();

    // Stack of {script_path, command_index} objects
    @autoserializeAs(StackFrame) private _serializeStack : Array<StackFrame> = [];
    // Stack of live generators that are running.
    private _liveStack = [];

    @autoserializeAs("running") private _running : boolean = false;

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
        if (this._running) {
            this.onStopRunning.invoke();
        }
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

    public static OnDeserialized(instance : VNRunner, json : any) : void {
        // After we deserialize, fill up our live stack
        instance._liveStack = [];
        instance._serializeStack.forEach((stackFrame : StackFrame) => {

            // For commands like "call", we can NOT repeat the command after running it, otherwise
            // when we finish the call stack we will re-run call and run the same function TWICE!
            let script : VNScript = ResourceManager.current.loadResource(StorageManager.current, VNScript, stackFrame.scriptPath);
            let repeat : boolean = script.getCommands()[stackFrame.lineNumber].shouldRepeatOnLoad();
            let lineToRunFrom = stackFrame.lineNumber;
            if (!repeat) {
                lineToRunFrom++;
            }

            instance._liveStack.push(new Coroutine(instance.runScriptGenerator(Game.current, stackFrame.scriptPath, lineToRunFrom)));
        });
    }
}
