

export class Coroutine {
    private _generator;

    private static readonly SAMPLE_GENERATOR = (function*(){}).constructor;

    constructor(generator) {
        this._generator = this.recursiveIterate(generator);
    }

    public static *waitSecondsRoutine(seconds : number) {
        let now = Date.now() / 1000.0;
        while ((Date.now() / 1000.0 - now) < seconds) {
            yield null;
        }
    }
    public static *waitUntilRoutine(condition : () => boolean) {
        while (!condition()) {
            yield null;
        }
    }

    public tick() : boolean {
        if (this._generator != null) {
            if (this._generator.next().done) {
                // We finished
                this._generator = null;
            } else {
                return true;
            }
        }
        return false;
    }

    public stop() : void {
        this._generator = null;
    }

    public isRunning() : boolean {return this._generator != null; }

    private *recursiveIterate(generator) {
        let toRun = [];
        toRun.push(generator);

        while (toRun.length != 0) {
            let current = toRun[toRun.length - 1];

            let next = current.next();
            if (next.done) {
                toRun.pop();
                continue;
            }

            let isNextGenerator : boolean = Coroutine.isGeneratorFunction(next.value);//(next.value != null && next.value instanceof Coroutine.SAMPLE_GENERATOR);//next.value.constructor != null && next.value.constructor === Coroutine.SAMPLE_GENERATOR.constructor);
            if (isNextGenerator) {
                toRun.push(next.value);
            }

            // One iteration complete.
            yield null;
        }
    }

    private static isGenerator(obj) {
        return 'function' == typeof obj.next && 'function' == typeof obj.throw;
      }

    private static isGeneratorFunction(obj) {
        if (obj == null) return false;
        var constructor = obj.constructor;
        if (!constructor) return false;
        if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;
        return Coroutine.isGenerator(constructor.prototype);
     }
}