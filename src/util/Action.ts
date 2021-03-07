
/**
 * C# Action type but in Javascript
 * 
 * Because events don't have to be tied to DOM elements
 */
export class Action {

    private static _eventKeyCounter : number = 0;

    private _key : string;

    constructor() {
        this._key = Action.generateUniqueEventKey();
    }

    public addListener(func) {
        document.addEventListener(this._key, func);
        return func;
    }

    public removeListener(func) : void {
        document.removeEventListener(this._key, func);
    }

    public invoke(data = null) : boolean {
        return document.dispatchEvent(new CustomEvent(this._key, {detail: data}));
    }

    private static generateUniqueEventKey() : string {
        Action._eventKeyCounter++;
        return "__DR_CUSTOM_EVENT__" + Action._eventKeyCounter.toString();
    }
}

