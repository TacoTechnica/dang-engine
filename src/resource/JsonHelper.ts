
// Json serialization/deserialization that we might want to swap out with a library later.
// TODO: Test for the following scenario:

import { Deserialize, DeserializeInto, INewable, ISerializable, Serialize } from "cerialize";
import Logger from "../logger/Logger";

/**
 * interface IThing {}
 * class A : IThing {...}
 * class B : IThing {...}
 * 
 * 
 * ...
 * 
 * 
 * IThing[] stuff = [new A(...), new B(...), new B(...), new A(...) ]
 * 
 * string data = serialize(stuff);
 * 
 * IThing[] readFromJson = deserialize(stuff);
 * 
 * `readFromJson` should contain A, B, B, A with the right class type + data.
 * 
 */

export class JsonHelper {

    static serialize(object) : string {
        return JSON.stringify(Serialize(object), null, 2);
    }

    static deserialize<T>(type: Function | INewable<T> | ISerializable, jsonText : string) : T {
        let jsonObj = JSON.parse(jsonText);
        let deserialized = Deserialize(jsonObj, type);
        return deserialized;
    }

    static deserializeInto<T>(object : T,  type: Function | INewable<T> | ISerializable, jsonText : string) : T{
        let jsonObj = JSON.parse(jsonText);
        return DeserializeInto(jsonObj, type, object);
    }
}
