import * as BABYLON from 'babylonjs'
import * as BABYLONGUI from 'babylonjs-gui'
import { IDialogueBox } from './IDialogueBox';
import { DialogueBox } from './DialogueBox';
import { Game } from '../Game';
import { Container } from 'babylonjs-gui';


export class GUIManager {
    private _advancedTexture : BABYLONGUI.AdvancedDynamicTexture;

    public dialogueBox : IDialogueBox;

    public initialize(game : Game) {
        this._advancedTexture = BABYLONGUI.AdvancedDynamicTexture.CreateFullscreenUI(
            "UI"
        );
        this._advancedTexture.idealWidth = 1920;

        this.dialogueBox = new DialogueBox(game, this);

        // BUG FIX: Force a resize for some rendering to not break.
        game.getBabylon().resize();
    }

    public addControl(control: BABYLONGUI.Control) {
        this._advancedTexture.addControl(control);
        return control;
    }

    public getDynamicTexture() : BABYLONGUI.AdvancedDynamicTexture {return this._advancedTexture;}

    public tickElements() {
        function branchTick(node : BABYLONGUI.Control) {
            if (typeof node["tick"] === 'function') {
                node["tick"]();
            }
            if (node instanceof Container) {
                node.children.forEach(sub => branchTick(sub));
            }
        }
        this._advancedTexture.getChildren().forEach(branchTick);
    }

}
