import * as BABYLON from 'babylonjs'
import * as BABYLONGUI from 'babylonjs-gui'
import { IDialogueBox } from './gui/IDialogueBox';
import { DialogueBox } from './gui/DialogueBox';
import { Game } from './Game';


export class GUIManager {
    private _advancedTexture : BABYLONGUI.AdvancedDynamicTexture;

    public dialogueBox : IDialogueBox;

    public initialize(game : Game) {
        this._advancedTexture = BABYLONGUI.AdvancedDynamicTexture.CreateFullscreenUI(
            "UI"
        );
        this._advancedTexture.idealWidth = 1920;
        this.dialogueBox = new DialogueBox(game, this);
    }

    public addControl(control: BABYLONGUI.Control) {
        this._advancedTexture.addControl(control);
        return control;
    }

}
