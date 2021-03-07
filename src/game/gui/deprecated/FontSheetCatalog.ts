
/**
 * This keeps track of font characters as a font sheet of sorts.
 */

import Debug from "../../../debug/Debug";
import { GUIManager } from "../../GUIManager";


class CachedCharacterRegion {
    public left : number;
    public top : number;
    public width : number;
    public progressWidth : number;
    public height : number;
}

class CachedFontSheet {

    private static CHARACTERS_TO_RENDER : string = "abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()-=_+[]{};'\\:\"|,./<>?`~";

    private _font : string;
    private _sheetImage = null;

    private _characterLocations = {};

    constructor(font : string) {
        this._font = font;
    }

    public generateSheet(gui : GUIManager, renderCanv : HTMLCanvasElement) : void {
        let textToLoad = CachedFontSheet.CHARACTERS_TO_RENDER;
        let ctx = renderCanv.getContext("2d");

        // I loathe text rendering so bad
        let STUPID_BUFFER = 4;

        function getDisplayWidth(character) {
            let size = ctx.measureText(character);
            return Math.abs(size.actualBoundingBoxLeft) + Math.abs(size.actualBoundingBoxRight) + STUPID_BUFFER;
        }
        function getProgressWidth(character) {
            return ctx.measureText(character).width;
        }

        let width = 0;
        for (let i = 0; i < textToLoad.length; ++i) { width += getDisplayWidth(textToLoad.charAt(i)); };
        renderCanv.width = width;
        //Debug.logDebug(size.actualBoundingBoxAscent, size.actualBoundingBoxDescent);
        // TODO: Get actual height pls
        renderCanv.height = 64;//size.fontBoundingBoxAscent + size.actualBoundingBoxDescent;
        ctx.clearRect(0, 0, renderCanv.width, renderCanv.height);
        ctx.fillStyle = "white" // TODO: Leave at some standard color and shade in when drawing.
        // TODO: Get actual height pls and offset
        //ctx.fillText(textToLoad, 0, 32);
        let offsetX = 0;
        let offsetY = 0;
        let universalHeight = renderCanv.height;
        for (let i = 0; i < textToLoad.length; ++i) {
            let c = textToLoad.charAt(i);
            //let prevSize = ctx.measureText(sub);
            let cSize = ctx.measureText(c);

            ctx.fillText(c, offsetX, 32);

            let newRegion : CachedCharacterRegion = new CachedCharacterRegion();
            let regionWidth = getDisplayWidth(c);
            newRegion.left = offsetX;//prevSize.width;//prevSize.actualBoundingBoxLeft + prevSize.actualBoundingBoxRight;
            newRegion.top = 0;
            newRegion.width = regionWidth - STUPID_BUFFER;//cSize.actualBoundingBoxLeft + cSize.actualBoundingBoxRight;
            newRegion.progressWidth = getProgressWidth(c);
            newRegion.height = universalHeight;
            this._characterLocations[c] = newRegion;
            offsetX += regionWidth;
        }
        let url = renderCanv.toDataURL("image/png");

        this._sheetImage = document.createElement('img');
        this._sheetImage.src = url;


        Debug.logDebug("(todo: Delete this message) GENERATED SHEET: ");
        Debug.logDebug(this._sheetImage);
        document.body.appendChild(this._sheetImage);
    }

    public getSheetImage() {return this._sheetImage;}
    public getCharacterLocation(character) : CachedCharacterRegion {return this._characterLocations[character];}
}

export class FontSheetCatalog {

    private _gui : GUIManager;
    private _cachedFonts = {};

    private _testCanvas : HTMLCanvasElement;

    constructor (gui : GUIManager) {
        this._gui = gui;
    }


    public getFontSheet(font : string): CachedFontSheet {
        if (!(font in this._cachedFonts)) {
            let newSheet = new CachedFontSheet(font);
            if (this._testCanvas == null) {
                this._testCanvas = document.createElement("canvas");
            }
            newSheet.generateSheet(this._gui, this._testCanvas);
            this._cachedFonts[font] = newSheet;
        }
        return this._cachedFonts[font];
    }
}