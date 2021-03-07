import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { DefaultResources } from '../DefaultResources';
import { Resource } from '../Resource';
import { DRScene } from './DRScene';
import { ResourceSerializer } from '../ResourceSerializer';
import { StorageManager } from "../StorageManager";


@inheritSerialization(Resource)
export class ProjectInfo extends Resource {

    @autoserialize public name : string = "Example Project";
    @autoserialize public author : string = "You!";
    @autoserializeAs("uniqueId") private _uniqueId : string = null;
    @autoserializeAs(new ResourceSerializer(DRScene)) public startingScene : DRScene;
    @autoserializeAs(DefaultResources) public defaultResources : DefaultResources;

    constructor(path : string) {
        super(path);
        if (this._uniqueId == null) {
            this._uniqueId = Math.random().toString(32).substr(2, 23);
        }
    }

    public getStartScene() : DRScene {return this.startingScene;}
    public getUniqueId() : string {return this._uniqueId;}
}
