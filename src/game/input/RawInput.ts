

class ButtonState<T extends any> {
    private _keys : any = {};

    public isDown(key : T) : boolean {
        if (key in this._keys) {
            return this._keys[key];
        }
        return false;
    }
    public setState(key : T, state : boolean) : void {
        this._keys[key] = state;
    }

    public copy() : ButtonState<T> {
        let newState : ButtonState<T> = new ButtonState();
        Object.assign(newState._keys, this._keys);
        return newState;
    }
}
class ButtonTracker<T> {
    // Always 100% accurate
    private _liveState : ButtonState<T> = new ButtonState<T>();
    // The keyboard state at the beginning of a frame, stays constant throughout the frame
    private _currentState : ButtonState<T> = new ButtonState<T>();
    // The keyboard state at the LAST frame
    private _prevState : ButtonState<T> = new ButtonState<T>();

    public setState(key : T, state : boolean) : void {
        this._liveState.setState(key, state);
    }

    public isDown(key : T) : boolean {
        return this._currentState.isDown(key);
    }
    public isPressed(key : T) : boolean {
        return this._currentState.isDown(key) && !this._prevState.isDown(key);
    }
    public isReleased(key : T) : boolean {
        return !this._currentState.isDown(key) && this._prevState.isDown(key);
    }

    public onPreTick() : void {
        // Update state
        this._prevState = this._currentState.copy();
        this._currentState = this._liveState.copy();
    }
}


export class RawInput {

    private static _keyTracker : ButtonTracker<string> = new ButtonTracker();
    private static _mouseTracker : ButtonTracker<number> = new ButtonTracker();
    private static _gamepadTracker : ButtonTracker<string> = new ButtonTracker();

    // DO NOT CALL from anywhere else.
    public static init() : void {

        document.addEventListener('keydown', event => {
            this._keyTracker.setState(event.key, true);
        });
        document.addEventListener('keyup', event => {
            this._keyTracker.setState(event.key, false);
        });

        document.addEventListener('mousedown', event => {
            this._mouseTracker.setState(event.buttons, true);
        });
        document.addEventListener('mouseup', event => {
            this._mouseTracker.setState(event.buttons, false);            
        });
        /*
        window.addEventListener("gamepaddisconnected", function(e) {
            console.log("Gamepad disconnected from index %d: %s",
              e.gamepad.index, e.gamepad.id);
        });*/
    }
    public static onPreTick() : void {
        // Update state
        this._keyTracker.onPreTick();
        this._mouseTracker.onPreTick();
        this._gamepadTracker.onPreTick();
    }

    public static isKeyDown(key : string) : boolean {return this._keyTracker.isDown(key);}
    public static isKeyPressed(key : string) : boolean {return this._keyTracker.isPressed(key);}
    public static isKeyReleased(key : string) : boolean {return this._keyTracker.isReleased(key);}

    public static isMouseButtonDown(button : number) : boolean {return this._mouseTracker.isDown(button);}
    public static isMouseButtonPressed(button : number) : boolean {return this._mouseTracker.isPressed(button);}
    public static isMouseButtonReleased(button : number) : boolean {return this._mouseTracker.isReleased(button);}

    /*
    public static isGamepadButtonDown(button : number) : boolean {return this._mouseTracker.isDown(button);}
    public static isGamepadButtonPressed(button : number) : boolean {return this._mouseTracker.isPressed(button);}
    public static isGamepadButtonReleased(button : number) : boolean {return this._mouseTracker.isReleased(button);}
    */
}

RawInput.init();
