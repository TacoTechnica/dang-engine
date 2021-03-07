
import * as BABYLON from 'babylonjs'
import * as BABYLONGUI from 'babylonjs-gui'
import { GUIManager } from './GUIManager';

/**
 * A text box that uses HTML to render text
 * becuase babylon gui is ABSURDLY slow.
 */
export class DocTextBox extends BABYLONGUI.Container {

    private _node : HTMLElement;
    private _gui : GUIManager;
    private _text : string = "";
    private _characterDisplayCount : number;

    constructor(gui : GUIManager, name : string, fontSize : number) {
        super(name);
        this._gui = gui;
        this.fontSize = fontSize;

        this._characterDisplayCount = -1;

        //let canvas = gui.getDynamicTexture().getContext().canvas;

        this._node = document.createElement("p");
        document.body.prepend(this._node);
        this._node.onload = evt => {
            this.setNodePos(this.leftInPixels, this.topInPixels, this.widthInPixels, this.heightInPixels);
        }
        //canvas.appendChild(this._node);
    }

    public setText(text : string) : void {
        this._text = text;
        this.generateTextHTML();
    }

    public setCharacterDisplayCount(count) {
        this._characterDisplayCount = count;
        this.generateTextHTML();
    }

    public setFont(font) {
        this.fontSize = font;
        this.updateVisualFontInternal();
    }

    private generateTextHTML() {
        if (this._characterDisplayCount == -1) {
            this._node.innerText = this._text;
        } else {
            let pre = this._text.substr(0, this._characterDisplayCount);
            let post = this._text.substr(this._characterDisplayCount);
            let hideSpanStart = '<span style="color: rgba(0,0,0,0);">';
            let hideSpanEnd = '</span>';
            this._node.innerHTML = pre + hideSpanStart + post + hideSpanEnd;
        }
    }

    private setNodePos(x, y, width, height) {
        let canvasRect = this._gui.getDynamicTexture().getContext().canvas.getBoundingClientRect();
        x += canvasRect.left;
        y += canvasRect.top;
        this._node.style.position = "absolute";
        this._node.style.left = x + "px";
        this._node.style.top = y + "px";
        this._node.style.width = width + "px";
        this._node.style.height = height + "px";
        this._node.style.padding = '0 0 0 0';

        this.updateVisualFontInternal();
    }

    private updateVisualFontInternal() {
        let t = this._gui.getDynamicTexture();
        let idealScale = 1;//t.getSize().width / t.idealWidth;

        this._node.style.fontSize = (this.fontSizeInPixels * idealScale) + "px";
    }

    _layout(parentMeasure: BABYLONGUI.Measure, context: CanvasRenderingContext2D): boolean {
        this.setNodePos(this.paddingLeftInPixels + parentMeasure.left, this.paddingTopInPixels + parentMeasure.top, this.widthInPixels, this.heightInPixels);
        return true;
    }

}
