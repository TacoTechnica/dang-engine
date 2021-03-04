import * as BABYLON from 'babylonjs'
import Logger from '../logger/Logger';
import { ProjectInfo } from '../resource/ProjectInfo';
import { ResourceManager } from '../resource/ResourceManager';
import { DRScene } from '../resource/resources/DRScene';
import { StorageManager } from '../resource/StorageManager';
import { GameObject, GameObjectCarrier } from './GameObject';
import { RawInput } from './input/RawInput';

export class Game {
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;

    // Resource handling
    private _storageManager : StorageManager;
    private _resourceManager : ResourceManager;

    // Scene handling
    private _currentBabylonScene : BABYLON.Scene;
    private _currentDRScene : DRScene;

    private _currentProjectInfo : ProjectInfo;

    constructor(canvasElement : string, storageManager : StorageManager = null, resourceManager : ResourceManager = null) {
        // Create canvas and engine.
        this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        this._canvas.hidden = true;
        //this._canvas.style.display = 'none';
        this._engine = new BABYLON.Engine(this._canvas, true);

        this._storageManager = storageManager == null? new StorageManager() : storageManager;
        this._resourceManager = resourceManager == null? new ResourceManager() : resourceManager;

        Logger.logMessage("Game initialized");
    }

    public getBabylon() : BABYLON.Engine {return this._engine;}
    public getCanvas() : HTMLCanvasElement {return this._canvas;}
    public getStorageManager() : StorageManager {return this._storageManager;}
    public getResourceManager() : ResourceManager {return this._resourceManager;}

    public openProject(onSuccess : () => void, onFail : (message) => void) : void {
        let projectPath = "project.json";
        if (this._resourceManager.projectFileExists(this._storageManager)) {
            let project : ProjectInfo = this._resourceManager.loadProjectFile(this._storageManager);
            let startScene : DRScene = project.getStartScene();
            if (startScene != null) {
                this._currentProjectInfo = project;
                onSuccess();
            } else {
                onFail("A start scene was not defined in " + projectPath + ", this is required.");
            }
        } else {
            onFail("No " + projectPath + " file found in your project's root directory. Thus, no project was found.");
        }
    }

    public loadScene(scene : DRScene) : void {
        let bscene = new BABYLON.Scene(this.getBabylon());

        // Clear previous babylon scene
        if (this._currentBabylonScene != null) {
            this._currentBabylonScene.dispose();
        }

        scene.onSceneLoad(this, bscene);

        scene.getGameObjects().forEach(gameObject => {
            gameObject.instantiate(this, bscene);
        });

        this._currentBabylonScene = bscene;
    }


    public run() : void {

        if (this._currentProjectInfo != null) {
            let startScene : DRScene = this._currentProjectInfo.getStartScene();
            if (startScene != null) {
                this.loadScene(startScene);
            }
        }

        this._canvas.hidden = false;
        this._canvas.width = window.screen.width;
        this._canvas.height = window.screen.height;

        //this._canvas.style.display = 'block';

        let lastTime = this.currentTimeSeconds();

        // Run the render loop.
        this._engine.runRenderLoop(() => {

            RawInput.onPreTick();

            if (this._currentBabylonScene != null) {
                let now : number = this.currentTimeSeconds();
                this._currentBabylonScene.getNodes().forEach(element => {
                    if (element instanceof GameObjectCarrier) {
                        element.tick(this, now - lastTime);
                    }
                });
                lastTime = now;
                this._currentBabylonScene.render();
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