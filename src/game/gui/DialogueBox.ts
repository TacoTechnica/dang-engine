
import * as BABYLONGUI from 'babylonjs-gui'
import { DefaultResources } from "../../resource/DefaultResources";
import { DRSprite } from "../../resource/resources/DRSprite";
import { Game } from "../Game";
import { GUIManager } from "../GUIManager";
import { IDialogueBox } from "./IDialogueBox";


export class DialogueBox implements IDialogueBox {

    private _outerBox : BABYLONGUI.Image;

    constructor(game : Game, gui : GUIManager) {
        game.getDefaultResources().loadDefaultResource(game.getStorageManager(), game.getResourceManager(), DRSprite, game.getDefaultResources().dialogueBox, sprite => {
            sprite.getHTMLImageUrl(game.getStorageManager(), url => {
                // Outer Box/BG
                this._outerBox = new BABYLONGUI.Image("bg", url);
                let padSide = "16px";
                let padBottom = "32px";
                let height = (256 + 128).toString() +"px";
                this._outerBox.paddingLeft = padSide;
                this._outerBox.paddingRight = padSide;
                this._outerBox.paddingBottom = padBottom;
                this._outerBox.height = height;
                this._outerBox.verticalAlignment = BABYLONGUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
                gui.addControl(this._outerBox);
            });
        });
    }

    runDialogue(name: string, text: string): IterableIterator<any> {
        throw new Error("Method not implemented.");
    }
    close(): void {
        throw new Error("Method not implemented.");
    }

}