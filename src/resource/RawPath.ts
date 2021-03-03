
/**
 * Represents a raw path that points to either a raw resource or a web URL
 */

import Logger from "../logger/Logger";
import { StorageManager } from "./StorageManager";

import * as $ from 'jquery';
import { autoserialize } from "cerialize";

export class RawPath {

    @autoserialize private path : string;

    constructor(path : string) {
        this.path = path;
    }


    public readRawBase64(storageManager : StorageManager) : string {
        if (this.path.startsWith(".raw/")) {
            return storageManager.readFile(this.path);
        }
        // Assume we're reading from the web then.
        let base = this;
        let error = null;
        let result = null;
        $.ajax({
            url : base.path,
            success : function(data){
                result = btoa(data);
            },
            error : function(XMLHttpRequest, textStatus, errorThrown) {
                error = errorThrown;
            },
            xhrFields: {
                withCredentials: true
            },
            async: false
        });
        if (error != null) {
            Logger.logError(error);
        }
        return result;
    }
}