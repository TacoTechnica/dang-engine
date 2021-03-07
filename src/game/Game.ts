import * as BABYLON from 'babylonjs'

import { autoserializeAs, serializeAs } from 'cerialize';
import Debug, { PopupType } from '../debug/Debug';
import { DefaultResources } from '../resource/DefaultResources';
import { ProjectInfo } from '../resource/resources/ProjectInfo';
import { ResourceManager } from '../resource/ResourceManager';
import { DRScene } from '../resource/resources/DRScene';
import { StorageManager } from '../resource/StorageManager';
import { GameObjectCarrier } from './GameObject';
import { GUIManager } from './gui/GUIManager';
import { RawInput } from './input/RawInput';
import { VNRunner } from './vn/VNRunner';
import { Action } from '../util/Action';
import { ResourceSerializer } from '../resource/ResourceSerializer';
import { JsonHelper } from '../resource/JsonHelper';
import { SaveFileManager } from '../resource/SaveFileManager';

export class Game {

    // ONLY USE for:
    // - Static Serialization methods
    // - External mods
    public static current : Game = null;

    // Public events/hookups
    public onGameStart : Action = new Action();
    public onProjectLoad : Action = new Action();
    public onGameTick : Action = new Action();

    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;

    // Resource handling
    private _storageManager : StorageManager;
    private _resourceManager : ResourceManager;
    private _saveFileManager : SaveFileManager;

    private _currentProjectInfo : ProjectInfo;

    // Scene handling
    private _currentBabylonScene : BABYLON.Scene;
    @serializeAs(new ResourceSerializer(DRScene), "currentScene")
    private _currentDRScene : DRScene;

    // GUI Managing
    private _guiManager : GUIManager;

    // VN Runner
    @autoserializeAs(VNRunner, "VNState")
    private _vnRunner : VNRunner;

    constructor(canvasElement : string, storageManager : StorageManager = null, resourceManager : ResourceManager = null) {
        Game.current = this; // poo poo singleton pattern

        // Create canvas and engine.
        this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        this._canvas.hidden = true;
        //this._canvas.style.display = 'none';
        this._engine = new BABYLON.Engine(this._canvas, true);

        this._storageManager = storageManager == null? new StorageManager() : storageManager;
        this._resourceManager = resourceManager == null? new ResourceManager() : resourceManager;
        this._saveFileManager = new SaveFileManager();

        this._guiManager = new GUIManager();

        this._vnRunner = new VNRunner();

        // The canvas/window resize event handler.
        window.addEventListener('resize', () => {
            this._engine.resize();
        });

        Debug.logMessage("Game initialized");
    }

    public getBabylon() : BABYLON.Engine {return this._engine;}
    public getCanvas() : HTMLCanvasElement {return this._canvas;}
    public getStorageManager() : StorageManager {return this._storageManager;}
    public getResourceManager() : ResourceManager {return this._resourceManager;}
    public getSaveFileManager() : SaveFileManager {return this._saveFileManager;}
    public getGUIManager() : GUIManager {return this._guiManager;}
    public getVNRunner() : VNRunner {return this._vnRunner;}

    public getDefaultResources() : DefaultResources {
        if (this._currentProjectInfo.defaultResources == null) {
            Debug.popup("Default resources not found in project.json, will generate an empty set of default resources.");
            this._currentProjectInfo.defaultResources = new DefaultResources();
        }
        return this._currentProjectInfo.defaultResources;

    }

    public openProject(onSuccess : () => void, onFail : (message) => void) : void {
        let projectPath = "project.json";
        if (this._resourceManager.projectFileExists(this._storageManager)) {
            let project : ProjectInfo = this._resourceManager.loadProjectFile(this._storageManager);
            let startScene : DRScene = project.getStartScene();
            if (startScene != null) {
                this._currentProjectInfo = project;
                this.onProjectLoad.invoke();
                onSuccess();
            } else {
                onFail("A start scene was not defined in " + projectPath + ", this is required.");
            }
        } else {
            onFail("No " + projectPath + " file found in your project's root directory. Thus, no project was found.");
        }
    }

    public loadScene(scene : DRScene) : void {

        this._currentDRScene = scene;

        // Clear previous babylon scene
        if (this._currentBabylonScene != null) {
            this._currentBabylonScene.dispose();
        }

        let bscene = new BABYLON.Scene(this.getBabylon());

        scene.onSceneLoad(this, bscene);

        scene.getGameObjects().forEach(gameObject => {
            gameObject.instantiate(this, bscene);
        });

        this._currentBabylonScene = bscene;
        // I had to manually set this
        // to prevent weird bug with GUI.
        // God dammit that's dumb
        BABYLON.EngineStore._LastCreatedScene = this._currentBabylonScene;
    }


    public run(saveStateData : string = null) : void {

        if (saveStateData != null) {
            // Load our save
            try {
                JsonHelper.deserializeInto(this, Game, saveStateData);
                if (this._currentDRScene != null) {
                    // We have a scene, load it.
                    this.loadScene(this._currentDRScene);
                } else {
                    // We don't have a scene to load, we're boofed.
                    Debug.popup("Save file has no scene, the game will not load a scene.", PopupType.Warning);
                }
            } catch (error) {
                Debug.popup("Failed to read save file:\n\n" + error + "\n\n You probably picked an invalid save file, or it's corrupted.", PopupType.Error);
                console.error(error);
            }
            // VN System should be loaded.
        } else {
            // New game / no save state selected, start from beginning.
            // Load project starting scene
            // TODO: Replace with starting script later.
            if (this._currentProjectInfo != null) {
                let startScene : DRScene = this._currentProjectInfo.getStartScene();
                if (startScene != null) {
                    this.loadScene(startScene);
                } else {
                    Debug.logWarning("No starting scene found.");
                }
            } else {
                Debug.logWarning("No project info loaded.");
            }
        }

        this._canvas.hidden = false;
        this._canvas.width = window.screen.width;
        this._canvas.height = window.screen.height;

        this._guiManager.initialize(this);

        this.onGameStart.invoke(this);

        let lastTime = this.currentTimeSeconds();

        this._engine.stopRenderLoop();

        // Run the render loop.
        this._engine.runRenderLoop(() => {

            RawInput.onPreTick();

            this._vnRunner.onTick();

            // Object tick
            let now : number = this.currentTimeSeconds();
            let deltaTime = now - lastTime;
            if (this._currentBabylonScene != null) {
                this._currentBabylonScene.getNodes().forEach(element => {
                    if (element instanceof GameObjectCarrier) {
                        element.tick(this, deltaTime);
                    }
                });
                this._currentBabylonScene.render();
            }
            lastTime = now;

            this.onGameTick.invoke(deltaTime);
        });

    }

    public saveState() : string {
        return JsonHelper.serialize(this, Game);
    }

    private currentTimeSeconds() : number {
        return window.performance.now() / 1000.0;
    }

    public static OnSerialized(instance : Game, json : any) : void {
        // When serializing, add our unique id to the save so we alert the
        // user if we try loading the wrong save file.
        json["projectUniqueId"] = instance._currentProjectInfo.getUniqueId();
    }

}