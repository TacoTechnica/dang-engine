
import * as BABYLON from 'babylonjs'
import * as BABYLONGUI from 'babylonjs-gui'
import { TextBlock } from 'babylonjs-gui';
import Debug from '../../../debug/Debug';
import { GUIManager } from '../../GUIManager';

// Abandoned because this is stupid.
export class FastTextBox extends BABYLONGUI.Control {

    private _gui : GUIManager;
    private _text : string = "";

    constructor(gui : GUIManager, name? : string) {
        super(name);
        this._gui = gui;
    }

    public setText(text : string) : void {
        this._text = text;
        this._markAsDirty();
    }


    _draw(context: CanvasRenderingContext2D, invalidatedRectangle?: BABYLON.Nullable<BABYLONGUI.Measure>): void {
        context.save();
        let sheet = null;//this._gui.getFontSheetCatalog().getFontSheet("30px Arial");
        Debug.logError("This element is broken, you shouldn't run it.");
        let img = sheet.getSheetImage();
        //let crop = sheet.getCharacterLocation('?');

        this._applyStates(context);

        let px = this._currentMeasure.left,
            py = this._currentMeasure.top;

        for (let i = 0; i < this._text.length; ++i) {
            let c = this._text.charAt(i);

            if (c === ' ') {
                px += sheet.getCharacterLocation('l').width;
                continue;
            }

            let characterMeasure = sheet.getCharacterLocation(c);

            let pw = characterMeasure.width,
                ph = characterMeasure.height;
            let cx = characterMeasure.left,
            cy = characterMeasure.top,
            cw = characterMeasure.width,
            ch = characterMeasure.height;
            context.drawImage(img, cx, cy, cw, ch, px, py, pw, ph);

            Debug.logDebug("C: ", c);

            px += characterMeasure.progressWidth;
        }

        // When you compare, there is definitely something wrong with my system here. Shit.
        context.fillText(this._text, this._currentMeasure.left, this._currentMeasure.top + 64);

        /*
            pw = crop.width,
            ph = crop.height;
        let cx = crop.left,
            cy = crop.top,
            cw = crop.width,
            ch = crop.height;

        context.drawImage(img, cx, cy, cw, ch, px, py, pw, ph);
        */

        context.restore();
    }

}

