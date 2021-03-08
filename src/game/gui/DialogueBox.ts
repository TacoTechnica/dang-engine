
import * as BABYLONGUI from 'babylonjs-gui'
import Debug from '../../debug/Debug';
import { DRSprite } from "../../resource/resources/DRSprite";
import { Coroutine } from '../coroutines/Coroutine';
import { Game } from "../Game";
import { GUIManager } from "./GUIManager";
import { DocTextBox } from './DocTextBox';
import { IDialogueBox } from "./IDialogueBox";
import { RawInput } from '../input/RawInput';



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
        this._textBox.paddingLeft = "234px"
        this._textBox.paddingTop = "110px"
        this._textBox.width = "1420px";
        this._textBox.color = "white";
        this._textBox.horizontalAlignment = BABYLONGUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this._textBox.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_TOP;
        //this._textBox.textHorizontalAlignment = BABYLONGUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        //this._textBox.textVerticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_TOP;
        gui.addControl(this._outerBox);
        game.getDefaultResources().loadDefaultResource(game.getStorageManager(), game.getResourceManager(), DRSprite, game.getDefaultResources().dialogueBox, (sprite : DRSprite) => {
            sprite.getHTMLImageUrl(game.getStorageManager(), url => {
                // Outer Box/BG
                let background = new BABYLONGUI.Image("background",url);
                this._outerBox.addControl(background);
                this._outerBox.addControl(this._textBox);
            });
        });

        this._outerBox.isVisible = false;
        this._textBox.isVisible = false;

        game.getVNRunner().onStopRunning.addListener(() => {this.close()});
    }

    public *runDialogue(name: string, text: string): IterableIterator<any> {

        // TODO: Animate in

        this._outerBox.isVisible = true;
        this._textBox.isVisible = true;
        this._textBox.setText("");
        this._textBox.setCharacterDisplayCount(0);
        this._textBox.setText(text);

        let counter = 0;

        Debug.logMessage("Dialogue: ", text);

        let textLength = this._textBox.calculateTextLength();
        // Increase the render amount
        while (counter < textLength) {
            // TODO: If we find user SKIP input, skip/set counter to max.
            yield Coroutine.waitSecondsRoutine(0.005, () => {
                if (RawInput.isKeyPressed(' ')) {
                    counter = textLength;
                    return true;
                }
                return false;
            });
            counter++;
            this._textBox.setCharacterDisplayCount(counter);
        }

        this._textBox.setCharacterDisplayCount(-1);

        // TODO: "Next" Arrow
        // TODO: Wait for user NEXT input

        yield Coroutine.waitUntilRoutine(() => {
            return RawInput.isKeyPressed(' ');
        })
    }
    public close(): void {
        // TODO: Animate out
        this._outerBox.isVisible = false;
        this._textBox.isVisible = false;
    }
}