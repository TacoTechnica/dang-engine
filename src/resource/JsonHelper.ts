

import { Deserialize, DeserializeInto, INewable, ISerializable, Serialize } from "cerialize";
import Debug from "../debug/Debug";
import * as $ from 'jquery';

export class JsonHelper {

    static serialize(object : any, type?: Function | ISerializable) : string {
        return JSON.stringify(Serialize(object, type), null, 2);
    }

    static deserialize<T>(type: Function | INewable<T> | ISerializable, jsonText : string) : T {
        let jsonObj = JSON.parse(jsonText);
        return this.deserializeObj(type, jsonObj);
    }

    static deserializeObj<T>(type : Function | INewable<T> | ISerializable, object : any) : T {
        let deserialized = Deserialize(object, type);
        return deserialized;
    }

    static deserializeInto<T>(object : T,  type: Function | INewable<T> | ISerializable, jsonText : string) : T{
        let jsonObj = JSON.parse(jsonText);
        return DeserializeInto(jsonObj, type, object);
    }

    static readFromURLBlocked(url : string, onError : (error : string) => void = null) : string{
        let result = null;
        this.readFromURL(url, data => result = data, onError, false);
        return result;
    }

    static readFromURL(url : string, onSuccess : (data : string) => void, onError : (error : string) => void = null, async : boolean = true) : void {
        $.ajax({
            url : url,
            success : ((onSuccess != null) ? onSuccess : (data) => {}),
            error : function(XMLHttpRequest, textStatus, errorThrown) {
                if (onError != null) onError(errorThrown);
                else Debug.logError(errorThrown);
            },
            xhrFields: {
                withCredentials: true
            },
            async: async
        });
    }
}
