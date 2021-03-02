

import Logger from '../logger/Logger';
import * as JSZip from 'jszip';
import { files } from 'jszip';
import { DebugLayer, int } from 'babylonjs';

import * as FileSaver from 'file-saver'

/**
 * This loads + saves projects.
 */
export class ProjectStorageManager {

    private _currentProjectZip : File;
    private _somethingDirty : boolean;

    // Hopefully disk storage, stores ALL DATA in an UNCOMPRESSED format.
    private _storage : Storage = sessionStorage;

    // In memory, bookkeeping that's only used by the editor.
    private _directoryMap = {};

    private _itemCounter : int = 0;

    public tryLoadZipFile(file : File, onfinish : (success : boolean, error : string) => void) : void {
        let jz : JSZip = new JSZip();
        jz.loadAsync(file)
        .then(zip => {
            this.clearStorage();
            let needToFinish : number = Object.keys(zip.files).length;
            // you now have every files contained in the loaded zip
            for(let key in zip.files) {
                zip.files[key].async("base64").then(data => {
                    if (!this.writeFile(key, data, true)) {
                        Logger.logError("Failed to write file: ", key);
                    }
                    needToFinish--;
                    if (needToFinish == 0) {
                        Logger.logMessage("TREE:");
                        Logger.logMessage(this._directoryMap);
                        this._currentProjectZip = file;
                        this._somethingDirty = false;
                        onfinish(true, "");
                    }
                });
            }
        }).catch(error => {
            onfinish(false, error);
        });
    }

    public saveZipFile(name : string = null) : void {
        let jz : JSZip = new JSZip();

        if (name == null && this._currentProjectZip != null) {
            name = this._currentProjectZip.name;
        }

        let base = this;

        function traverse(path : string = "") {
            base.getFilePathsInDirectory(path).forEach((sub : string) => {
                // Save file
                jz.file(getFullPath(sub), base.readFile(sub), {base64 : true} );
            });
            base.getDirectoryPathsInDirectory(path).forEach(sub => {
                jz.folder(getFullPath(sub));
                traverse(sub);
            });
        }

        function getFullPath(sub : string) : string {
            if (sub.startsWith('/')) {
                return sub.substr(1);
            }
            return sub;
        }

        traverse();

        jz.generateAsync({type:"blob"}).then(function (blob) {
            FileSaver.saveAs(blob, name);
        });
    }

    public isDirty() : boolean {return this._somethingDirty;}

    public fileExists(path : string) : boolean {
        path = this.formatPath(path);
        let node = this.getPathNode(path);
        return node != null && typeof(node) == 'string';
    }
    public directoryExists(path : string) : boolean {
        path = this.formatPath(path);
        let node = this.getPathNode(path);
        return node != null && typeof(node) == 'object';
    }

    public readFile(path : string) : string {
        path = this.formatPath(path);
        let node = this.getPathNode(path);
        if (typeof(node) == 'string') {
            return this._storage.getItem(node);
        } else {
            return null;
        }
    }

    public writeFile(path : string, dataBase64 : string, recurseDirectoryCreate : boolean = false) : boolean {
        path = this.formatPath(path);
        // Recurse through, creating directories if we're instructed to do so.
        let currentDirNode = this._directoryMap;
        let subpaths : string[] = ProjectStorageManager.splitSubpaths(path);
        let failed = false;
        subpaths.forEach((sub, i) => {
            if (failed) return;
            let last = (i == subpaths.length - 1);
            if (!(sub in currentDirNode)) {
                if (last) {
                    // We're the file part and we're new.
                    let newKey = this.getNewStorageKey();
                    //Logger.logDebug("### ", sub, " = ", newKey);
                    currentDirNode[sub] = newKey;
                } else {
                    // We're a directory part
                    if (recurseDirectoryCreate) {
                        currentDirNode[sub] = {};
                        //Logger.logDebug("### ", sub);
                    } else {
                        failed = true;
                        return;
                    }
                }
            }
            currentDirNode = currentDirNode[sub];
        });
        if (failed) {
            return false;
        }

        let storageKey = currentDirNode;
        if (!(typeof storageKey === 'string')) {
            Logger.logError("Failed to grab storage key of path ", path, " this probably means the directory tree is corrupted somehow. Or that I'm a bad programmer.");
            return false;
        }

        // Write to said file
        this._storage.setItem(storageKey, dataBase64);
        this._somethingDirty = true;

        return true;
    }

