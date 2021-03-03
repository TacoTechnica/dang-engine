import { autoserialize } from 'cerialize';
import Logger from '../logger/Logger'
import { JsonHelper } from './JsonHelper';
import { StorageManager } from "./StorageManager";


export class ProjectInfo {
    
    @autoserialize public name : string = "Example Project";
    @autoserialize public author : string = "You!";

    static load(storageManager : StorageManager, path : string) : ProjectInfo {
        if (!storageManager.fileExists(path)) {
            Logger.logError("Failed to load project json at path ", path, " because that path does not exist!");
            return null;
        }
        let jsonText = atob(storageManager.readFile(path));

        return JsonHelper.deserialize(ProjectInfo, jsonText);
    }

    static save(storageManager : StorageManager, path : string, project : ProjectInfo) : void {
        storageManager.writeFile(path, btoa(JsonHelper.serialize(project)));
    }
}
