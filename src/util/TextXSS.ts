import * as xss from "xss";
import Debug from "../debug/Debug";

export class TextXSS {
    public static filterXSSDisplayText(text : string) : string {
        // What should the user be allowed to type in?
        let options = {
            whitelist: {
                b: [],
                i: [],
                span: [],
                h1: [],
                h2: [],
                h3: [],
                h4: [],
                p: [],
                a: ['href', 'title', 'target'],

                // Our custom tags
                highlight : [],
                color: []
            },
            onTagAttr: (tag, name, value, isWhiteAttr) => {
                if (!isWhiteAttr) {
                    return null;
                }
                if (tag === 'color') {
                    // Max size
                    value = value.substr(0, 9);
                    if (value.startsWith("#")) {
                        if (!isNaN(value.substr(1))) {
                            // We have a number!
                            return value;
                        }
                    }
                    // We don't have a valid hex string.
                    Debug.logWarning("Invalid dialogue text color, must be in the format <color #RRGGBB>, for example #FFFFFF or #000000");
                    return null;
                }
                return value;
            }
        };
        return xss.filterXSS(text, options);
    }
}