
import * as BABYLON from 'babylonjs'
import * as BABYLONGUI from 'babylonjs-gui'
import Debug from '../../debug/Debug';
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
        gui.getHTMLOverlayContainer().appendChild(this._node);
        //document.body.prepend(this._node);
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

    public calculateTextLength() : number {
        return DocTextBox.calculateTextLength(this._text);
    }

    private static calculateTextLength(htmlText : string) {
        let counter = 0;
        let insideBracketCount = 0;
        for (let i = 0; i < htmlText.length; ++i) {
            let c = htmlText.charAt(i);
            if (c == '<') {
                insideBracketCount++;
            }
            if (insideBracketCount <= 0) {
                let escapeSize = this.getLengthOfThisHTMLEscapeCode(htmlText, i);
                if (escapeSize != -1) {
                    // escapeSize = innerEscapeCode Thing
                    i += escapeSize + 1;
                }
                counter ++;
            }
            if (c == '>') {
                insideBracketCount--;
            }
        }
        return counter;
    }

    private static calculateHTMLLengthFromTextLength(htmlText : string, desiredTextLength : number) : number {
        let insideBracketCount = 0;
        for (let i = 0; i < htmlText.length; ++i) {
            let c = htmlText.charAt(i);
            if (c == '<') {
                insideBracketCount++;
            }
            if (insideBracketCount <= 0) {
                desiredTextLength--;
                let escapeSize = this.getLengthOfThisHTMLEscapeCode(htmlText, i);
                if (escapeSize != -1) {
                    // escapeSize = innerEscapeCode Thing
                    i += escapeSize + 1;
                }
                if (desiredTextLength == 0) {
                    return i;
                }
            }
            if (c == '>') {
                insideBracketCount--;
            }
        }
        return htmlText.length;
    }

    private static getLengthOfThisHTMLEscapeCode(htmlText : string, escapeStart : number) : number {
        let maxEscape = 6;
        if (htmlText.charAt(escapeStart) != '&') return -1;
        let inner = "";
        let closed = false;
        for (let i = 0; i < maxEscape; ++i) {
            let index = escapeStart + i + 1;
            if (index >= htmlText.length) break;
            let c = htmlText.charAt(index);
            if (c == ';') {
                closed = true;
                break;
            }
            inner += c;
        }
        if (!closed) {
            return -1;
        }
        return inner.length;
    }

    private generateTextHTML() {
        if (this._characterDisplayCount == -1) {
            this._node.innerHTML = this._text;
        } else {
            if (this._characterDisplayCount == 0) {
                this._node.innerHTML = "";
            } else {
                let cropPoint = DocTextBox.calculateHTMLLengthFromTextLength(this._text, this._characterDisplayCount);
                let pre = this._text.substr(0, cropPoint);
                let post = this._text.substr(cropPoint);
                let hideSpanStart = '<span style="color: rgba(0,0,0,0);">';
                let hideSpanEnd = '</span>';

                // Add this hide span everywhere beyond a point to make sure it's hidden.
                let postSpanned = "";
                let hideSpanCount = 1;
                for (let i = 0; i < post.length; ++i) {
                    let c = post.charAt(i);
                    postSpanned += c;
                    if (c == '>') {
                        // Add this hide span just to make sure everything after is hidden.
                        postSpanned += hideSpanStart;
                        hideSpanCount++;
                    }
                }
                
                for (let i = 0; i < hideSpanCount; ++i) {
                    postSpanned += hideSpanEnd;
                }

                this._node.innerHTML = pre + hideSpanStart + postSpanned;
            }
        }
    }

    private setNodePos(x, y, width, height) {
        let canvas = this._gui.getMainCanvas();
        Debug.logDebug(canvas);
        let parentOffs = DocTextBox.getScreenCordinates(canvas);
        x += parentOffs.x;
        y += parentOffs.y;
        Debug.logDebug(parentOffs);
        this._node.style.position = "absolute";
        this._node.style.left = x + "px";
        this._node.style.top = y + "px";
        this._node.style.width = width + "px";
        this._node.style.height = height + "px";
        this._node.style.padding = '0 0 0 0';
        this._node.style.outlineWidth = "1px";

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

    dispose() : void {
        super.dispose();
        this._gui.getHTMLOverlayContainer().removeChild(this._node);
    }

    set isVisible(visible : boolean) {
        super.isVisible = visible;
        this._node.style.visibility = visible ? "visible" : "hidden";
    }

    private static getScreenCordinates(obj : HTMLElement) : BABYLON.Vector2 {
        let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
	    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return new BABYLON.Vector2(scrollLeft + obj.offsetLeft, scrollTop + obj.offsetTop);
    }

}
