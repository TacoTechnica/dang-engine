
// Json serialization/deserialization that we might want to swap out with a library later.
// TODO: Test for the following scenario:
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

    static serialize(data) : string {
        return JSON.stringify(data, null, 2);
    }

    static deserialize(jsonText : string) {
        return JSON.parse(jsonText);
    }
}
