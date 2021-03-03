import Logger from '../logger/Logger'
import { JsonHelper } from './JsonHelper';
import { ProjectStorageManager } from "./ProjectStorageManager";


export class Project {
    public name : string = "Example Project";
    public author : string = "You!";

    static load(storageManager : ProjectStorageManager, path : string) : Project {
        if (!storageManager.fileExists(path)) {
            Logger.logError("Failed to load project json at path ", path, " because that path does not exist!");
            return null;
        }
        let jsonText = atob(storageManager.readFile(path));

        return JsonHelper.deserialize(jsonText);
    }

    static save(storageManager : ProjectStorageManager, path : string, project : Project) : void {
        storageManager.writeFile(path, btoa(JsonHelper.serialize(project)));
    }
}
