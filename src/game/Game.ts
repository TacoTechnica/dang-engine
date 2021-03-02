import * as Babylon from 'babylonjs';
import { DebugLayer } from 'babylonjs';
import Logger from '../logger/Logger';
import { GameObject } from './GameObject';

export class Game {
    private _canvas: HTMLCanvasElement;
    private _engine: Babylon.Engine;

    private _currentScene : Babylon.Scene;

    constructor(canvasElement : string) {
        // Create canvas and engine.
        this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        this._canvas.style.display = 'none';
        this._engine = new Babylon.Engine(this._canvas, true);
        
        Logger.logMessage("Game initialized");
    }

    public getBabylon() : Babylon.Engine {return this._engine;}
    public getCanvas() : HTMLCanvasElement {return this._canvas;}

    public loadScene(scene : Babylon.Scene) : void {
        if (this._currentScene != null) {
            this._currentScene.dispose();
        }
        this._currentScene = scene;
    }


    public run() : void {

        this._canvas.style.display = 'block';
        
        let lastTime = this.currentTimeSeconds();

        // Run the render loop.
        this._engine.runRenderLoop(() => {
            if (this._currentScene != null) {
                let now : number = this.currentTimeSeconds();
                this._currentScene.getNodes().forEach(element => {
                    if (element instanceof GameObject) {
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


    /**
     * 
     * TODO: This is the C# equivalent of "GamePlus"
     * 
     * This will have:
     * - A game loop with empty overridable methods (tick, render)
     * - Object managing system that hopefully piggy backs off of Babylon
     * NEW PHILOSOPHY:
     *      - Just use Babylon scenes.
     *      - We mostly deal with meshes.
     *      - Anything that's not a mesh is part of the scene. (ex. there is no GameObject, just GameObject3D)
     *      - Add behaviors to objects.
     * FIGURE OUT: How to make a custom object that contains both the mesh and the behavior and add it to the scene easily.
     * I think a simple constructor that passes a game should do the trick.
     * 
     */

}