    public createDirectory(path : string, recurseCreate : boolean = false) : boolean {
        path = this.formatPath(path);
        let currentDirNode = this._directoryMap;
        let subpaths : string[] = ProjectStorageManager.splitSubpaths(path);
        let failed = false;
        subpaths.forEach((sub, i) => {
            if (failed) return;
            let last = (i == subpaths.length - 1);
            let exists = sub in currentDirNode;
            if (last) {
                if (exists) {
                    Logger.logError("Tried creating directory that already exists.");
                    failed = true;
                    return;
                }
                currentDirNode[sub] = {};
            }
            if (!exists) {
                if (recurseCreate) {
                    currentDirNode[sub] = {};
                } else {
                    failed = true;
                    return;
                }
            }
            currentDirNode = currentDirNode[sub];
        });

        return !failed;
    }

    public deleteItem(path : string, recurseDelete : boolean = false) : boolean {
        path = this.formatPath(path);
        let split : string[] = ProjectStorageManager.splitSubpaths(path);
        if (split.length == 0) {
            Logger.logError("Tried deleting root directory.");
            // We can't delete root directory
            return false;
        }

        // Delete sub directories?
        if (this.directoryExists(path)) {
            if (this.getPathsInDirectory(path).length != 0 && !recurseDelete) {
                Logger.logError("Tried deleting non-empty directory without recursive flag set.");
                return false;
            }
            // Recursive
            let failed = false;
            this.getPathsInDirectory(path).forEach(sub => {
                if (failed) return;
                if (!this.deleteItem(sub, true)) {
                    Logger.logError("Failed to delete sub file that should be deletable: ", sub, ". This likely means a file heirarchy corruption occured.");
                    failed = true;
                    return;
                }
            });
            if (failed) return false;
        } else {
            if (this.fileExists(path)) {
                // We're a file
                let key = this.getPathNode(path);
                if (typeof(key) == 'string') {
                    this._storage.removeItem(key);
                } else {
                    Logger.logError("Tried deleting valid file at ", path, "but it's not a file node. This likely means a file heirarchy corruption occured.");
                    return false;
                }
            }
        }

        // Update directory that contains this path
        if (split.length >= 1) {
            let targetNodeName = split[split.length - 1];
            let prevNodeName = split.slice(0, split.length - 1).join('/');
            let prevNode = this.getPathNode(prevNodeName);
            delete prevNode[targetNodeName];
        }

        return true;
    }

    public getFilePathsInDirectory(path : string = "") : string[] {
        let result : string[] = [];
        this.getPathsInDirectory(path).forEach(checkPath => {
            if (this.fileExists(checkPath)) {
                result.push(checkPath);
            }
        });
        return result;
    }
    public getDirectoryPathsInDirectory(path : string = "") : string[] {
        let result : string[] = [];
        this.getPathsInDirectory(path).forEach(checkPath => {
            if (this.directoryExists(checkPath)) {
                result.push(checkPath);
            }
        });
        return result;
    }

    /**
     * Given a directory path, get all files AND directories from that path
     * @param path the path to look inside of
     * @returns a list of paths, or an empty array if the path is invalid.
     */
    public getPathsInDirectory(path : string = "") : string[] {
        path = this.formatPath(path);
        let dirNode = this.getPathNode(path);
        if (dirNode == null) return [];
        let result = [];
        Object.keys(dirNode).forEach(sub => {
            result.push(path + "/" + sub);
        });
        return result;
    }

    private getPathNode(path : string) {
        let currentDirNode = this._directoryMap;
        let subpaths : string[] = ProjectStorageManager.splitSubpaths(path);
        let failed = false;
        subpaths.forEach((sub) => {
            if (failed) return;
            if (!(sub in currentDirNode)) {
                failed = true;
                return;
            }
            currentDirNode = currentDirNode[sub];
        });
        if (failed) return null;
        return currentDirNode;
    }

    private clearStorage() : void {
        this._storage.clear();
        this._directoryMap = {};
    }

    private formatPath(path : string) : string {
        if (path.startsWith('/')) {
            path = path.substr(1);
        }
        if (path.endsWith('/')) {
            path = path.substr(0, path.length - 1);
        }
        return path;
    }

    private static splitSubpaths(path : string) : string[] {
        let result = path.split("/");
        if (result[0] == "") {
            result = result.splice(1);
        }
        return result;
    }

    private getNewStorageKey() : string {
        this._itemCounter++;
        return this._itemCounter.toString();
    }

}
