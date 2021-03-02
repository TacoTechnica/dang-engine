
export class DropZone {

    private _element : HTMLElement;

    public onfileopened : (file : File) => void = (file) => {};

    constructor(elementName : string) {
        this._element = document.getElementById("dropZone");

        this._element.onclick = (mevent) => {
            if (mevent.button == 0) {
                mevent.preventDefault();
                // Open up file window
                let input : HTMLInputElement = document.createElement('input');
                input.type = 'file';
                input.click();
                input.onchange = (e) => {
                    this.onfileopened((<HTMLInputElement> e.target).files[0]);
                    input.remove();
                 }                 
            }
        }

        this._element.ondrop = (devent) => {
            //Logger.logMessage("File dragged");
            devent.preventDefault();
            if (devent.dataTransfer.items) {
                // Use DataTransferItemList interface to access the file(s)
                for (var i = 0; i < devent.dataTransfer.items.length; i++) {
                // If dropped items aren't files, reject them
                if (devent.dataTransfer.items[i].kind === 'file') {
                    this.onfileopened(devent.dataTransfer.items[i].getAsFile());
                }
                }
            } else {
                // Use DataTransfer interface to access the file(s)
                for (var i = 0; i < devent.dataTransfer.files.length; i++) {
                    this.onfileopened(devent.dataTransfer.files[i]);
                }
            }
        };
        this._element.ondragover = (devent) => {
            devent.preventDefault();
        };
    }

    public destroy() : void {
        this._element.remove();
    }
}