import * as Babylon from 'babylonjs';
import { DebugLayer } from 'babylonjs';
import Logger from '../logger/Logger';
import { ResourceManager } from '../resource/ResourceManager';
import { StorageManager } from '../resource/StorageManager';
import { GameObject, GameObjectCarrier } from './GameObject';

export class Game {
    private _canvas: HTMLCanvasElement;
    private _engine: Babylon.Engine;

    // Resource handling
    private _storageManager : StorageManager;
    private _resourceManager : ResourceManager;

    private _currentScene : Babylon.Scene;

    constructor(canvasElement : string, storageManager : StorageManager = null) {
        // Create canvas and engine.
        this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        this._canvas.hidden = true;
        //this._canvas.style.display = 'none';
        this._engine = new Babylon.Engine(this._canvas, true);

        this._storageManager = storageManager == null? new StorageManager() : storageManager;
        this._resourceManager = new ResourceManager();

        Logger.logMessage("Game initialized");
    }

    public getBabylon() : Babylon.Engine {return this._engine;}
    public getCanvas() : HTMLCanvasElement {return this._canvas;}
    public getStorageManager() : StorageManager {return this._storageManager;}
    public getResourceManager() : ResourceManager {return this._resourceManager;}

    // Deprecated
    // TODO: Only load DR Scenes, which will behind the scenes load a Babylon scene.
    public loadScene(scene : Babylon.Scene) : void {
        if (this._currentScene != null) {
            this._currentScene.dispose();
        }
        this._currentScene = scene;
    }


    public run() : void {

        this._canvas.hidden = false;
        this._canvas.width = window.screen.width;
        this._canvas.height = window.screen.height;
        //this._canvas.style.display = 'block';

        let lastTime = this.currentTimeSeconds();

        // Run the render loop.
        this._engine.runRenderLoop(() => {
            if (this._currentScene != null) {
                let now : number = this.currentTimeSeconds();
                this._currentScene.getNodes().forEach(element => {
                    if (element instanceof GameObjectCarrier) {
                        element.tick(this, now - lastTime);
                    }
                });
                lastTime = now;
                this._currentScene.render();
            }
        });

        // The canvas/window resize event handler.
        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }

    private currentTimeSeconds() : number {
        return window.performance.now() / 1000.0;
    }

}