import FileSaver = require("file-saver");
import Debug, { PopupType } from "../debug/Debug";
import { DropZone } from "./DropZone";

export class SaveFileManager {

    public promptForLoad(onLoad : (data : string) => void, onError : (error) => void = null) : void {
        if (onError == null) {
            onError = (error) => Debug.popup(error, PopupType.Warning);
        }
        DropZone.doFilePrompt(files => {
            let file = files[0];
            file.text().then(value => {
                onLoad(value);
            }).catch(error => {
                onError(error);
            })
        });
    }

    public save(data : string) : void {
        let blob = new Blob([data], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, "drsavefile");
    }
}
