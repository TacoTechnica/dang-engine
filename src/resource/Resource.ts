

/**
 * This represents a DR Resource.
 * 
 * Every DR Resource is a json file.
 * 
 * Even sprites, which merely link to a raw file.
 */
export abstract class Resource {

    private _path : string;

    constructor(path : string) {
        this._path = path;
    }

    public setPathOnLoad(path : string) : void {
        this._path = path;
    }

    public getPath() : string {return this._path;}
}