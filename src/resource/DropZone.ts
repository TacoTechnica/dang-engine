import Debug from "../debug/Debug";

export class DropZone {

    private _element : HTMLElement;

    public onfileopened : (file : File) => void = (file) => {};

    constructor(text : string) {

        this._element = document.createElement("button");
        this._element.id = "dropZone";
        this._element.innerHTML = text;
        document.body.appendChild(this._element);

        this._element.onclick = (mevent) => {
            if (mevent.button == 0) {
                mevent.preventDefault();
                DropZone.doFilePrompt(files => {
                    this.onfileopened(files[0]);
                });
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

    public static doFilePrompt(onSelect : (filesSelected : FileList) => void) : void {
        let input : HTMLInputElement = document.createElement('input');
        input.type = 'file';
        input.click();
        input.onchange = (e) => {
            onSelect((<HTMLInputElement> e.target).files);
            input.remove();
        };
    }

    public destroy() : void {
        this._element.remove();
    }
}