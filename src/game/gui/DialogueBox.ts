
import * as BABYLONGUI from 'babylonjs-gui'
import Debug from '../../debug/Debug';
import { DRSprite } from "../../resource/resources/DRSprite";
import { Coroutine } from '../coroutines/Coroutine';
import { Game } from "../Game";
import { GUIManager } from "../GUIManager";
import { DocTextBox } from './DocTextBox';
import { IDialogueBox } from "./IDialogueBox";



export class DialogueBox implements IDialogueBox {

    private _outerBox : BABYLONGUI.Container;
    private _textBox : DocTextBox;

    constructor(game : Game, gui : GUIManager) {
        this._outerBox = new BABYLONGUI.Container("box");
        let padSide = "16px";
        let padBottom = "32px";
        let height = (256 + 128).toString() +"px";
        this._outerBox.paddingLeft = padSide;
        this._outerBox.paddingRight = padSide;
        this._outerBox.paddingBottom = padBottom;
        this._outerBox.height = height;
        this._outerBox.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        this._textBox = new DocTextBox(gui, "text", 42);//new BABYLONGUI.TextBlock("text", "");
        this._textBox._markAsDirty();
        // TODO: Make padding left + width set via offsets configured as a custom range in the editor.
        this._textBox.paddingLeft = "248px"
        this._textBox.paddingTop = "130px"
        this._textBox.width = "1420px";
        this._textBox.color = "white";
        this._textBox.horizontalAlignment = BABYLONGUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this._textBox.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_TOP;
        //this._textBox.textHorizontalAlignment = BABYLONGUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        //this._textBox.textVerticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_TOP;
        gui.addControl(this._outerBox);
        game.getDefaultResources().loadDefaultResource(game.getStorageManager(), game.getResourceManager(), DRSprite, game.getDefaultResources().dialogueBox, sprite => {
            sprite.getHTMLImageUrl(game.getStorageManager(), url => {
                // Outer Box/BG
                let background = new BABYLONGUI.Image("background",url);
                this._outerBox.addControl(background);
                this._outerBox.addControl(this._textBox);
            });
        });

        this._outerBox.isVisible = false;
    }

    public *runDialogue(name: string, text: string): IterableIterator<any> {

        // TODO: Animate in

        this._outerBox.isVisible = true;
        this._textBox.setCharacterDisplayCount(0);
        this._textBox.setText(text);

        let counter = 0;

        Debug.logMessage("Dialogue: ", text);

        // Increase the render amount
        while (counter < text.length) {
            // TODO: If we find user SKIP input, skip/set counter to max.
            yield Coroutine.waitSecondsRoutine(0.005);
            counter++;
            this._textBox.setCharacterDisplayCount(counter);
        }

        // TODO: Delete following lines
        // TODO: Wait for user NEXT input

        yield Coroutine.waitSecondsRoutine(0.75);
    }
    public close(): void {
        // TODO: Animate out
        this._outerBox.isVisible = false;
    }
}