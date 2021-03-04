import { Coroutine } from "./Coroutine";

export class CoroutineRunner {

    private _coroutines : Coroutine[] = [];

    public run(generator : any): Coroutine {
        let newCoroutine = new Coroutine(generator);
        this._coroutines.push(newCoroutine);
        return newCoroutine;
    }

    public stopAll() {
        this._coroutines = [];
    }

    public onTick() : void {
        // Tick through all, removing those that finished.
        this._coroutines = this._coroutines.filter(element => {
            return element.tick();
        });
    }
}
